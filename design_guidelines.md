# Design Guidelines: Invitation Showcase & Management Platform

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from visual portfolio platforms (Behance, Dribbble, Pinterest) for the showcase experience, and modern admin dashboards (Linear, Notion) for the management interface.

**Core Principle**: Let the invitation designs be the hero. The interface should be an elegant frame that elevates the artwork without competing with it.

---

## Typography System

**Font Stack**: 
- Primary: Inter or DM Sans (modern, clean sans-serif via Google Fonts)
- Display: Playfair Display or Cormorant (elegant serif for invitation titles in detail view)

**Hierarchy**:
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Invitation Titles: text-lg font-medium
- Body Text: text-base font-normal
- Labels/Meta: text-sm font-medium
- Admin UI: Consistent text-sm to text-base, prioritize clarity

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Micro spacing: gap-2, p-2
- Component spacing: gap-4, p-4, p-6
- Section spacing: gap-8, py-12, py-16
- Major sections: py-16, py-20

**Container Strategy**:
- Showcase grid: max-w-7xl mx-auto px-4 md:px-8
- Detail view: max-w-4xl mx-auto
- Admin panel: Full-width with sidebar, content area max-w-6xl

---

## Component Library

### 1. Invitation Showcase Page

**Hero Section**:
- Full-width hero with gradient overlay (no image needed, pure design)
- Centered content: Large title "Invitation Gallery" + brief tagline
- Height: min-h-[50vh], not full viewport
- Gradient background from brand direction

**Masonry/Collage Grid**:
- Use CSS Grid with auto-fit columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Variable row heights for visual interest (use aspect-ratio or natural image dimensions)
- Each card:
  - Image container with subtle shadow and border radius (rounded-lg)
  - Overlay appears on hover with invitation title
  - Smooth transition on hover (scale-105, shadow increase)
  - Click anywhere on card to open detail view
  - Gap between cards: gap-4 md:gap-6

**Grid Card Structure**:
- Image: Rounded corners, object-cover to maintain aspect
- Title overlay: Gradient backdrop from transparent to black/80 at bottom
- Typography: White text, text-lg font-semibold

### 2. Detail View (Modal)

**Modal Presentation**:
- Centered overlay modal with backdrop blur
- Modal width: max-w-3xl
- Background: White/light surface with rounded-2xl
- Close button: Top-right corner, clear X icon

**Content Layout** (Two-column on desktop):
- Left Column (60%): Large invitation image with rounded-lg, shadow-xl
- Right Column (40%): 
  - Invitation title (display font, text-3xl)
  - Description text (prose formatting, max-w-prose)
  - Price display (text-2xl font-bold, highlighted)
  - Share to Telegram button (primary CTA)

**Share Button**:
- Full-width button with Telegram brand treatment
- Icon + "Share on Telegram" text
- Prominent placement below price
- Background: Telegram blue (#0088cc)
- Rounded-lg, py-3 px-6

### 3. Admin Panel

**Layout Structure**:
- Left sidebar navigation (w-64, fixed)
- Main content area (ml-64, full remaining width)

**Sidebar Components**:
- Logo/branding at top (p-6)
- Navigation menu with icons:
  - Dashboard overview
  - Manage Invitations
  - Settings (Telegram link, fonts)
  - Logout
- Active state: Background highlight, bold text
- Gap between items: gap-1

**Admin Login Page**:
- Centered card design (max-w-md mx-auto)
- Minimal, clean aesthetic
- Logo at top
- Username/password fields with clear labels
- Primary action button
- Vertical spacing: space-y-6 for form elements

**Invitation Management Table/Grid**:
- Use card grid (not table) for visual consistency: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
- Each card shows:
  - Thumbnail image (aspect-square, rounded-lg)
  - Title and truncated description
  - Price badge (top-right corner)
  - Action buttons (Edit, Delete) at bottom
  - Hover state: Subtle shadow increase

**Add/Edit Form**:
- Single column form layout (max-w-2xl)
- Image upload with drag-and-drop zone:
  - Dashed border, rounded-lg
  - Icon + "Upload invitation image" text
  - Preview thumbnail after upload
- Text inputs: Full-width, py-3 px-4, rounded-lg border
- Textarea for description: rows-4
- Price input: Number field with currency prefix
- Actions: Save (primary) and Cancel (secondary) buttons, gap-3

**Settings Panel**:
- Section-based layout with clear headers
- Telegram Link: Input field showing current link, update button
- Font Settings: Dropdown selectors for primary/display fonts
- Custom Links: List of external links with add/remove functionality
- Each section: Bordered card with p-6, space-y-4 for internal spacing

---

## Navigation

**Public Site Header**:
- Sticky top navigation (sticky top-0 z-50)
- Logo on left, minimal menu on right (if needed)
- Transparent background with backdrop blur when scrolling
- Height: h-16 or h-20

**Admin Navigation**:
- Persistent sidebar as described above
- Top bar in content area shows current page title + breadcrumbs

---

## Images

**Required Images**:
- **NO hero background image** - use gradient/design instead
- **Invitation design images**: User-uploaded, primary content (showcase grid, detail view, admin thumbnails)
- **Admin avatar/logo**: Small branding image in sidebar
- All images: Use rounded corners consistently (rounded-lg)
- Image optimization: Serve responsive sizes, lazy load below fold

---

## Interactions & Micro-animations

**Minimal Animation Strategy**:
- Card hover: Subtle scale (scale-105) and shadow increase (transition-all duration-300)
- Modal entrance: Fade-in with scale (scale-95 to scale-100)
- Button clicks: Slight scale reduction (active:scale-95)
- NO complex scroll animations or page transitions

---

## Responsive Behavior

**Breakpoints**:
- Mobile (base): Single column, full-width cards
- Tablet (md:): 2-column grid
- Desktop (lg:): 3-column grid
- Large desktop (xl:): 4-column grid

**Admin Panel Mobile**:
- Sidebar becomes slide-out drawer
- Hamburger menu trigger in top-left
- Content full-width on mobile

**Detail Modal Mobile**:
- Stack columns vertically
- Image on top, content below
- Full-screen on small devices

---

## Visual Treatment

**Cards & Containers**:
- Subtle shadows: shadow-md, shadow-lg for elevated states
- Border radius: rounded-lg (8px) standard, rounded-2xl (16px) for modals
- Borders: Use sparingly, border-gray-200 when needed

**Spacing Consistency**:
- Page padding: px-4 md:px-8
- Section spacing: py-12 md:py-16
- Card padding: p-4 md:p-6

This design creates a visually appealing, gallery-focused experience while maintaining professional admin functionality. The showcase lets invitations shine, while the admin panel provides efficient management tools.