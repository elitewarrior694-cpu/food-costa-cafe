import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ReviewsPage from "./pages/ReviewsPage";

export type Page =
  | "home"
  | "menu"
  | "reviews"
  | "gallery"
  | "contact"
  | "admin";

function getInitialPage(): Page {
  const hash = window.location.hash.replace("#", "");
  const valid: Page[] = [
    "home",
    "menu",
    "reviews",
    "gallery",
    "contact",
    "admin",
  ];
  return valid.includes(hash as Page) ? (hash as Page) : "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const valid: Page[] = [
        "home",
        "menu",
        "reviews",
        "gallery",
        "contact",
        "admin",
      ];
      setPage(valid.includes(hash as Page) ? (hash as Page) : "home");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (p: Page) => {
    window.location.hash = p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = page === "admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      {!isAdmin && <Navbar currentPage={page} navigate={navigate} />}
      <main>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "menu" && <MenuPage />}
        {page === "reviews" && <ReviewsPage />}
        {page === "gallery" && <GalleryPage />}
        {page === "contact" && <ContactPage />}
        {page === "admin" && <AdminPage navigate={navigate} />}
      </main>
      {!isAdmin && <Footer navigate={navigate} />}
    </div>
  );
}
