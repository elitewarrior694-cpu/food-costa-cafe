import { Button } from "@/components/ui/button";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { useEffect } from "react";
import { useActor } from "../hooks/useActor";

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 11:00 PM" },
  { day: "Saturday", time: "8:00 AM – 12:00 AM" },
  { day: "Sunday", time: "8:00 AM – 12:00 AM" },
];

export default function ContactPage() {
  const { actor } = useActor();

  useEffect(() => {
    if (actor) actor.incrementPageView("contact").catch(() => {});
  }, [actor]);

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
          Find Us
        </p>
        <h1 className="font-poppins font-black text-4xl md:text-5xl mb-4">
          Contact Us
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Come visit us or reach out — we’d love to hear from you!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-2 gap-10">
        {/* Map Placeholder */}
        <div
          className="glass rounded-2xl overflow-hidden"
          style={{ minHeight: "380px" }}
        >
          <div
            className="w-full h-full relative flex flex-col items-center justify-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.14 0.02 49) 0%, oklch(0.18 0.025 55) 100%)",
              minHeight: "380px",
            }}
          >
            {/* Decorative grid lines */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.72 0.12 78 / 6%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.12 78 / 6%) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Pin */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center shadow-gold animate-float">
                <MapPin className="w-8 h-8 text-[oklch(0.11_0.018_48)]" />
              </div>
              <div className="glass-heavy rounded-xl px-6 py-4 text-center">
                <p className="font-poppins font-bold text-lg mb-1">
                  Food Costa Cafe
                </p>
                <p className="text-sm text-muted-foreground">
                  Ashok Nagar, Gorakhpur
                </p>
                <p className="text-sm text-muted-foreground">
                  Uttar Pradesh — 273001
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/Ashok+Nagar+Gorakhpur+Uttar+Pradesh"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="sm"
                  className="gradient-gold text-[oklch(0.11_0.018_48)] font-semibold border-0 hover:opacity-90"
                >
                  <Navigation className="w-4 h-4 mr-1" /> Get Directions
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Contact Buttons */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-poppins font-bold text-xl mb-5">Reach Us</h2>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors group"
              >
                <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[oklch(0.11_0.018_48)]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-muted-foreground text-sm">
                    +91 98765 43210
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.52 0.18 145)" }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">
                    Chat with us instantly
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 gold-text" />
              <h2 className="font-poppins font-bold text-xl">Opening Hours</h2>
            </div>
            <div className="flex flex-col gap-3">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{h.day}</span>
                  <span className="text-sm font-medium gold-text">
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">
                Currently Open
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 gold-text" />
              <h2 className="font-poppins font-bold text-xl">Address</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Food Costa Cafe and Restaurant
              <br />
              Ashok Nagar, Gorakhpur
              <br />
              Uttar Pradesh &mdash; 273001
              <br />
              India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
