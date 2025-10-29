import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Sparkles, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-5xl font-bold mb-6">Meet Roopa</h1>
            <p className="text-xl text-muted-foreground">
              The heart and hands behind Figure It
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <p className="text-lg leading-relaxed mb-6">
                Meet Roopa, the heart behind Figure It. What started as a love for
                storytelling and tiny details became a way to turn everyday moments
                into lasting keepsakes.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Each figurine is handcrafted with care, humor, and a touch of
                whimsy—because your memories deserve more than a frame. Whether it's
                a skating dad, a cuddly pup, or a festive family, I sculpt joy into
                every piece.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Every commission is a collaboration. You share your photos, your
                stories, your quirks—and I transform them into miniature treasures
                that capture not just how people look, but who they are. The dad who
                never takes off his favorite cap, the dog with the crooked ear, the
                grandmother's signature smile—these are the details that matter.
              </p>
              <p className="text-lg leading-relaxed mb-6 font-semibold text-primary">
                Let's figure it out—together.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Makes Us Different
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Handcrafted with Love
                </h3>
                <p className="text-muted-foreground">
                  Every detail is carefully sculpted by hand, ensuring each piece is
                  unique and personal
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Personality Over Perfection
                </h3>
                <p className="text-muted-foreground">
                  We capture the quirks and character that make your loved ones
                  special
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaborative Process</h3>
                <p className="text-muted-foreground">
                  We work closely with you to ensure every detail tells your story
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share Your Vision</h3>
                  <p className="text-muted-foreground">
                    Send us your photos and tell us what makes your subjects special.
                    The more details, the better!
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">We Create Magic</h3>
                  <p className="text-muted-foreground">
                    Roopa handcrafts your figurines with care, capturing every quirk
                    and personality trait.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Delivered with Love</h3>
                  <p className="text-muted-foreground">
                    Your custom figurines arrive carefully packaged and ready to
                    become treasured keepsakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
