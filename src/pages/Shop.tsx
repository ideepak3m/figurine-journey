import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import productFamily from "@/assets/product-family.jpg";
import productPet from "@/assets/product-pet.jpg";
import productFestive from "@/assets/product-festive.jpg";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "family", label: "Family Portraits" },
    { id: "pets", label: "Pet & Owner Sets" },
    { id: "festive", label: "Festive Figurines" },
    { id: "custom", label: "Custom Orders" },
  ];

  const products = [
    {
      image: productFamily,
      title: "Family Portrait Set",
      description: "Capture your family's unique bond in charming miniature form",
      price: "$89.99",
      category: "family",
    },
    {
      image: productPet,
      title: "Pet & Owner Set",
      description: "Celebrate the special connection with your furry friend",
      price: "$64.99",
      category: "pets",
    },
    {
      image: productFestive,
      title: "Festive Collection",
      description: "Holiday-themed figurines perfect for seasonal celebrations",
      price: "$74.99",
      category: "festive",
    },
    {
      image: productFamily,
      title: "Couple Portrait",
      description: "Perfect anniversary or wedding gift for special occasions",
      price: "$69.99",
      category: "family",
    },
    {
      image: productPet,
      title: "Multi-Pet Set",
      description: "Celebrate all your furry companions in one adorable set",
      price: "$89.99",
      category: "pets",
    },
    {
      image: productFestive,
      title: "Christmas Family",
      description: "Festive family figurines with holiday spirit",
      price: "$94.99",
      category: "festive",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
