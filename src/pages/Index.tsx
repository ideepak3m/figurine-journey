import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import productFamily from "@/assets/product-family.jpg";
import productPet from "@/assets/product-pet.jpg";
import productFestive from "@/assets/product-festive.jpg";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import banner4 from "@/assets/banner-4.jpg";
import banner5 from "@/assets/banner-5.jpg";
import banner6 from "@/assets/banner-6.jpg";
import banner7 from "@/assets/banner-7.jpg";

const Index = () => {
  const bannerImages = [
    { 
      image: banner1, 
      alt: "Child reaching for colorful flower fairy figurines",
      title: "Bring Magic to Life",
      subtitle: "Whimsical creations that spark joy and wonder"
    },
    { 
      image: banner2, 
      alt: "Singer with custom talent figurine under glass dome",
      title: "Celebrate the Talent",
      subtitle: "Custom crafted for that special artist or performer"
    },
    { 
      image: banner3, 
      alt: "Artist painting with matching figurine",
      title: "Magic Happens",
      subtitle: "Transform your passion into a handcrafted keepsake"
    },
    { 
      image: banner4, 
      alt: "Pet owner with dog figurine keepsake",
      title: "Memorable Keepsake",
      subtitle: "Truly cherished moments preserved forever"
    },
    { 
      image: banner5, 
      alt: "Couple figurine in elegant glass display",
      title: "Romance Captured",
      subtitle: "Celebrate love with timeless artistry"
    },
    { 
      image: banner6, 
      alt: "Holiday gift figurine with Christmas tree",
      title: "Perfect Gifts",
      subtitle: "Heartfelt presents for every special occasion"
    },
    { 
      image: banner7, 
      alt: "Garden fairy figurine in glass dome",
      title: "Nature's Beauty",
      subtitle: "Enchanting pieces inspired by the natural world"
    },
  ];

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
        {/* Hero Carousel Banner */}
        <section className="relative w-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {bannerImages.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                          <div className="flex flex-wrap gap-4 justify-center">
                            <Button size="lg" className="gap-2 shadow-lg">
                              Shop Now <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2 shadow-lg bg-background/80 backdrop-blur-sm">
                              Create Custom Order
                            </Button>
                          </div>
                          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground drop-shadow-lg">
                            {item.title}
                          </h1>
                          <p className="text-xl md:text-2xl text-foreground/90 drop-shadow-md">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 md:left-8 bg-background/80 backdrop-blur-sm border-2" />
            <CarouselNext className="right-4 md:right-8 bg-background/80 backdrop-blur-sm border-2" />
          </Carousel>
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
