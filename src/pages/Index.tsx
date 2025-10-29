import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-background.jpg";
import productFamily from "@/assets/product-family.jpg";
import productPet from "@/assets/product-pet.jpg";
import productFestive from "@/assets/product-festive.jpg";

const Index = () => {
  const featuredProducts = [
    {
      image: productFamily,
      title: "Family Portrait Set",
      description: "Capture your family's unique bond in charming miniature form",
      price: "$89.99",
    },
    {
      image: productPet,
      title: "Pet & Owner Set",
      description: "Celebrate the special connection with your furry friend",
      price: "$64.99",
    },
    {
      image: productFestive,
      title: "Festive Collection",
      description: "Holiday-themed figurines perfect for seasonal celebrations",
      price: "$74.99",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[hsl(var(--accent))]" />
          <div
            className="absolute inset-0 bg-contain bg-right bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent))] via-[hsl(var(--accent))]/60 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                From photo to charm—
                <span className="text-primary"> custom figurines</span> that tell
                your story
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Handcrafted with love, each figurine captures the moments and
                personalities that matter most to you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Create Yours
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-accent/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Handcrafted with Care</h3>
                <p className="text-muted-foreground">
                  Every figurine is sculpted by hand with attention to detail and love
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Magic</h3>
                <p className="text-muted-foreground">
                  Transform your photos into unique keepsakes that capture personalities
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Memories That Last</h3>
                <p className="text-muted-foreground">
                  Create lasting tributes to the people, pets, and moments you cherish
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Collections</h2>
              <p className="text-xl text-muted-foreground">
                Discover our most popular handcrafted figurines
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </div>
          </div>
        </section>

        {/* Instagram Preview */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Follow Our Journey</h2>
              <p className="text-xl text-muted-foreground mb-6">
                See our latest creations on Instagram @figureit2023
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://instagram.com/figureit2023"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow Us on Instagram
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
