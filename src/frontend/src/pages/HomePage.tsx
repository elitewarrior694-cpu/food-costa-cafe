import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Leaf,
  Star,
  Utensils,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import { sampleMenuItems, sampleReviews } from "../data/sampleData";

interface HomePageProps {
  navigate: (p: Page) => void;
}

const peakData = [
  { day: "Mon", pct: 60 },
  { day: "Tue", pct: 55 },
  { day: "Wed", pct: 70 },
  { day: "Thu", pct: 65 },
  { day: "Fri", pct: 85 },
  { day: "Sat", pct: 100 },
  { day: "Sun", pct: 95 },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function HomePage({ navigate }: HomePageProps) {
  const [reviewIdx, setReviewIdx] = useState(0);
  const featured = sampleMenuItems.filter((m) => m.isRecommended);

  // Auto-scroll testimonials
  useEffect(() => {
    const t = setInterval(
      () => setReviewIdx((i) => (i + 1) % sampleReviews.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const whyUs = useInView();
  const peakSection = useInView();
  const ratingsSection = useInView();

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.08 0.015 45) 0%, oklch(0.14 0.025 55) 100%)",
        }}
      >
        {/* Floating particles */}
        {Array.from({ length: 8 }, (_, i) => i).map((i) => (
          <div
            key={`p${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              background: "oklch(0.72 0.12 78)",
              top: `${10 + i * 11}%`,
              left: `${5 + i * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Background image overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/coffeehero/1600/900')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div className="absolute inset-0 gradient-hero" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ color: "oklch(0.72 0.12 78)" }}
          >
            <Star className="w-4 h-4 fill-current" />
            <span>4.9 Rating &bull; 500+ Happy Customers</span>
          </div>

          <h1 className="font-poppins font-black text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-fade-in">
            Delicious Food,
            <br />
            <span className="gold-text">Pocket-Friendly</span>
            <br />
            Prices
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Premium taste, budget-friendly prices &mdash; starting at just{" "}
            <span className="gold-text font-semibold">&#8377;1</span>. Located
            at Ashok Nagar, Gorakhpur.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("menu")}
              className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold text-base px-8 border-0 hover:opacity-90 hover:scale-105 transition-all"
            >
              Explore Menu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-primary/40 text-foreground hover:bg-primary/10 hover:border-primary/70 text-base px-8 hover:scale-105 transition-all"
            >
              Visit Us
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <span className="text-xs text-muted-foreground">
            Scroll to explore
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
        </div>
      </section>

      {/* ===== FEATURED DISHES ===== */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium gold-text uppercase tracking-widest mb-2">
              Must Try
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl">
              Featured Dishes
            </h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex gap-6 transition-transform duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                  {featured.map((item) => (
                    <div
                      key={item.id}
                      className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
                      onClick={() => navigate("menu")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") navigate("menu");
                      }}
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.018_48)] to-transparent" />
                        <span className="absolute top-3 right-3 gradient-gold text-[oklch(0.11_0.018_48)] text-xs font-bold px-2 py-1 rounded-full">
                          &#9733; Recommended
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-poppins font-semibold">
                            {item.name}
                          </h3>
                          <span className="gold-text font-bold">
                            &#8377;{item.price}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <span className="inline-block mt-2 text-xs glass px-2 py-0.5 rounded-full capitalize gold-text">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("menu")}
              className="border-primary/40 hover:border-primary hover:bg-primary/10 gold-text"
            >
              View Full Menu <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section
        ref={whyUs.ref}
        className="section-padding"
        style={{ background: "oklch(0.13 0.02 48)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium gold-text uppercase tracking-widest mb-2">
              Our Promise
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Budget Friendly",
                desc: "Enjoy premium quality food starting at just ₹1. We believe good food should be for everyone.",
                badge: "₹1–200",
              },
              {
                icon: Clock,
                title: "Fast Service",
                desc: "Your order ready in minutes. We respect your time as much as we care about your food.",
                badge: "< 15 min",
              },
              {
                icon: Utensils,
                title: "Cozy Ambience",
                desc: "A warm, welcoming space perfect for family meals, friend meetups, or a quiet solo bite.",
                badge: "Ashok Nagar",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="glass rounded-2xl p-8 text-center card-hover"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  opacity: whyUs.inView ? 1 : 0,
                  transform: whyUs.inView
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: `all 0.6s ease ${i * 0.15}s`,
                }}
              >
                <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-[oklch(0.11_0.018_48)]" />
                </div>
                <span className="text-xs font-bold gold-text uppercase tracking-widest">
                  {item.badge}
                </span>
                <h3 className="font-poppins font-semibold text-xl mt-1 mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RATINGS ===== */}
      <section
        ref={ratingsSection.ref}
        className="section-padding text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.11 0.018 48) 0%, oklch(0.16 0.025 52) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            style={{
              opacity: ratingsSection.inView ? 1 : 0,
              transform: ratingsSection.inView ? "scale(1)" : "scale(0.9)",
              transition: "all 0.7s ease",
            }}
          >
            <div className="flex justify-center gap-1 mb-4">
              {([1, 2, 3, 4, 5] as const).map((s) => (
                <Star key={s} className="w-8 h-8 fill-primary text-primary" />
              ))}
            </div>
            <div className="font-poppins font-black text-7xl md:text-8xl gold-text mb-2">
              4.9
            </div>
            <p className="text-xl text-muted-foreground mb-2">Average Rating</p>
            <p className="text-sm text-muted-foreground">
              Based on{" "}
              <span className="gold-text font-semibold">
                500+ customer reviews
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        className="section-padding"
        style={{ background: "oklch(0.13 0.02 48)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium gold-text uppercase tracking-widest mb-2">
              What Customers Say
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl">
              Testimonials
            </h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="glass rounded-2xl p-8 md:p-12 text-center card-hover transition-all duration-500">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from(
                  { length: sampleReviews[reviewIdx].rating },
                  (_, i) => i + 1,
                ).map((s) => (
                  <Star key={s} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-foreground italic leading-relaxed mb-6">
                &ldquo;{sampleReviews[reviewIdx].comment}&rdquo;
              </p>
              <p className="font-poppins font-semibold gold-text">
                &mdash; {sampleReviews[reviewIdx].name}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() =>
                  setReviewIdx(
                    (i) =>
                      (i - 1 + sampleReviews.length) % sampleReviews.length,
                  )
                }
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2 items-center">
                {sampleReviews.map((rev, i) => (
                  <button
                    type="button"
                    key={rev.id}
                    onClick={() => setReviewIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === reviewIdx ? "w-6 gradient-gold" : "bg-muted"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setReviewIdx((i) => (i + 1) % sampleReviews.length)
                }
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PEAK HOURS ===== */}
      <section ref={peakSection.ref} className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium gold-text uppercase tracking-widest mb-2">
              Plan Your Visit
            </p>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl">
              Popular Times
            </h2>
          </div>

          <div className="glass rounded-2xl p-6 md:p-10">
            <div className="flex items-end justify-between gap-3 h-40">
              {peakData.map((d, i) => (
                <div
                  key={d.day}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <div
                    className="w-full flex items-end justify-center"
                    style={{ height: "120px" }}
                  >
                    <div
                      className="w-full rounded-t-lg gradient-gold opacity-80 transition-all duration-700"
                      style={{
                        height: peakSection.inView ? `${d.pct}%` : "0%",
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Weekends are our busiest &mdash; arrive early for the best
              experience!
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section
        className="section-padding"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.03 55) 0%, oklch(0.12 0.02 48) 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl mb-4">
            Ready to <span className="gold-text">Taste</span> the Difference?
          </h2>
          <p className="text-muted-foreground mb-8">
            Visit us at Ashok Nagar, Gorakhpur or browse our menu online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("menu")}
              className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold border-0 hover:opacity-90"
            >
              View Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-primary/40 hover:border-primary hover:bg-primary/10 gold-text"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
