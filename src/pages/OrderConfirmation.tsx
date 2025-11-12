import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    subtotal: number;
    shipping_fee: number;
    tax: number;
    total: number;
    payment_status: string;
    order_status: string;
    created_at: string;
}

interface OrderItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

const OrderConfirmation = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                toast.error("Order ID not found");
                navigate("/");
                return;
            }

            try {
                // Fetch order
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('id', orderId)
                    .single();

                if (orderError) throw orderError;

                // Fetch order items
                const { data: itemsData, error: itemsError } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                if (itemsError) throw itemsError;

                setOrder(orderData);
                setOrderItems(itemsData || []);
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                        <Button onClick={() => navigate("/")}>Go to Home</Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-20 w-20 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-muted-foreground text-lg">
                            Thank you for your order. We've sent a confirmation email to {order.customer_email}
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Order Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Number</p>
                                        <p className="font-semibold">{order.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="font-semibold">
                                            {new Date(order.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Payment Status</p>
                                        <p className="font-semibold capitalize text-green-600">
                                            {order.payment_status}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Status</p>
                                        <p className="font-semibold capitalize">
                                            {order.order_status}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-semibold">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-semibold">{order.customer_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-semibold">{order.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                                    <p className="font-semibold">{order.shipping_address}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-16 h-16 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center">
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
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
                                    <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold">${order.shipping_fee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="font-semibold">${order.tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate("/shop")}
                            >
                                Continue Shopping
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => navigate("/")}
                            >
                                Go to Home
                            </Button>
                        </div>

                        {/* Additional Information */}
                        <Card className="bg-muted">
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">
                                    <strong>What's next?</strong><br />
                                    We'll send you an email with tracking information once your order ships.
                                    If you have any questions about your order, please contact us at support@figureit.com
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderConfirmation;
