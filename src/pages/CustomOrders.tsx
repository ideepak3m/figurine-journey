import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomOrders = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Order Submitted!",
      description: "We'll review your custom order and get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Create Your Custom Figurine</h1>
            <p className="text-xl text-muted-foreground">
              Let's bring your vision to life, step by step
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Custom Order Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="figures">Number of Figures</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of figures" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Figure</SelectItem>
                        <SelectItem value="2">2 Figures</SelectItem>
                        <SelectItem value="3">3 Figures</SelectItem>
                        <SelectItem value="4">4 Figures</SelectItem>
                        <SelectItem value="5+">5+ Figures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occasion">Occasion</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="wedding">Wedding/Anniversary</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="memorial">Memorial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description & Special Requests</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your vision... Include details about outfits, poses, accessories, or any special elements you'd like"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameplate">Nameplate or Message (Optional)</Label>
                    <Input
                      id="nameplate"
                      placeholder="Add a custom message or names"
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Reference Photos</h3>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB (multiple files allowed)
                    </p>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="bg-accent/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm italic">
                        "Roopa captured our family perfectly! The attention to detail
                        was incredible."
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        - Sarah M.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm italic">
                        "Best gift I've ever given. My mom was in tears!"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        - Mike T.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">Estimated Timeline:</p>
                  <p className="text-muted-foreground">
                    Custom orders typically take 2-3 weeks from approval to delivery.
                    We'll send you progress photos along the way!
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Custom Order Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomOrders;
