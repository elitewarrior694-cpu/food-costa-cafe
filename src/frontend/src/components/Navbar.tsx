import { Button } from "@/components/ui/button";
import { Coffee, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Page } from "../App";

interface NavbarProps {
  currentPage: Page;
  navigate: (p: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Menu", page: "menu" },
  { label: "Reviews", page: "reviews" },
  { label: "Gallery", page: "gallery" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ currentPage, navigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-heavy shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center">
            <Coffee className="w-4 h-4 text-[oklch(0.11_0.018_48)]" />
          </div>
          <span className="font-poppins font-bold text-lg gold-text tracking-wide">
            Food Costa
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              type="button"
              key={l.page}
              onClick={() => navigate(l.page)}
              className={`text-sm font-medium transition-all duration-200 relative pb-1 ${
                currentPage === l.page
                  ? "gold-text"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
              {currentPage === l.page && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Admin CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate("admin")}
            className="gradient-gold text-[oklch(0.11_0.018_48)] font-semibold hover:opacity-90 border-0"
          >
            Admin
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-foreground p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-heavy border-t border-border px-4 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <button
              type="button"
              key={l.page}
              onClick={() => {
                navigate(l.page);
                setMobileOpen(false);
              }}
              className={`text-left py-2 font-medium transition-colors ${
                currentPage === l.page ? "gold-text" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
          <Button
            onClick={() => {
              navigate("admin");
              setMobileOpen(false);
            }}
            className="gradient-gold text-[oklch(0.11_0.018_48)] font-semibold border-0 w-full"
          >
            Admin Panel
          </Button>
        </div>
      )}
    </nav>
  );
}
