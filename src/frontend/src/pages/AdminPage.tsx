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
  Eye,
  EyeOff,
  FileImage,
  Image,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { MenuCategory } from "../backend";
import {
  sampleGalleryImages,
  sampleMenuItems,
  sampleReviews,
} from "../data/sampleData";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
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

  const handleLogin = () => {
    if (!usernameInput || !passwordInput) {
      toast.error("Please enter username and password");
      return;
    }
    setIsAuthLoading(true);
    // Simulate a short delay for UX polish
    setTimeout(() => {
      if (usernameInput === "AKA" && passwordInput === "09122011") {
        setIsLoggedIn(true);
        toast.success("Welcome back, AKA!");
      } else {
        toast.error("Invalid username or password");
      }
      setIsAuthLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsernameInput("");
    setPasswordInput("");
    navigate("home");
  };

  const handleApproveReview = (id: number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r)),
    );
    toast.success("Review approved");
  };

  const handleDeleteReview = (id: number) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review deleted");
  };

  const handleDeleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    toast.success("Menu item deleted");
  };

  const handleSaveCafeInfo = () => {
    toast.success("Café info updated");
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

  // ── Login Screen ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        data-ocid="admin.page"
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 20%, oklch(0.20 0.04 78 / 40%) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 80%, oklch(0.18 0.03 55 / 30%) 0%, transparent 60%), oklch(0.11 0.018 48)",
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 78 / 8%) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 78 / 6%) 0%, transparent 70%)",
            bottom: "15%",
            right: "8%",
          }}
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Card */}
          <div
            className="rounded-3xl p-10"
            style={{
              background: "oklch(0.14 0.022 50 / 80%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid oklch(0.72 0.12 78 / 30%)",
              boxShadow:
                "0 32px 64px oklch(0 0 0 / 50%), 0 0 0 1px oklch(0.72 0.12 78 / 10%), inset 0 1px 0 oklch(0.72 0.12 78 / 20%)",
            }}
          >
            {/* Icon */}
            <div className="flex flex-col items-center mb-10">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                  boxShadow:
                    "0 8px 24px oklch(0.72 0.12 78 / 35%), 0 0 0 1px oklch(0.72 0.12 78 / 40%)",
                }}
              >
                <Coffee className="w-10 h-10 text-[oklch(0.11_0.018_48)]" />
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.55 0.18 145)",
                    boxShadow: "0 2px 8px oklch(0.55 0.18 145 / 50%)",
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h1
                className="font-poppins font-black text-3xl tracking-tight mb-1"
                style={{ color: "oklch(0.94 0.018 75)" }}
              >
                Admin Panel
              </h1>
              <p className="text-sm" style={{ color: "oklch(0.62 0.04 68)" }}>
                Food Costa Cafe & Restaurant
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5">
              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                  style={{ color: "oklch(0.72 0.12 78)" }}
                >
                  Username
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.62 0.04 68)" }}
                  />
                  <Input
                    data-ocid="admin.input"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter username"
                    className="pl-10 h-12 rounded-xl font-medium"
                    style={{
                      background: "oklch(0.18 0.025 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                      color: "oklch(0.94 0.018 75)",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                  style={{ color: "oklch(0.72 0.12 78)" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.62 0.04 68)" }}
                  />
                  <Input
                    data-ocid="admin.input"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter password"
                    className="pl-10 pr-11 h-12 rounded-xl font-medium"
                    style={{
                      background: "oklch(0.18 0.025 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                      color: "oklch(0.94 0.018 75)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                    style={{ color: "oklch(0.62 0.04 68)" }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                data-ocid="admin.submit_button"
                onClick={handleLogin}
                disabled={isAuthLoading}
                className="h-12 rounded-xl font-bold text-base mt-2 transition-all hover:opacity-90 active:scale-[0.98] border-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                  color: "oklch(0.11 0.018 48)",
                  boxShadow: "0 4px 16px oklch(0.72 0.12 78 / 30%)",
                }}
              >
                {isAuthLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Sign In
                  </span>
                )}
              </Button>
            </div>

            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid oklch(0.72 0.12 78 / 12%)" }}
            >
              <button
                type="button"
                onClick={() => navigate("home")}
                className="w-full text-sm transition-colors hover:opacity-80"
                style={{ color: "oklch(0.62 0.04 68)" }}
              >
                ← Back to Website
              </button>
            </div>
          </div>

          {/* Subtle footer note */}
          <p
            className="text-center text-xs mt-4"
            style={{ color: "oklch(0.45 0.03 65)" }}
          >
            Restricted access — authorized personnel only
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex relative"
      data-ocid="admin.panel"
    >
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />
      )}

      {/* Mobile header bar */}
      <div
        className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 md:hidden"
        style={{
          background: "oklch(0.10 0.018 48)",
          borderBottom: "1px solid oklch(0.72 0.12 78 / 30%)",
        }}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-[oklch(0.18_0.022_50)]"
          style={{ color: "oklch(0.72 0.12 78)" }}
          data-ocid="admin.sidebar.toggle"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <span
          className="flex-1 text-center font-poppins font-bold text-sm"
          style={{ color: "oklch(0.72 0.12 78)" }}
        >
          Food Costa Admin
        </span>
        <div className="w-9" />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 min-h-screen flex flex-col shrink-0 transition-transform duration-300 md:relative md:inset-auto md:z-auto md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          background: "oklch(0.10 0.018 48)",
          borderRight: "1px solid oklch(0.72 0.12 78 / 15%)",
        }}
      >
        {/* Brand */}
        <div
          className="p-6"
          style={{ borderBottom: "1px solid oklch(0.72 0.12 78 / 15%)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
              }}
            >
              <Coffee className="w-5 h-5 text-[oklch(0.11_0.018_48)]" />
            </div>
            <div>
              <p
                className="font-poppins font-bold text-sm leading-none mb-0.5"
                style={{ color: "oklch(0.72 0.12 78)" }}
              >
                Food Costa
              </p>
              <p className="text-xs" style={{ color: "oklch(0.50 0.03 65)" }}>
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* Admin Profile Badge */}
        <div
          className="mx-4 mt-5 mb-2 px-4 py-3 rounded-xl"
          style={{
            background: "oklch(0.16 0.022 50 / 60%)",
            border: "1px solid oklch(0.72 0.12 78 / 20%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-poppins font-black text-sm shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                color: "oklch(0.11 0.018 48)",
                boxShadow: "0 2px 8px oklch(0.72 0.12 78 / 30%)",
              }}
            >
              AKA
            </div>
            <div className="min-w-0">
              <p
                className="font-semibold text-sm leading-none mb-0.5"
                style={{ color: "oklch(0.94 0.018 75)" }}
              >
                AKA
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck
                  className="w-3 h-3"
                  style={{ color: "oklch(0.55 0.18 145)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.18 145)" }}
                >
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              data-ocid={`admin.${item.tab}.tab`}
              type="button"
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setSidebarOpen(false);
              }}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab ? "" : "hover:bg-[oklch(0.18_0.022_50)]"
              }`}
              style={
                activeTab === item.tab
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.60 0.10 70))",
                      color: "oklch(0.11 0.018 48)",
                      boxShadow: "0 2px 8px oklch(0.72 0.12 78 / 25%)",
                    }
                  : { color: "oklch(0.62 0.04 68)" }
              }
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

        {/* Bottom actions */}
        <div
          className="p-4"
          style={{ borderTop: "1px solid oklch(0.72 0.12 78 / 12%)" }}
        >
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm w-full rounded-xl transition-colors hover:bg-[oklch(0.18_0.022_50)] mb-1"
            style={{ color: "oklch(0.62 0.04 68)" }}
          >
            ← Back to Site
          </button>
          <button
            data-ocid="admin.logout_button"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm w-full rounded-xl transition-colors hover:bg-[oklch(0.20_0.06_25_/_50%)]"
            style={{ color: "oklch(0.65 0.18 25)" }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-auto p-8 pt-[calc(3.5rem+2rem)] md:pt-8"
        style={{ background: "oklch(0.12 0.018 48)" }}
      >
        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="font-poppins font-bold text-2xl mb-1">
                  Dashboard
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)" }}>
                  Welcome back, AKA. Here's what's happening.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                  {
                    icon: UtensilsCrossed,
                    label: "Menu Items",
                    value: menuItems.length,
                    sub: "Active listings",
                    color: "oklch(0.72 0.12 78)",
                    bgColor: "oklch(0.72 0.12 78 / 12%)",
                  },
                  {
                    icon: Star,
                    label: "Reviews",
                    value: reviews.length,
                    sub: `${reviews.filter((r) => r.approved).length} approved`,
                    color: "oklch(0.60 0.18 145)",
                    bgColor: "oklch(0.60 0.18 145 / 12%)",
                  },
                  {
                    icon: FileImage,
                    label: "Gallery Images",
                    value: galleryImages.length,
                    sub: "Published photos",
                    color: "oklch(0.60 0.15 250)",
                    bgColor: "oklch(0.60 0.15 250 / 12%)",
                  },
                  {
                    icon: Users,
                    label: "Page Views",
                    value: "2.4k",
                    sub: "This month",
                    color: "oklch(0.65 0.18 30)",
                    bgColor: "oklch(0.65 0.18 30 / 12%)",
                  },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    data-ocid="admin.dashboard.card"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-2xl p-6 cursor-default"
                    style={{
                      background: "oklch(0.15 0.022 50 / 70%)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid oklch(0.72 0.12 78 / 15%)",
                      boxShadow: "0 4px 16px oklch(0 0 0 / 20%)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: stat.bgColor }}
                      >
                        <stat.icon
                          className="w-5 h-5"
                          style={{ color: stat.color }}
                        />
                      </div>
                      <BarChart3
                        className="w-4 h-4"
                        style={{ color: "oklch(0.40 0.02 65)" }}
                      />
                    </div>
                    <p
                      className="font-poppins font-black text-3xl mb-1"
                      style={{ color: "oklch(0.94 0.018 75)" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="font-semibold text-sm mb-0.5"
                      style={{ color: "oklch(0.80 0.02 70)" }}
                    >
                      {stat.label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: stat.color, opacity: 0.8 }}
                    >
                      {stat.sub}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Page views bar chart */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "oklch(0.15 0.022 50 / 70%)",
                  border: "1px solid oklch(0.72 0.12 78 / 15%)",
                }}
              >
                <h3 className="font-poppins font-semibold text-lg mb-6">
                  Visitor Activity
                </h3>
                <div className="flex gap-3 h-36 items-end">
                  {[
                    ["Home", 85],
                    ["Menu", 72],
                    ["Gallery", 48],
                    ["Reviews", 61],
                    ["Contact", 34],
                  ].map(([page, views]) => (
                    <div
                      key={page}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.72 0.12 78)" }}
                      >
                        {views}
                      </span>
                      <motion.div
                        className="w-full rounded-t-lg"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${Math.max(8, ((views as number) / 85) * 100)}%`,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                        style={{
                          background:
                            "linear-gradient(180deg, oklch(0.72 0.12 78), oklch(0.55 0.09 70))",
                          boxShadow: "0 0 8px oklch(0.72 0.12 78 / 25%)",
                        }}
                      />
                      <span
                        className="text-xs capitalize"
                        style={{ color: "oklch(0.55 0.03 65)" }}
                      >
                        {page}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Menu */}
          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-poppins font-bold text-2xl mb-1">
                    Menu Items
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.55 0.03 65)" }}
                  >
                    {menuItems.length} items total
                  </p>
                </div>
                <Button
                  data-ocid="admin.menu.primary_button"
                  onClick={() => setMenuModal(true)}
                  className="border-0 font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                    color: "oklch(0.11 0.018 48)",
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "oklch(0.15 0.022 50 / 70%)",
                  border: "1px solid oklch(0.72 0.12 78 / 15%)",
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow
                      className="hover:bg-transparent"
                      style={{ borderColor: "oklch(0.72 0.12 78 / 10%)" }}
                    >
                      {["Name", "Category", "Price", "Status", "Actions"].map(
                        (h) => (
                          <TableHead
                            key={h}
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "oklch(0.55 0.03 65)" }}
                          >
                            {h}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.map((item, idx) => (
                      <TableRow
                        data-ocid={`admin.menu.item.${idx + 1}`}
                        key={item.id}
                        className="hover:bg-[oklch(0.18_0.022_50_/_40%)]"
                        style={{ borderColor: "oklch(0.72 0.12 78 / 8%)" }}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p style={{ color: "oklch(0.90 0.018 75)" }}>
                              {item.name}
                            </p>
                            {item.isRecommended && (
                              <Badge
                                className="text-xs mt-1 border-0 font-semibold"
                                style={{
                                  background: "oklch(0.72 0.12 78 / 15%)",
                                  color: "oklch(0.72 0.12 78)",
                                }}
                              >
                                ★ Recommended
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="capitalize text-sm"
                          style={{ color: "oklch(0.62 0.04 68)" }}
                        >
                          {item.category}
                        </TableCell>
                        <TableCell
                          className="font-bold"
                          style={{ color: "oklch(0.72 0.12 78)" }}
                        >
                          ₹{item.price}
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={
                              item.isAvailable
                                ? {
                                    background: "oklch(0.55 0.18 145 / 15%)",
                                    color: "oklch(0.55 0.18 145)",
                                  }
                                : {
                                    background: "oklch(0.55 0.18 25 / 15%)",
                                    color: "oklch(0.55 0.18 25)",
                                  }
                            }
                          >
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            data-ocid={`admin.menu.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="hover:bg-[oklch(0.55_0.18_25_/_15%)]"
                            style={{ color: "oklch(0.60 0.18 25)" }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="font-poppins font-bold text-2xl mb-1">
                  Reviews Management
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)" }}>
                  {reviews.filter((r) => !r.approved).length} pending approval
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    data-ocid={`admin.reviews.item.${idx + 1}`}
                    key={review.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl p-6 flex items-start justify-between gap-4"
                    style={{
                      background: "oklch(0.15 0.022 50 / 70%)",
                      border: "1px solid oklch(0.72 0.12 78 / 15%)",
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                            color: "oklch(0.11 0.018 48)",
                          }}
                        >
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-semibold text-sm"
                            style={{ color: "oklch(0.90 0.018 75)" }}
                          >
                            {review.name}
                          </p>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className="w-3 h-3"
                                style={{
                                  color:
                                    s <= review.rating
                                      ? "oklch(0.72 0.12 78)"
                                      : "oklch(0.30 0.02 65)",
                                  fill:
                                    s <= review.rating
                                      ? "oklch(0.72 0.12 78)"
                                      : "transparent",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge
                          className="text-xs border-0 font-semibold shrink-0"
                          style={
                            review.approved
                              ? {
                                  background: "oklch(0.55 0.18 145 / 15%)",
                                  color: "oklch(0.55 0.18 145)",
                                }
                              : {
                                  background: "oklch(0.72 0.15 80 / 15%)",
                                  color: "oklch(0.72 0.15 80)",
                                }
                          }
                        >
                          {review.approved ? "✓ Approved" : "Pending"}
                        </Badge>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(0.65 0.04 68)" }}
                      >
                        {review.comment}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!review.approved && (
                        <Button
                          data-ocid={`admin.reviews.confirm_button.${idx + 1}`}
                          size="sm"
                          onClick={() => handleApproveReview(review.id)}
                          className="border-0 text-xs font-semibold"
                          style={{
                            background: "oklch(0.55 0.18 145 / 20%)",
                            color: "oklch(0.55 0.18 145)",
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                      )}
                      <Button
                        data-ocid={`admin.reviews.delete_button.${idx + 1}`}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReview(review.id)}
                        className="hover:bg-[oklch(0.55_0.18_25_/_15%)]"
                        style={{ color: "oklch(0.60 0.18 25)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="font-poppins font-bold text-2xl mb-1">
                  Gallery Management
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)" }}>
                  {galleryImages.length} images published
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <motion.div
                    data-ocid={`admin.gallery.item.${idx + 1}`}
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-xl overflow-hidden group relative"
                    style={{
                      border: "1px solid oklch(0.72 0.12 78 / 15%)",
                    }}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{ background: "oklch(0 0 0 / 65%)" }}
                    >
                      <Button
                        data-ocid={`admin.gallery.delete_button.${idx + 1}`}
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setGalleryImages((prev) =>
                            prev.filter((g) => g.id !== img.id),
                          )
                        }
                        className="rounded-full w-10 h-10 p-0"
                        style={{
                          background: "oklch(0.55 0.18 25 / 20%)",
                          color: "oklch(0.75 0.18 25)",
                          border: "1px solid oklch(0.55 0.18 25 / 40%)",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div
                      className="p-2.5"
                      style={{ background: "oklch(0.13 0.020 50)" }}
                    >
                      <p
                        className="text-xs truncate font-medium"
                        style={{ color: "oklch(0.65 0.04 68)" }}
                      >
                        {img.caption}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Café Info */}
          {activeTab === "cafeinfo" && (
            <motion.div
              key="cafeinfo"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg"
            >
              <div className="mb-8">
                <h2 className="font-poppins font-bold text-2xl mb-1">
                  Café Info
                </h2>
                <p className="text-sm" style={{ color: "oklch(0.55 0.03 65)" }}>
                  Manage café status and contact information
                </p>
              </div>
              <div
                className="rounded-2xl p-8 flex flex-col gap-6"
                style={{
                  background: "oklch(0.15 0.022 50 / 70%)",
                  border: "1px solid oklch(0.72 0.12 78 / 15%)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      className="text-sm font-semibold block mb-0.5"
                      style={{ color: "oklch(0.90 0.018 75)" }}
                    >
                      Currently Open
                    </Label>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.03 65)" }}
                    >
                      Toggle café open/closed status
                    </p>
                  </div>
                  <Switch
                    data-ocid="admin.cafeinfo.switch"
                    checked={cafeInfo.isOpen}
                    onCheckedChange={(v) =>
                      setCafeInfo((p) => ({ ...p, isOpen: v }))
                    }
                  />
                </div>

                <div
                  className="h-px"
                  style={{ background: "oklch(0.72 0.12 78 / 12%)" }}
                />

                <div>
                  <Label
                    className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                    style={{ color: "oklch(0.72 0.12 78)" }}
                  >
                    Opening Hours
                  </Label>
                  <Input
                    data-ocid="admin.cafeinfo.input"
                    value={cafeInfo.openingHours}
                    onChange={(e) =>
                      setCafeInfo((p) => ({
                        ...p,
                        openingHours: e.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                    style={{
                      background: "oklch(0.18 0.025 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                      color: "oklch(0.90 0.018 75)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                    style={{ color: "oklch(0.72 0.12 78)" }}
                  >
                    Contact Info
                  </Label>
                  <Input
                    data-ocid="admin.cafeinfo.input"
                    value={cafeInfo.contactInfo}
                    onChange={(e) =>
                      setCafeInfo((p) => ({
                        ...p,
                        contactInfo: e.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                    style={{
                      background: "oklch(0.18 0.025 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                      color: "oklch(0.90 0.018 75)",
                    }}
                  />
                </div>

                <Button
                  data-ocid="admin.cafeinfo.submit_button"
                  onClick={handleSaveCafeInfo}
                  className="h-11 rounded-xl font-bold border-0 hover:opacity-90 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                    color: "oklch(0.11 0.018 48)",
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Menu Item Modal */}
      <Dialog open={menuModal} onOpenChange={setMenuModal}>
        <DialogContent
          data-ocid="admin.menu.dialog"
          style={{
            background: "oklch(0.14 0.022 50)",
            border: "1px solid oklch(0.72 0.12 78 / 25%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-poppins">
              Add New Menu Item
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <Label
                className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: "oklch(0.72 0.12 78)" }}
              >
                Name
              </Label>
              <Input
                data-ocid="admin.menu.input"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, name: e.target.value }))
                }
                className="h-10 rounded-xl"
                style={{
                  background: "oklch(0.18 0.025 50)",
                  border: "1px solid oklch(0.72 0.12 78 / 20%)",
                }}
                placeholder="e.g. Veg Pizza"
              />
            </div>
            <div>
              <Label
                className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                style={{ color: "oklch(0.72 0.12 78)" }}
              >
                Description
              </Label>
              <Textarea
                data-ocid="admin.menu.textarea"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, description: e.target.value }))
                }
                className="rounded-xl resize-none"
                style={{
                  background: "oklch(0.18 0.025 50)",
                  border: "1px solid oklch(0.72 0.12 78 / 20%)",
                }}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                  style={{ color: "oklch(0.72 0.12 78)" }}
                >
                  Price (₹)
                </Label>
                <Input
                  data-ocid="admin.menu.input"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, price: e.target.value }))
                  }
                  className="h-10 rounded-xl"
                  style={{
                    background: "oklch(0.18 0.025 50)",
                    border: "1px solid oklch(0.72 0.12 78 / 20%)",
                  }}
                  type="number"
                  placeholder="99"
                />
              </div>
              <div>
                <Label
                  className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                  style={{ color: "oklch(0.72 0.12 78)" }}
                >
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(v) =>
                    setNewItem((p) => ({ ...p, category: v as MenuCategory }))
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.menu.select"
                    className="h-10 rounded-xl"
                    style={{
                      background: "oklch(0.18 0.025 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "oklch(0.16 0.022 50)",
                      border: "1px solid oklch(0.72 0.12 78 / 20%)",
                    }}
                  >
                    {Object.entries(categoryLabels).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.menu.switch"
                checked={newItem.isRecommended}
                onCheckedChange={(v) =>
                  setNewItem((p) => ({ ...p, isRecommended: v }))
                }
              />
              <Label
                className="text-sm"
                style={{ color: "oklch(0.80 0.02 70)" }}
              >
                Mark as Recommended
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.menu.cancel_button"
              variant="outline"
              onClick={() => setMenuModal(false)}
              style={{ borderColor: "oklch(0.72 0.12 78 / 25%)" }}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.menu.submit_button"
              onClick={() => {
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
                toast.success("Menu item added!");
              }}
              className="border-0 font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.12 78), oklch(0.58 0.10 68))",
                color: "oklch(0.11 0.018 48)",
              }}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
