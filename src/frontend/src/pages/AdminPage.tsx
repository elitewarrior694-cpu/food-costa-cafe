import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Coffee,
  FileImage,
  Image,
  Info,
  LayoutDashboard,
  LogOut,
  Plus,
  Star,
  Trash2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { MenuCategory } from "../backend";
import {
  sampleGalleryImages,
  sampleMenuItems,
  sampleReviews,
} from "../data/sampleData";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AdminPageProps {
  navigate: (p: Page) => void;
}

type AdminTab = "dashboard" | "menu" | "reviews" | "gallery" | "cafeinfo";

const categoryLabels: Record<MenuCategory, string> = {
  [MenuCategory.pizza]: "Pizza",
  [MenuCategory.burger]: "Burger",
  [MenuCategory.sandwich]: "Sandwich",
  [MenuCategory.shakes]: "Shakes",
  [MenuCategory.thali]: "Thali",
  [MenuCategory.snacks]: "Snacks",
  [MenuCategory.beverages]: "Beverages",
};

export default function AdminPage({ navigate }: AdminPageProps) {
  const { actor } = useActor();
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Data
  const [analytics, setAnalytics] = useState({
    totalMenuItems: 0,
    totalReviews: 0,
    totalGalleryImages: 0,
    pageViews: [] as [string, number][],
  });
  const [menuItems, setMenuItems] = useState(sampleMenuItems);
  const [reviews, setReviews] = useState(sampleReviews);
  const [galleryImages, setGalleryImages] = useState(sampleGalleryImages);
  const [cafeInfo, setCafeInfo] = useState({
    isOpen: true,
    openingHours: "Mon-Fri: 9AM-11PM | Sat-Sun: 8AM-12AM",
    contactInfo: "+91 98765 43210",
  });

  // Modals
  const [menuModal, setMenuModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: MenuCategory.snacks,
    isRecommended: false,
  });

  // Check admin
  useEffect(() => {
    if (!actor || !identity) return;
    setCheckingAdmin(true);
    actor
      .isCallerAdmin()
      .then((result) => {
        setIsAdmin(result);
        if (result) loadData();
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAdmin(false));
  }, [actor, identity]);

  const loadData = async () => {
    if (!actor) return;
    try {
      const [ana, items, revs, imgs, info] = await Promise.all([
        actor.getAnalytics(),
        actor.getAllMenuItems(),
        actor.getApprovedReviews(),
        actor.getAllGalleryImages(),
        actor.getCafeInfo(),
      ]);
      setAnalytics({
        totalMenuItems: Number(ana.totalMenuItems),
        totalReviews: Number(ana.totalReviews),
        totalGalleryImages: Number(ana.totalGalleryImages),
        pageViews: ana.pageViews.map(([k, v]) => [k, Number(v)]),
      });
      if (items.length > 0)
        setMenuItems(
          items.map((it, i) => ({
            id: i + 1,
            name: it.name,
            description: it.description,
            price: Number(it.price),
            category: it.category,
            imageUrl: it.image.getDirectURL(),
            isRecommended: it.isRecommended,
            isAvailable: it.isAvailable,
          })),
        );
      if (revs.length > 0)
        setReviews(
          revs.map((r) => ({
            id: Number(r.id),
            name: r.name,
            rating: Number(r.rating),
            comment: r.comment,
            timestamp: Number(r.timestamp),
            approved: r.approved,
          })),
        );
      if (imgs.length > 0)
        setGalleryImages(
          imgs.map((img) => ({
            id: Number(img.id),
            caption: img.caption,
            category: img.category,
            imageUrl: img.image.getDirectURL(),
          })),
        );
      if (info)
        setCafeInfo({
          isOpen: info.isOpen,
          openingHours: info.openingHours,
          contactInfo: info.contactInfo,
        });
    } catch {
      // keep sample data
    }
  };

  const handleApproveReview = async (id: number) => {
    try {
      if (actor) await actor.approveReview(BigInt(id));
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: true } : r)),
      );
      toast.success("Review approved");
    } catch {
      toast.error("Failed to approve review");
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      if (actor) await actor.deleteReview(BigInt(id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    try {
      if (actor) await actor.deleteMenuItem(BigInt(id));
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("Menu item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleSaveCafeInfo = async () => {
    try {
      if (actor) await actor.updateCafeInfo(cafeInfo);
      toast.success("Café info updated");
    } catch {
      toast.error("Failed to update info");
    }
  };

  const navItems: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    tab: AdminTab;
  }[] = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
    { icon: UtensilsCrossed, label: "Menu", tab: "menu" },
    { icon: Star, label: "Reviews", tab: "reviews" },
    { icon: Image, label: "Gallery", tab: "gallery" },
    { icon: Info, label: "Café Info", tab: "cafeinfo" },
  ];

  // Login screen
  if (isInitializing || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 gradient-gold rounded-full animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-8 h-8 text-[oklch(0.11_0.018_48)]" />
          </div>
          <h1 className="font-poppins font-black text-2xl mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in with Internet Identity to access the dashboard
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold border-0 hover:opacity-90 w-full"
          >
            {isLoggingIn ? "Connecting..." : "Sign In"}
          </Button>
          <button
            type="button"
            onClick={() => navigate("home")}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to Website
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-10 max-w-sm w-full text-center">
          <h2 className="font-poppins font-bold text-xl mb-4">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your account does not have admin privileges.
          </p>
          <Button
            onClick={() => {
              clear();
              navigate("home");
            }}
            variant="outline"
            className="border-border"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 min-h-screen"
        style={{
          background: "oklch(0.12 0.018 48)",
          borderRight: "1px solid oklch(0.72 0.12 78 / 15%)",
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "oklch(0.72 0.12 78 / 15%)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center">
              <Coffee className="w-4 h-4 text-[oklch(0.11_0.018_48)]" />
            </div>
            <div>
              <p className="font-poppins font-bold text-sm gold-text">
                Food Costa
              </p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? "gradient-gold text-[oklch(0.11_0.018_48)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              {activeTab === item.tab && (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-64 px-4">
          <button
            type="button"
            onClick={() => {
              navigate("home");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            &larr; Back to Site
          </button>
          <button
            type="button"
            onClick={() => {
              clear();
              navigate("home");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="font-poppins font-bold text-2xl mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                {
                  icon: UtensilsCrossed,
                  label: "Menu Items",
                  value: analytics.totalMenuItems || menuItems.length,
                  color: "oklch(0.72 0.12 78)",
                },
                {
                  icon: Star,
                  label: "Reviews",
                  value: analytics.totalReviews || reviews.length,
                  color: "oklch(0.60 0.18 145)",
                },
                {
                  icon: FileImage,
                  label: "Gallery Images",
                  value: analytics.totalGalleryImages || galleryImages.length,
                  color: "oklch(0.55 0.18 250)",
                },
                {
                  icon: Users,
                  label: "Page Views",
                  value:
                    analytics.pageViews.reduce((s, [, v]) => s + v, 0) || "—",
                  color: "oklch(0.65 0.18 30)",
                },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${stat.color}25` }}
                    >
                      <stat.icon
                        className="w-5 h-5"
                        style={{ color: stat.color }}
                      />
                    </div>
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="font-poppins font-black text-3xl mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Page Views Chart */}
            {analytics.pageViews.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-poppins font-semibold text-lg mb-6">
                  Page Views
                </h3>
                <div className="flex gap-4 h-32 items-end">
                  {analytics.pageViews.map(([page, views]) => (
                    <div
                      key={page}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <span className="text-xs text-muted-foreground">
                        {views}
                      </span>
                      <div
                        className="w-full gradient-gold rounded-t-lg"
                        style={{
                          height: `${Math.max(8, (views / Math.max(...analytics.pageViews.map(([, v]) => v))) * 100)}%`,
                        }}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {page}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu */}
        {activeTab === "menu" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-poppins font-bold text-2xl">Menu Items</h2>
              <Button
                onClick={() => setMenuModal(true)}
                className="gradient-gold text-[oklch(0.11_0.018_48)] font-semibold border-0"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-border/30 hover:bg-secondary/30"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p>{item.name}</p>
                          {item.isRecommended && (
                            <Badge className="text-xs mt-0.5 bg-primary/20 text-primary border-0">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground text-sm">
                        {item.category}
                      </TableCell>
                      <TableCell className="gold-text font-semibold">
                        &#8377;{item.price}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.isAvailable
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div>
            <h2 className="font-poppins font-bold text-2xl mb-8">
              Reviews Management
            </h2>
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="glass rounded-2xl p-6 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-xs font-bold text-[oklch(0.11_0.018_48)]">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= review.rating ? "fill-primary text-primary" : "text-muted"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <Badge
                        className={`ml-auto text-xs ${review.approved ? "bg-green-500/20 text-green-400 border-0" : "bg-yellow-500/20 text-yellow-400 border-0"}`}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!review.approved && (
                      <Button
                        size="sm"
                        onClick={() => handleApproveReview(review.id)}
                        className="gradient-gold text-[oklch(0.11_0.018_48)] font-semibold border-0 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {activeTab === "gallery" && (
          <div>
            <h2 className="font-poppins font-bold text-2xl mb-8">
              Gallery Management
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="glass rounded-xl overflow-hidden group relative"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setGalleryImages((prev) =>
                          prev.filter((g) => g.id !== img.id),
                        )
                      }
                      className="text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground truncate">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Café Info */}
        {activeTab === "cafeinfo" && (
          <div className="max-w-lg">
            <h2 className="font-poppins font-bold text-2xl mb-8">Café Info</h2>
            <div className="glass rounded-2xl p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Currently Open</Label>
                <Switch
                  checked={cafeInfo.isOpen}
                  onCheckedChange={(v) =>
                    setCafeInfo((p) => ({ ...p, isOpen: v }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Opening Hours
                </Label>
                <Input
                  value={cafeInfo.openingHours}
                  onChange={(e) =>
                    setCafeInfo((p) => ({ ...p, openingHours: e.target.value }))
                  }
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Contact Info
                </Label>
                <Input
                  value={cafeInfo.contactInfo}
                  onChange={(e) =>
                    setCafeInfo((p) => ({ ...p, contactInfo: e.target.value }))
                  }
                  className="bg-secondary border-border focus:border-primary"
                />
              </div>
              <Button
                onClick={handleSaveCafeInfo}
                className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold border-0 hover:opacity-90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Add Menu Item Modal */}
      <Dialog open={menuModal} onOpenChange={setMenuModal}>
        <DialogContent className="glass border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-poppins">Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label className="text-sm mb-1.5 block">Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-secondary border-border"
                placeholder="e.g. Veg Pizza"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Description</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-secondary border-border resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1.5 block">Price (&#8377;)</Label>
                <Input
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, price: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  type="number"
                  placeholder="99"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(v) =>
                    setNewItem((p) => ({ ...p, category: v as MenuCategory }))
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(categoryLabels).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={newItem.isRecommended}
                onCheckedChange={(v) =>
                  setNewItem((p) => ({ ...p, isRecommended: v }))
                }
              />
              <Label className="text-sm">Mark as Recommended</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMenuModal(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!newItem.name || !newItem.price) {
                  toast.error("Name and price required");
                  return;
                }
                const item = {
                  id: menuItems.length + 1,
                  name: newItem.name,
                  description: newItem.description,
                  price: Number(newItem.price),
                  category: newItem.category,
                  imageUrl: `https://picsum.photos/seed/${newItem.name.replace(/\s/g, "")}/400/300`,
                  isRecommended: newItem.isRecommended,
                  isAvailable: true,
                };
                setMenuItems((prev) => [item, ...prev]);
                setMenuModal(false);
                setNewItem({
                  name: "",
                  description: "",
                  price: "",
                  category: MenuCategory.snacks,
                  isRecommended: false,
                });
                toast.success("Menu item added");
              }}
              className="gradient-gold text-[oklch(0.11_0.018_48)] font-bold border-0"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
