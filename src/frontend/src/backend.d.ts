import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MenuItem {
    name: string;
    isAvailable: boolean;
    description: string;
    isRecommended: boolean;
    category: MenuCategory;
    image: ExternalBlob;
    price: bigint;
}
export interface CafeInfo {
    contactInfo: string;
    isOpen: boolean;
    openingHours: string;
}
export interface GalleryImage {
    id: bigint;
    caption: string;
    category: string;
    image: ExternalBlob;
}
export interface AnalyticsView {
    totalMenuItems: bigint;
    totalGalleryImages: bigint;
    totalReviews: bigint;
    pageViews: Array<[string, bigint]>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Review {
    id: bigint;
    name: string;
    comment: string;
    approved: boolean;
    timestamp: bigint;
    rating: bigint;
}
export enum MenuCategory {
    thali = "thali",
    shakes = "shakes",
    sandwich = "sandwich",
    snacks = "snacks",
    beverages = "beverages",
    pizza = "pizza",
    burger = "burger"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(image: GalleryImage): Promise<bigint>;
    addMenuItem(item: MenuItem): Promise<bigint>;
    approveReview(id: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryImage(id: bigint): Promise<void>;
    deleteMenuItem(id: bigint): Promise<void>;
    deleteReview(id: bigint): Promise<void>;
    getAllGalleryImages(): Promise<Array<GalleryImage>>;
    getAllMenuItems(): Promise<Array<MenuItem>>;
    getAnalytics(): Promise<AnalyticsView>;
    getApprovedReviews(): Promise<Array<Review>>;
    getAvailableMenuItems(): Promise<Array<MenuItem>>;
    getCafeInfo(): Promise<CafeInfo | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMenuItemsByCategory(category: MenuCategory): Promise<Array<MenuItem>>;
    getRecommendedMenuItems(): Promise<Array<MenuItem>>;
    getTopRatedReviews(): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementPageView(page: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitReview(review: Review): Promise<bigint>;
    updateCafeInfo(info: CafeInfo): Promise<void>;
    updateMenuItem(id: bigint, item: MenuItem): Promise<void>;
}
