import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, StarHalf } from "lucide-react";
import type { Database } from "@/types/database";


// StarRating component: shows stars rounded to nearest half
export function StarRating({ rating }: { rating: number }) {
    const rounded = Math.round(rating * 2) / 2;
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => {
                if (rounded >= n) {
                    return <Star key={n} className="h-4 w-4 text-yellow-400 fill-yellow-400" fill="#facc15" />;
                } else if (rounded + 0.5 === n) {
                    return <StarHalf key={n} className="h-4 w-4 text-yellow-400 fill-yellow-400" fill="#facc15" />;
                } else {
                    return <Star key={n} className="h-4 w-4 text-gray-300" fill="none" />;
                }
            })}
        </div>
    );
}

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export function TestimonialCarousel({ visibleCount = 5, className = "" }: { visibleCount?: number; className?: string }) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [start, setStart] = useState(0);

    useEffect(() => {
        supabase
            .from("testimonials")
            .select("*")
            .then(({ data }) => {
                if (data) {
                    // Shuffle for random order
                    setTestimonials(shuffleArray(data));
                }
            });
    }, []);

    // Shuffle helper
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    const total = testimonials.length;
    const visible = testimonials.slice(start, start + visibleCount);

    return (
        <div className={"relative " + className}>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {visible.map((review) => (
                    <div key={review.id} className="bg-muted/50 rounded p-4 border border-muted-200">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-base">{review.fullname}</span>
                            {typeof review.rating === 'number' && (
                                <>
                                    <StarRating rating={review.rating} />
                                    <span className="ml-1 text-xs text-yellow-700 font-semibold align-middle">{parseFloat(review.rating.toFixed(2)).toString()}/5</span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                    </div>
                ))}
            </div>
            {total > visibleCount && (
                <div className="flex justify-center gap-2 mt-2">
                    <button
                        className="rounded-full w-6 h-6 flex items-center justify-center bg-muted text-primary"
                        onClick={() => setStart((start - visibleCount + total) % total)}
                        aria-label="Previous reviews"
                    >
                        &#8592;
                    </button>
                    <button
                        className="rounded-full w-6 h-6 flex items-center justify-center bg-muted text-primary"
                        onClick={() => setStart((start + visibleCount) % total)}
                        aria-label="Next reviews"
                    >
                        &#8594;
                    </button>
                </div>
            )}
        </div>
    );
}
