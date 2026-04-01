import { getReferenceComponent } from '@/lib/references'

export const REFERENCE_COMPONENTS: Record<number, string> = {

1: `// SAAS ANALYTICS DASHBOARD — Reference: Linear, Vercel, Mixpanel
// Dark navy #0f172a sidebar. White content. Indigo #6366f1 accent. Inter font.
// Shell: fixed sidebar 220px + scrollable main content. Stats row + chart + feed.
// Cards: bg rgba(255,255,255,0.04) border rgba(255,255,255,0.08) rounded-xl
// Numbers: tabular-nums JetBrains Mono. Never round: $24,819 not $25,000.
// MRR $24,819 users 1,284 churn 2.1% ARPU $19.33 — specific always
// Bar chart: bars animate left to right staggered 60ms intervals
// Activity feed: Sarah Chen upgraded Pro 2m, Marcos Rivera signup 14m
// Nav active state: bg rgba(99,102,241,0.15) text #818cf8 font-semibold`,

2: `// CLIENT PORTAL — Reference: HoneyBook, Dubsado, Bonsai, AND.CO
// White #ffffff. Teal #0d9488 accent. Plus Jakarta Sans. Warm professional.
// Shell: sidebar 230px bg-white border-r border-gray-100 + scrollable content
// Nav active: bg #f0fdfa color #0d9488 border-left 3px solid #0d9488
// Project cards: name client progress bar (73% not 75%) status badge deadline
// Invoice rows: INV-2024-0847 PAID green, SENT blue, OVERDUE red pulsing
// Mark as Paid: badge flips red to green with scale(1.1) animation — delight
// Stats: Active Projects 3, Billed $24,400, Outstanding $9,072, Avg 18 days`,

3: `// BOOKING SYSTEM — Reference: Calendly, Acuity, Cal.com, Square Appointments
// Pure white. Violet #7c3aed accent. Inter font. Calendar grid is the hero.
// Shell: centered max-w-4xl. Service selector left, calendar right.
// Calendar: 7-column grid, today highlighted violet, booked days have dot
// Available slots: pill buttons, selected = violet bg white text
// Time slots: 9:00am 9:30am 10:15am 11:00am 2:00pm 3:45pm 4:30pm
// Services: Strategy Session 60min $150, Quick Call 30min $75, Deep Dive 90min $225
// Confirmation checkmark draws itself stroke by stroke 400ms — delight`,

4: `// TASK MANAGER — Reference: Linear, Height, Asana, ClickUp
// White #ffffff. Indigo #6366f1 accent. Inter font. Issue rows not bloated cards.
// Shell: sidebar 240px + content with sections per status column
// Task rows: checkbox, title, priority badge color, assignee avatar, due date
// Priority: High = red badge, Medium = amber badge, Low = gray badge
// Overdue: amber left border 3px, pulse animation
// Checking subtask: 3-particle confetti burst from checkbox — delight
// Done column: strikethrough text, 8 completed this week count`,

5: `// E-COMMERCE — Reference: Allbirds, Away, Glossier, Warby Parker
// White #ffffff. Dark #111827 accent. Playfair Display + Inter. Product is hero.
// Shell: sticky nav, category filter, 3-column product grid, cart drawer right
// Product cards: gradient photo placeholder, name Playfair font, price mono
// Add to cart: thumbnail arcs from card to cart icon 300ms — delight
// Cart drawer: slides from right, item list, quantity controls, checkout CTA
// Category filter: minimal pill chips, not dropdown, filters live
// Product detail: large image, variants selector, add to bag button full width`,

6: `// CRM PIPELINE — Reference: HubSpot, Attio, Pipedrive, Close CRM
// White #ffffff. Orange #f97316 accent. DM Sans + JetBrains Mono. Deal focused.
// Shell: sidebar + pipeline kanban columns as main content
// Deal cards: company, contact, value LARGE mono font, probability bar, days in stage
// Columns: Lead Contacted Proposal Negotiation — Won section at end
// Total pipeline: $847,500 in header always visible
// Moving deal to Won: green flash + Deal Won $220,000 toast — delight
// Probability bar: green >70%, orange 40-70%, gray <40%`,

7: `// LANDING PAGE — Reference: Stripe, Linear, Resend, Vercel.com
// White #ffffff. Indigo #6366f1 accent. Plus Jakarta Sans 900 weight hero.
// Hero: radial gradient glow behind, badge pill, h1 large with gradient text
// Stats count up on scroll: 847K+ users $2.4M generated 12min avg 99.9% uptime
// Testimonials: real names real outcomes Marcus Rivera Sarah Kim James Thornton
// Pricing: 3 tiers, Pro Most Popular highlighted with border glow
// FAQ: smooth accordion height transition, 6 questions
// Email capture glows on focus, CTA shifts to accent — delight`,

8: `// HABIT TRACKER — Reference: Streaks, Done, Way of Life, Habitica
// Warm white #fafaf9. Orange #f97316 accent. Plus Jakarta Sans. Streak emotion.
// Shell: sidebar + today view with habit cards stacked
// Habit cards: circular checkbox, streak badge fire emoji, weekly dots Mon-Sun
// Progress ring: 3 of 5 today 60%, draws clockwise on mount
// Heatmap: GitHub contribution style 3 months below
// All 5 habits checked: Perfect Day toast with gold shimmer on rings — delight
// Best streak 34 days, this week 82%, total 847 completions`,

9: `// FITNESS TRACKER — Reference: Whoop, Strava, Fitbod, Nike Training Club
// Dark #111827. Orange #f97316 accent. Space Grotesk + JetBrains Mono. Energy.
// Shell: dark sidebar #0f172a + dark content #111827 + scrollable
// Recovery ring: SVG circle, percent text center, color by score (green/amber/red)
// Stats: Calories 1,847 | Active 47min | Streak 14 days fire | Volume 12,400lbs
// Exercise rows: name, 3x8 @185lbs, PR badge gold glow if new record
// Weekly bar chart: Mon-Sun bars, today orange highlighted
// PR badge scales in with gold pulse — moment of delight`,

10: `// BUDGET TRACKER — Reference: Monarch Money, Copilot, YNAB
// White #ffffff. Emerald #10b981 accent. Inter + JetBrains Mono. Data is hero.
// Shell: sidebar 220px bg-white border-r + scrollable content bg-gray-50
// Stats: Income $6,200 | Spent $4,847 | Remaining $1,353 — count up on mount
// Category bars: color dot + name + progress bar + spent/budget amounts
// Over budget: red bar, Over badge, exact overage amount shown
// Transactions: merchant icon, name, category, date, amount mono right-aligned
// Savings goals: 3 cards with progress bars and percentages
// Savings bar crossing 50% shifts blue to green — moment of delight`,

11: `// INVOICE GENERATOR — Reference: Bonsai, Wave, FreshBooks, Invoice Ninja
// White #ffffff. Indigo #6366f1 accent. Inter + JetBrains Mono. Two-panel layout.
// Shell: form left 50% + live preview right 50% updates on every keystroke
// Preview: professional document layout, line items table, total prominent
// Line items: Brand Strategy Workshop $2,800, Visual Identity $4,200, Guidelines $1,400
// Subtotal $8,400 Tax 8% $672 Total $9,072 — indigo large font
// Total section glows when all items filled — moment of delight
// Download PDF: loading spinner then success checkmark animation`,

12: `// RESTAURANT — Reference: Toast POS, ChowNow, Resy, Olo
// Warm #faf9f7. Red #dc2626 accent. Lora + Inter. Appetizing warm palette.
// Shell: sticky category tabs + product grid + cart drawer right
// Menu cards: gradient warm photo placeholder, name Lora font, price red
// Category tabs: All Starters Mains Sides Drinks Desserts — filters live
// Dietary tags: V green GF yellow — pill badges on each item
// First item added: cart icon bounces + drawer peeks 20px from right — delight
// Cart: items list, delivery/pickup toggle, tip selector, checkout button`,

13: `// REAL ESTATE — Reference: Zillow, Compass, Redfin, Realtor.com
// White #ffffff. Blue #1d4ed8 accent. Inter + JetBrains Mono. Trust and clarity.
// Shell: map placeholder left 45% + listings right 55% scrollable
// Listing cards: photo placeholder, price LARGE mono, address, beds/baths/sqft
// Price specific: $485,000 not $500,000 — $329,000 not $330,000
// Days badge: 5 days on market — green if <7 amber if <30 gray if older
// Save heart fills with pop animation — moment of delight
// Schedule Tour: calendar opens, slot highlights, confirmation slides up`,

14: `// JOB BOARD — Reference: LinkedIn Jobs, Wellfound, Lever, Greenhouse
// White #ffffff. Sky blue #0ea5e9 accent. Inter font. Opportunity forward.
// Shell: filter sidebar 260px + job list scrollable
// Job cards: company logo area, title, company, location, salary ALWAYS visible
// Salary: $120K-$150K not just listed — always prominent
// Apply button: loading brief then Applied green badge immediately — delight
// Filters: Full-time Remote Salary Level Date — all work live
// Job detail: slides from right, apply modal with resume upload`,

15: `// MEMBERSHIP — Reference: Memberstack, Patreon, Kajabi, Substack
// Dark #0f172a. Violet #a78bfa accent. Inter + JetBrains Mono. Premium feel.
// Shell: sidebar + content. Member card prominent at top.
// Member card: gradient dark purple, shimmer animation on mount — delight
// Member ID: ARC-2847-XKQP — specific always
// Benefits: builds 7/9 remaining with progress bar, seats 1/2, custom domain checkmark
// Billing: card ending 4242, Nov 1 $44 Paid, Oct 1 $44 Paid — download receipts
// Plan: Architect $44/month renews December 1 2025`,

16: `// PORTFOLIO — Reference: Awwwards winners, agency sites, Cargo Collective
// Cream #fafaf9. Dark #1c1917 text. Cormorant Garamond + DM Sans. Editorial.
// Shell: full viewport hero + asymmetric project grid + about + contact
// Project grid: mixed sizes — large 2x2 beside two 1x1 — curated not listed
// Hover: image darkens, title slides up from bottom, category fades in
// Case study: hero full width, process 3 steps, results with real metrics
// Contact: minimal name email project type message — no busy forms
// Scroll: smooth, sections reveal with stagger — editorial rhythm`,

17: `// COURSE PLATFORM — Reference: Teachable, Kajabi, Maven, Podia
// White #ffffff. Violet #7c3aed accent. Plus Jakarta Sans. Progress visible always.
// Shell: video player top + lesson detail below + curriculum sidebar right 280px
// Curriculum sidebar: sections expandable, lessons with checkmarks, current highlighted
// Progress bar: top of sidebar, percentage, draws on mount
// Lesson complete button: fires checkmark + XP animation + next lesson
// Final lesson: certificate slides up with gold shimmer + confetti — delight
// Font: Plus Jakarta Sans 800 weight headers`,

18: `// BLOG — Reference: Substack, Ghost, Medium, Bulletin
// White #ffffff. Near-black text #1c1917. Lora serif. Typography is everything.
// Shell: narrow content column max-w-2xl centered. Reading experience first.
// Reading progress: thin colored line at very top fills as user scrolls — delight
// Article list: Lora heading, excerpt 2 lines, author date read time views
// Article page: large Lora headline, generous line-height 1.8, drop shadows subtle
// Newsletter CTA inline between paragraphs — non-intrusive
// Category tags: pill badges, click filters list live`,

19: `// TEAM DIRECTORY — Reference: Notion team, Lattice, Rippling, Workday
// White #ffffff. Cyan #0891b2 accent. Inter font. Human warmth prominent.
// Shell: search + filter bar top + profile card grid below scrollable
// Profile cards: large avatar with initials gradient, name, role, dept badge, location
// Dept color coding: consistent per department across all cards
// Search: filters name role department skill live on keystroke
// Profile detail: slides from right — bio skills manager reports recent projects
// Org chart nodes pop with scale on expand — moment of delight`,

20: `// LINK IN BIO — Reference: Linktree, Beacons, Stan Store, Koji
// Dark #0f0f0f. Violet #a78bfa accent. Inter. Creator personality is design.
// Shell: centered column, avatar, name, bio, links stacked
// Link buttons: colored left border matching category — that IS the design
// Each button: icon + title + click count on right — feels curated not listed
// Avatar: large circular with subtle glow ring in accent color
// Analytics tab: 284 clicks today chart 7 days top link
// Theme switcher: 6 presets with live preview`,


21: `// MARKETPLACE — Reference: Depop, Vinted, eBay, Facebook Marketplace
// White #ffffff. Dark #111827 accent. Inter font. Trust signals everywhere.
// Shell: sidebar filters left 260px + listing grid right scrollable
// Listing cards: photo placeholder, condition badge, price large, seller rating stars
// Seller: avatar, name, rating 4.9 stars, sales count 247, verified badge
// Make Offer: slide-up panel with amount input + typically responds 2hrs badge — delight
// Filter: price range condition distance date — all live
// Save: heart fills with pop animation instantly`,

22: `// HEALTHCARE PORTAL — Reference: One Medical, MyChart, Oscar Health
// White #ffffff. Sky blue #0ea5e9. Inter font. Clinical but warm. Trust everything.
// Shell: sidebar nav + content. Clean. Nothing distracting from health data.
// Patient card: name DOB blood type insurance ID copay — all specific
// Vitals: weight 181lbs height 5ft11in BP 118/76 pulse 68 — real numbers
// Allergies: Penicillin Severe red badge, Shellfish Moderate amber badge
// Appointments: upcoming pulsing blue indicator, past history below
// All intake complete: You are all set screen with drawing checkmark — delight`,

23: `// WEDDING PLANNER — Reference: Zola, The Knot, Minted, Joy
// Warm cream #fdf8f0. Rose #be185d accent. Cormorant Garamond + DM Sans. Elegant.
// Shell: sidebar + content. Soft warm palette throughout. Nothing harsh.
// Countdown: 247 Days Until June 14th — large animated flip numbers
// Checklist: organized by timeline, checking fires strikethrough color flash
// Budget: category cards with spent vs budget bars — Venue $8,500 PAID green
// Guest list: 124 invited 89 confirmed 12 declined 23 pending — color coded
// Checklist hitting 50%: champagne bubbles rise from progress bar — delight`,

24: `// SHIFT SCHEDULING — Reference: Deputy, 7shifts, When I Work, Homebase
// White #ffffff. Teal #0891b2 accent. Inter font. Week grid is the hero.
// Shell: sidebar team list left + week grid right — each row = one employee
// Grid: Mon-Sun columns, shift blocks color-coded per employee
// Each employee has a distinct color applied consistently throughout
// Coverage warning: understaffed slot shows amber pulse overlay
// Overtime warning: employee row shows amber badge near name
// Publishing: wave animation sweeps left to right across full grid — delight`,

25: `// SOCIAL FEED — Reference: Twitter/X, Threads, Bluesky, Mastodon
// White #ffffff. Blue #1d4ed8 accent. Inter font. Avatar forward. Content is design.
// Shell: sidebar 260px + feed center + trending sidebar right 260px
// Compose box: avatar + textarea placeholder What are you building
// Post cards: avatar, name, handle, time, content, like comment share save
// Posts: real content — Marcos Rivera Crossed $10K MRR this morning 234 likes
// Like button: 5 small hearts scatter outward 400ms then settle — delight
// Trending: hashtags BuildingInPublic ShipIt IndieHacker clickable`,

26: `// PROJECT MANAGEMENT — Reference: Linear, Asana, Monday, Jira
// White #ffffff. Indigo #6366f1 accent. Inter font. Projects are the hero.
// Shell: sidebar + project cards grid + my work tab + timeline tab
// Project cards: name, status badge On Track green At Risk red Blocked amber
// Progress bars animate on mount, deadline countdown visible
// My work: tasks assigned to me across all projects today
// Timeline: Gantt bars horizontal across dates with milestones as diamonds
// Progress bar hitting 100%: brief fireworks burst — delight`,

27: `// NOTE TAKING — Reference: Notion, Obsidian, Bear, Craft
// Cream #fafaf9. Dark #1c1917 text. Lora + DM Sans. Writing is everything.
// Shell: note list left 260px + markdown editor center + info panel right
// Note list: title date word count favorite star — sorted by recent
// Editor: title editable, markdown body with formatting toolbar
// Markdown preview: headings render, bold renders, code syntax highlighted
// Search: instant results highlighting matching text yellow
// Focus mode: both panels hide, editor fills screen — moment of delight`,

28: `// TIME TRACKING — Reference: Toggl, Harvest, Clockify, RescueTime
// White #ffffff. Teal #0891b2 accent. Inter + JetBrains Mono. Timer is hero.
// Shell: sidebar + timer prominent at top + today entries + week chart
// Running timer: 01:24:37 ticking every second in JetBrains Mono large
// Project selector: Website Redesign — Acme Corp, billable toggle, rate $150/hr
// Today entries: rows with project, duration, billable amount
// Stopping timer: number snaps to final value with brief count-up — delight
// Week chart: daily hours bars, billable vs non-billable color coded`,

29: `// RESTAURANT MANAGEMENT — Reference: Toast POS, Square Restaurants, Aloha
// Dark #111827. Orange #f97316 accent. Inter font. Real-time operational feel.
// Shell: floor map tab + orders tab + menu tab + analytics tab
// Floor map: table positions as cards, occupied/available/reserved color coded
// Table card: number, party size, server name, time seated, check amount
// New order: relevant table card pulses green briefly — moment of delight
// Orders tab: active orders stream with status pipeline
// Analytics: $4,847 today 127 covers $38.17 avg revenue by hour chart`,

30: `// LMS CORPORATE — Reference: Docebo, Cornerstone, TalentLMS, Workday Learning
// White #ffffff. Violet #7c3aed accent. Plus Jakarta Sans. Achievement earned.
// Shell: sidebar + my learning tab + catalog + team progress + certificates
// Course cards: title, required badge, due date urgency color, progress bar
// Course player: module sidebar with checkmarks + video placeholder + quiz
// Completing module: checkmark fills with animation + XP increment
// Certificate earned: gold badge appears with radiant glow animation — delight
// Team leaderboard: completion percentages, overdue flagged red`,


31: `// EVENT PLATFORM — Reference: Eventbrite, Luma, Partiful, Lu.ma
// White #ffffff. Pink #db2777 accent. Inter font. Events are the hero.
// Shell: category filter tabs + event cards grid + my tickets tab
// Event cards: gradient photo placeholder, date badge, location, price, spots bar
// Ticket purchase: modal with billing, card input, confirm with loading state
// Digital ticket: styled with QR placeholder, event details, ticket number TKT-28471
// After purchase: digital ticket slides up from bottom — moment of delight
// Countdown: days until event shown on each card`,

32: `// INVENTORY — Reference: Fishbowl, Cin7, inFlow, Katana MRP
// White #ffffff. Dark #0f172a accent. Inter + JetBrains Mono. Table is hero.
// Shell: stats bar top + searchable filterable table + orders tab + reports
// Stats: 847 total items, 3 low stock amber, 1 critical red, value $124,800
// Table rows: SKU, name, stock count, min stock, status badge, location, cost, price
// Critical rows: red left border pulse, Low rows: amber badge
// Stock level: mini bar visualization per row showing fill level
// Receiving restock: row flashes green, warning badge disappears — delight`,

33: `// SUPPORT DESK — Reference: Zendesk, Intercom, Front, Linear
// White #ffffff. Indigo #6366f1 accent. Inter font. Queue is everything.
// Shell: inbox sidebar + ticket detail main + customer info right panel
// Inbox: ticket rows with priority badge, subject, customer, time, assignee
// Priority: Urgent red pulsing, High amber, Medium blue, Low gray
// Ticket detail: conversation thread, reply editor with formatting, status selector
// Customer sidebar: past tickets, plan, total spend, contact info
// Resolving ticket: checkmark animation + ticket slides out of queue — delight`,

34: `// FINANCIAL PLANNING — Reference: Betterment, Personal Capital, Wealthfront
// White #ffffff. Emerald #10b981 accent. Inter + JetBrains Mono. Numbers hero.
// Shell: sidebar + overview tab + investments + goals + reports
// Net worth: $284,700 counts up from 0 on mount — large mono font center
// Account cards: 401K Fidelity $142,800 +3.2%, Brokerage $68,400 +6.8%
// Allocation donut: Retirement 59% Investment 24% Cash 17% draws clockwise
// Goals: Home Down Payment $48,200 of $80,000 60.3% bar animates
// Net worth hitting milestone: brief count-through celebration — delight`,

35: `// SURVEY PLATFORM — Reference: Typeform, Tally, SurveyMonkey, Jotform
// White #ffffff. Indigo #6366f1 accent. Inter font. Results are the payoff.
// Shell: survey list tab + results dashboard tab + templates tab
// NPS gauge: semicircle animates to 72 score on mount — score specific never round
// Response count: increments with brief scale pulse on each new response — delight
// Multiple choice: Quality 68% bar, Price 24%, Support 8% — bars animate
// Rating distribution: 2/4/12/89/140 — specific always
// Survey list: 247 responses 67% completion rate — real numbers`,

36: `// SUBSCRIPTION BOX — Reference: FabFitFun, Birchbox, Ipsy, Cratejoy
// Warm cream #faf9f7. Amber #b45309 accent. Playfair Display + DM Sans. Gift feel.
// Shell: my box tab + upcoming tab + history + preferences + shop
// Upcoming box: November 2025 Artisan Collection with revealed and mystery items
// Mystery items: blurred with question marks — anticipation is the emotion
// Shipment tracking: Processing Packed Shipped Delivered steps
// Preferences update: live box preview updates to match taste — delight
// Past boxes: October September August as cards with full item reveal on click`,

37: `// PROPERTY MANAGEMENT — Reference: Buildium, AppFolio, Propertyware
// White #ffffff. Teal #0891b2 accent. Inter font. Properties are the hero.
// Shell: properties tab + tenants + maintenance + finances + leases
// Property cards: address, units, occupancy, monthly rent, payment status badge
// ALL PAID green, LATE red pulsing, PARTIAL amber — instantly clear
// Maintenance: open requests with priority, status pipeline, assign vendor
// Rent received: unit card briefly flashes green — moment of delight
// Stats: 8 units 87.5% occupancy $14,450 monthly $1,850 outstanding`,

38: `// MUSIC / PODCAST — Reference: Spotify web, Overcast, Pocket Casts, Castro
// Dark #0c0a09. Violet #a78bfa accent. Inter font. Audio atmosphere.
// Shell: sidebar + episode list + persistent player bar at bottom
// Player bar: episode title, waveform visualization, progress 14:32/42:18
// Playback controls: play/pause, skip ±30s, speed 1x/1.5x/2x, volume
// Episode list: number, title, duration, date, play count, play/download
// Play button pressed: album art subtly breathes with waveform — delight
// Waveform: animated bars that pulse with imagined audio rhythm`,

39: `// FREELANCER MARKETPLACE — Reference: Contra, Toptal, Fiverr Pro, Upwork
// White #ffffff. Sky blue #0ea5e9 accent. Inter font. Trust signals everywhere.
// Shell: category filter + freelancer card grid + profile detail slide
// Freelancer cards: photo placeholder, name, title, rate $/hr, rating stars, jobs count
// Available now: green pulse badge — urgency without pressure
// Trust signals: verified badge, response time typically 2 hours, review count
// Hire modal: project description, budget, timeline, send inquiry button
// Sending inquiry shows response time badge immediately — delight`,

40: `// NONPROFIT / VOLUNTEER — Reference: Galaxy Digital, VolunteerMatch, InitLive
// White #ffffff. Green #16a34a accent. Plus Jakarta Sans. Impact is the hero.
// Shell: impact dashboard tab + opportunities + volunteers + donations + impact
// Impact counters: 12,847 Meals 234 Families 847 Volunteers — all count up mount
// Opportunity cards: title, date, time, location, spots remaining bar
// 1 spot left: amber urgent badge pulsing — creates appropriate urgency
// Donation: amount selector $25/$50/$100/$250, one-time/monthly toggle
// After donation: Your $50 provides 10 meals animated reveal — delight`,


41: `// SOCIAL MEDIA SCHEDULER — Reference: Buffer, Later, Sprout Social, Hootsuite
// White #ffffff. Indigo #6366f1 accent. Inter font. Calendar is the hero.
// Shell: calendar tab + queue tab + compose tab + analytics tab
// Calendar: monthly grid, colored dots per platform Twitter blue LinkedIn blue Instagram pink TikTok teal
// Queue: posts listed chronologically with platform badge, content preview, time, status
// Compose: write area with character counter per platform, platform toggles, schedule picker
// Scheduled post going live: calendar cell briefly flashes send animation — delight
// Analytics: reach 124K engagement 4.8% best time heatmap followers growth`,

42: `// RECRUITMENT ATS — Reference: Lever, Greenhouse, Ashby, Workable
// White #ffffff. Teal #0891b2 accent. Inter font. Pipeline is everything.
// Shell: pipeline kanban + candidates tab + jobs tab + analytics
// Pipeline columns: Applied Screening Interview Offer — with candidate cards
// Candidate cards: photo placeholder, name, role, applied date, match score badge
// Score: color coded green 90+ amber 70-89 red below 70 — specific numbers
// Candidate detail: slides from right, resume summary, interview notes, stage mover
// Moving to Hired: celebration animation + congratulations toast fires — delight`,

43: `// KNOWLEDGE BASE — Reference: Notion, GitBook, Confluence, Archbee
// Cream #fafaf9. Dark #1c1917 text. Inter font. Search is the hero.
// Shell: search bar prominent top + section cards + article view
// Search: instant results appear as you type, grouped by section
// Article view: breadcrumb, title, updated date, reading time, table of contents sidebar
// Table of contents: sticky, highlights current section as you scroll
// Code blocks: syntax highlighted with copy button
// Search result click: matching term highlights yellow as article slides in — delight
// Article ratings: thumbs up/down, helpful percentage shown`,

44: `// MEAL PLANNING — Reference: Yummly, Mealime, Paprika, Plan to Eat
// Warm cream #faf9f7. Orange #ea580c accent. Lora + DM Sans. Appetizing warm.
// Shell: week grid tab + recipes tab + grocery list tab + nutrition tab
// Week grid: 7 columns Mon-Sun, 3 rows Breakfast Lunch Dinner — all pre-filled
// Recipe cards: warm photo gradient, name Lora font, time calories difficulty tags
// Grocery list: auto-generated from week plan, sorted by Produce Meat Dairy Pantry
// Adding 7th day: grocery list items appear one by one reveal animation — delight
// Nutrition: weekly averages vs goals, macros chart, calorie trend line`,

45: `// PITCH DECK BUILDER — Reference: Beautiful.ai, Pitch, Tome, Gamma
// Dark #0f172a. Amber #f59e0b accent. Inter font. Slides are the hero.
// Shell: slide thumbnails list left + canvas center + style panel right
// Slides: Problem complete, Solution complete, Market complete, Product in progress, Team empty
// Empty slides: red exclamation badge — urgency to complete
// Deck strength ring: 64% amber, animates to final score — specific never round
// AI assist button: suggests content for current slide
// All 9 slides complete: ring animates to final score with celebration — delight`,

46: `// FLEET MANAGEMENT — Reference: Samsara, Verizon Connect, Fleetio, Azuga
// Dark #111827. Sky blue #0ea5e9 accent. Inter font. Map is the hero.
// Shell: live map tab + vehicles tab + drivers tab + deliveries tab + reports
// Map: dark placeholder with vehicle markers in different states
// Vehicle cards: ID, type, driver, status ON ROUTE green IDLE gray DELIVERING blue
// Fuel gauge: animates to fill level on mount for each vehicle
// Alert banner: VH-1204 maintenance due Medium amber — immediately visible
// Vehicle completing delivery: map marker flashes green briefly — delight
// Stats: 2 active 1 idle 14 deliveries today 92% on time`,

47: `// LANGUAGE LEARNING — Reference: Duolingo web, Babbel, Pimsleur, Busuu
// White #ffffff. Green #16a34a accent. Plus Jakarta Sans. Streak is emotional.
// Shell: sidebar + lesson area center + leaderboard right 240px
// Lesson: translation exercise with text input, multiple choice with 4 options
// Correct answer: green flash + XP bar fills + count increments — satisfying
// Wrong answer: red shake animation + try again — forgiving not punishing
// Streak counter: 21-day flame, increments with flame grow animation — delight
// Leaderboard: Sarah Chen 4,847 XP, Jordan Davis 3,291 XP, Marcos 2,847 XP`,

48: `// MEDITATION / WELLNESS — Reference: Calm, Headspace, Insight Timer, Ten Percent
// Deep indigo #1e1b4b. Lavender #a78bfa accent. DM Sans gentle font. Calm.
// Shell: home tab + meditate tab + breathe tab + sleep tab + journal tab
// Breathing circle: large SVG circle expands inhale 4s holds 4s contracts exhale 4s
// Circle breathes in perfect biological rhythm — alive and responsive — delight
// Session cards: Morning Calm 10min Guided, Focus Flow 15min, Body Scan 20min
// Ambient sounds: Rain Forest Silence — toggle during session
// Mood tracker: 5 emoji selectors, week history shown as emoji row`,

49: `// CODE REVIEW — Reference: GitHub, GitLab, Linear, Codecov, Qodo
// Dark #0d1117. Blue #3b82f6 accent. Inter + JetBrains Mono. Developer precision.
// Shell: dashboard tab + pull requests tab + quality tab + team tab
// PR rows: title, author, repo, status READY green CHANGES REQUESTED amber DRAFT gray
// PR detail: file list, diff view green additions red deletions, review comments
// Code diff: JetBrains Mono font, line numbers, syntax colors appropriate
// Merge button: branch folding into main line animation — moment of delight
// Quality score: 87/100 ring, coverage 94% bar, debt 2.4 hours, 3 issues list`,

50: `// INTERIOR DESIGN — Reference: Houzz, Havenly, Modsy, Planner 5D
// Warm cream #fafaf9. Gold #8b6914 accent. Cormorant Garamond + DM Sans. Premium.
// Shell: my rooms tab + design canvas tab + mood board tab + shop tab
// Room canvas: top-down grid, furniture as labeled draggable rectangles
// Style selector: Modern Minimalist Scandinavian Industrial Bohemian Mid-Century
// Furniture library: searchable, filter by type, items show name price brand dimensions
// Mood board: Pinterest-style grid, add images, organize by room
// Room layout complete: before empty and after furnished side-by-side reveal — delight`,

}

export function getReferenceComponent(blueprintId: number): string {
  const ref = REFERENCE_COMPONENTS[blueprintId]
  if (!ref) return ''
  return `
REFERENCE COMPONENT — QUALITY STANDARD FOR THIS BUILD:
${ref}

This is the exact quality level required. Match or exceed it.
Study the layout pattern, color system, font choices, data specificity, and interaction model.
Build at this level. Every tab complete. Every number specific. Every interaction alive.
`
}
