# Food Costa Cafe and Restaurant

## Current State
New project — no existing application files. Scaffolded Motoko backend and React frontend are present.

## Requested Changes (Diff)

### Add
- Home page: hero section, featured dishes slider, Why Choose Us, ratings highlight, testimonials slider, peak hours visualization
- Menu page: dynamic menu with categories (Pizza, Burger, Sandwich, Shakes, Thali, etc.), search + filter, animated cards, Recommended badges, price display in ₹
- Reviews page: public review submission (name, star rating, comment), display reviews sorted by latest/top rated
- Gallery page: grid layout, hover zoom, lightbox preview
- Contact page: Google Map embed placeholder, Call + WhatsApp buttons, opening hours
- Admin panel (JWT-protected): login, manage menu items (CRUD), manage gallery images (upload/delete), manage reviews (approve/delete), dashboard analytics (visit count, review count, menu item count)
- Authorization system for admin-only access
- Blob storage for gallery and food images
- Sample data for all content (menu, reviews, gallery)
- Placeholder visuals throughout

### Modify
- N/A (new project)

### Remove
- No ordering system
- No coupon system
- No AI chatbot
- No push notifications

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend with actors for:
   - Menu items (CRUD, categories, recommended flag)
   - Reviews (submit public, admin approve/delete, sort options)
   - Gallery (upload reference, delete, list)
   - Analytics (page view tracking, counts)
   - Admin auth via authorization component
3. Build React frontend:
   - Dark elegant theme: black, brown, beige, soft gold palette
   - Fonts: Poppins + Inter via Google Fonts
   - Framer Motion animations throughout
   - Pages: Home, Menu, Reviews, Gallery, Contact
   - Admin panel: /admin route with login gate
   - Fully responsive (mobile, tablet, desktop)
   - Glassmorphism cards, smooth gradients, hover effects
