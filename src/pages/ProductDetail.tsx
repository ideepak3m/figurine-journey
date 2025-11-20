import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReviewCarousel, Review } from "@/components/ReviewCarousel";
import { AlertCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
// import { useState } from "react";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Quantity always 1 for available figurines

    const { data: product, isLoading, error } = useProduct(id || '');
    const addItem = useCartStore((state) => state.addItem);

    // Determine if product is available for purchase
    const isAvailable = product?.asset_status === 'inventory';
    const statusLabel = isAvailable ? 'Available' : 'Showcase';

    const handleAddToCart = () => {
        if (!product) {
            toast.error("Unable to add product to cart");
            return;
        }

        if (!isAvailable) {
            toast.info("This is a showcase item. Let's create something similar for you!");
            navigate('/custom-orders');
            return;
        }

        if (!product.price) {
            toast.error("Unable to add product to cart");
            return;
        }

        addItem({
            id: product.id,
            type: 'standard',
            title: product.title || 'Untitled Product',
            description: product.description || undefined,
            price: Number(product.price),
            quantity: 1,
            imageUrl: product.asset_url,
            assetId: product.id,
        });

        toast.success(`${product.title || 'Product'} added to cart!`);
    };
    const handleCustomize = () => {
        navigate('/custom-orders');
    };

    const formatPrice = (price: number | null) => {
        if (!price) return 'Price not available';
        return `$${price.toFixed(2)}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 py-12">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-8 w-32 mb-8" />
                        <div className="grid md:grid-cols-2 gap-12">
                            <Skeleton className="aspect-square w-full" />
                            <div className="space-y-6">
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 py-12">
                    <div className="container mx-auto px-4">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Product not found or failed to load. Please try again later.
                            </AlertDescription>
                        </Alert>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => navigate('/shop')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shop
                        </Button>
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
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-8"
                        onClick={() => navigate('/shop')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shop
                    </Button>

                    {/* Product Details */}
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden rounded-lg flex items-center justify-center bg-muted">
                            <img
                                src={product.asset_url}
                                alt={product.title || 'Product'}
                                className="w-[85%] h-[85%] object-contain"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h1 className="text-4xl font-bold">
                                        {product.title || 'Untitled Product'}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isAvailable
                                        ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                                        : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                        }`}>
                                        {statusLabel}
                                    </span>
                                </div>
                                {product.category && (
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        {product.category}
                                    </span>
                                )}
                            </div>

                            <div className="text-3xl font-bold text-primary">
                                {formatPrice(product.price)}
                                {!isAvailable && (
                                    <p className="text-sm text-muted-foreground font-normal mt-2">
                                        This is a showcase piece. Contact us to create something similar!
                                    </p>
                                )}
                            </div>                            <div className="prose max-w-none">
                                <p className="text-lg text-muted-foreground">
                                    {product.description || 'No description available for this product.'}
                                </p>
                            </div>

                            {/* Quantity Selector removed: quantity is always 1 for available figurines */}

                            {/* Action Buttons and Custom Order Info */}
                            <div className="space-y-4 pt-6">
                                {isAvailable ? (
                                    <>
                                        <Button
                                            className="w-full"
                                            size="lg"
                                            onClick={handleAddToCart}
                                            disabled={!product.price}
                                        >
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            Add to Cart
                                        </Button>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-900 text-sm flex flex-col gap-2">
                                            <h1><span className="font-semibold text-base">🛎️ Custom Orders Available — But Not Modifications</span></h1>
                                            <span>
                                                <span className="text-base font-bold">This figurine is handcrafted and one-of-a-kind.</span>
                                                <br />If you'd like something similar but personalized, we offer custom orders — just click <b>Customize</b> to start.
                                                <br /><b>Please note:</b> we cannot modify this exact piece or recreate it identically, but we’d love to craft something inspired by it, just for you.
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            size="lg"
                                            onClick={handleCustomize}
                                        >
                                            Customize
                                        </Button>
                                        <div className="pt-6">
                                            {/* TODO: Replace with real reviews from DB */}
                                            <ReviewCarousel
                                                reviews={demoReviews}
                                                visibleCount={3}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleCustomize}
                                    >
                                        Custom Order
                                    </Button>
                                )}
                            </div>

                            {/* Additional Info
                            <div className="pt-6 border-t space-y-2 text-sm text-muted-foreground">
                                <p>• Handcrafted with attention to detail</p>
                                <p>• Custom orders available</p>
                                <p>• Shipping available across GTA and beyond</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

// Demo reviews until DB integration
const demoReviews: Review[] = [
    {
        id: "1",
        name: "Aarti S.",
        rating: 5,
        text: "Absolutely beautiful work! The figurine was even better than I imagined. Thank you for making my gift so special!",
    },
    {
        id: "2",
        name: "Priya M.",
        rating: 5,
        text: "Incredible attention to detail. The custom order process was easy and the result was perfect!",
    },
    {
        id: "3",
        name: "Rohit K.",
        rating: 4,
        text: "Very happy with my purchase. The figurine is unique and arrived safely. Will order again!",
    },
    {
        id: "4",
        name: "Meera D.",
        rating: 5,
        text: "The best custom gift experience I've had. Highly recommend!",
    },
    {
        id: "5",
        name: "Sanjay P.",
        rating: 5,
        text: "Beautiful craftsmanship and great communication throughout the process.",
    },
];

export default ProductDetail;
