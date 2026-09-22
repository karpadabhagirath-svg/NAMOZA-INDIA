# Namoza India — Website

A full-stack website for Namoza India: customers upload a photo of a loved one, customize a
statue (size, finish, engraving, pose notes), and place an order online. The studio manages
orders, photos, statuses and payments from an admin dashboard.

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Payments**: Razorpay (India-first, supports UPI/cards/netbanking)
- **Email**: any SMTP provider via Nodemailer
- **Design**: "royal grey" palette — graphite/charcoal base, soft silver-greys, muted antique-gold accent

## Project structure

```
namoza-india/
├── backend/     Express API, Prisma schema, order/payment/email logic
└── frontend/    Next.js site: marketing pages, order wizard, tracking, admin dashboard
```

## 1. Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- A PostgreSQL database (local, or a managed one — Render, Railway, Neon, Supabase all work)
- A Razorpay account (for real payments — optional to get the site running)
- An SMTP provider (for real emails — optional to get the site running; without it, emails are
  logged to the console instead of sent)

> This project was written in a sandboxed environment without access to the npm registry, so its
> dependencies have **not** been installed or build-verified here. Everything below is standard
> `npm install` / `npm run dev`, which will work normally on your own machine or CI.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL, JWT_SECRET, ADMIN_EMAIL/ADMIN_PASSWORD, SMTP_*, RAZORPAY_*
npm install
npm run prisma:migrate      # creates the database tables
npm run seed                 # creates your first admin login from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                  # starts the API on http://localhost:4000
```

Generate a strong `JWT_SECRET` with:

```bash
openssl rand -hex 32
```

Uploaded customer photos are stored on disk under `backend/uploads` in development, and served at
`http://localhost:4000/uploads/...`. For production, either keep a persistent disk on your host
(see deployment notes below) or swap the `multer` disk storage in
`backend/src/middleware/upload.ts` for an S3-compatible bucket — the rest of the app only relies on
`OrderPhoto.url` being a reachable URL, so this is a contained change.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to your backend's URL
npm install
npm run dev                  # starts the site on http://localhost:3000
```

Visit `http://localhost:3000` for the site, `/customize` for the order flow, `/track` for order
tracking, and `/admin/login` for the studio dashboard (log in with the admin account you seeded).

## 4. How the pieces fit together

- **Customer places an order** (`/customize`) → uploads photos, picks size/finish, enters contact
  details → `POST /api/orders` (multipart) creates the order, stores the photos, emails a
  confirmation, and alerts the studio.
- **Studio reviews the order** in `/admin/dashboard` → opens the order, updates its status
  (Received → Confirmed → In Production → Quality Check → Shipped → Delivered), which emails the
  customer automatically.
- **Payment**: from the order confirmation screen or the tracking page, the customer can pay via
  Razorpay Checkout. The backend creates a Razorpay order (`POST /api/payments/create`) and
  verifies the signature after checkout (`POST /api/payments/verify`). The studio can also mark an
  order as paid manually (e.g. for UPI/cash) from the order detail page.
- **Customer tracks their order** (`/track`) by entering their order number and email → shows an
  animated status timeline.

## 5. Pricing

Prices live in two places that must be kept in sync:

- `backend/src/utils/pricing.ts` — the authoritative price used when an order is created
- `frontend/src/lib/pricing.ts` — a copy used only to show a live estimate while customizing

Update both if you change your pricing.

## 6. Before you launch

- **Replace the gallery placeholders.** `frontend/src/components/Gallery.tsx` currently renders
  elegant placeholder frames (no real product photos were available to build this with) — swap in
  real photography of finished statues.
- **Update contact details.** Phone number, email and Instagram handle in
  `frontend/src/components/Footer.tsx` are placeholders.
- **Review copy.** Testimonials, stats ("2,000+ statues crafted") and FAQ content in the
  homepage components are illustrative starting points — replace with your real numbers and
  policies.
- **Set a strong `JWT_SECRET` and `ADMIN_PASSWORD`** in production, and rotate them if this
  repository is ever shared.
- **Switch Razorpay to live keys** (`rzp_live_...`) only once you've tested the full flow with test
  keys (`rzp_test_...`).

## 7. Deploying with your domain (namozaindia.com)

A simple, low-maintenance setup:

1. **Backend** → deploy `backend/` to Render, Railway, or a similar Node host. Add a managed
   PostgreSQL database (most of these providers offer one directly), set the environment variables
   from `backend/.env.example`, and run `npm run prisma:deploy` once as a release step. Note the
   backend's public URL (e.g. `https://api.namozaindia.com` if you add that subdomain, or the
   host's default URL).
2. **Frontend** → deploy `frontend/` to Vercel (simplest for Next.js). Set `NEXT_PUBLIC_API_URL`
   to your backend's public URL in the Vercel project's environment variables.
3. **Domain** → in your domain registrar's DNS settings for `namozaindia.com`:
   - Point the root domain (and `www`) at Vercel, following Vercel's "Add Domain" instructions for
     your project.
   - If you host the API on a subdomain (recommended), add a CNAME/A record for `api.namozaindia.com`
     pointing at your backend host, following that host's custom-domain instructions.
4. Update `CORS_ORIGINS` in the backend's environment variables to include
   `https://namozaindia.com` and `https://www.namozaindia.com` (already included by default in
   `.env.example`).
5. Update the Razorpay dashboard's allowed domains/webhook settings (if you add webhooks later) to
   your live domain.

## 8. Extending later

- **Photo storage**: move from local disk to S3/Cloudinary for durability across deploys.
- **Customer accounts**: the tracking page currently works by order number + email, with no login
  — add customer accounts later if you want order history across multiple orders.
- **Webhooks**: `POST /api/payments/verify` currently verifies payment via the Checkout response
  signature; for extra reliability you can add a Razorpay webhook endpoint as a second
  confirmation path.
