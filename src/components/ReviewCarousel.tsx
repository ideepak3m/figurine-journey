import { Star } from "lucide-react";

export interface Review {
    id: string;
    name: string;
    rating: number; // 1-5
    text: string;
}

export function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={
                        "h-4 w-4 " + (n <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")
                    }
                    fill={n <= rating ? "#facc15" : "none"}
                />
            ))}
        </div>
    );
}

// Carousel/scrollable review list
import { useEffect, useState } from "react";

export function ReviewCarousel({
    reviews,
    className = "",
    visibleCount = 3,
}: {
    reviews: Review[];
    className?: string;
    visibleCount?: number;
}) {
    const [start, setStart] = useState(0);
    const total = reviews.length;

    // Auto-scroll every 6s
    useEffect(() => {
        if (total <= visibleCount) return;
        const timer = setInterval(() => {
            setStart((prev) => (prev + visibleCount) % total);
        }, 6000);
        return () => clearInterval(timer);
    }, [total, visibleCount]);

    const visible = [];
    for (let i = 0; i < Math.min(visibleCount, total); i++) {
        visible.push(reviews[(start + i) % total]);
    }

    return (
        <div className={"relative " + className}>
            <div className="space-y-4 max-h-56 overflow-y-auto">
                {visible.map((review) => (
                    <div key={review.id} className="bg-muted/50 rounded p-4 border border-muted-200">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-base">{review.name}</span>
                            <StarRating rating={review.rating} />
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
