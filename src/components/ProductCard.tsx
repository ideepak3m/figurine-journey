import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { ReviewCarousel, Review } from "@/components/ReviewCarousel";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const navigate = useNavigate();

  // Determine if product is available for purchase
  const isAvailable = product.asset_status === 'inventory';
  const statusLabel = isAvailable ? 'Available' : 'Showcase';

  // Check if product is already in cart
  const isInCart = items.some(item => item.assetId === product.id);

  const handleAddToCart = () => {
    if (!isAvailable) {
      console.log('Showcase item clicked, asset_url:', product.asset_url);
      const encodedUrl = encodeURIComponent(product.asset_url || '');
      console.log('Encoded URL:', encodedUrl);
      toast.info("This is a showcase item and cannot be purchased directly. Please contact us for custom orders!");
      navigate(`/custom-orders?showcaseImage=${encodedUrl}`);
      return;
    }

    if (!product.price) {
      toast.error("Price not available for this product");
      return;
    }

    // Use discounted price if available, otherwise use regular price
    const priceToUse = product.discounted_price && product.discounted_price < product.price
      ? product.discounted_price
      : product.price;

    addItem({
      id: product.id,
      type: 'standard',
      title: product.title || 'Untitled Product',
      description: product.description || undefined,
      price: Number(priceToUse),
      quantity: 1,
      imageUrl: product.asset_url,
      assetId: product.id,
    });

    toast.success(`${product.title || 'Product'} added to cart!`, {
      description: "⚠️ Item not reserved - complete payment to guarantee availability",
      duration: 4000,
    });
  };

  const handleCustomize = () => {
    // Navigate to custom order page with showcase image
    console.log('Customize clicked, asset_url:', product.asset_url);
    const encodedUrl = encodeURIComponent(product.asset_url || '');
    console.log('Encoded URL for customize:', encodedUrl);
    navigate(`/custom-orders?showcaseImage=${encodedUrl}`);
  };

  const handleViewDetails = () => {
    navigate(`/shop/${product.id}`);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price not available';
    return `$${price.toFixed(2)}`;
  };

  const renderPrice = () => {
    if (!product.price) {
      return <p className="text-2xl font-bold text-primary">Price not available</p>;
    }

    if (product.discounted_price && product.discounted_price < product.price) {
      return (
        <div className="flex items-center gap-3">
          <p className="text-2xl font-bold text-primary">${product.discounted_price.toFixed(2)}</p>
          <p className="text-lg line-through text-muted-foreground">${product.price.toFixed(2)}</p>
          <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded">
            SALE
          </span>
        </div>
      );
    }

    return <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>;
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div
        className="aspect-square overflow-hidden relative flex items-center justify-center bg-muted"
        onClick={handleViewDetails}
      >
        <img
          src={product.asset_url}
          alt={product.title || 'Product'}
          className="w-[65%] h-[65%] object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${isAvailable
          ? 'bg-green-500/90 text-white'
          : 'bg-amber-500/90 text-white'
          }`}>
          {statusLabel}
        </div>
      </div>
      <CardContent className="p-6" onClick={handleViewDetails}>
        <h3 className="text-xl font-semibold mb-2">{product.title || 'Untitled Product'}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description || 'No description available'}
        </p>
        {renderPrice()}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2 flex-col items-stretch">
        {isAvailable ? (
          <>
            <Button
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.price || isInCart}
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleCustomize();
              }}
            >
              Customize
            </Button>
            {/* ReviewCarousel removed from shop page */}
          </>
        ) : (
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleCustomize();
            }}
          >
            Custom Order
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};



export default ProductCard;
