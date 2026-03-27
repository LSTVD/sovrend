# SOVREND — Project Brief
## Current Status as of March 26, 2026

---

## IDENTITY

- **Name:** SOVREND (cleared USPTO, App Store, .com)
- **Entity:** SOVREND Inc. — Delaware C-Corp via Stripe Atlas
- **Domain:** sovrend.com (Cloudflare DNS), sovren.build (redirect)
- **Email:** hello@sovrend.com (Cloudflare routing → personal Gmail)
- **GitHub:** LSTVD/sovrend
- **Vercel:** lstvds-projects/sovrend (currently paused for privacy)
- **Tagline:** "The place where the thought becomes the thing."
- **One-liner:** "Build anything. Own everything."

---

## TECH STACK

- **Framework:** Next.js 14 + TypeScript + Tailwind CSS
- **Auth + Database:** Supabase (project ID: wgvwzswrswuqpjujvglo)
- **Payments:** Stripe (Builder price: price_1TBZhJCuN7ALZHeFpgDuAAbM)
- **Hosting:** Vercel
- **AI - Builds:** Claude Sonnet (Anthropic) — every build, every refine
- **AI - Background:** Gemini 2.5 Flash Lite (Google) — auto-enhance for short prompts
- **AI Assistant Name:** Cipher (renamed from Coach)

---

## COLOR SYSTEM (LOCKED)

| Color | Hex | Role |
|-------|-----|------|
| TRON Blue | #00E5FF | Primary UI, Grid, building, rain, quotes |
| Amber | #FF6A00 | Cipher, auth page, intelligence, warmth |
| Electric Yellow | #FFE600 | Build Journal, timeline, history |
| ISO White | #F0F0FF | Text, transcendence moments |
| Black | #000000 | Canvas always |
| Error Red | #FF3131 | Glitch/hard errors only |

