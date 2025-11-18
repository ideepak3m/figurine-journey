import { Button } from "@/components/ui/button";
import HomeVideoModal from "@/components/HomeVideoModal";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import banner4 from "@/assets/banner-4.jpg";
import banner5 from "@/assets/banner-5.jpg";
import banner6 from "@/assets/banner-6.jpg";
import banner7 from "@/assets/banner-7.jpg";

const Index = () => {
  // Fetch featured products from Supabase (limit to 3)
  const { data: products, isLoading } = useProducts({ limit: 3 });

  const bannerImages = [
    {
      image: banner1,
      alt: "Child reaching for colorful flower fairy figurines"
    },
    {
      image: banner2,
      alt: "Singer with custom talent figurine under glass dome"
    },
    {
      image: banner3,
      alt: "Artist painting with matching figurine"
    },
    {
      image: banner4,
      alt: "Pet owner with dog figurine keepsake"
    },
    {
      image: banner5,
      alt: "Couple figurine in elegant glass display"
    },
    {
      image: banner6,
      alt: "Holiday gift figurine with Christmas tree"
    },
    {
      image: banner7,
      alt: "Garden fairy figurine in glass dome"
    },
  ];

  // Group images into pairs for 2-per-slide layout
  const bannerSlides = [];
  for (let i = 0; i < bannerImages.length; i += 2) {
    bannerSlides.push(bannerImages.slice(i, i + 2));
  }

  return (
    <>
      <HomeVideoModal />
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
                {bannerSlides.map((slide, slideIndex) => (
                  <CarouselItem key={slideIndex} className="pl-0">
                    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden bg-muted pattern-dots">
                      <div className="flex h-full gap-1">
                        {slide.map((item, itemIndex) => (
                          <div key={itemIndex} className="relative h-full flex-1">
                            <img
                              src={item.image}
                              alt={item.alt}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-12">
                        <div className="container px-0 md:px-4 mx-auto">
                          <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
                            <div className="flex flex-wrap gap-4 justify-center">
                              <Button size="lg" className="gap-2 shadow-lg">
                                Shop Now <ArrowRight className="h-4 w-4" />
                              </Button>
                              <Button size="lg" variant="outline" className="gap-2 shadow-lg bg-background/80 backdrop-blur-sm">
                                Create Custom Order
                              </Button>
                            </div>
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

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, index) => (
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
              {!isLoading && products && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Button size="lg" variant="outline" onClick={() => window.location.href = '/#/shop'}>
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
    </>
  );
};

export default Index;
