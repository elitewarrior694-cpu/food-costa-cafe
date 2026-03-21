import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Star, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { sampleReviews } from "../data/sampleData";
import { useActor } from "../hooks/useActor";

interface DisplayReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export default function ReviewsPage() {
  const { actor } = useActor();
  const [reviews, setReviews] = useState<DisplayReview[]>(sampleReviews);
  const [sortBy, setSortBy] = useState<"latest" | "top">("latest");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (actor) {
      actor.incrementPageView("reviews").catch(() => {});
      actor
        .getApprovedReviews()
        .then((r) => {
          if (r.length > 0) {
            setReviews(
              r.map((rev) => ({
                id: Number(rev.id),
                name: rev.name,
                rating: Number(rev.rating),
                comment: rev.comment,
                timestamp: Number(rev.timestamp),
              })),
            );
          }
        })
        .catch(() => {});
    }
  }, [actor]);

  const sorted = [...reviews].sort((a, b) =>
    sortBy === "latest" ? b.timestamp - a.timestamp : b.rating - a.rating,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      if (actor) {
        await actor.submitReview({
          id: BigInt(0),
          name: name.trim(),
          comment: comment.trim(),
          rating: BigInt(rating),
          timestamp: BigInt(Date.now()),
          approved: false,
        });
      }
      toast.success("Review submitted! It will appear after approval.");
      setName("");
      setComment("");
      setRating(0);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.10 0.016 48) 0%, oklch(0.15 0.025 52) 100%)",
        }}
      >
        <p className="text-sm font-medium gold-text uppercase tracking-widest mb-2">
          Customer Feedback
        </p>
        <h1 className="font-poppins font-black text-4xl md:text-5xl mb-4">
          Reviews
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Share your experience and read what others say about Food Costa.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-5 gap-10">
        {/* Submit Form */}
        <div className="md:col-span-2">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="font-poppins font-bold text-xl mb-1">
              Write a Review
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Your honest feedback matters to us
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="review-name"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Your Name
                </label>
                <Input
                  id="review-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Comment
                </label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="bg-secondary border-border focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold border-0 hover:opacity-90"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-poppins font-bold text-xl">
              {reviews.length} Reviews
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSortBy("latest")}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all border ${
                  sortBy === "latest"
                    ? "gradient-gold text-[oklch(0.11_0.018_48)] border-transparent"
                    : "glass border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Latest
              </button>
              <button
                type="button"
                onClick={() => setSortBy("top")}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all border ${
                  sortBy === "top"
                    ? "gradient-gold text-[oklch(0.11_0.018_48)] border-transparent"
                    : "glass border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Top Rated
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {sorted.map((review, i) => (
              <div
                key={review.id}
                className="glass rounded-2xl p-6 card-hover"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center font-bold text-sm text-[oklch(0.11_0.018_48)]">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold font-poppins">
                        {review.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.timestamp).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