- Typography: Orbitron for UI, Share Tech Mono / SF Mono for code
- Scanlines: 1px at ~1.2% opacity always present
- One color per moment — never mix simultaneously
- Green (#00FF41) has been phased out — no longer in active use

---

## FILE STRUCTURE (KEY FILES)

```
app/
  page.tsx              — Landing/coming soon page (has waitlist + ENTER THE GRID link)
  auth/
    page.tsx            — Blade Runner themed sign-in/sign-up (amber + cyan)
    callback/route.ts   — Supabase auth callback → redirects to /dashboard
  dashboard/
    page.tsx            — Main builder dashboard (~500+ lines, the core product)
  api/
    build/route.ts      — Claude Sonnet build endpoint with journal saving
    enhance/route.ts    — Gemini 2.5 Flash Lite auto-enhance for short prompts
    stripe/             — Stripe routes (not fully wired)

lib/
  supabase/
    client.ts           — Browser Supabase client
    server.ts           — Server Supabase client

middleware.ts           — Protects /dashboard, /build, /onboarding — redirects to /auth
.env.local              — All keys (Supabase, Anthropic, Google AI, Stripe)
```

---

## DASHBOARD (app/dashboard/page.tsx) — CURRENT STATE

### What's built and working:

**Visual:**
- Grid background canvas with cyan TRON perspective lines
- Rain overlay with James Allen quote characters ("AS A MAN THINKETH SO IS HE")
- Entry animation (horizontal line scan + logo reveal)
- Scanlines overlay
- Daily quote widget (28 quotes, 9 thinkers: James Allen, Neville Goddard, Napoleon Hill, Marcus Aurelius, Bruce Lee, Epictetus, Seneca, Alan Watts, Miyamoto Musashi) — TRON Blue styling, rotates daily

**Sidebar (left):**
- SOVREND logo + grid icon
- Home, Search nav items
- NEW BUILD button (resets state)
- Plan & Notes (floating panel, localStorage persistence)
- Build Journal (floating panel, Electric Yellow timeline, per-project filtered)
- PROJECTS section with count
- All projects, Starred, Recent nav items
- Saved apps list (clickable, loads app into preview)
- SPARK templates (Client Portal, SaaS Dashboard, Booking System, Online Store)
- UPLINK Profile link
- Share SOVREND referral card
- Upgrade to Builder card
- Dynamic username (from Supabase auth email)
- Dynamic initials avatar
- OPERATOR badge
- EXIT button (signs out, redirects to /auth)
- Auto-collapses on mobile (< 768px)

**Idle state (prompt screen):**
- "Are you ready to create?" headline (amber→cyan gradient, Orbitron)
- "No code needed. Takes about 60 seconds." subtitle
- CIPHER pill with greeting: "Tell me what you want to build — in your own words. I'll handle the rest."
- Prompt textarea with rotating placeholders
- Particle effect on typing (amber sparks)
- "⌘+ENTER TO CREATE" hint
- CREATE → button (blue→amber gradient)

**Build flow:**
- Auto-enhance: prompts under 30 words get expanded by Gemini 2.5 Flash Lite before Claude builds
- Cipher narration steps during build ("Setting up your database...", "Creating the dashboard layout...", etc.)
- Spinning loader with "BUILDING" text
- Claude Sonnet generates full React + TypeScript + Tailwind app

**Post-build state:**
- Live preview in iframe (with Tailwind CDN + React + Babel)
- Preview bar with dynamic app name (projname.sovrend.com)
- View Code button (toggleable)
- PUBLISH button (visible but not wired)
- CIPHER tab with message history
- Suggestion pills (clickable, fill refine input)
- SOVREN CODE card (explains a term from the build)
- Refine input with "REFINE WITH CIPHER" label and CREATE → button
- Refine strips: Look & Feel, How It Works, Business, Content
- Device toggle: DESKTOP, MOBILE, TABLET (not functional)
- OPERATOR badge + BUILT WITH CLAUDE badge in top nav

**Bottom status bar:**
- "Powered by Claude Sonnet"
- "Auto-Fix ●" indicator (not wired)
- "Supabase ●" and "Stripe ○" status

**Floating widgets:**
- SOVREN CODE glossary (⬡ CODE button, bottom right, 76 terms, searchable)
- Plan & Notes (floating panel, free thought space)
- Build Journal (floating panel, Electric Yellow timeline)

### Components defined in dashboard:
- `GI` — Grid icon (9-square logo)
- `GridBg` — Background canvas with TRON grid + rain
- `Msg` — Chat message bubble (Cipher or user)
- `Sug` — Suggestion pill (clickable, fires onPick)
- `GlossFab` — SOVREN CODE floating glossary
- `EntryScreen` — Initial line-scan animation on page load

---

## AUTH PAGE (app/auth/page.tsx) — CURRENT STATE

- Blade Runner aesthetic: amber + cyan split
- Canvas with rain (cyan streaks), dust particles (amber + cyan), horizontal light streaks
- Atmosphere gradients (warm amber left, cool cyan right)
- Horizontal scan bar animation
- Corner accent lines (HUD framing)
- SOVREND logo (amber→cyan gradient)
- "SYSTEM v1.0 / AUTHENTICATION REQ." system info
- Pulsing dot + "OPERATOR SIGN IN" / "NEW OPERATOR REGISTRATION" mode indicator
- IDENTIFICATION (email) + PASSPHRASE (password) fields
- Amber focus glow on inputs
- VERIFY IDENTITY / INITIALIZE submit button
- REGISTER / SIGN IN toggle
- "BUILD ANYTHING. OWN EVERYTHING." tagline
- PROTOTYPE badge (top right)
- Full Supabase auth wired (signUp, signInWithPassword, callback redirect)
- Error/success message display

---

## API ROUTES

### /api/build (route.ts)
- Validates prompt with Zod schema
- Checks user tier + build limits (currently bypassed for dev with `if(false &&...)`)
- Calls Claude Sonnet (claude-sonnet-4-5) with SOVREND system prompt
- System prompt includes persona context (Operator/Architect/Oracle)
- Returns JSON: code, narration, appName, suggestions
- Saves app to Supabase `apps` table (insert or update)
- Saves journal entry to `journal` table (via service role client)
- Updates user build count + API cost tracking
- Cost tracking per build

### /api/enhance (route.ts)
- Auth check
- Calls Gemini 2.5 Flash Lite (gemini-2.5-flash-lite)
- Expands short prompts into detailed build descriptions
- Returns enhanced prompt
- Console logs model name for verification

---

## SUPABASE TABLES

- **users** — id, tier, builds_used, api_cost_this_month
- **apps** — id, user_id, name, description, persona, code, updated_at
- **journal** — id, user_id, app_id, entry_type (build/refine), title, narration, prompt, created_at (RLS disabled for dev)

---

## MIDDLEWARE (middleware.ts)

- Creates Supabase server client with cookie handling
- Protected routes: /dashboard, /build, /onboarding → redirect to /auth if no user
- Reverse redirect: /auth → /dashboard if user already signed in
- Matcher excludes static assets

---

## PRICING (LOCKED)

| Tier | Price | Builds | Refines | Key Features |
|------|-------|--------|---------|--------------|
| FREE | $0 | 1 Sonnet | 7 Gemini 2.5 Flash | Auto-Fix, deploy, code export, Cipher, $0.30 lifetime ceiling |
| BUILDER | $22/mo | 5 Sonnet | 20/build | Build Memory, custom domain, Opus for diagnostics, ~93% margin |
| ARCHITECT | $44/mo | 9 Opus | 20/build | 2 seats, custom domain, white-label, ~93% margin |

- Custom domains unlock at Builder ($22) and up
- Users buy their own domains, SOVREND handles DNS routing via Vercel

---

## DIFFERENTIATOR FEATURES (SPECCED, NOT YET BUILT)

### Build Score
- Visual readiness ring after every build completion
- Based on Claude's suggestions (what's missing)
- "Your app is 65% ready for real users"
- Zero API cost — uses existing response data

