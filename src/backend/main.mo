import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type MenuCategory = {
    #pizza;
    #burger;
    #sandwich;
    #shakes;
    #thali;
    #snacks;
    #beverages;
  };

  module MenuCategory {
    public func toText(category : MenuCategory) : Text {
      switch (category) {
        case (#pizza) { "Pizza" };
        case (#burger) { "Burger" };
        case (#sandwich) { "Sandwich" };
        case (#shakes) { "Shakes" };
        case (#thali) { "Thali" };
        case (#snacks) { "Snacks" };
        case (#beverages) { "Beverages" };
      };
    };
  };

  type MenuItem = {
    name : Text;
    description : Text;
    price : Nat;
    category : MenuCategory;
    image : Storage.ExternalBlob;
    isRecommended : Bool;
    isAvailable : Bool;
  };

  module MenuItem {
    public func compare(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  type Review = {
    id : Nat;
    name : Text;
    rating : Nat;
    comment : Text;
    timestamp : Int;
    approved : Bool;
  };

  module Review {
    public func compareByRating(review1 : Review, review2 : Review) : Order.Order {
      Nat.compare(review2.rating, review1.rating);
    };

    public func compareByTimestamp(review1 : Review, review2 : Review) : Order.Order {
      Int.compare(review2.timestamp, review1.timestamp);
    };
  };

  type GalleryImage = {
    id : Nat;
    image : Storage.ExternalBlob;
    caption : Text;
    category : Text;
  };

  module GalleryImage {
    public func compare(image1 : GalleryImage, image2 : GalleryImage) : Order.Order {
      Text.compare(image1.category, image2.category);
    };
  };

  type CafeInfo = {
    isOpen : Bool;
    openingHours : Text;
    contactInfo : Text;
  };

  // Internal persistent analytics type
  type Analytics = {
    pageViews : Map.Map<Text, Nat>;
    totalReviews : Nat;
    totalMenuItems : Nat;
    totalGalleryImages : Nat;
  };

  // Shareable analytics result type
  type AnalyticsView = {
    pageViews : [(Text, Nat)];
    totalReviews : Nat;
    totalMenuItems : Nat;
    totalGalleryImages : Nat;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let menuItems = Map.empty<Nat, MenuItem>();
  let reviews = Map.empty<Nat, Review>();
  let gallery = Map.empty<Nat, GalleryImage>();
  var nextMenuId = 1;
  var nextReviewId = 1;
  var nextGalleryId = 1;
  let pageViews = Map.empty<Text, Nat>();
  var totalReviews = 0;
  var totalGalleryImages = 0;

  var cafeInfo : ?CafeInfo = null;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Initialize storage
  include MixinStorage();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Menu Management Functions
  public query ({ caller }) func getAllMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };

  public query ({ caller }) func getMenuItemsByCategory(category : MenuCategory) : async [MenuItem] {
    menuItems.values().toArray().filter(func(item) { item.category == category }).sort();
  };

  public query ({ caller }) func getRecommendedMenuItems() : async [MenuItem] {
    menuItems.values().toArray().filter(func(item) { item.isRecommended }).sort();
  };

  public query ({ caller }) func getAvailableMenuItems() : async [MenuItem] {
    menuItems.values().toArray().filter(func(item) { item.isAvailable }).sort();
  };

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };
    let id = nextMenuId;
    nextMenuId += 1;
    menuItems.add(id, item);
    id;
  };

  public shared ({ caller }) func updateMenuItem(id : Nat, item : MenuItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    menuItems.add(id, item);
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete menu items");
    };
    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };
    ignore menuItems.get(id);
    menuItems.remove(id);
  };

  // Review Functions
  public query ({ caller }) func getApprovedReviews() : async [Review] {
    reviews.values().toArray().filter(func(review) { review.approved }).sort(Review.compareByTimestamp);
  };

  public query ({ caller }) func getTopRatedReviews() : async [Review] {
    reviews.values().toArray().filter(func(review) { review.approved }).sort(Review.compareByRating);
  };

  public shared ({ caller }) func submitReview(review : Review) : async Nat {
    // Public users (including guests) can submit reviews - no authorization check needed
    let id = nextReviewId;
    nextReviewId += 1;
    let newReview = { review with id; timestamp = Time.now(); approved = false };
    reviews.add(id, newReview);
    id;
  };

  public shared ({ caller }) func approveReview(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve reviews");
    };
    switch (reviews.get(id)) {
      case (null) { Runtime.trap("Review not found") };
      case (?review) {
        let approvedReview = { review with approved = true };
        reviews.add(id, approvedReview);
      };
    };
  };

  public shared ({ caller }) func deleteReview(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete reviews");
    };
    if (not reviews.containsKey(id)) {
      Runtime.trap("Review not found");
    };
    reviews.remove(id);
  };

  // Gallery Functions
  public query ({ caller }) func getAllGalleryImages() : async [GalleryImage] {
    gallery.values().toArray().sort();
  };

  public shared ({ caller }) func addGalleryImage(image : GalleryImage) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };
    let id = nextGalleryId;
    nextGalleryId += 1;
    gallery.add(id, image);
    id;
  };

  public shared ({ caller }) func deleteGalleryImage(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };
    if (not gallery.containsKey(id)) {
      Runtime.trap("Gallery image not found");
    };
    ignore gallery.get(id);
    gallery.remove(id);
  };

  // Cafe Info Functions
  public shared ({ caller }) func updateCafeInfo(info : CafeInfo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update cafe info");
    };
    cafeInfo := ?info;
  };

  public query ({ caller }) func getCafeInfo() : async ?CafeInfo {
    cafeInfo;
  };

  // Analytics Functions
  public shared ({ caller }) func incrementPageView(page : Text) : async () {
    // Public function - anyone including guests can track page views
    let count = switch (pageViews.get(page)) {
      case (null) { 1 };
      case (?existing) { existing + 1 };
    };
    pageViews.add(page, count);
  };

  public query ({ caller }) func getAnalytics() : async AnalyticsView {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    {
      pageViews = pageViews.toArray();
      totalReviews;
      totalMenuItems = nextMenuId - 1;
      totalGalleryImages;
    };
  };
};
