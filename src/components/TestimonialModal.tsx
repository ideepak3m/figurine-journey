import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface TestimonialModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TestimonialModal = ({ open, onOpenChange }: TestimonialModalProps) => {
    const [fullname, setFullname] = useState("");
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullname.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!text.trim()) {
            toast.error("Please enter your feedback");
            return;
        }

        setIsSubmitting(true);

        try {
            // Explicitly create insert object without id field
            const testimonialData = {
                fullname: fullname.trim(),
                rating: rating,
                text: text.trim(),
                date: new Date().toISOString(),
            };

            console.log("=== TESTIMONIAL SUBMISSION ===");
            console.log("Data to be inserted:", JSON.stringify(testimonialData, null, 2));
            console.log("Table: testimonials");

            const { data, error } = await supabase
                .from("testimonials")
                .insert(testimonialData)
                .select();

            console.log("Supabase response - data:", data);
            console.log("Supabase response - error:", error);

            if (error) {
                console.error("❌ Supabase error details:", {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw error;
            }

            console.log("✅ Successfully inserted testimonial:", data);

            toast.success("Thank you for your feedback!", {
                description: "Your testimonial has been submitted successfully.",
            });

            // Reset form and close modal
            setFullname("");
            setRating(5);
            setText("");
            onOpenChange(false);
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            toast.error("Failed to submit testimonial", {
                description: "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Share Your Experience</DialogTitle>
                    <DialogDescription>
                        We'd love to hear about your experience with our figurines!
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Your Name *</Label>
                        <Input
                            id="fullname"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                    </div>

                    {/* Rating Input */}
                    <div className="space-y-2">
                        <Label>Rating *</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground self-center">
                                {rating} {rating === 1 ? "star" : "stars"}
                            </span>
                        </div>
                    </div>

                    {/* Feedback Text */}
                    <div className="space-y-2">
                        <Label htmlFor="text">Your Feedback *</Label>
                        <Textarea
                            id="text"
                            placeholder="Tell us about your experience..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            rows={5}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Share what you loved about our figurines or service
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TestimonialModal;
