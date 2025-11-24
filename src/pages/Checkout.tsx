import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { InventoryDisclaimer } from "@/components/InventoryDisclaimer";
import { ItemUnavailableAlert } from "@/components/ItemUnavailableAlert";


// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log("Stripe Publishable Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// Card element styling
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

interface CheckoutFormProps {
    onSuccess: (orderId: string) => void;
}

const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { items, shippingInfo, getSubtotal, getTax, getTotal, clearCart, removeItem } = useCartStore();

    const [processing, setProcessing] = useState(false);
    const [unavailableItems, setUnavailableItems] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: shippingInfo?.postalCode || "",
    });

    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();
    const shippingFee = shippingInfo?.shippingFee || 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const createOrder = async () => {
        try {
            // Generate order number using the database function
            const { data: orderNumberData, error: orderNumberError } = await supabase
                .rpc('generate_order_number');

            if (orderNumberError) {
                console.error('Error generating order number:', orderNumberError);
                throw orderNumberError;
            }

            const orderNumber = orderNumberData as string;

            // Create order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    customer_name: formData.fullName,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                    postal_code: formData.postalCode,
                    is_gta: shippingInfo?.isGTA || false,
                    subtotal: subtotal,
                    shipping_fee: shippingFee,
                    tax: tax,
                    total: total,
                    payment_status: 'paid',
                    order_status: 'pending',
                })
                .select()
                .single();

            if (orderError) throw orderError;
            if (!orderData) throw new Error('Failed to create order');

            // Insert order items (only standard products, no custom orders)
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                asset_id: item.assetId || null,
                item_type: item.type,
                title: item.title,
                description: item.description || null,
                price: item.price,
                quantity: item.quantity,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Update asset status to 'sold' for standard products that were purchased
            const standardItems = items.filter(item => item.type === 'standard' && item.assetId);
            if (standardItems.length > 0) {
                const assetIdsToUpdate = standardItems.map(item => item.assetId);

                const { error: updateError } = await supabase
                    .from('assets')
                    .update({ asset_status: 'sold' })
                    .in('id', assetIdsToUpdate);

                if (updateError) {
                    console.error('Error updating asset status:', updateError);
                    // Don't throw - order is already created, just log the error
                }
            }

            return orderData;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    // const sendOrderNotification = async (orderData: any) => {
    //     const webhookUrl = import.meta.env.VITE_N8N_ORDER_WEBHOOK_URL;

    //     if (!webhookUrl) {
    //         console.log('n8n webhook URL not configured, skipping notification');
    //         return;
    //     }

    //     try {
    //         // Send only the order ID to n8n
    //         // n8n will fetch order details from Supabase and send emails
    //         await fetch(webhookUrl, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 event: 'order.created',
    //                 order_id: orderData.id,
    //                 order_number: orderData.order_number,
    //             }),
    //         });
    //     } catch (error) {
    //         console.error('Error sending notification to n8n:', error);
    //         // Don't throw - notification failure shouldn't break the order
    //         // n8n can also be triggered by Supabase webhooks as backup
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
            toast.error("Please fill in all fields");
            return;
        }

        setProcessing(true);

        try {
            // Step 1: Create order in brand database FIRST
            const orderData = await createOrder();

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

            // Step 2: Create payment intent via external payment service
            const paymentResponse = await fetch(import.meta.env.VITE_PAYMENT_CREATE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.id,
                    orderNumber: orderData.order_number,
                    brand: 'FigureIt',
                    product: 'testing',
                    amount: Math.round(total * 100),
                    currency: 'cad',
                    customerEmail: formData.email,
                    customerName: formData.fullName,
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentData.success || !paymentData.clientSecret) {
                throw new Error('Failed to create payment intent');
            }

            console.log('Admin Order ID:', paymentData.adminOrderId);

            // Step 3: Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(
                paymentData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: formData.fullName,
                            email: formData.email,
                            phone: formData.phone,
                            address: {
                                line1: formData.address,
                                city: formData.city,
                                postal_code: formData.postalCode,
                            },
                        },
                    },
                }
            );

            if (result.error) {
                throw new Error(result.error.message);
            }

            // Step 4: Update payment status directly
            if (result.paymentIntent?.status === 'succeeded') {
                console.log('Payment succeeded:', result.paymentIntent.id);

                await fetch(import.meta.env.VITE_PAYMENT_UPDATE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        brand: 'FigureIt',
                        orderId: orderData.id,
                        paymentIntentId: result.paymentIntent.id,
                        status: 'paid',
                        paymentMethod: 'card',
                    }),
                });

                // Prepare email template data
                const imageHtml = items.map(item => item.imageUrl ? `<img src="${item.imageUrl}" alt="Order Image" style="max-width:300px;" />` : '').join('');
                const nameParts = formData.fullName.split(' ');
                const customerName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts.slice(1).join(' ')}` : formData.fullName;

                // Send order confirmation email
                await fetch(import.meta.env.VITE_EMAIL_SERVICE_URL + '/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: formData.email,
                        subject: 'Order Confirmation',
                        templateData: {
                            orderImages: imageHtml,
                            customerName: customerName,
                        },
                    }),
                });

                // Clear cart
                clearCart();

                toast.success("Order placed successfully!");
                onSuccess(orderData.id);
            } else {
                throw new Error('Payment was not successful');
            }

        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error.message || "Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show alert if items are unavailable */}
            {unavailableItems.length > 0 && (
                <ItemUnavailableAlert itemNames={unavailableItems} />
            )}

            {/* Customer Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(416) 555-0123"
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
                <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main St"
                            required
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Toronto"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code *</Label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="M5V 3A8"
                                required
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Card Details *</Label>
                        <div className="p-3 border rounded-md bg-background">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold">${shippingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Tax ({shippingInfo?.province} - {((shippingInfo?.taxRate || 0) * 100).toFixed(2)}%)
                        </span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/cart")}
                    disabled={processing}
                >
                    Back to Cart
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={!stripe || processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        `Pay $${total.toFixed(2)}`
                    )}
                </Button>
            </div>
        </form>
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const { items, shippingInfo } = useCartStore();

    // Redirect if cart is empty
    if (items.length === 0) {
        navigate("/cart");
        return null;
    }

    // Allow if shippingInfo exists OR isPickup is true
    if (!shippingInfo || (!shippingInfo.isPickup && !shippingInfo.shippingFee)) {
        toast.error("Please calculate shipping or select pickup");
        // Do not navigate away, just show the toast and keep the page
        return null;
    }

    const handleSuccess = (orderId: string) => {
        navigate(`/order-confirmation/${orderId}`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                    {/* Inventory Disclaimer */}
                    <InventoryDisclaimer />

                    <Elements stripe={stripePromise}>
                        <CheckoutForm onSuccess={handleSuccess} />
                    </Elements>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;