### Revenue Calculator
- Cipher asks post-build: "What would you charge?" + "How many customers?"
- Shows monthly/yearly projection
- Triggers follow-up: "Want me to add a pricing page?"
- Zero API cost — just math

### Explain Mode
- Toggle button in preview bar ("EXPLAIN")
- User taps any element in preview → tooltip explains what it does
- "Tell me more" sends full explanation to Cipher chat
- Powered by Gemini Flash Lite (~$0.0003 per explanation)

### Live App Intelligence
- Analytics snippet auto-injected into every deployed app
- Tracks page views initially, adds clicks/forms over time
- Cipher sends periodic digest (frequency user-chosen)
- Dashboard notification card at top (shares space with daily quote)
- Email digest as well
- Tone: data first, warm suggestion after
- One-click improvements from the card
- Gemini Flash Lite for analysis — near zero cost

### Origin Story
- Auto-generated from Build Journal data
- Private by default, user can make public
- Public URL: appname.sovrend.com/story
- Shareable timeline of how the app was built
- Free marketing every time shared
- Color treatment: TBD

### The Handoff
- Developer brief export — triggered when Build Score is high
- Cipher suggests it: "Your app is 85% ready. Want a developer handoff brief?"
- **Builder tier:** PDF with architecture diagram, page map, database schema, what's wired, what's not, next steps
- **Architect tier:** Everything Builder gets + interactive HTML report, clickable component tree, branded cover, pitch deck format, strategic recommendations
- Powered by Gemini Flash Lite

---

## WHAT NEEDS FIXING

1. **Publish button** — visible but does nothing. Needs at minimum a celebration + mock URL
2. **Build limit bypass** — `if(false &&...)` in build route needs re-enabling before launch
3. **Device toggle** (Desktop/Mobile/Tablet in preview bar) — not functional
4. **Auth page input focus** — turns yellow, should stay amber
5. **"All Projects" click** — no handler, nothing happens
6. **Starred / Recent** — sidebar items with no functionality
7. **Search (⌘K)** — not wired
8. **Share SOVREND / referral** — not wired
9. **Upgrade to Builder** — not wired to Stripe checkout
10. **SOVREN CODE auto-detection** — currently shows one hardcoded card, should detect terms in generated code

---

## NEXT SESSION PRIORITIES (in order)

### Session 4 — Differentiators:
1. Build Score ring component
2. Revenue Calculator (post-build Cipher flow)
3. Publish button flow (celebration + URL)

### Session 5 — Launch Gate:
4. Privacy Policy + Terms pages
5. Waitlist gate logic
6. Un-pause Vercel
7. Point sovrend.com → Vercel
8. Real deploy test end to end
9. Re-enable build limits

---

## SOCIAL ACCOUNTS

- Instagram: @sovrend (claimed with hello@sovrend.com)
- TikTok: not yet claimed
- X/Twitter: not yet claimed
- YouTube: not yet claimed

---

## STANDING PRINCIPLES

- Anthropic-first: Claude builds everything user-facing. Gemini handles background only.
- Cost saving without feeling cheap: quality where users see it, efficiency where they don't.
- One color per moment: cyan = building, amber = intelligence, yellow = history, white = transcendence.
- Every screen has its own cinematic identity: landing, auth (Blade Runner), dashboard (TRON Grid).
- The thought becomes the thing — this isn't just a tagline, it's the product philosophy baked into every feature.
