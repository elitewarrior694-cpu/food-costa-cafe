import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { sampleGalleryImages } from "../data/sampleData";
import { useActor } from "../hooks/useActor";

interface GalleryItem {
  id: number;
  caption: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const { actor } = useActor();
  const [images, setImages] = useState<GalleryItem[]>(sampleGalleryImages);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (actor) {
      actor.incrementPageView("gallery").catch(() => {});
      actor
        .getAllGalleryImages()
        .then((imgs) => {
          if (imgs.length > 0) {
            setImages(
              imgs.map((img) => ({
                id: Number(img.id),
                caption: img.caption,
                imageUrl: img.image.getDirectURL(),
              })),
            );
          }
        })
        .catch(() => {});
    }
  }, [actor]);

  const closeLightbox = () => setLightbox(null);
  const prev = () =>
    setLightbox((i) =>
      i !== null ? (i - 1 + images.length) % images.length : null,
    );
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % images.length : null));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
          Visual Stories
        </p>
        <h1 className="font-poppins font-black text-4xl md:text-5xl mb-4">
          Gallery
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A glimpse into our world &mdash; food, ambience, and happy moments.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.95)",
                transition: `all 0.5s ease ${(i % 8) * 0.06}s`,
              }}
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
            >
              <img
                src={img.imageUrl}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.015_45)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                <ZoomIn className="w-8 h-8 text-white" />
                <p className="text-white text-xs font-medium text-center px-4">
                  {img.caption}
                </p>
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/60 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.06_0.01_45)]/95 backdrop-blur-xl"
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="absolute left-4 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full px-16"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].imageUrl}
              alt={images[lightbox].caption}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-gold-lg"
            />
            <p className="text-center mt-4 text-sm text-muted-foreground">
              {images[lightbox].caption}
            </p>
            <p className="text-center text-xs text-muted-foreground/60 mt-1">
              {lightbox + 1} / {images.length}
            </p>
          </div>

          <button
            type="button"
            className="absolute right-4 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
