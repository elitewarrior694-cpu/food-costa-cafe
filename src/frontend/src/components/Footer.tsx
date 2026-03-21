import { Coffee, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Page } from "../App";

interface FooterProps {
  navigate: (p: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="border-t border-border bg-[oklch(0.10_0.016_48)] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center">
              <Coffee className="w-4 h-4 text-[oklch(0.11_0.018_48)]" />
            </div>
            <span className="font-poppins font-bold text-lg gold-text">
              Food Costa
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Premium taste, budget-friendly prices. Serving happiness at Ashok
            Nagar, Gorakhpur.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-poppins font-semibold mb-4 gold-text">
            Quick Links
          </h4>
          <div className="flex flex-col gap-2">
            {(["menu", "reviews", "gallery", "contact"] as Page[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => navigate(p)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left capitalize"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-poppins font-semibold mb-4 gold-text">
            Contact Us
          </h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 gold-text shrink-0" />
              <span>Ashok Nagar, Gorakhpur, UP 273001</span>
            </div>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4 gold-text" />
              <span>+91 98765 43210</span>
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-4 h-4 gold-text" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Food Costa Cafe and Restaurant. All
        rights reserved.
      </div>
    </footer>
  );
}
