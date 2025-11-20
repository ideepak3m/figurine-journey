import Modal from "@/components/ui/modal";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore, isGTAPostalCode, getProvinceFromPostalCode, TAX_RATES } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, Package } from "lucide-react";
import { toast } from "sonner";
import { InventoryDisclaimer } from "@/components/InventoryDisclaimer";
import logo from "@/assets/logo.jpg";

const Cart = () => {
    // Modal state for outside GTA shipping inquiry
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [inqFirstName, setInqFirstName] = useState("");
    const [inqLastName, setInqLastName] = useState("");
    const [inqEmail, setInqEmail] = useState("");
    const [inqPhone, setInqPhone] = useState("");
    const [inqLoading, setInqLoading] = useState(false);

    const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');
    const navigate = useNavigate();
    const { items, removeItem, clearCart, getSubtotal, getTax, getTotal, shippingInfo, setShippingInfo } = useCartStore();

    const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || "");
    const [shippingCalculated, setShippingCalculated] = useState(!!shippingInfo);

    const SHIPPING_FEE_GTA = 20.00;

    // Handle delivery method change
    const handleDeliveryChange = (method: 'shipping' | 'pickup') => {
        setDeliveryMethod(method);
        if (method === 'pickup') {
            setShippingInfo(undefined);
            setPostalCode('');
            setShippingCalculated(false);
        }
    };

    // Submit shipping inquiry to Supabase
    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInqLoading(true);

        const fullName = `${inqFirstName} ${inqLastName}`.trim();
        const cartSnapshot = JSON.stringify(items);

        const { error } = await supabase
            .from('shipping_inquiries')
            .insert({
                full_name: fullName,
                email: inqEmail,
                phone: inqPhone || null,
                postal_code: postalCode,
                cart_snapshot: cartSnapshot,
                shipping_method: 'outside_gta',
                status: 'pending',
                source: 'checkout_form',
            });

        setInqLoading(false);

        if (error) {
            console.error('Shipping inquiry error:', error);
            toast.error('Failed to submit shipping inquiry. Please try again.');
        } else {
            toast.success('Shipping inquiry submitted! We will contact you within 24 hours.');
            setShowInquiryModal(false);

            // Reset form
            setInqFirstName("");
            setInqLastName("");
            setInqEmail("");
            setInqPhone("");

            // Mark as calculated with 0 fee (will be quoted later)
            const province = getProvinceFromPostalCode(postalCode);
            const taxRate = TAX_RATES[province as keyof typeof TAX_RATES] || TAX_RATES.ON;

            setShippingInfo({
                postalCode: postalCode.toUpperCase(),
                isGTA: false,
                shippingFee: 0, // Will be quoted
                province,
                taxRate,
            });
            setShippingCalculated(true);
        }
    };

    const handleCalculateShipping = () => {
        if (!postalCode.trim()) {
            toast.error("Please enter a postal code");
            return;
        }

        const isGTA = isGTAPostalCode(postalCode);
        const province = getProvinceFromPostalCode(postalCode);
        const taxRate = TAX_RATES[province as keyof typeof TAX_RATES] || TAX_RATES.ON;

        if (!isGTA) {
            // Show modal for outside GTA
            setShowInquiryModal(true);
            return;
        }

        // GTA shipping
        const fee = SHIPPING_FEE_GTA;

        setShippingInfo({
            postalCode: postalCode.toUpperCase(),
            isGTA,
            shippingFee: fee,
            province,
            taxRate,
        });

        setShippingCalculated(true);
        toast.success(`Shipping fee: $${fee.toFixed(2)}`);
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 py-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center py-16">
                            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                                Thank you for shopping at
                                <img src={logo} alt="Figure It" className="h-12 w-auto align-middle" />
                            </h1>
                            <p className="text-muted-foreground mb-8">
                                You will receive an email shortly with order details.
                            </p>
                            <Button onClick={() => navigate("/shop")}>
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const subtotal = getSubtotal();
    let shippingFee = 0;
    if (deliveryMethod === 'shipping' && shippingInfo?.isGTA) {
        shippingFee = shippingInfo.shippingFee || 0;
    }
    const tax = getTax();
    const total = subtotal + shippingFee + tax;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                    <InventoryDisclaimer />

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-[85%] h-[85%] object-contain"
                                                    />
                                                ) : (
                                                    <Package className="h-12 w-12 text-muted-foreground" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{item.title}</h3>
                                                        {item.type === 'custom' && (
                                                            <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-700 text-xs rounded mt-1">
                                                                Custom Order
                                                            </span>
                                                        )}
                                                        {item.description && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            removeItem(item.id);
                                                            toast.success("Item removed from cart");
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="text-lg font-bold text-primary">
                                                        ${item.price.toFixed(2)}
                                                    </div>

                                                    {item.type === 'custom' && (
                                                        <div className="text-sm text-muted-foreground">
                                                            Quantity: {item.quantity}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearCart();
                                    toast.success("Cart cleared");
                                }}
                                className="w-full"
                            >
                                Clear Cart
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                        </div>

                                        <Separator />

                                        {/* Delivery Method */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium">Delivery Method</label>
                                            <div className="flex gap-4 mb-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="deliveryMethod"
                                                        value="shipping"
                                                        checked={deliveryMethod === 'shipping'}
                                                        onChange={() => handleDeliveryChange('shipping')}
                                                    />
                                                    Shipping
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="deliveryMethod"
                                                        value="pickup"
                                                        checked={deliveryMethod === 'pickup'}
                                                        onChange={() => handleDeliveryChange('pickup')}
                                                    />
                                                    Pickup
                                                </label>
                                            </div>

                                            {deliveryMethod === 'shipping' && (
                                                <>
                                                    <label className="text-sm font-medium">Postal Code (for shipping quote)</label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="M5V 3A8"
                                                            value={postalCode}
                                                            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                                                            className="flex-1"
                                                        />
                                                        <Button onClick={handleCalculateShipping} size="sm">
                                                            Calculate
                                                        </Button>
                                                    </div>
                                                    {shippingCalculated && (
                                                        <p className="text-sm">
                                                            {shippingInfo?.isGTA ? (
                                                                <span className="text-green-600">
                                                                    ✓ Flat rate within GTA: ${shippingInfo?.shippingFee.toFixed(2)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-amber-600">
                                                                    ✓ Inquiry submitted. We'll contact you with shipping details within 24 hours.
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}
                                                    {!shippingCalculated && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Enter postal code to calculate shipping or proceed to checkout.
                                                        </p>
                                                    )}
                                                </>
                                            )}

                                            {deliveryMethod === 'pickup' && (
                                                <p className="text-green-700 text-sm">
                                                    No shipping fee for pickup. You will be contacted for pickup arrangements.
                                                </p>
                                            )}
                                        </div>

                                        {(deliveryMethod === 'shipping' || shippingCalculated) && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Shipping
                                                    {deliveryMethod === 'shipping' && shippingInfo?.isGTA && ' (GTA)'}
                                                    {deliveryMethod === 'shipping' && shippingInfo && !shippingInfo.isGTA && ' (TBD)'}
                                                </span>
                                                <span className="font-semibold">
                                                    {shippingInfo && !shippingInfo.isGTA ? 'TBD' : `$${shippingFee.toFixed(2)}`}
                                                </span>
                                            </div>
                                        )}

                                        <Separator />

                                        {(deliveryMethod === 'pickup' || shippingCalculated) && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Tax
                                                    {deliveryMethod === 'shipping' && shippingInfo?.province &&
                                                        ` (${shippingInfo?.province} - ${((shippingInfo?.taxRate || 0) * 100).toFixed(2)}%)`
                                                    }
                                                </span>
                                                <span className="font-semibold">${tax.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">
                                                ${total.toFixed(2)}
                                                {shippingInfo && !shippingInfo.isGTA && <span className="text-sm font-normal"> + shipping</span>}
                                            </span>
                                        </div>

                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleCheckout}
                                        >
                                            Proceed to Checkout
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => navigate("/shop")}
                                        >
                                            Continue Shopping
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for outside GTA shipping inquiry */}
            <Modal open={showInquiryModal} onOpenChange={setShowInquiryModal}>
                <div className="p-6 max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Let's make it happen.</h1>
                    <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                        Shipping outside the GTA is calculated based on your location. To ensure you get the product you want, please share your full name, email address, and phone number (optional).
                        <br />We'll work out the best shipping option and get back to you with the details—typically within 24 hours.
                        <br /><span className="font-bold">No payment is required until shipping is confirmed</span>
                        <br /><span className="font-bold">Your information is used only to finalize your order.</span>
                    </p>
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="First Name"
                                value={inqFirstName}
                                onChange={e => setInqFirstName(e.target.value)}
                                required
                            />
                            <Input
                                placeholder="Last Name"
                                value={inqLastName}
                                onChange={e => setInqLastName(e.target.value)}
                                required
                            />
                        </div>
                        <Input
                            placeholder="Email"
                            type="email"
                            value={inqEmail}
                            onChange={e => setInqEmail(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Phone (optional)"
                            type="tel"
                            value={inqPhone}
                            onChange={e => setInqPhone(e.target.value)}
                        />
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowInquiryModal(false)}
                                disabled={inqLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={inqLoading}
                            >
                                {inqLoading ? 'Submitting...' : 'Submit Inquiry'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <Footer />
        </div>
    );
};

export default Cart;