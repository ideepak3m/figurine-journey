import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // Determine if product is available for purchase
  const isAvailable = product.asset_status === 'inventory';
  const statusLabel = isAvailable ? 'Available' : 'Showcase';

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.info("This is a showcase item and cannot be purchased directly. Please contact us for custom orders!");
      navigate('/custom-orders');
      return;
    }

    if (!product.price) {
      toast.error("Price not available for this product");
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
    // Navigate to custom order page
    navigate('/custom-orders');
  };

  const handleViewDetails = () => {
    navigate(`/shop/${product.id}`);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price not available';
    return `$${price.toFixed(2)}`;
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
        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        {isAvailable ? (
          <>
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.price}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCustomize}
            >
              Customize
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={handleCustomize}
          >
            Custom Order
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
