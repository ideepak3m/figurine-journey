import { Star } from "lucide-react";

interface Review {
    id: string;
    name: string;
    rating: number; // 1-5
    text: string;
}

export const reviews: Review[] = [
    {
        id: "1",
        name: "Aarti S.",
        rating: 5,
        text: "Absolutely beautiful work! The figurine was even better than I imagined. Thank you for making my gift so special!",
    },
    {
        id: "2",
        name: "Priya M.",
        rating: 5,
        text: "Incredible attention to detail. The custom order process was easy and the result was perfect!",
    },
    {
        id: "3",
        name: "Rohit K.",
        rating: 4,
        text: "Very happy with my purchase. The figurine is unique and arrived safely. Will order again!",
    },
];

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

export function ReviewList({ className = "" }: { className?: string }) {
    return (
        <div className={"space-y-4 " + className}>
            {reviews.map((review) => (
                <div key={review.id} className="bg-muted/50 rounded p-4 border border-muted-200">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base">{review.name}</span>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
            ))}
        </div>
    );
}
