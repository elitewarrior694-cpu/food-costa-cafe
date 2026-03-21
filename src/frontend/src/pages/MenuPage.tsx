import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { MenuCategory } from "../backend";
import { type SampleMenuItem, sampleMenuItems } from "../data/sampleData";
import { useActor } from "../hooks/useActor";

const categories: { label: string; value: MenuCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pizza", value: MenuCategory.pizza },
  { label: "Burger", value: MenuCategory.burger },
  { label: "Sandwich", value: MenuCategory.sandwich },
  { label: "Shakes", value: MenuCategory.shakes },
  { label: "Thali", value: MenuCategory.thali },
  { label: "Snacks", value: MenuCategory.snacks },
  { label: "Beverages", value: MenuCategory.beverages },
];

export default function MenuPage() {
  const { actor } = useActor();
  const [items, setItems] = useState<SampleMenuItem[]>(sampleMenuItems);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (actor) {
      actor.incrementPageView("menu").catch(() => {});
      actor
        .getAllMenuItems()
        .then((backendItems) => {
          if (backendItems.length > 0) {
            setItems(
              backendItems.map((item, idx) => ({
                id: idx + 1,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                imageUrl: item.image.getDirectURL(),
                isRecommended: item.isRecommended,
                isAvailable: item.isAvailable,
              })),
            );
          }
        })
        .catch(() => {});
    }
  }, [actor]);

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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
          Our Offerings
        </p>
        <h1 className="font-poppins font-black text-4xl md:text-5xl mb-4">
          Our Menu
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Premium flavours starting at &#8377;1. Fresh ingredients, made with
          love, every single day.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="pl-10 bg-secondary border-border focus:border-primary"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat.value
                  ? "gradient-gold text-[oklch(0.11_0.018_48)] border-transparent shadow-gold"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground glass"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="glass rounded-2xl overflow-hidden card-hover group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s ease ${(i % 8) * 0.06}s`,
                }}
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.018_48)]/80 to-transparent" />
                  {item.isRecommended && (
                    <span className="absolute top-2 right-2 gradient-gold text-[oklch(0.11_0.018_48)] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Recommended
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-poppins font-semibold text-sm leading-tight">
                      {item.name}
                    </h3>
                    <span className="gold-text font-bold text-sm whitespace-nowrap">
                      &#8377;{item.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs capitalize bg-muted/60 gold-text border-0"
                  >
                    {item.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
