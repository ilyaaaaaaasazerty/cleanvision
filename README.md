# CleanVision — Luxury Cleaning Company Website

A cinematic, premium cleaning company website built with Next.js 14, GSAP, and Supabase.

## ✨ Features

### Frontend
- **Cinematic Glass Cleaning Hero** — Canvas-based GSAP ScrollTrigger wipe effect simulating real glass cleaning
- **Dynamic Services** — Fetched from Supabase, filterable by category
- **Before/After Slider** — Interactive comparison with auto-reveal on scroll entry
- **Animated Counters** — Homes cleaned, satisfaction rate, years, staff
- **Testimonials** — Glass morphism cards with stagger reveal
- **Process Timeline** — Horizontal (desktop) / Vertical (mobile) GSAP-animated steps
- **Cinematic CTA** — Full-width, parallax background
- **Floating WhatsApp Button** — With pulse animation and hover label
- **Responsive Navbar** — Scroll-aware, mobile hamburger menu

### Backend / CMS
- **Supabase Auth** — Email/password login for admin
- **Services CRUD** — Create, edit, delete services with image upload
- **Categories Management** — Add/delete categories
- **Bookings Management** — View, filter, update status (pending → confirmed → completed)
- **Image Storage** — Supabase Storage for service images

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
```bash
cp .env.local.example .env.local
```

Fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set up database
- Open Supabase → SQL Editor
- Paste and run the contents of `supabase-schema.sql`
- Go to Storage → Create bucket named `service-images` (set to **Public**)

### 4. Create admin user
- Supabase → Authentication → Add User
- Use those credentials to log in at `/admin/login`

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
/app
  page.tsx                    ← Homepage (cinematic)
  layout.tsx                  ← Root layout (Navbar + WhatsApp btn)
  globals.css                 ← Design system + animations
  /services
    page.tsx                  ← All services (SSG + filter)
    ServicesPageClient.tsx    ← Client-side filter UI
    /[id]
      page.tsx                ← Service detail (dynamic)
      ServiceDetailClient.tsx
  /contact
    page.tsx                  ← Booking form
  /admin
    layout.tsx                ← Sidebar layout
    page.tsx                  ← Dashboard overview
    login/page.tsx            ← Auth page
    /services
      page.tsx                ← Services table
      new/page.tsx            ← Create service
    /categories
      page.tsx                ← Category management
    /bookings
      page.tsx                ← Bookings with status update

/components
  GlassCleaningScene.tsx      ← ★ Canvas GSAP wipe hero
  ServicesSection.tsx         ← Homepage services grid
  BeforeAfter.tsx             ← Interactive comparison slider
  TrustSection.tsx            ← Counters + testimonials
  ProcessTimeline.tsx         ← 4-step process animation
  CTASection.tsx              ← Bottom CTA
  Navbar.tsx                  ← Responsive navigation
  WhatsAppButton.tsx          ← Floating chat button
  Footer.tsx
  /admin
    ServiceForm.tsx           ← Reusable create/edit form

/lib
  supabaseClient.ts           ← All DB functions + client
  types.ts                    ← TypeScript interfaces
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--obsidian` | `#080808` — Primary background |
| `--alabaster` | `#F5F3EF` — Primary text |
| `--ice-blue` | `#A8DCEB` — Accent / CTAs |
| `--deep-teal` | `#0D6E7A` — Secondary accent |
| Display font | Cormorant Garamond |
| Body font | DM Sans |
| Mono font | DM Mono |

---

## 🎬 GSAP Architecture

### GlassCleaningScene (Hero)
```
ScrollTrigger pin: 450vh scroll distance
├── 0–20%   Spray droplets appear (canvas)
├── 20–80%  Organic wipe edge sweeps left→right
├── 60–80%  Spray fades out
├── 70–90%  Dirty layer fades
└── 80–100% Clean content reveals with stagger
```

### Other Animations
- **ServicesSection** — `stagger: 0.12` cards from y:80 on scroll entry
- **BeforeAfter** — Auto-sweep timeline (25%→75%→50%) then interactive
- **TrustSection** — Counter animation with `gsap.to({val:0},{val:end})`
- **ProcessTimeline** — Line `scaleX` grow + step `stagger: 0.18`
- **CTASection** — Sequential timeline + parallax orbs on scrub

---

## 📋 Supabase Tables

| Table | Key fields |
|-------|-----------|
| `categories` | id, name |
| `services` | id, title, description, image_url, category_id, price, featured |
| `bookings` | id, name, phone, service, message, status |

---

## 🔧 Customisation

- **WhatsApp number**: Edit `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`
- **Brand name**: Search/replace `CleanVision` across components
- **Colors**: Edit CSS variables in `globals.css`
- **Services**: Add via `/admin/services/new` or directly in Supabase

---

## 📦 Deploy

```bash
# Vercel (recommended)
vercel --prod

# Or
npm run build && npm start
```

Set environment variables in Vercel dashboard.
