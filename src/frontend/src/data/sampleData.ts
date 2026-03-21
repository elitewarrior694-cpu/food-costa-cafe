import { MenuCategory } from "../backend";

export interface SampleMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  isRecommended: boolean;
  isAvailable: boolean;
}

export const sampleMenuItems: SampleMenuItem[] = [
  {
    id: 1,
    name: "Veg Pizza",
    description:
      "Crispy thin crust pizza loaded with fresh vegetables and mozzarella",
    price: 120,
    category: MenuCategory.pizza,
    imageUrl: "https://picsum.photos/seed/pizza1/400/300",
    isRecommended: true,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Chicken Burger",
    description:
      "Juicy grilled chicken patty with lettuce, tomato and special sauce",
    price: 99,
    category: MenuCategory.burger,
    imageUrl: "https://picsum.photos/seed/burger1/400/300",
    isRecommended: true,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Paneer Sandwich",
    description:
      "Toasted sandwich with spiced paneer filling and crunchy vegetables",
    price: 60,
    category: MenuCategory.sandwich,
    imageUrl: "https://picsum.photos/seed/sandwich1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Mango Shake",
    description: "Fresh mango blended with chilled milk and a hint of cardamom",
    price: 79,
    category: MenuCategory.shakes,
    imageUrl: "https://picsum.photos/seed/mango1/400/300",
    isRecommended: true,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Veg Thali",
    description: "Complete meal with dal, sabzi, roti, rice, salad and pickle",
    price: 149,
    category: MenuCategory.thali,
    imageUrl: "https://picsum.photos/seed/thali1/400/300",
    isRecommended: true,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Masala Chai",
    description: "Aromatic Indian spiced tea brewed to perfection",
    price: 20,
    category: MenuCategory.beverages,
    imageUrl: "https://picsum.photos/seed/chai1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 7,
    name: "French Fries",
    description: "Golden crispy fries seasoned with our special spice blend",
    price: 49,
    category: MenuCategory.snacks,
    imageUrl: "https://picsum.photos/seed/fries1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Veg Maggi",
    description: "Classic Maggi noodles tossed with vegetables and spices",
    price: 39,
    category: MenuCategory.snacks,
    imageUrl: "https://picsum.photos/seed/maggi1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 9,
    name: "Cold Coffee",
    description: "Rich blended cold coffee with ice cream — our bestseller",
    price: 89,
    category: MenuCategory.beverages,
    imageUrl: "https://picsum.photos/seed/coffee1/400/300",
    isRecommended: true,
    isAvailable: true,
  },
  {
    id: 10,
    name: "Pasta Arrabbiata",
    description: "Penne pasta in spicy tomato sauce with herbs and parmesan",
    price: 110,
    category: MenuCategory.snacks,
    imageUrl: "https://picsum.photos/seed/pasta1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 11,
    name: "Spring Roll",
    description:
      "Crispy rolls stuffed with seasoned vegetables, served with dipping sauce",
    price: 59,
    category: MenuCategory.snacks,
    imageUrl: "https://picsum.photos/seed/roll1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
  {
    id: 12,
    name: "Veg Wrap",
    description:
      "Soft tortilla wrap filled with spiced vegetables and creamy sauce",
    price: 69,
    category: MenuCategory.sandwich,
    imageUrl: "https://picsum.photos/seed/wrap1/400/300",
    isRecommended: false,
    isAvailable: true,
  },
];

export const sampleReviews = [
  {
    id: 1,
    name: "Rohit Sharma",
    rating: 5,
    comment:
      "Best café in Gorakhpur! The cold coffee is absolutely amazing and the pricing is unbeatable.",
    timestamp: Date.now() - 86400000,
    approved: true,
  },
  {
    id: 2,
    name: "Priya Singh",
    rating: 5,
    comment:
      "Love the vibe here! Cozy atmosphere, friendly staff, and the Veg Thali is super filling.",
    timestamp: Date.now() - 172800000,
    approved: true,
  },
  {
    id: 3,
    name: "Amit Kumar",
    rating: 4,
    comment:
      "Great food quality at such affordable prices. The pizza is crispy and the shakes are fresh.",
    timestamp: Date.now() - 259200000,
    approved: true,
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rating: 5,
    comment:
      "Visited with family last weekend. Everyone loved it! Kids especially enjoyed the burgers.",
    timestamp: Date.now() - 345600000,
    approved: true,
  },
  {
    id: 5,
    name: "Vikram Yadav",
    rating: 4,
    comment:
      "Pocket-friendly and delicious. The Masala Chai is just perfect to start the morning!",
    timestamp: Date.now() - 432000000,
    approved: true,
  },
];

export const sampleGalleryImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  caption: [
    "Our cozy cafe interior",
    "Fresh food daily",
    "Special weekend platter",
    "Happy customers",
    "Chef's special",
    "Coffee art",
    "Evening vibes",
    "Street food corner",
    "Thali special",
    "Shake of the day",
    "Late night snacks",
    "Weekend brunch",
  ][i],
  category: "cafe",
  imageUrl: `https://picsum.photos/seed/cafe${i + 1}/600/400`,
}));
