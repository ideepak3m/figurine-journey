import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore, isGTAPostalCode } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, Package } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotal, shippingInfo, setShippingInfo } = useCartStore();

    const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || "");
    const [shippingCalculated, setShippingCalculated] = useState(!!shippingInfo);

    const SHIPPING_FEE = 15.00; // Fee for outside GTA

    const handleCalculateShipping = () => {
        if (!postalCode.trim()) {
            toast.error("Please enter a postal code");
            return;
        }

        const isGTA = isGTAPostalCode(postalCode);
        const fee = isGTA ? 0 : SHIPPING_FEE;

        setShippingInfo({
            postalCode: postalCode.toUpperCase(),
            isGTA,
            shippingFee: fee,
        });

        setShippingCalculated(true);
        toast.success(isGTA ? "Free shipping within GTA!" : `Shipping fee: $${fee.toFixed(2)}`);
    };

    const handleCheckout = () => {
        if (!shippingCalculated) {
            toast.error("Please calculate shipping first");
            return;
        }
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
                            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                            <p className="text-muted-foreground mb-8">
                                Looks like you haven't added any items to your cart yet.
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
    const total = getTotal();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            {/* Image */}
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

                                            {/* Details */}
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

                                                    {/* Quantity Controls - Only for standard products */}
                                                    {item.type === 'standard' && (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="w-12 text-center font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    )}

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

                                        {/* Shipping Calculator */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium">Postal Code</label>
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
                                                        <span className="text-green-600">✓ Free shipping (GTA)</span>
                                                    ) : (
                                                        <span className="text-amber-600">
                                                            + ${shippingInfo?.shippingFee.toFixed(2)} (Outside GTA)
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${total.toFixed(2)}</span>
                                        </div>

                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleCheckout}
                                            disabled={!shippingCalculated}
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

            <Footer />
        </div>
    );
};

export default Cart;
