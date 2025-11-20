import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useAssetCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products from Supabase
  const { data: products, isLoading, error } = useProducts({
    category: selectedCategory
  });

  // Fetch categories from Supabase
  const { data: assetCategories, isLoading: categoriesLoading } = useAssetCategories();

  // Build category list with "All Products" option
  // Replace 'FigureIt' with 'Available' and sort so 'Available' is first if present
  let categories = [
    { id: "all", label: "All Products" },
    ...(assetCategories?.map(cat => ({ id: cat, label: cat === 'FigureIt' ? 'Available' : cat })) || []),
  ];
  // Move 'Available' to the front if it exists (after 'All Products')
  const availableIdx = categories.findIndex(c => c.label === 'Available');
  if (availableIdx > 1) {
    const [availableCat] = categories.splice(availableIdx, 1);
    categories.splice(1, 0, availableCat);
  }
  // Hide the 'Available' button for now
  categories = categories.filter(c => c.label !== 'Available');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Our Shop</h1>
            <p className="text-xl text-muted-foreground">
              Handcrafted figurines that bring your memories to life
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoriesLoading ? (
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : (
              categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))
            )}
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load products. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">
                    No products found in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products
                    .slice()
                    .sort((a, b) => {
                      // Show 'inventory' (Available) first
                      if (a.asset_status === 'inventory' && b.asset_status !== 'inventory') return -1;
                      if (a.asset_status !== 'inventory' && b.asset_status === 'inventory') return 1;
                      return 0;
                    })
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
