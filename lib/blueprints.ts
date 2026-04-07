import { getReferenceComponent } from '@/lib/references'
export interface Blueprint {
  id: number
  name: string
  triggers: string[]
  who: string
  action: string
  feeling: string
  visual: string
  delight: string
  appName: string
  tabs: string[]
  brief: string
}

export const BLUEPRINTS: Blueprint[] = [
{
  id: 1,
  name: 'SaaS Analytics Dashboard',
  triggers: ['dashboard','analytics','saas','mrr','churn','revenue tracking','metrics','kpi','business dashboard','startup dashboard','growth metrics'],
  who: 'A founder or operator checking business health every morning. Slightly anxious, hoping the numbers tell a good story.',
  action: 'Understand at a glance whether the business is growing or bleeding.',
  feeling: 'Confidence. Everything is accounted for. The data is alive.',
  visual: 'Dark slate surface. Metric cards with health colors — green growth, amber caution, red churn. Mono font for all numbers. Clean grid layout.',
  delight: 'Revenue chart line draws itself in from left — when it reaches the current month it pulses once with a glow before settling.',
  appName: 'MetricsPro',
  tabs: ['Overview','Revenue','Users','Settings'],
  brief: `Build MetricsPro — a fully alive SaaS analytics dashboard. OVERVIEW TAB: greeting "Good morning, Jordan" with subline about best month. Four KPI cards — MRR $24,819 (↑18.4%), Active Users 1,284 (↑7.2%), Churn Rate 2.1% (↓0.4%), ARPU $19.33 (↑$2.10). All numbers count up from 0 on mount over 800ms. Bar chart showing 8 months of revenue with labels Mar through Oct — bars stagger in left to right, last bar highlighted, click each bar for toast with exact revenue. Activity feed: Sarah Chen upgraded to Pro 2m, Marcos Rivera new signup 14m, Payment $264 received 1h, Monthly report exported 3h — each item clickable. REVENUE TAB: monthly/annual toggle switches between $24,819 and $247,431. SVG line chart with orange stroke and gradient fill. Transaction table: Acme Corp Team $264 Oct 28, Sarah Chen Pro $20 Oct 27, Marcos Rivera Pro $20 Oct 26, Priya Nair Free $0 Oct 25, DataFlow Team $264 Oct 22. USERS TAB: 1,284 total. Search filters all 6 users live. User rows: Sarah Chen purple Pro Active, Marcos Rivera teal Free Trial, Priya Nair green Pro Active, James Thornton amber Team Active, Aisha Okonkwo orange Free Inactive, David Park blue Pro Active. SETTINGS TAB: 5 nav items — Profile (Jordan Davis, jordan@metricspro.io), Billing (Pro $20/month card 4242), Notifications (4 toggles), Security (password + 2FA), Integrations (GitHub/Stripe/Supabase connected, PostHog connect). MOMENT OF DELIGHT: revenue chart line draws and pulses with orange glow at final data point.`
},
{
  id: 2,
  name: 'Client Portal',
  triggers: ['client portal','freelancer','project tracking','client management','invoice clients','client dashboard','agency portal','contractor portal'],
  who: 'A freelancer or small agency tired of chasing clients over email.',
  action: 'Give clients a single place to see everything.',
  feeling: 'Relief. This is what professional looks like.',
  visual: 'Clean light mode. Warm whites. Professional but personal. Terracotta or teal as accent.',
  delight: 'Clicking Mark as Paid flips OVERDUE badge to PAID with a scale pulse and green flash.',
  appName: 'StudioHQ',
  tabs: ['Dashboard','Projects','Invoices','Messages','Files'],
  brief: `Build StudioHQ — a professional client portal. DASHBOARD: 4 stat cards — Active Projects 3, Total Billed $24,400, Outstanding $9,072, Avg Payment Time 18 days. PROJECTS TAB: 3 project cards — Acme Corp Brand Identity 73% Active Nov 15, Northlight Studio Web Redesign 45% Review Nov 30, DataFlow Systems App Design 100% Complete Oct 31. Progress bars animate on mount. INVOICES TAB: INV-2024-0847 Acme Corp $12,400 PAID green, INV-2024-0851 Northlight $4,200 SENT blue, INV-2024-0855 DataFlow $8,800 OVERDUE red pulsing. Click any invoice opens detail with line items: Brand Strategy Workshop $2,800, Visual Identity System $4,200, Brand Guidelines $1,400. Subtotal $8,400, Tax $672, Total $9,072. Mark as Paid button on OVERDUE. MESSAGES TAB: threaded conversations per client with real content, read receipts, timestamps. FILES TAB: grid of files with type icons, names, sizes, download buttons. MOMENT OF DELIGHT: clicking Mark as Paid flips badge from red OVERDUE to green PAID with scale pulse.`
},
{
  id: 3,
  name: 'Booking System',
  triggers: ['booking','scheduling','appointments','calendar availability','reserve a time','appointment system','book a session','consultation booking','scheduling app'],
  who: 'A service provider and their clients. Provider wants zero back-and-forth.',
  action: 'Pick a date, pick a time, confirm. Done.',
  feeling: 'Easy. This is simpler than I expected.',
  visual: 'Clean calendar. Available slots in green, booked in muted gray. Warm background.',
  delight: 'Confirmation checkmark draws itself stroke by stroke over 400ms then booking ID fades in beneath.',
  appName: 'ScheduleFlow',
  tabs: ['Calendar','Book Now','My Appointments','Admin'],
  brief: `Build ScheduleFlow — a booking and scheduling system. CALENDAR TAB: monthly grid for November 2025, today highlighted, days 4/6/8/10/12/15 have booking dots. Click a day shows time slots: 9:00am, 9:30am, 10:15am, 11:00am, 2:00pm, 3:45pm, 4:30pm — each clickable, selected highlights. BOOKING FORM: service dropdown (Strategy Session 60min $150, Quick Call 30min $75, Deep Dive 90min $225), name, email, phone, message, price auto-shown, Book Now button. CONFIRMATION: booking ID BK-2847-XK, service, date/time, provider Jordan Davis Business Strategy Coach, add to calendar button, email note. ADMIN TAB: today's 3 appointments — Sarah Chen 9:00am Strategy, Marcus Rivera 2:30pm Design Review, Priya Nair 4:00pm Quick Call. Stats: 47 bookings this month, $6,825 revenue, 3 today, 2.1% cancellation. MOMENT OF DELIGHT: confirmation checkmark draws itself stroke by stroke over 400ms then booking ID fades in below.`
},
{
  id: 4,
  name: 'Task Manager',
  triggers: ['task manager','trello','kanban','project board','to-do','task tracking','project management','todo app','task board','work management'],
  who: 'A solo founder or small team. Things are falling through the cracks.',
  action: 'Move a task from To Do to Done and feel progress.',
  feeling: 'Clarity. I can see everything. I know what to do next.',
  visual: 'Dark or medium tone. Columns clearly delineated. Cards have weight. Priority colors immediate.',
  delight: 'Checking a task complete triggers a brief 3-particle confetti burst from the checkbox.',
  appName: 'TaskFlow',
  tabs: ['Board','List','My Tasks','Settings'],
  brief: `Build TaskFlow — a fully functional kanban task manager. BOARD VIEW: 4 columns — Backlog, In Progress, Review, Done. In Progress: Redesign onboarding flow (High, Jordan, Nov 8, design tag), Fix payment webhook (High, Marcus, Nov 7, bug tag, OVERDUE amber left border pulsing). Review: User interview Acme Corp (High, Jordan, Nov 9), Deploy v2.1 (High, Marcus, Nov 10). Backlog: Write API docs (Medium, Sarah, Nov 12), Setup analytics (Low, Priya, Nov 15). Done column shows 8 completed this week with strikethrough. TASK DETAIL: slides from right — description, 3 subtasks with checkboxes, comment thread, activity log, due date, assignee selector. LIST VIEW: same tasks in sortable table. FILTERS: by assignee, priority, due date, tag — all functional. STATS HEADER: 14 total, 1 overdue, 8 completed this week, velocity up 23%. MOMENT OF DELIGHT: checking subtask complete fires 3-particle confetti burst from the checkbox.`
},
{
  id: 5,
  name: 'E-Commerce Store',
  triggers: ['online store','e-commerce','ecommerce','shop','products','sell online','shopping cart','stripe checkout','product listings','buy online','retail'],
  who: 'A maker or small business with something real to sell.',
  action: 'Browse, find the right product, buy with confidence.',
  feeling: 'This brand has taste. I want to look around.',
  visual: 'Product photography forward. Clean white canvas. Products are the hero. Cart always accessible.',
  delight: 'Add to cart fires a tiny product thumbnail that arcs from the card to the cart icon over 300ms.',
  appName: 'Meridian Shop',
  tabs: ['Shop','Product Detail','Cart','Checkout','Orders'],
  brief: `Build Meridian Shop — a premium e-commerce store. SHOP PAGE: category filter tabs (All, Home, Travel, Kitchen, Office, Accessories), 3-column product grid. Products: Meridian Leather Wallet $89 4.8★ 247 reviews, Canvas Weekender Bag $185 4.6★ 189 reviews, Copper Pour-Over Set $124 4.9★ 312 reviews, Wool Throw Blanket $167 4.7★ 156 reviews, Ceramic Mug Set $68 4.5★ 423 reviews, Bamboo Desk Organizer $94 4.8★ 198 reviews. Filter by category works live. PRODUCT DETAIL: image area, name, price, description, variant selector, quantity picker 1-10, Add to Cart button, shipping estimate, 3 reviews. CART DRAWER: slides from right, 2 items (Leather Wallet $89 + Canvas Bag $185), quantity controls, remove button, subtotal $274, free shipping badge, Checkout button. CHECKOUT: shipping form, payment card input Stripe style, order summary, Place Order button. ORDER CONFIRMATION: order ORD-28471, estimated delivery Nov 12-14, item list. MOMENT OF DELIGHT: add to cart fires tiny thumbnail that arcs from card to cart icon over 300ms.`
},
{
  id: 6,
  name: 'CRM Pipeline',
  triggers: ['crm','sales pipeline','deal tracking','leads','contacts','sales funnel','customer relationship','pipeline','sales crm','deal management'],
  who: 'A sales person or founder doing sales. Deals in various stages, needs focus.',
  action: 'See the pipeline, know what needs action, move a deal forward.',
  feeling: 'I know exactly where everything stands.',
  visual: 'Clean, business-like. Pipeline columns are the hero. Deal value always visible.',
  delight: 'Moving a deal to Won triggers green flash and Deal Won toast with the value.',
  appName: 'PipelineHQ',
  tabs: ['Pipeline','Contacts','Activity','Forecast','Settings'],
  brief: `Build PipelineHQ — a fully functional sales CRM. PIPELINE TAB: 4 columns — Lead, Contacted, Proposal, Negotiation plus Won section. Total $847,500 in header. DEAL CARDS: company name, contact, value in large mono font, probability %, days in stage, progress bar. Deals: NovaTech (Lead, Tom Reyes, $48,000, 10%), Acme Industries (Contacted, Brian Lee, $180,000, 25%), DataFlow Corp (Proposal, Maya Patel, $84,000, 55%), Vertex Systems (Negotiation, Jennifer Walsh, $220,000, 85% — progress bar glowing). Won: Meridian Group $315,500 Sarah Kim last week. DEAL DETAIL: slides from right — contact info, deal history timeline, notes editor, next action, stage mover. CONTACTS TAB: sortable table with avatar, name, company, title, email, last contacted, deal count. ACTIVITY TAB: chronological feed of all interactions. FORECAST TAB: this month $187,000 expected vs $142,000 actual, pipeline by stage bars. MOMENT OF DELIGHT: moving to Won fires green flash and Deal Won toast with value.`
},
{
  id: 7,
  name: 'Landing Page',
  triggers: ['landing page','marketing site','startup page','waitlist','coming soon','homepage','product page','saas homepage','launch page','startup website'],
  who: 'A founder about to launch needing people to sign up.',
  action: 'Sign up for the waitlist or start a trial.',
  feeling: 'This is something I have been waiting for.',
  visual: 'Bold hero. One dominant accent color. Social proof prominent. CTA impossible to miss.',
  delight: 'Email capture field glows on focus, CTA button shifts to accent color.',
  appName: 'Derive name from prompt',
  tabs: ['Home','Features','Pricing','About'],
  brief: `Build a high-converting landing page for the product described. NAVIGATION: sticky on scroll, logo, nav links, sign in, CTA right. HERO: large bold headline specific to this product benefit, subheadline, email input + CTA button, social proof "847 people already building", product screenshot placeholder. STATS BAR: 4 metrics counting up on scroll — 847K Users, $2.4M Generated, 12 min Avg Build, 99.8% Uptime. FEATURES: 6 cards 3-column, icon, title, description specific to the product. HOW IT WORKS: 3 numbered steps with connecting line — Describe, Build, Deploy. TESTIMONIALS: Marcus Rivera Founder ScheduleFlow, Sarah Kim Co-founder Clade, James Thornton Freelance Developer — with specific outcome quotes. PRICING: Free $0, Pro $29 Most Popular highlighted, Team $79. Feature lists. FAQ: 6 questions with smooth accordion. FINAL CTA: full-width dark section, email capture. FOOTER: 4 column links. MOMENT OF DELIGHT: email capture glows on focus and CTA shifts from gray to accent color.`
},
{
  id: 8,
  name: 'Habit Tracker',
  triggers: ['habit tracker','daily habits','streak','routine tracker','consistency','habit building','habit app','daily tracker','streak tracker'],
  who: 'Someone trying to build a better version of themselves. Needs to feel progress.',
  action: 'Mark today\'s habits complete and see the streak grow.',
  feeling: 'I can do this. The progress is already visible.',
  visual: 'Warm and motivating. Progress rings and streaks are the visual language.',
  delight: 'Completing all habits fires a Perfect Day toast with gold shimmer across completion rings.',
  appName: 'StreakOS',
  tabs: ['Today','Habits','Stats','Settings'],
  brief: `Build StreakOS — a motivating habit tracker. TODAY TAB: greeting with date, completion ring 60% "3 of 5 complete today". HABIT LIST: Morning Run 14-day streak orange checked, Meditation 7-day purple checked, Read 30min 21-day blue checked, Drink Water 3-day cyan unchecked, No Phone 9am 5-day green unchecked. Each card: icon, name, streak badge, today checkbox, weekly completion dots. Clicking unchecked marks complete with animation. HABITS TAB: add habit form (name, icon, category, frequency, color, reminder). Edit and delete. STATS TAB: leaderboard, heatmap 3 months GitHub style, weekly bar chart, personal records. Best streak 34 days Reading. This week 82%. Total 847 completions. MOMENT OF DELIGHT: all 5 habits checked fires Perfect Day toast with gold shimmer sweeping across all rings simultaneously.`
},
{
  id: 9,
  name: 'Fitness Tracker',
  triggers: ['fitness tracker','workout log','exercise app','gym tracker','fitness app','workout tracker','personal training','training log','workout app','exercise tracker'],
  who: 'Someone serious about training. Tracks everything because what gets measured gets improved.',
  action: 'Log a workout and see how it compares to last week.',
  feeling: 'This feels like a tool built for someone serious.',
  visual: 'Dark mode. High contrast. Orange or electric blue accents. Mono font for all numbers.',
  delight: 'When a personal record is set, the exercise row flashes gold and NEW PR badge scales in with pulse.',
  appName: 'FitFlow',
  tabs: ['Dashboard','Log Workout','Progress','Library','PRs'],
  brief: `Build FitFlow — a serious dark-mode fitness tracker. DASHBOARD: date greeting "Thursday Nov 7 — Jordan's Dashboard". Large progress ring 76% orange. Stats: Calories 1,847, Active Minutes 47, Streak 14 days fire emoji. Workouts: Morning Run 32min 284cal orange, Upper Body Lift 48min 390cal purple. Weekly volume chart Mon 12,400lbs Wed 9,800lbs Fri 11,200lbs. LOG WORKOUT TAB: exercise list with inputs. Bench Press 3×8 @185lbs with gold PR badge, Shoulder Press 3×10 @95lbs, Lat Pulldown 3×12 @140lbs, Barbell Row 3×8 @155lbs. Add exercise button. Total volume calculated. PROGRESS TAB: body weight chart 187lbs to 181lbs over 12 weeks drawing in. Workout frequency heatmap. Volume per muscle group bars. LIBRARY TAB: searchable exercise database with muscle group filters. PRs TAB: Bench Press 185lbs Nov 7 today highlighted gold, Squat 225lbs Oct 28, Deadlift 275lbs Oct 15. MOMENT OF DELIGHT: PR badge scales in with gold pulse and row briefly flashes gold background.`
},
{
  id: 10,
  name: 'Budget Tracker',
  triggers: ['budget','expense tracker','personal finance','money tracker','spending tracker','savings tracker','financial dashboard','budget app','finance tracker','expense app'],
  who: 'Someone who knows they spend too much on something but does not know what.',
  action: 'See where the money went and feel in control.',
  feeling: 'Clarity without judgment. I can see everything and know what to do.',
  visual: 'Clean, trustworthy. Green for under budget, amber for approaching, red for over.',
  delight: 'Savings bar crossing 50% shifts from blue to green with a brief glow.',
  appName: 'ClearBudget',
  tabs: ['Overview','Transactions','Budget','Savings','Reports'],
  brief: `Build ClearBudget — a personal finance tracker. OVERVIEW TAB: 4 summary cards — Income $6,200, Spent $4,847, Remaining $1,353, Savings Rate 21.8%. Donut chart with 8 categories drawing clockwise — Housing $1,800, Food $680, Transport $340, Entertainment $420 over budget red, Shopping $890 over budget red, Subscriptions $187, Health $280, Other $250. TRANSACTIONS TAB: Whole Foods -$127.43 Food Nov 7, Netflix -$15.99 Nov 6, Shell -$68.20 Nov 5, Amazon -$94.17 Nov 4, Spotify -$9.99 Nov 3, Salary +$6,200 Nov 1 green. Add transaction form. BUDGET TAB: per-category budget vs actual with progress bars. Over-budget categories show red warning. SAVINGS TAB: Emergency Fund $8,000 target, $5,240 saved 65.5%, $2,760 remaining, $92/week needed. Progress bar. MOMENT OF DELIGHT: savings bar crossing 50% animates from blue to green with glow.`
},
{
  id: 11,
  name: 'Invoice Generator',
  triggers: ['invoice','invoicing','billing','send invoice','invoice generator','freelance billing','invoice pdf','create invoice','billing software','invoice maker'],
  who: 'A freelancer or small business owner who hates admin. Just wants to get paid.',
  action: 'Create a professional invoice and send it in 60 seconds.',
  feeling: 'This is fast and it looks good. My clients will respect this.',
  visual: 'Two-panel layout. Form left, live preview right. Professional typography.',
  delight: 'When all line items are filled, the preview total section briefly glows drawing the eye.',
  appName: 'InvoiceKit',
  tabs: ['New Invoice','Invoices','Clients','Settings'],
  brief: `Build InvoiceKit — a professional invoice generator with live preview. TWO-PANEL LAYOUT: form left, styled invoice preview right updating in real-time. FORM LEFT: Business (Studio Vantage, Creative Direction, hello@studiovantage.co), Client (Northlight Media, jennifer@northlight.co), Invoice INV-2024-0847, date today, due 30 days. Line items: Brand Strategy Workshop 1×$2,800, Visual Identity System 1×$4,200, Brand Guidelines 1×$1,400. Add line item button. Tax 8%. PREVIEW RIGHT: professional document layout, line items table, subtotal $8,400, Tax $672, Total $9,072 in large font. Actions: Download PDF (loading then success), Send Email, Save Draft, Mark Paid. INVOICES TAB: INV-2024-0847 Northlight $9,072 SENT, INV-2024-0841 Acme $12,400 PAID, INV-2024-0836 DataFlow $4,800 PAID, INV-2024-0829 NovaTech $6,200 OVERDUE red. YTD $47,200. MOMENT OF DELIGHT: total section glows orange when all line items are filled.`
},
{
  id: 12,
  name: 'Restaurant Food Ordering',
  triggers: ['restaurant','menu','food ordering','online ordering','food app','cafe','delivery','takeout','food delivery','restaurant app','order food'],
  who: 'A restaurant owner and their hungry customers.',
  action: 'Browse menu, add items, check out in under 3 minutes.',
  feeling: 'I am already hungry just looking at this.',
  visual: 'Rich warm colors. Category tabs prominent. Cart always accessible.',
  delight: 'Adding first item reveals cart drawer peeking 20px from the right with a bounce.',
  appName: 'Casa Verde',
  tabs: ['Menu','Cart','Orders','Admin'],
  brief: `Build Casa Verde — Modern Mexican Kitchen online ordering. MENU PAGE: restaurant header, rating 4.8 stars 1247 reviews, hours 11am-10pm. Category tabs (All, Starters, Mains, Sides, Drinks, Desserts). Items: Guacamole Chips $12 V GF, Street Tacos 3pc $16 GF, Carne Asada Bowl $22 GF, Birria Quesadilla $18, Elote Corn $9 V, Churros $9 V, Horchata $5 V, Margarita $14 GF. Each card: photo placeholder, name, price, dietary tags, calories, Add button with quantity control. Item modal on click with customization. CART DRAWER: slides from right — 3 items (Street Tacos $16, Carne Asada Bowl $22, Horchata $5), subtotal $43, delivery/pickup toggle, tip selector, checkout button. CHECKOUT: address or pickup time, name, phone, payment, order summary. CONFIRMATION: order CV-2847, ready 25-35 minutes. ADMIN TAB: today 47 orders $1,840 revenue, order status stream. MOMENT OF DELIGHT: first item added causes cart to bounce and drawer peeks 20px from right edge.`
},
{
  id: 13,
  name: 'Real Estate Listings',
  triggers: ['real estate','property listings','homes for sale','rental listings','property search','real estate app','house listings','mls','property finder','home search'],
  who: 'A home buyer or renter, or a real estate agent managing listings.',
  action: 'Find the right property, schedule a tour.',
  feeling: 'There is something here. Let me look closer.',
  visual: 'Photography forward. Map on one side. Price prominent. Details feel thorough.',
  delight: 'Clicking Schedule Tour opens calendar with slots — selected slot highlights and confirmation slides up.',
  appName: 'EstateView',
  tabs: ['Search','Map View','Saved','Agent Dashboard'],
  brief: `Build EstateView — a real estate listings platform. SEARCH PAGE: filter bar (location, price $200K-$800K, beds, baths, type). 4 listing cards: 2847 Maple Grove Dr $485,000 4bd/3ba 2240sqft 5 days, 1204 Lakeview Terrace $329,000 3bd/2ba 1680sqft 12 days, 891 Sunset Canyon $712,000 5bd/4ba 3100sqft 2 days, 445 Oak Street 3B $285,000 2bd/1ba 980sqft 21 days. Each: photo placeholder, price large, address, beds/baths/sqft, days badge, heart save. LISTING DETAIL: gallery 4 photos, price, stats, description, features (hardwood, granite, 2-car garage), school ratings 8/10, Walk Score 78, Crime Low. Agent card: Jordan Davis Keller Williams (512) 847-2934, Schedule Tour button. Mortgage calculator prefilled. MAP VIEW: dark map placeholder with 4 pins, clicking shows listing popup. SAVED TAB: hearted listings. MOMENT OF DELIGHT: Schedule Tour opens calendar, selecting time slides up confirmation card.`
},
{
  id: 14,
  name: 'Job Board',
  triggers: ['job board','job listings','career page','hiring platform','recruitment','job postings','apply for jobs','job search','employment','careers page'],
  who: 'Job seekers hoping to find the right fit, and companies wanting the right candidates.',
  action: 'Find a job that fits, apply in minutes.',
  feeling: 'There are real opportunities here. One of these could be it.',
  visual: 'Professional but not corporate. Company logos prominent. Salary visible. Remote status clear.',
  delight: 'After applying, the job card immediately shows a green Applied badge.',
  appName: 'HireFlow',
  tabs: ['Browse Jobs','My Applications','Saved Jobs','Post a Job'],
  brief: `Build HireFlow — a job board platform. BROWSE JOBS: search + filter chips (Full-time, Remote, Salary range, Experience). 5 job cards: Senior Product Designer Meridian Labs $120K-$150K Remote 2 days, Full Stack Engineer DataFlow $140K-$175K SF/Remote 1 day, Head of Marketing NovaTech $130K-$160K Austin 5 days, Customer Success Vertex $75K-$95K Remote 3 days, Data Analyst Acme $90K-$115K New York 7 days. Each: company initials logo, role, salary always visible, remote badge, apply button, save bookmark. JOB DETAIL: company header, description with requirements and benefits, Apply button opens modal. APPLY MODAL: resume upload drag drop, cover letter, LinkedIn URL, authorization dropdown, Submit with loading then Applied checkmark. MY APPLICATIONS: kanban — Applied, Phone Screen, Interview, Offer, Rejected. Stats: 247 jobs 48 companies 12 new today 89 remote. MOMENT OF DELIGHT: after applying job card shows green Applied badge instantly.`
},
{
  id: 15,
  name: 'Membership Dashboard',
  triggers: ['subscription','membership','member dashboard','subscription box','recurring billing','member portal','subscription management','membership app'],
  who: 'A subscriber checking their account and a business managing their subscriber base.',
  action: 'See what is included, manage the subscription, feel the value.',
  feeling: 'I am getting a lot for my money.',
  visual: 'Premium feel. Clean. Member status displayed with pride. Benefits prominently visible.',
  delight: 'Member card has a subtle gradient shimmer that moves across it on mount like a premium card.',
  appName: 'MemberVault',
  tabs: ['My Membership','Billing','Referrals','Usage','Settings'],
  brief: `Build MemberVault — a premium membership dashboard. MY MEMBERSHIP TAB: member card with shimmer animation — Architect tier, $44/month, Member since March 15 2024, ID ARC-2847-XKQP, renews December 1 2025. Benefits with checkmarks: Claude Builds 9/month 2 remaining progress bar, Refines 20/build, Team Seats 2 (1 used), Custom Domain, White-label, Priority Builds. Storage 2.4 GB of 10 GB bar animates. BILLING TAB: current plan highlighted, card ending 4242, history — Nov 1 $44 Paid, Oct 1 $44 Paid, Sep 1 $44 Paid, download receipts. Cancel option with retention offer. REFERRALS TAB: referral link with copy button confirming with checkmark, 3 referrals sent, $44 credits earned. USAGE TAB: builds used this cycle, API calls, storage graphs. MOMENT OF DELIGHT: member card has moving shimmer gradient on mount — subtle and premium.`
},
{
  id: 16,
  name: 'Personal Portfolio',
  triggers: ['portfolio','personal website','showcase work','designer portfolio','developer portfolio','creative portfolio','my work','ux portfolio','brand portfolio'],
  who: 'A creative professional. This site is their first impression with every opportunity.',
  action: 'Be moved by the work and reach out.',
  feeling: 'This person has taste. I want to see more.',
  visual: 'Distinctive. The designer personality comes through. Dark editorial or warm minimal.',
  delight: 'Project grid uses varied card sizes — 2x2 beside two 1x1 — feels curated not templated.',
  appName: 'Jordan Davis Portfolio',
  tabs: ['Work','About','Services','Contact'],
  brief: `Build a striking personal portfolio. HERO: full viewport, name large in display font, title/discipline, one-line descriptor, scroll indicator. WORK GRID: asymmetric masonry — Meridian Brand Identity large 2x2 (2024 Branding), NovaTech Product Design small (2024 UI/UX), Verde Kitchen Campaign small (2023 Marketing), DataFlow Dashboard large (2023 Product), Northlight Editorial small (2024 Print). Hover: image darkens, title slides up from bottom. Click opens case study. CASE STUDY: hero, overview, role and tools, process 3 steps, results with metrics, next/prev navigation. ABOUT: photo placeholder, bio, skills as tags, downloadable resume, career timeline. SERVICES: 4 service cards with icon, title, description, starting price. CONTACT: name, email, project type, budget, timeline, message, send with loading state. MOMENT OF DELIGHT: project grid varied sizes create visual rhythm — the eye moves naturally through the work.`
},
{
  id: 17,
  name: 'Online Course Platform',
  triggers: ['course platform','online course','teaching','lms','lessons','course builder','educational platform','tutorials','elearning','teach online'],
  who: 'A creator teaching what they know, and students eager to learn.',
  action: 'Watch the lesson, mark it complete, feel progress toward the certificate.',
  feeling: 'This person knows what they are talking about. I am in good hands.',
  visual: 'Clean and focused. Dark video area, light content panels. Progress always visible.',
  delight: 'Final lesson completion fires certificate with gold shimmer and confetti burst.',
  appName: 'Learnly',
  tabs: ['Dashboard','My Courses','Explore','Certificate'],
  brief: `Build Learnly — an online course platform. DASHBOARD: welcome back, Continue Watching Brand Strategy Masterclass 68% lesson 19 of 28, completed courses with certificates. COURSE PLAYER: video placeholder with controls, lesson title "Building Your Brand Positioning Statement" Section 4 18:42, curriculum sidebar with 28 lessons — 1-19 checked, 20-28 upcoming. Notes panel. Next/prev navigation. Mark complete button. EXPLORE TAB: No-Code Business Builder Marcus Rivera 4.8★ 1240 students 6hrs $147, Copywriting Mastery Priya Nair 4.6★ 3420 students 8hrs $129. Course detail with curriculum preview and enroll. CERTIFICATE TAB: Figma for Designers certificate — Jordan Davis, October 14 2024, Jordan Davis signature, download PDF, share LinkedIn. MOMENT OF DELIGHT: completing final lesson triggers certificate to slide up with gold shimmer and 8 particles of confetti.`
},
{
  id: 18,
  name: 'Blog Content Platform',
  triggers: ['blog','content platform','articles','newsletter','writing platform','publication','editorial site','blogging','content site','personal blog'],
  who: 'A writer with something to say, and readers who want to hear it.',
  action: 'Read an article all the way through and subscribe.',
  feeling: 'I want to read this. Right now.',
  visual: 'Editorial. Beautiful typography is the design. Generous whitespace. Article itself is the design.',
  delight: 'Reading progress bar at top fills as you scroll — thin colored line keeps you reading.',
  appName: 'The Build Journal',
  tabs: ['Home','Articles','Newsletter','About'],
  brief: `Build a content platform and blog. HOME: featured article hero — The Architecture of Good Thinking large with category and read time. Recent grid 2-column: Why Most Apps Fail 12min 4,120 views Oct 28, The Permission You are Waiting For 6min 6,844 views Oct 15 most popular badge, Building in Public 90 Days 10min 3,290 views Oct 1. Category filter (All, Design, Strategy, Building, Mindset). Newsletter signup inline. Stats: 4,847 subscribers, 24 articles, 47K reads. ARTICLE PAGE: reading progress bar top — thin colored line fills as you scroll, headline large in display font, author date read time, formatted body with h2/paragraphs/blockquotes/code, subscribe CTA inline, related articles at bottom. NEWSLETTER TAB: about the newsletter, recent issues preview, email signup. MOMENT OF DELIGHT: reading progress bar grows as reader scrolls — subconsciously encourages finishing.`
},
{
  id: 19,
  name: 'Team Directory',
  triggers: ['team directory','employee directory','hr','org chart','team management','people directory','staff profiles','company directory','team roster'],
  who: 'A growing company where people do not know each other yet.',
  action: 'Find a colleague, learn about them, reach out.',
  feeling: 'These are real people. I feel like I know this company.',
  visual: 'Warm and human. Faces are the design. Color coded by department.',
  delight: 'Org chart nodes pop in with brief scale animation when expanded.',
  appName: 'TeamHub',
  tabs: ['Directory','Org Chart','Departments','My Profile'],
  brief: `Build TeamHub — a warm human team directory. DIRECTORY TAB: search by name role department skill. Department filter chips. 7 profile cards: Jordan Davis CEO Leadership Austin, Sarah Chen Head of Design Remote, Marcus Rivera Head of Engineering Miami, Priya Nair Product Lead NYC, James Thornton Sales Lead Chicago, Aisha Okonkwo Marketing Remote, David Park Customer Success LA. Each: avatar initials in department color, name, role, department badge, location, start date, contact icons. Clicking opens profile panel from right — full bio, skills tags, manager link, direct reports, recent projects. ORG CHART TAB: hierarchy tree Jordan at top, direct reports below, click expands with scale pop on each node. DEPARTMENTS TAB: 7 department cards with head, member count, description. MOMENT OF DELIGHT: org chart expansion triggers brief scale pop on each appearing node.`
},
{
  id: 20,
  name: 'Link in Bio Creator Hub',
  triggers: ['link in bio','creator page','social links','linktree','creator hub','bio page','social media page','bio link','link page','creator links'],
  who: 'A creator with followers who want more of them but do not know where to go.',
  action: 'Click the link that matters most to them.',
  feeling: 'This is exactly who I follow. I want everything they are offering.',
  visual: 'The creator personality IS the design. Avatar large and prominent. Clean link priority order.',
  delight: 'Each link button has a left-side color accent matching its category — feels curated not listed.',
  appName: 'Creator Hub',
  tabs: ['My Page','Analytics','Edit Links','Settings'],
  brief: `Build a creator link-in-bio hub. PUBLIC PAGE: large circular avatar, name Jordan Davis, handle @jordandavis verified, bio "Helping founders build without limits. SOVREND founder. Writing about building, thinking, and shipping." Social icons (Instagram, TikTok, YouTube, Twitter, LinkedIn). 5 link buttons: Start Building Free on SOVREND orange left accent 847 clicks, Read My Newsletter purple 4,847 clicks, The Build Podcast blue 1,240 clicks, Free Prompt Engineering Course green 2,847 clicks, Book Strategy Call amber 312 clicks. Each: icon, title, click count badge visible to creator. ANALYTICS TAB: 284 clicks today up 23%, 1,840 this week, top link Newsletter, 7-day chart, link breakdown table with CTR. EDIT LINKS TAB: drag to reorder, toggle visibility, edit title/URL/icon/color, add new link. THEME TAB: 6 presets with live preview. MOMENT OF DELIGHT: each link button has colored left border matching its category — feels intentionally designed.`
},
{
  id: 21,
  name: 'Peer Marketplace',
  triggers: ['marketplace','buy and sell','peer to peer','listings marketplace','multi-vendor','seller platform','second hand','resale','classifieds'],
  who: 'Buyers looking for something specific, sellers wanting to reach them. Trust is the product.',
  action: 'Find what you are looking for, trust the seller, buy it.',
  feeling: 'Real items, real sellers, real transactions happening here.',
  visual: 'Clean, trustworthy, item-forward. Seller ratings prominently visible. Prices clear.',
  delight: 'Making an offer shows typically responds in 2 hours badge — sets expectation, reduces anxiety.',
  appName: 'LocalFind',
  tabs: ['Browse','My Listings','Messages','Saved','Sell'],
  brief: `Build LocalFind — a peer-to-peer marketplace. BROWSE: search + category chips (Electronics, Clothing, Furniture, Sports, Books). Filter: price, condition, distance. 4 listings: Vintage Levis Jacket $145 Excellent Sarah 4.9★ 247 sales 2 days, Sony WH-1000XM5 $220 Good Marcus 4.8★ 89 sales 5 days, Standing Desk $380 Like New Priya 5.0★ 12 sales 1 day, Canon EOS R50 $640 Good James 4.7★ 34 sales 8 days. LISTING DETAIL: 4-photo gallery navigation, condition badge, seller card (avatar, rating, response time "typically 2 hours", verified), Message Seller, Make Offer slide-up with amount input, Buy Now. MY LISTINGS: own listings with edit/delete, view count, saved count. SELL TAB: multi-step form — photos, title, category, condition, price, description, location. MOMENT OF DELIGHT: clicking Make Offer reveals seller typically responds in 2 hours badge, reducing buyer anxiety.`
},
{
  id: 22,
  name: 'Healthcare Patient Portal',
  triggers: ['healthcare','patient intake','medical','clinic','doctor','appointment health','health portal','medical records','patient portal','doctor app','clinic portal'],
  who: 'A patient filling out forms before an appointment and a provider who needs information organized.',
  action: 'Complete intake before the appointment so the visit is more efficient.',
  feeling: 'This is a professional practice. I am in good hands.',
  visual: 'Clean, calm, trustworthy. Blues and whites. Medical but not cold. Welcoming language.',
  delight: 'Completing all intake forms shows a You are all set screen with checkmark animation.',
  appName: 'CarePortal',
  tabs: ['My Health','Appointments','Messages','Records','Intake Forms'],
  brief: `Build CarePortal — a patient health portal. MY HEALTH TAB: Jordan Davis DOB March 15 1988 Blood Type O+. Vitals: Weight 181lbs, Height 5ft 11in, BP 118/76, Pulse 68, Last updated Oct 15. Medications: Vitamin D3 2000IU daily, Fish Oil 1000mg daily. Allergies: Penicillin Severe red badge, Shellfish Moderate amber badge. APPOINTMENTS TAB: Dr. Sarah Chen MD Annual Physical Nov 8 10:30am Austin Medical Center 3 days away pulsing, Dr. Marcus Rivera DDS Dental Nov 22 2pm. Book Appointment opens calendar. History below. MESSAGES TAB: secure thread per provider, file attachments, read receipts. RECORDS TAB: lab results, imaging, visit summaries, insurance card. Download buttons. INTAKE FORMS TAB: multi-step form — Personal Info, Medical History, Medications, Allergies, Insurance Blue Cross XKQ-847-2934 Copay $30, Consent. Progress bar advances per step. MOMENT OF DELIGHT: completing all forms shows You are all set screen with appointment details and checkmark drawing itself.`
},
{
  id: 23,
  name: 'Wedding Planner',
  triggers: ['wedding','wedding planner','wedding app','event planning','wedding checklist','wedding budget','wedding vendors','wedding organizer','bridal planner'],
  who: 'A couple planning the most important day of their lives. Excited, overwhelmed, needing control.',
  action: 'Check something off the list and feel less overwhelmed.',
  feeling: 'This is going to be beautiful. And manageable.',
  visual: 'Elegant, soft. Warm whites and blush tones. Typography is delicate. Tone is celebratory but calm.',
  delight: 'Checklist hitting 50% complete fires champagne bubble animation rising from the progress bar.',
  appName: 'Forever Planning',
  tabs: ['Dashboard','Checklist','Budget','Guests','Vendors'],
  brief: `Build Forever Planning — a wedding planning app. DASHBOARD: large countdown "247 Days Until June 14th" animated numbers. Progress: checklist 67% (54/81 done), budget $18,420 of $28,000 ($9,580 remaining), RSVPs 89 confirmed of 124. Upcoming tasks this week 3 items. CHECKLIST TAB: organized by timeline (12 months, 9 months, 6 months, 3 months, 1 month, week of, day of). Checking triggers strikethrough animation and color flash. Filter by category, assignee Jordan/Priya, complete/incomplete. Progress bar at top. BUDGET TAB: $28,000 total. Category cards: Venue $8,500 PAID green, Catering $7,800 Booked blue, Photography $4,200 50% paid amber, Attire $2,400 of $3,000, Flowers $0 of $2,000 considering, Music $1,400 considering. GUESTS TAB: 124 invited, 89 confirmed, 12 declined, 23 pending. Searchable table with meal selection, table assignment, dietary needs. VENDORS TAB: 4 vendor cards with type, price, status, contact, notes. MOMENT OF DELIGHT: checklist crossing 50% fires champagne bubble animation rising from progress bar.`
},
{
  id: 24,
  name: 'Shift Scheduling',
  triggers: ['shift scheduling','employee scheduling','rota','schedule builder','staff scheduling','time tracking','workforce management','shift manager','work schedule','team schedule'],
  who: 'A manager scheduling a team, and employees checking when they work.',
  action: 'See the schedule. Know when you work. Request time off.',
  feeling: 'I can see the whole week at a glance. Everything is accounted for.',
  visual: 'Clean weekly grid. Each employee has a color. Shifts are blocks filling the calendar.',
  delight: 'Publishing schedule fires a wave sweep left to right across grid as each employee is notified.',
  appName: 'ShiftFlow',
  tabs: ['Schedule','My Shifts','Time Off','Team','Payroll'],
  brief: `Build ShiftFlow — a team shift scheduling app. SCHEDULE TAB: weekly calendar grid. Rows are employees, columns are days Mon-Sun. Shift blocks color-coded: Jordan Manager purple full coverage, Priya Shift Lead orange Wed/Fri/Sat, Sarah Barista blue Mon/Tue/Thu/Fri/Sat 38hrs amber overtime badge, Marcus Barista green Mon/Wed/Fri time-off request pending, James Barista amber Tue/Wed/Sat, Aisha Cashier pink Mon/Thu/Sat. Coverage warning: Tuesday 2pm-4pm only 1 person — amber pulse overlay. 47 shifts 284 hours total. ADD SHIFT: click empty slot opens quick form — employee, start/end time, role, notes. PUBLISH BUTTON: Draft to Published with wave animation. MY SHIFTS TAB: own shifts this week and next. TIME OFF TAB: request form, Marcus Thanksgiving Nov 27-Dec 1 Pending with approve/deny. TEAM TAB: employee cards with hours, availability. PAYROLL TAB: hours per employee, overtime flagged red, projected wages. MOMENT OF DELIGHT: publishing fires left-to-right wave sweep across entire grid.`
},
{
  id: 25,
  name: 'Social Feed',
  triggers: ['social','community','feed','posts','social network','forum','social media app','community platform','twitter clone','social app','discussion board'],
  who: 'People sharing a common interest who want to feel seen and heard by their community.',
  action: 'Post something and get a response. Or find a post that resonates.',
  feeling: 'My people are here. There is already a conversation I want to join.',
  visual: 'Warm, conversational. Not cold or corporate. Avatars prominent. Content is the design.',
  delight: 'Liking a post fires a brief burst of small hearts scattering outward then settling.',
  appName: 'BuildPublic',
  tabs: ['Feed','Explore','Notifications','Messages','Profile'],
  brief: `Build BuildPublic — a social community platform. FEED TAB: compose box "What are you building?" at top. 4 posts: Jordan Davis @jordandavis 2h "Shipped something today that 6 months ago I thought was impossible. The gap between thought and reality is just time and action." 47 likes 12 comments. Sarah Chen @sarahdesigns 4h "Design systems are not about components. They are about shared language." 89 likes 23 comments. Marcus Rivera @marcusbuilds 6h "Crossed $10K MRR this morning. 11 months of building in public." 234 likes 67 comments — comment thread expanded showing 3 replies. Priya Nair @priyafounder 8h "Nobody talks about the 3am moments when you almost quit." 312 likes 89 comments. Each post: avatar, name, handle, time, content, like heart, comment count, share, save. EXPLORE TAB: trending hashtags BuildingInPublic ShipIt IndieHacker, popular posts, suggested people. NOTIFICATIONS TAB: likes/comments/follows grouped with unread badge. MESSAGES TAB: inbox, conversation view. PROFILE TAB: own posts grid, followers/following, edit profile. MOMENT OF DELIGHT: liking fires burst of 5 small hearts scattering outward over 400ms then settling.`
},
{
  id: 26,
  name: 'Project Management Suite',
  triggers: ['project management','project tracker','team project','sprint planning','agile','jira clone','project suite','roadmap','milestone tracker','project collaboration'],
  who: 'A product team managing multiple projects across multiple people with deadlines that matter.',
  action: 'See all projects at a glance and know exactly what needs to happen today.',
  feeling: 'We are organized. We are going to ship this.',
  visual: 'Clean, professional. Multiple views — board, timeline, list. Status colors consistent.',
  delight: 'Project progress bar hitting 100% fires a brief fireworks burst from the completion point.',
  appName: 'Runway',
  tabs: ['Projects','My Work','Timeline','Reports','Settings'],
  brief: `Build Runway — a project management suite. PROJECTS TAB: stats bar. 4 project cards: Website Redesign 68% On Track purple Dec 1 team 4, Mobile App v2 34% At Risk red Nov 20 team 6 pulsing warning, Q4 Marketing 82% On Track green Oct 31 team 3, API Integration 15% Blocked amber Dec 15 team 2. Each: progress bar, status badge, deadline countdown, team avatar stack, task count. Click opens project with full board. MY WORK TAB: today assigned tasks across all projects — Design system audit Website Redesign High Nov 8, Review API docs Medium Nov 9, Stakeholder presentation High Nov 10. TIMELINE TAB: Gantt chart all 4 projects as horizontal bars Nov-Dec, milestones as diamonds. REPORTS TAB: velocity chart, completion rate, team workload balance, overdue tasks. MOMENT OF DELIGHT: progress bar hitting 100% fires brief fireworks burst from completion point.`
},
{
  id: 27,
  name: 'Note Taking App',
  triggers: ['notes app','note taking','notebook','markdown editor','personal notes','knowledge base','second brain','note organizer','writing app','journal app'],
  who: 'A thinker who captures everything and needs to find it again.',
  action: 'Write a note, organize it, find it instantly when needed.',
  feeling: 'My thoughts are safe here. Everything is findable.',
  visual: 'Clean writing environment. Typography is everything. Dark or cream tones. Distraction-free.',
  delight: 'Switching to Focus Mode hides everything except the editor — words fill the screen.',
  appName: 'NoteStack',
  tabs: ['All Notes','Favorites','Tags','Archive'],
  brief: `Build NoteStack — a clean note-taking app. THREE-PANEL LAYOUT: note list left, editor center, info panel right. NOTE LIST: search bar, 4 notes — The Architecture of Good Thinking Nov 7 847 words favorite star, SOVREND Product Philosophy Nov 6 1,240 words, Meeting Notes Investor Call Nov 5 312 words, Book Notes As A Man Thinketh Nov 4 2,847 words favorite. Tags shown per note. EDITOR: title editable top, markdown body with formatting toolbar (bold, italic, heading, bullet, numbered, link, code). Character count. Auto-saves with toast. Tags editable inline. MARKDOWN: toggle between edit and preview — headings render, bold renders, code blocks syntax highlighted. SEARCH: instant results highlighting matching text across all notes. TAGS TAB: tag cloud, clicking filters. FOCUS MODE: button hides both panels, editor fills screen, ESC to exit. MOMENT OF DELIGHT: Focus Mode smoothly hides both panels and writing fills the screen — pure distraction-free.`
},
{
  id: 28,
  name: 'Time Tracking App',
  triggers: ['time tracker','time tracking','timesheet','billable hours','time log','hours tracker','freelance time','time management','track hours','productivity timer'],
  who: 'A freelancer or consultant who bills by the hour and needs accurate records.',
  action: 'Start a timer, stop it, see exactly where the time went.',
  feeling: 'My time is accounted for. I am not leaving money on the table.',
  visual: 'Clean and precise. Timer is prominent. Chart shows the week at a glance.',
  delight: 'Stopping a timer reveals the exact elapsed time counting up to the final number with a satisfying settle.',
  appName: 'TimeStack',
  tabs: ['Timer','Timesheet','Projects','Reports','Invoices'],
  brief: `Build TimeStack — a time tracking app. TIMER TAB: large prominent timer showing 01:24:37 ticking every second. Project selector "Website Redesign — Acme Corp". Billable toggle on. Rate $150/hr. Stop Timer button red. Today entries: SOVREND Dashboard (Self, 2h 14m, not billable), Brand Strategy (Northlight, 1h 45m, billable $200/hr $350), Website Redesign running. Today total: 5h 23m $350 billable. TIMESHEET TAB: current week table columns Project/Client/Mon-Sun/Total. Editable entries. Total row 18h 24m total 14h 12m billable. PROJECTS TAB: 4 project cards with client, hourly rate, hours this week, total billed. Color coded. REPORTS TAB: week bar chart daily hours. Billable vs non-billable donut. Top clients table. Export CSV/PDF. INVOICES TAB: generate from tracked time — select date range and client, creates itemized invoice automatically. MOMENT OF DELIGHT: stopping timer shows final time snap to value with brief count-up settle.`
},
{
  id: 29,
  name: 'Restaurant Management Dashboard',
  triggers: ['restaurant dashboard','restaurant management','pos system','kitchen display','restaurant admin','table management','restaurant analytics','food business dashboard'],
  who: 'A restaurant owner or manager needing real-time visibility into their operation.',
  action: 'See what is happening right now — tables, orders, revenue — and make decisions.',
  feeling: 'I have my finger on the pulse of everything.',
  visual: 'Dark professional. Real-time feel. Tables as visual map. Revenue prominent.',
  delight: 'New order causes the relevant table on the floor map to pulse briefly with a glow.',
  appName: 'TableCommand',
  tabs: ['Floor','Orders','Menu','Analytics','Settings'],
  brief: `Build TableCommand — a restaurant management dashboard. FLOOR TAB: visual table map 5 tables. Table 1: 4-top occupied 3 guests Sarah serving 47min $84 check. Table 2: 2-top AVAILABLE green. Table 3: 6-top occupied 5 guests Marcus 23min $127. Table 4: 4-top RESERVED 7:30pm amber. Table 5: 8-top occupied 7 guests Priya 12min $210. Stats: 34 seated of 60 capacity, 8 active orders, avg ticket $47.20. ORDERS TAB: active orders — #2847 Table 5 In Kitchen 8 min Carne Asada Bowl 3 Street Tacos 2 Margaritas, #2846 Table 3 Delivered 15 min. Status pipeline. MENU TAB: editable menu categories, toggle availability, edit prices. ANALYTICS TAB: today $4,847 revenue, 127 covers, $38.17 avg check, $1,240 labor. Revenue by hour bar chart. Top items. Server performance table. MOMENT OF DELIGHT: new incoming order causes relevant table map marker to pulse green briefly.`
},
{
  id: 30,
  name: 'Learning Management System',
  triggers: ['lms','learning management','employee training','corporate training','onboarding platform','training platform','skills development','compliance training'],
  who: 'HR managers creating training programs and employees completing required learning.',
  action: 'Complete the assigned courses and get certified.',
  feeling: 'My development is being invested in. This matters.',
  visual: 'Professional, clean. Progress tracking prominent. Achievement feels earned.',
  delight: 'Earning a certificate fires a badge appearing with a brief golden glow.',
  appName: 'SkillPath',
  tabs: ['My Learning','Catalog','Team Progress','Admin','Certificates'],
  brief: `Build SkillPath — a corporate learning management system. MY LEARNING TAB: 3 assigned courses — Security Compliance 2024 Required Due Nov 30 45% (5/12 modules), Customer Communication Optional Dec 15 0% not started, Product Knowledge Q4 Required Due Nov 15 100% CERTIFIED green badge. Each: progress bar, due date urgency, module count, start/continue/review button. COURSE PLAYER: module list sidebar with checkmarks, video placeholder, quiz after each module, mark complete button. CATALOG TAB: browse by category. TEAM PROGRESS TAB: leaderboard with completion percentages. Overdue 3 people flagged. Overall 67% completion avg score 84. ADMIN TAB: assign courses to users/groups, set due dates, compliance report. Overdue users highlighted red. CERTIFICATES TAB: earned certificates grid with gold badge, download PDF option. MOMENT OF DELIGHT: completing final module triggers gold badge appearing with radiant glow animation.`
},
{
  id: 31,
  name: 'Event Management Platform',
  triggers: ['event management','event platform','event listings','ticket sales','event organizer','conference management','event app','event registration','ticketing'],
  who: 'Event organizers selling tickets and attendees discovering and buying them.',
  action: 'Find the right event, buy a ticket, attend.',
  feeling: 'There is something happening here worth going to.',
  visual: 'Vibrant. Event photos prominent. Date and location clear. Ticket price visible.',
  delight: 'Completing ticket purchase fires a digital ticket reveal animation sliding up from the bottom.',
  appName: 'EventFlow',
  tabs: ['Discover','My Tickets','Organize','Analytics'],
  brief: `Build EventFlow — an event management and ticketing platform. DISCOVER TAB: category filter (All, Conference, Workshop, Meetup, Concert). 4 event cards: AI Founders Summit Nov 15 Austin $297 847/1000 tickets, Design Systems Workshop Nov 20 Online $97 124/200 tickets, Build in Public Meetup Nov 22 Austin Free 47/80 tickets, No-Code Summit Dec 5 San Francisco $199 412/500 tickets. Each: gradient photo placeholder, date badge, location, price, tickets remaining progress bar. EVENT DETAIL: hero, title, date/time, location map placeholder, description, agenda, organizer, ticket types, quantity selector, Buy Now button. TICKET PURCHASE: modal with billing, card input, order summary, confirm with loading. MY TICKETS TAB: digital ticket for AI Founders Summit styled with QR code placeholder, event details, ticket number TKT-28471, add to calendar. ORGANIZE TAB: create event form, attendees list, check-in scanner, revenue dashboard. MOMENT OF DELIGHT: after purchase digital ticket slides up from bottom with reveal animation.`
},
{
  id: 32,
  name: 'Inventory Management',
  triggers: ['inventory','stock management','warehouse','inventory tracker','product stock','sku management','inventory app','stock tracker','supply chain'],
  who: 'A business owner or operations manager tracking what they have and what they need.',
  action: 'See current stock levels and know what to order before running out.',
  feeling: 'Nothing will run out unexpectedly. I am in control.',
  visual: 'Clean, data-dense. Red for low stock demands attention immediately. Table is the hero.',
  delight: 'Low stock item restocked causes the row to flash green briefly as the warning disappears.',
  appName: 'StockFlow',
  tabs: ['Inventory','Orders','Suppliers','Reports','Settings'],
  brief: `Build StockFlow — an inventory management system. INVENTORY TAB: stats — 847 total items, 3 low stock amber, 1 critical red, total value $124,800. Searchable table: SKU-2847 Meridian Leather Wallet Stock 12 Min 20 LOW amber Shelf A3 Cost $45 Price $89, SKU-1204 Canvas Weekender Bag Stock 47 OK green Shelf B1, SKU-0891 Copper Pour-Over Set Stock 3 CRITICAL red pulsing Shelf C2, SKU-0445 Wool Throw Blanket Stock 89 OK Shelf D4, SKU-0312 Ceramic Mug Set Stock 156 Overstocked blue Shelf E1. Each row: stock level bar, edit button, reorder button. Filter by status. ORDERS TAB: 4 pending purchase orders with supplier, items, expected delivery, total cost. Receive order marks items received. SUPPLIERS TAB: supplier cards with contact, lead time, last order. REPORTS TAB: inventory value by category, turnover rate, slow moving items, reorder recommendations. MOMENT OF DELIGHT: receiving restock makes low stock row flash green and warning badge disappears with animation.`
},
{
  id: 33,
  name: 'Customer Support Desk',
  triggers: ['helpdesk','customer support','support tickets','help desk','ticket system','customer service','support platform','zendesk clone','support portal'],
  who: 'Support agents handling customer issues, and customers tracking their requests.',
  action: 'Resolve the ticket quickly and make the customer feel heard.',
  feeling: 'This team takes care of their customers. I am in good hands.',
  visual: 'Clean and efficient. Ticket priority immediately visible. Agent workload clear.',
  delight: 'Resolving a ticket plays a brief satisfying checkmark animation and moves it to resolved.',
  appName: 'SupportDesk',
  tabs: ['Inbox','All Tickets','My Queue','Reports','Settings'],
  brief: `Build SupportDesk — a customer support ticket system. INBOX TAB: stats — 24 Open, 8 In Progress, 147 Resolved today, Avg Response 14 min, CSAT 94%. Ticket list: TKT-2847 "Payment not processing" Sarah Chen Urgent red pulsing 2 min Jordan assigned, TKT-2846 "Cannot access account" Marcus Rivera High 18 min Sarah assigned, TKT-2845 "Export feature" Priya Nair Medium In Progress 1h Jordan, TKT-2844 "Billing question" James Thornton Low Waiting 2h Aisha. TICKET DETAIL: customer info card, full conversation thread, reply editor with formatting toolbar, status selector, priority selector, assignee dropdown, internal notes tab, resolve button. Customer history sidebar. ALL TICKETS TAB: filterable table with search. MY QUEUE TAB: only assigned to current agent. REPORTS TAB: volume chart, response time trends, resolution rate, agent performance, CSAT scores. MOMENT OF DELIGHT: clicking Resolve fires checkmark animation and ticket smoothly slides out of queue.`
},
{
  id: 34,
  name: 'Financial Planning Dashboard',
  triggers: ['financial planning','wealth management','investment tracker','portfolio tracker','stock portfolio','retirement planning','net worth','financial advisor','investment dashboard'],
  who: 'Someone taking their finances seriously and wanting to see the full picture.',
  action: 'Understand net worth, track investments, plan for goals.',
  feeling: 'I know exactly where I stand financially. And I am moving in the right direction.',
  visual: 'Clean, trustworthy, premium. Green for growth. Numbers are large and clear.',
  delight: 'Net worth display counts through to its final value on mount — feels like watching wealth counted.',
  appName: 'WealthView',
  tabs: ['Overview','Investments','Goals','Budget','Reports'],
  brief: `Build WealthView — a personal financial planning dashboard. OVERVIEW TAB: large net worth card $284,700 up $12,400 this month (+4.6%). 4 account cards: 401K Fidelity $142,800 +3.2%, Brokerage Schwab $68,400 +6.8%, Savings Chase $48,200 +0.4%, Roth IRA Vanguard $25,300 +4.1%. Allocation donut: Retirement 59%, Investment 24%, Cash 17%. Net worth chart last 12 months trending up. INVESTMENTS TAB: holdings table — AAPL $12,400 +2.4% green, GOOGL $8,700 +1.8%, VTI $24,800 +0.9%, MSFT $9,200 -0.3% red. Performance chart. Add investment button. GOALS TAB: Home Down Payment $48,200 of $80,000 (60.3%) Dec 2026, Emergency Fund $28,400 of $30,000 (94.7%) nearly there!, Vacation Fund $2,840 of $8,000 (35.5%). Progress bars with projected dates. REPORTS TAB: monthly summary, returns vs benchmarks, tax-loss harvesting. MOMENT OF DELIGHT: net worth counts through to final value on mount — feels like watching your wealth tallied.`
},
{
  id: 35,
  name: 'Survey and Feedback Platform',
  triggers: ['survey','feedback','questionnaire','poll','form builder','customer feedback','nps','survey tool','feedback form','research tool'],
  who: 'Researchers and businesses collecting opinions, and respondents sharing them.',
  action: 'Create a survey, share it, watch responses come in.',
  feeling: 'I am going to learn something real from this.',
  visual: 'Clean form design. Response visualization is the payoff. Real-time feel as responses arrive.',
  delight: 'New response causes the response count to increment with a brief pulse.',
  appName: 'FormPulse',
  tabs: ['My Surveys','Results','Templates','Settings'],
  brief: `Build FormPulse — a survey and feedback platform. MY SURVEYS TAB: 3 survey cards — Q4 Customer Satisfaction 247 responses 67% completion Active, Product Feature Prioritization 89 responses 42% Active, Employee Engagement 47 responses 90% Closed. Each: response count, completion rate bar, share, view results, edit buttons. CREATE SURVEY: question types — NPS 1-10 scale, Multiple Choice, Star Rating, Text. Drag to reorder. Preview mode. RESULTS TAB: NPS score 72 gauge animating to score, 247 total responses, avg time 3m 42s. Question breakdown: NPS gauge, multiple choice "What do you value most?" (Quality 68%, Price 24%, Support 8%), Rating "How satisfied?" (4.3 avg, distribution 2/4/12/89/140). Individual responses table. Export CSV. TEMPLATES TAB: NPS, CSAT, Employee Engagement, Product Feedback, Event starters. MOMENT OF DELIGHT: response count increments with brief scale pulse on each update.`
},
{
  id: 36,
  name: 'Subscription Box Platform',
  triggers: ['subscription box','curated box','monthly box','subscription curation','box service','curated products','monthly subscription box'],
  who: 'A curator building a subscription box business and their subscribers.',
  action: 'Subscribe, customize preferences, track the next shipment.',
  feeling: 'I am getting something curated just for me every month.',
  visual: 'Warm, premium, gift-like. Box imagery dominant. Each box feels special.',
  delight: 'Selecting preferences shows a live preview of what is being built for your box.',
  appName: 'BoxCraft',
  tabs: ['My Box','Upcoming','History','Preferences','Shop'],
  brief: `Build BoxCraft — a subscription box platform. MY BOX TAB: subscription card — Premium Box $49/month, next shipment November 15 countdown days, subscribed since March 2024. UPCOMING TAB: November 2025 Artisan Collection. Items: Meridian Coffee Blend $28 revealed, Handcrafted Ceramic Mug $45 revealed, ??? $35+ mystery blurred, ??? Mystery blurred. Total value $120+. Shipment tracking steps Processing/Packed/Shipped/Delivered. HISTORY TAB: past boxes October/September/August 2025 as cards. Click to see full item list. Rate this box stars. Shop items from past boxes again. PREFERENCES TAB: selectable category tags (Coffee, Kitchen, Home Decor, Beauty, Tech, Books). Dietary needs. Box size. Save updates toast. SHOP TAB: individual items from current and past boxes. Cart integration. MOMENT OF DELIGHT: customizing preferences shows live box preview updating to reflect your taste.`
},
{
  id: 37,
  name: 'Property Management System',
  triggers: ['property management','landlord','tenant management','rental management','property manager','lease tracker','maintenance requests','rent collection'],
  who: 'A landlord or property manager overseeing multiple rental units.',
  action: 'Collect rent, handle maintenance, track tenants without it feeling like chaos.',
  feeling: 'My properties are managed. I can sleep at night.',
  visual: 'Professional, clean. Property cards as the visual unit. Revenue and occupancy prominent.',
  delight: 'Rent payment received causes the unit card to briefly flash green.',
  appName: 'PropFlow',
  tabs: ['Properties','Tenants','Maintenance','Finances','Leases'],
  brief: `Build PropFlow — a property management system. PROPERTIES TAB: stats — 8 total units, 87.5% occupancy, $14,450 monthly revenue, $1,850 outstanding. 3 property cards: 2847 Maple Grove Drive 4 units all occupied $8,400/mo ALL PAID green, 1204 Lakeview Terrace 1 unit $1,850/mo LATE red pulsing, 891 Oak Street 1-3 3 units 2 occupied $4,200/mo PARTIAL amber. Click opens unit detail. TENANTS TAB: searchable list with name, unit, lease end, rent, payment status, contact. Send message button. MAINTENANCE TAB: 2 open requests — Maple 3 Leaking faucet Medium Scheduled, Lakeview HVAC High In Progress. Status pipeline. Add request. Assign to vendor. FINANCES TAB: monthly revenue chart, rent roll table, expense tracking, profit/loss summary. LEASES TAB: lease cards with start/end dates, rent, deposit, renewal status. Expiring flagged. MOMENT OF DELIGHT: receiving rent payment flashes unit card green briefly.`
},
{
  id: 38,
  name: 'Music and Podcast Platform',
  triggers: ['podcast','music app','audio platform','podcast player','music player','audio streaming','podcast manager','playlist','audio app'],
  who: 'A creator publishing audio content and their listeners finding and enjoying it.',
  action: 'Find something worth listening to and press play.',
  feeling: 'There is something here I want to spend time with.',
  visual: 'Dark mode. Album art dominant. Player always accessible. Mood-setting atmosphere.',
  delight: 'Pressing play causes the album art to subtly pulse in sync with a waveform visualization.',
  appName: 'AirWave',
  tabs: ['Home','Library','Discover','Creator','Downloads'],
  brief: `Build AirWave — a podcast platform. HOME TAB: featured show hero — The Build Podcast Ep. 47 "How SOVREND Changed My Business" 42:18 by Jordan Davis, Play button, subscribe. Stats: 47 episodes, 124K total listens, 4,847 subscribers, 4.9 stars. EPISODE LIST: Ep. 47 How SOVREND Changed My Business 42:18 Nov 7 2,847 plays, Ep. 46 The Art of Shipping 38:44 Oct 31 4,120 plays, Ep. 45 Building in Public 1 Year 51:22 Oct 24 6,844 plays. Each: number, title, duration, date, play count, play button, download, share. PERSISTENT PLAYER: bottom bar — episode title, host, waveform visualization, progress bar 14:32 of 42:18, play/pause, skip 30s, speed selector 1.0x/1.5x/2.0x, volume. LIBRARY TAB: subscribed shows, playlists, downloaded episodes. DISCOVER TAB: featured shows, trending, categories. CREATOR TAB: upload form, analytics, subscriber insights. MOMENT OF DELIGHT: pressing play causes album art to subtly breathe in sync with waveform.`
},
{
  id: 39,
  name: 'Freelancer Marketplace',
  triggers: ['freelancer marketplace','hire freelancers','upwork clone','freelancer platform','talent marketplace','find freelancers','hire designer','freelance platform'],
  who: 'Clients looking for talented freelancers and freelancers showcasing their work.',
  action: 'Find the right person for the project, hire them confidently.',
  feeling: 'This person can do exactly what I need. Let us work together.',
  visual: 'Clean profile pages. Work samples front and center. Trust signals prominent.',
  delight: 'Sending a hire request shows the freelancer response time badge — sets expectation immediately.',
  appName: 'TalentFlow',
  tabs: ['Browse','My Profile','Projects','Messages','Payments'],
  brief: `Build TalentFlow — a freelancer marketplace. BROWSE TAB: search + category filter (Design, Development, Marketing, Writing, Video, Finance). 3 freelancer cards: Sarah Chen Brand Designer $125/hr 5.0 stars 247 jobs Remote Available now green pulse, Marcus Rivera Full Stack Developer $150/hr 4.9 stars 189 jobs Remote Available, Priya Nair Product Designer $110/hr 4.8 stars 312 jobs NYC Currently Busy. Each: photo placeholder, name, title, rate, rating, jobs, location, skills tags, hire button. FREELANCER PROFILE: cover, avatar, name, headline, rate, availability, about text, skills grid, 5 portfolio work samples, 3 detailed reviews, hire button. HIRE MODAL: project description, budget, timeline, attachments, send inquiry with typically responds in 2 hours badge. MY PROFILE TAB: edit profile, portfolio management, availability toggle. PROJECTS TAB: active engagements with status, messages, deliverables. PAYMENTS TAB: escrow status, milestones, history. MOMENT OF DELIGHT: sending hire request shows response time badge immediately.`
},
{
  id: 40,
  name: 'Volunteer and Nonprofit Management',
  triggers: ['volunteer','nonprofit','charity','volunteer management','donation platform','fundraising','ngo','volunteer coordinator','cause','community service'],
  who: 'A nonprofit coordinator managing volunteers and a donor or volunteer wanting to help.',
  action: 'Sign up to volunteer for an opportunity or make a donation.',
  feeling: 'My time and money will make a real difference here.',
  visual: 'Warm, mission-driven. Impact numbers are the emotional hook.',
  delight: 'After donation shows impact — Your $50 provides 10 meals — animated reveal.',
  appName: 'ImpactHub',
  tabs: ['Dashboard','Opportunities','Volunteers','Donations','Impact'],
  brief: `Build ImpactHub — a volunteer and nonprofit platform. DASHBOARD TAB: mission banner. Live impact counters counting up — 12,847 Meals Provided, 234 Families Served, 847 Active Volunteers, 4,200 Hours Logged, $28,400 Donated this month. Urgent needs callout. Recent activity feed. OPPORTUNITIES TAB: 3 volunteer cards — Food Pantry Weekend Nov 9 9am-1pm 1 spot left amber urgent, Youth Tutoring Every Tuesday 4-6pm 4 spots left, Habitat Build Day Nov 15 7am-3pm 12 spots. Each: title, date/time, location, spots remaining bar, sign up button. VOLUNTEERS TAB: roster with name, hours, skills, last active, contact. Invite button. DONATIONS TAB: recent — Sarah Chen $500 Nov 7, Anonymous $100 Nov 6 recurring, Marcus Rivera $250 Nov 5. Donation form: amount selector $25/$50/$100/$250/custom, one-time/monthly toggle, card input, donate button. IMPACT TAB: visualized impact stories, cumulative charts. MOMENT OF DELIGHT: after donation shows Your $50 provides 10 meals to families in Austin with animated reveal.`
},
{
  id: 41,
  name: 'Social Media Scheduler',
  triggers: ['social media scheduler','content scheduler','post scheduler','social media management','hootsuite clone','buffer clone','content calendar','social scheduling'],
  who: 'A content creator or marketer scheduling posts across multiple platforms.',
  action: 'Schedule posts in advance and let them publish automatically.',
  feeling: 'My content is handled. I can focus on creating instead of posting.',
  visual: 'Calendar view is the hero. Platform color coding. Queue feels organized and controllable.',
  delight: 'A scheduled post going live causes a brief celebration animation on the calendar cell.',
  appName: 'PostQueue',
  tabs: ['Calendar','Queue','Compose','Analytics','Accounts'],
  brief: `Build PostQueue — a social media scheduling platform. CALENDAR TAB: monthly calendar Nov 2025 with colored dots on scheduled days (Twitter blue, LinkedIn blue, Instagram pink, TikTok teal). Click a day shows all scheduled posts. QUEUE TAB: Twitter "Just shipped something..." Nov 8 9:00am Scheduled, LinkedIn "Design tip..." Nov 8 12:00pm Scheduled, Instagram "Behind the scenes..." Nov 9 6:00pm Draft. Each: platform badge, content preview, time, status, edit/delete, drag to reorder. COMPOSE TAB: content area with character counter per platform, platform toggles, media upload, hashtag suggestions, best time recommendations, schedule picker, post now or schedule. ANALYTICS TAB: reach 124K, engagement 4.8%, top performing post chart, best posting times heatmap, followers growth per platform. ACCOUNTS TAB: Instagram 12.4K, Twitter 8.7K, LinkedIn 4.2K, TikTok 28.4K connected. Connect new button. MOMENT OF DELIGHT: scheduled post going live causes calendar cell to briefly flash with send animation.`
},
{
  id: 42,
  name: 'Recruitment ATS',
  triggers: ['ats','applicant tracking','recruitment','hiring pipeline','recruiting','talent acquisition','hr recruiting','hiring management','applicant management'],
  who: 'A hiring manager tracking candidates through the recruitment pipeline.',
  action: 'Move the right candidate from applicant to hired efficiently.',
  feeling: 'We are going to find the right person and not miss them.',
  visual: 'Pipeline stages are clear. Candidate cards have personality. Stage progression is satisfying.',
  delight: 'Moving candidate to Hired fires celebration animation and sends automated congratulations.',
  appName: 'HireTrack',
  tabs: ['Pipeline','Candidates','Jobs','Analytics','Settings'],
  brief: `Build HireTrack — an applicant tracking system. PIPELINE TAB: kanban for Senior Product Designer role. Applied: Sarah Chen Nov 7 score 92. Screening: Marcus Rivera Nov 3 score 88. Interview: Priya Nair Oct 28 score 95 interviewing this week badge. Offer: James Thornton Oct 15 score 97. Candidate cards: photo placeholder, name, role, date, match score color coded, move to next stage button. CANDIDATE DETAIL: slides from right — resume summary, skills match, interview notes, touchpoints timeline, schedule interview, move stage dropdown, reject button. JOBS TAB: Senior Product Designer 47 applicants Interviewing, Full Stack Engineer 124 Screening, Head of Marketing 31 Offer. Click views all applicants. ANALYTICS TAB: time to hire chart, funnel conversion rates, source of hire pie, diversity metrics. SETTINGS TAB: email templates, stage customization, scoring rubrics. MOMENT OF DELIGHT: moving to Hired fires celebration animation and auto-sends congratulations toast.`
},
{
  id: 43,
  name: 'Knowledge Base Documentation',
  triggers: ['knowledge base','documentation','wiki','help center','docs','internal wiki','knowledge management','company wiki','confluence clone','notion clone'],
  who: 'A team that needs to share and find knowledge without asking someone every time.',
  action: 'Find the answer immediately without asking anyone.',
  feeling: 'Everything we know is organized and findable. We are a professional team.',
  visual: 'Clean editorial. Search is the hero. Hierarchy is clear. Reading is a pleasure.',
  delight: 'Finding something in search highlights the matching term and the doc slides into view.',
  appName: 'KnowBase',
  tabs: ['Home','Browse','Search','My Pages','Settings'],
  brief: `Build KnowBase — a knowledge base platform. HOME TAB: search bar prominent "Search 122 articles..." instant results as you type. 5 section cards: Getting Started 12 articles, Product Guide 47 articles, API Reference 31 articles, Billing and Account 8 articles, Troubleshooting 24 articles. Recent articles: How to connect Supabase 2,847 views 94% helpful 2 days ago, Custom domains on Architect 1,240 views 89% 5 days ago, Understanding build tokens 4,120 views 97% 1 week ago. ARTICLE VIEW: breadcrumb, title, last updated, reading time, table of contents sidebar, formatted body with headings/code blocks/notes, Was this helpful thumbs, related articles, edit button. BROWSE TAB: hierarchical section browser. SEARCH TAB: live results as you type, grouped by section, matching terms highlighted yellow. MY PAGES TAB: recently viewed, bookmarked, articles I edited. MOMENT OF DELIGHT: search result click highlights matching term in yellow as article slides into view.`
},
{
  id: 44,
  name: 'Recipe and Meal Planning App',
  triggers: ['recipe','meal planning','meal prep','cooking app','recipe manager','grocery list','meal planner','cookbook','food planner','weekly meals'],
  who: 'Someone who wants to eat better without spending hours deciding what to cook.',
  action: 'Plan the week meals and generate the grocery list automatically.',
  feeling: 'I have got the week handled. I will eat well without thinking about it.',
  visual: 'Warm food photography placeholders. Recipe cards inviting. Weekly calendar clear.',
  delight: 'Completing full week plan auto-generates grocery list with items appearing one by one.',
  appName: 'MealStack',
  tabs: ['This Week','Recipes','Grocery List','Nutrition','Saved'],
  brief: `Build MealStack — a recipe and meal planning app. THIS WEEK TAB: 7-column grid Mon-Sun, 3 rows Breakfast/Lunch/Dinner. Pre-filled: Monday Salmon/Caesar Salad/Greek Yogurt Parfait, Tuesday Avocado Toast/Turkey Wrap/Pasta Primavera, Wednesday Overnight Oats/Buddha Bowl/Beef Stir Fry, etc. Each slot: recipe name, click to open. Empty slots show + Add. Week nutrition summary avg 1,840 cal 47g protein. RECIPES TAB: searchable grid — Salmon 30min 480cal Easy Healthy GF, Chicken Caesar 15min 380cal Easy Quick, Pasta Primavera 25min 520cal Medium Vegetarian. Recipe detail: ingredients, steps, servings scaler, nutrition, add to meal plan button. GROCERY LIST TAB: auto-generated from week plan sorted by category Produce/Meat/Dairy/Pantry. Check off as you shop. Add custom items. Export to notes. Quantities scale with servings. NUTRITION TAB: weekly averages vs goals, macros chart, calorie trend. MOMENT OF DELIGHT: adding 7th day triggers grocery list generating with items appearing one by one in satisfying reveal.`
},
{
  id: 45,
  name: 'Pitch Deck Builder',
  triggers: ['pitch deck','investor pitch','startup pitch','presentation builder','investor deck','funding pitch','slide deck','powerpoint alternative','deck builder'],
  who: 'A founder preparing to raise money. High stakes, high stress, needs to look exceptional.',
  action: 'Build a pitch deck that gets funded.',
  feeling: 'This looks like it came from a top design agency. Investors will take us seriously.',
  visual: 'Dark and premium. Slide preview dominant. Clean modern slide templates.',
  delight: 'Completing all required slides shows a Deck Strength score with animated progress ring.',
  appName: 'PitchCraft',
  tabs: ['My Decks','Editor','Templates','Share','Analytics'],
  brief: `Build PitchCraft — a pitch deck builder. MY DECKS TAB: deck card — SOVREND Seed Round Deck, 9 slides, 64% strength, last edited 2 hours ago, Open Editor. EDITOR TAB: slide thumbnails list left (Problem complete, Solution complete, Market Size complete, Product Demo in progress, Business Model complete, Traction complete, Team empty!, Financials empty!, The Ask empty!). Main canvas center with editable text blocks. Style panel right with fonts/colors/background. AI assist button suggests content for current slide. DECK STRENGTH: ring at 64% amber. Breakdown: Required slides 6/9, Content completeness 72%, Investor readiness 58%. Improvement tips. TEMPLATES TAB: Y Combinator Style dark, Sequoia Format clean, Airbnb Original minimal, Custom blank. Preview on hover. SHARE TAB: shareable link with password, view count, investor-specific version. ANALYTICS TAB: views, avg time per slide, drop-off slide, investor engagement. MOMENT OF DELIGHT: completing all 9 slides triggers strength ring animating to final score with brief celebration.`
},
{
  id: 46,
  name: 'Fleet and Vehicle Management',
  triggers: ['fleet management','vehicle tracking','fleet tracker','vehicle management','logistics','delivery management','driver management','fleet dashboard'],
  who: 'A fleet manager overseeing vehicles, drivers, and deliveries.',
  action: 'Know where every vehicle is and if anything needs attention.',
  feeling: 'The fleet is running. Everything is accounted for.',
  visual: 'Dark with map. Vehicle status clearly visible. Alerts demand immediate attention.',
  delight: 'Vehicle completing a delivery turns its map marker green briefly.',
  appName: 'FleetCommand',
  tabs: ['Live Map','Vehicles','Drivers','Deliveries','Reports'],
  brief: `Build FleetCommand — a fleet management dashboard. LIVE MAP TAB: dark map placeholder with 3 vehicle markers. Stats: 2 active, 1 idle, 14 deliveries today, 92% on time. Alert banner: VH-1204 maintenance due Medium amber. Vehicle sidebar list with mini status. VEHICLES TAB: VH-2847 Van Marcus Rivera ON ROUTE green Acme Corp Fuel 78%, VH-1204 Truck James Thornton IDLE gray Depot Bay 3 Fuel 45%, VH-0891 Van Aisha Okonkwo DELIVERING blue 2847 Maple Grove Fuel 62%. Click opens detail: vehicle info, location, fuel gauge animating, mileage, maintenance history, assigned driver. DRIVERS TAB: driver cards with photo placeholder, name, license, vehicle, deliveries today, rating. DELIVERIES TAB: 14 today as list with origin, destination, status, ETA, driver, vehicle. Filter by status. REPORTS TAB: fuel consumption, mileage per vehicle, on-time rate, driver performance. MOMENT OF DELIGHT: vehicle completing delivery turns map marker green with brief glow.`
},
{
  id: 47,
  name: 'Language Learning App',
  triggers: ['language learning','learn spanish','learn french','vocabulary','language app','duolingo clone','language practice','translation app','foreign language'],
  who: 'Someone trying to learn a new language with consistency.',
  action: 'Complete today lesson and keep the streak alive.',
  feeling: 'I am actually making progress. This is working.',
  visual: 'Bright, gamified, encouraging. Streak and progress are the emotional hooks.',
  delight: 'Completing a lesson fires the streak counter incrementing with a flame animation.',
  appName: 'LinguaFlow',
  tabs: ['Learn','Practice','Progress','Stories','Profile'],
  brief: `Build LinguaFlow — a language learning app. LEARN TAB: current lesson header — Spanish Intermediate Unit 4 Travel, Lesson 7 At the Airport. Daily progress 240 XP of 300 goal bar animated. 21-day streak flame. Exercise: Translation "The flight departs at 8pm" text input, Submit checks answer — correct green flash + XP animation, wrong red shake + try again. Multiple choice "What does equipaje mean?" Luggage correct highlighted green, Ticket, Passport, Gate. Progress through 5 exercises per lesson. LESSON COMPLETE: XP earned, streak maintained, continue button. PRACTICE TAB: flashcard mode, conversation practice, listening exercises. PROGRESS TAB: XP chart over time, lessons per day heatmap, vocabulary mastered, weak areas. LEADERBOARD: Sarah Chen 4,847 XP 34-day streak, Jordan Davis 3,291 XP 21-day streak, Marcus Rivera 2,847 XP 15-day streak. STORIES TAB: reading passages in target language with hover translations. MOMENT OF DELIGHT: streak counter incrementing fires flame animation that grows based on streak length.`
},
{
  id: 48,
  name: 'Mindfulness and Meditation App',
  triggers: ['meditation','mindfulness','breathing','mental health app','stress relief','calm app','headspace clone','wellness app','breathing exercise','anxiety app'],
  who: 'Someone trying to find calm in a busy life.',
  action: 'Complete a meditation session and feel better.',
  feeling: 'I just found 10 minutes of peace in a chaotic day.',
  visual: 'Calm. Soft gradients. Breathing circle is the centerpiece. Nothing is loud.',
  delight: 'The breathing circle expands and contracts in perfect sync with inhale/exhale prompts.',
  appName: 'StillPoint',
  tabs: ['Home','Meditate','Breathe','Sleep','Journal'],
  brief: `Build StillPoint — a mindfulness and meditation app. HOME TAB: calming dark gradient background. Today: 18 minutes meditated, 7-day streak fire, mood Calm. Greeting "Good morning, Jordan. Take a moment." Today recommended: Morning Calm 10min. Quick sessions: 3min breathing, 5min body check. MEDITATE TAB: 4 session cards — Morning Calm 10min Guided Stress, Focus Flow 15min Guided Focus, Body Scan 20min Guided Sleep, Open Awareness 5min Unguided Quick. Playing shows: title, timer counting down, pause/end, ambient sound options Rain/Forest/Silence, progress ring. BREATHE TAB: 3 breathing patterns. Selecting shows large breathing circle — inhale circle expands 4s, hold stays 4s, exhale contracts 4s, hold 4s. Inhale/Hold/Exhale text cues. Session length selector. SLEEP TAB: sleep timer 5/10/15/30 min, ambient sounds playlist, evening routine checklist. JOURNAL TAB: today entry text area with calming prompt, mood selector 5 emojis, mood history this week. MOMENT OF DELIGHT: breathing circle expands and contracts in perfect biological rhythm — feels alive and responsive.`
},
{
  id: 49,
  name: 'Code Review and Developer Tool',
  triggers: ['code review','developer tool','code analyzer','github dashboard','pull request','code quality','dev dashboard','development analytics','engineering metrics'],
  who: 'A developer or engineering manager tracking code quality and team velocity.',
  action: 'Review PRs, track code quality, keep the team moving.',
  feeling: 'The team is shipping. Quality is being maintained. I know what needs attention.',
  visual: 'Dark developer aesthetic. Code syntax highlighting. Metrics are numbers not charts.',
  delight: 'Merging a PR fires a brief git commit animation — branch folding into main.',
  appName: 'CodePulse',
  tabs: ['Dashboard','Pull Requests','Code Quality','Team','Settings'],
  brief: `Build CodePulse — a developer tool and code review dashboard. DASHBOARD TAB: 4 metric cards — PRs This Week 12, Avg Review Time 3.4 hours, Deploy Frequency 4.2/day, Change Failure Rate 2.1%. Team velocity chart last 2 weeks. Recent deployments. Code quality score ring 87/100. PULL REQUESTS TAB: 3 PR cards — "Add Stripe webhook handler" Marcus Rivera sovrend-app READY green 2 reviews +284/-47 2h, "Fix auth token refresh" Sarah Chen CHANGES REQUESTED amber 1 review +12/-8 5h, "Update dashboard components" Priya Nair DRAFT gray 0 reviews +847/-124 1h. PR DETAIL: title, author, description, file changed list, diff view syntax highlighted green additions red deletions, review comments, approve/request changes, merge button. CODE QUALITY TAB: score 87/100 ring, coverage 94% bar, technical debt 2.4 hours, 3 open issues. Coverage by file. TEAM TAB: member cards with PRs merged, review participation, commits, comments. MOMENT OF DELIGHT: clicking Merge fires brief animation of branch folding into main line.`
},
{
  id: 50,
  name: 'Interior Design and Room Planner',
  triggers: ['interior design','room planner','home design','interior decorator','room layout','furniture placement','home planning','decor app','room designer'],
  who: 'Someone redesigning a room and needing to visualize it before buying anything.',
  action: 'Plan the room layout and feel confident before making purchases.',
  feeling: 'I can see it. This is exactly how I want it to look.',
  visual: 'Clean, editorial, design-forward. Room visualization is the hero. Mood board feels premium.',
  delight: 'Completing a room layout shows a before/after slider revealing the transformation.',
  appName: 'RoomCraft',
  tabs: ['My Rooms','Design','Mood Board','Shop','Inspiration'],
  brief: `Build RoomCraft — an interior design and room planning app. MY ROOMS TAB: 3 room cards — Living Room 14x18 In Progress 8 items $4,200 budget, Master Bedroom 12x14 Planning 3 items $2,800, Home Office 10x10 Complete 12 items $1,847. DESIGN TAB: room canvas top-down grid view of Living Room. Furniture placed as labeled rectangles — Meridian Sectional Sofa, Walnut Coffee Table. Add furniture opens library sidebar — searchable, filter by type, items show name/price/brand/dimensions. Drag to canvas. Room dimensions input. Style selector Modern Minimalist/Scandinavian/Industrial/Bohemian/Mid-Century. Color palette swatches. MOOD BOARD TAB: Pinterest-style grid of inspiration images gradient placeholders, add image URL, organize by room, export PDF. SHOP TAB: curated products — Meridian Sectional Sofa $1,847 West Elm In Room check, Walnut Coffee Table $624 CB2 In Room, Linen Area Rug $489 Add to Room button. Budget vs spent. INSPIRATION TAB: style galleries with curated room photos. MOMENT OF DELIGHT: completing room layout shows before empty room and after furnished side-by-side reveal.`
},
];

export function classifyPrompt(prompt: string): Blueprint {
  const lower = prompt.toLowerCase();
  let bestMatch = BLUEPRINTS[0];
  let bestScore = 0;
  for (const blueprint of BLUEPRINTS) {
    let score = 0;
    for (const trigger of blueprint.triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        score += trigger.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = blueprint;
    }
  }
  return bestMatch;
}

export function getBlueprint(id: number): Blueprint | undefined {
  return BLUEPRINTS.find(b => b.id === id);
}

export function getBlueprintBrief(prompt: string): string {
  const blueprint = classifyPrompt(prompt);
  const design = getDesignSystem(blueprint.id);
  const reference = getReferenceComponent(blueprint.id);
  return `
ACTIVE BLUEPRINT: ${blueprint.id} — ${blueprint.name}

WHO IS THIS FOR: ${blueprint.who}
CORE ACTION: ${blueprint.action}
FIRST 3 SECONDS FEELING: ${blueprint.feeling}
MOMENT OF DELIGHT: ${blueprint.delight}

REQUIRED TABS: ${blueprint.tabs.join(', ')}

${design}

COMPLETE BUILD SPECIFICATION:
${blueprint.brief}

${reference}
`;
}

export const DESIGN_SYSTEMS: Record<number, {mode:string;background:string;surface:string;accent:string;accentHover:string;text:string;textMuted:string;border:string;shadow:string;radius:string;fontDisplay:string;fontBody:string;fontMono:string;googleFonts:string;references:string[];feel:string}> = {
1:{mode:'dark',background:'#0a0f1e',surface:'rgba(255,255,255,0.04)',accent:'#3ECFCF',accentHover:'#2BB5B5',text:'#F0F4FF',textMuted:'#8892AA',border:'rgba(255,255,255,0.07)',shadow:'0 1px 3px rgba(0,0,0,0.4)',radius:'8px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Linear','Vercel','Mixpanel'],feel:'Precision tool. Every number has meaning.'},
2:{mode:'light',background:'#FAFAF8',surface:'#FFFFFF',accent:'#0D9488',accentHover:'#0F766E',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:wght@400;500;600;700|DM+Sans:wght@300;400;500;600',references:['HoneyBook','Bonsai','Dubsado'],feel:'Professional without being cold.'},
3:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#7C3AED',accentHover:'#6D28D9',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'DM Serif Display',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Serif+Display:ital@0;1|DM+Sans:wght@300;400;500;600',references:['Calendly','Cal.com','SavvyCal'],feel:'Effortless. Friction gone.'},
4:{mode:'light',background:'#FAFAFA',surface:'#FFFFFF',accent:'#0F9590',accentHover:'#0D7A76',text:'#0F172A',textMuted:'#6B7280',border:'#E5E7EB',shadow:'0 1px 2px rgba(0,0,0,0.05)',radius:'6px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Linear','Height','Asana'],feel:'Momentum. Clarity. Work is visible.'},
5:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['La Colombe','Aesop','Flamingo Estate'],feel:'Premium. Product is the hero.'},
6:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#F97316',accentHover:'#EA580C',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'10px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['HubSpot','Attio','Pipedrive'],feel:'Every deal visible. Next action clear.'},
7:{mode:'dark',background:'#08090C',surface:'rgba(255,255,255,0.05)',accent:'#FF4F00',accentHover:'#E04500',text:'#F8F9FA',textMuted:'#9CA3AF',border:'rgba(255,255,255,0.08)',shadow:'0 4px 24px rgba(0,0,0,0.4)',radius:'12px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:wght@300;400;500;600;700;900|DM+Sans:wght@300;400;500;600',references:['Stripe.com','Linear.app','Vercel.com'],feel:'I need to sign up right now.'},
8:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Calm','Notion','Bear'],feel:'Streak is real. Progress is visible.'},
9:{mode:'dark',background:'#07090F',surface:'#0C0F18',accent:'#B8FF3C',accentHover:'#A8EF2C',text:'#E8EAF0',textMuted:'rgba(232,234,240,.6)',border:'rgba(232,234,240,.07)',shadow:'0 8px 32px rgba(0,0,0,.5)',radius:'0px',fontDisplay:'Barlow Condensed',fontBody:'Barlow',fontMono:'JetBrains Mono',googleFonts:'Barlow+Condensed:wght@600;700;800;900|Barlow:wght@300;400;500',references:['Whoop','Strava','Nike Training Club'],feel:'Serious tool. Serious training.'},
10:{mode:'dark',background:'#0A0A0A',surface:'#111111',accent:'#C8FF00',accentHover:'#B8EF00',text:'#F0EDE6',textMuted:'rgba(240,237,230,.6)',border:'rgba(240,237,230,.07)',shadow:'0 8px 32px rgba(0,0,0,.6)',radius:'0px',fontDisplay:'Lora',fontBody:'Syne',fontMono:'JetBrains Mono',googleFonts:'Lora:ital,wght@0,400;0,500;1,400;1,500|Syne:wght@400;500;600;700',references:['Robinhood','Copilot','Monarch'],feel:'Clarity. I can see where the money went.'},
11:{mode:'light',background:'#FAFAF8',surface:'#FFFFFF',accent:'#0D9488',accentHover:'#0F766E',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:wght@400;500;600;700|DM+Sans:wght@300;400;500;600',references:['Bonsai','FreshBooks','Wave'],feel:'Fast professional trustworthy.'},
12:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Toast POS','ChowNow','Olo'],feel:'I am already hungry.'},
13:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Compass','Sothebys Realty','The Agency'],feel:'Something here worth looking at.'},
14:{mode:'light',background:'#FFFFFF',surface:'#F9FAFB',accent:'#0EA5E9',accentHover:'#0284C7',text:'#111827',textMuted:'#6B7280',border:'#E5E7EB',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Wellfound','LinkedIn Jobs','Lever'],feel:'Real opportunities. One could change everything.'},
15:{mode:'dark',background:'#0F0E17',surface:'rgba(255,255,255,0.05)',accent:'#9B8AFA',accentHover:'#7C6AF0',text:'#F1F5F9',textMuted:'#94A3B8',border:'rgba(155,138,250,0.15)',shadow:'0 1px 3px rgba(0,0,0,0.4)',radius:'16px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:wght@400;500;600;700|DM+Sans:wght@300;400;500;600',references:['Memberstack','Patreon','Ghost'],feel:'Premium membership. Worth every dollar.'},
16:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Studio Anton','Lu Yu','Awwwards'],feel:'This person has taste. I want to hire them.'},
17:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Maven','Teachable','Kajabi'],feel:'I trust them to teach me.'},
18:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Ghost','Substack','Medium'],feel:'I want to read this right now.'},
19:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0891B2',accentHover:'#0E7490',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Lattice','Rippling','Linear'],feel:'Real people. I feel connected.'},
20:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['La Colombe','Aesop','Editorial creator'],feel:'I want to click everything.'},
21:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Faire','Wolf and Badger','Not On The High Street'],feel:'Real items. Trust is present.'},
22:{mode:'light',background:'#F8FBFF',surface:'#FFFFFF',accent:'#0EA5E9',accentHover:'#0284C7',text:'#0C4A6E',textMuted:'#64748B',border:'#BAE6FD',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'DM Sans',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Sans:wght@300;400;500;600;700',references:['One Medical','Oscar Health','MyChart'],feel:'I am in good hands.'},
23:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Joy','Zola','Artifact Uprising'],feel:'Most important day handled with care.'},
24:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0891B2',accentHover:'#0E7490',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Deputy','When I Work','7shifts'],feel:'Whole week at a glance.'},
25:{mode:'dark',background:'#07090F',surface:'#0C0F18',accent:'#B8FF3C',accentHover:'#A8EF2C',text:'#E8EAF0',textMuted:'rgba(232,234,240,.6)',border:'rgba(232,234,240,.07)',shadow:'0 8px 32px rgba(0,0,0,.5)',radius:'0px',fontDisplay:'Barlow Condensed',fontBody:'Barlow',fontMono:'JetBrains Mono',googleFonts:'Barlow+Condensed:wght@600;700;800;900|Barlow:wght@300;400;500',references:['Luma','Threads','Partiful'],feel:'My people are here.'},
26:{mode:'light',background:'#FAFAFA',surface:'#FFFFFF',accent:'#0F9590',accentHover:'#0D7A76',text:'#0F172A',textMuted:'#6B7280',border:'#E5E7EB',shadow:'0 1px 2px rgba(0,0,0,0.05)',radius:'6px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Linear','Monday.com','Asana'],feel:'Team organized. We are going to ship.'},
27:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Bear','Craft','iA Writer'],feel:'Everything organized and findable.'},
28:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0891B2',accentHover:'#0E7490',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'DM Serif Display',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Serif+Display:ital@0;1|DM+Sans:wght@300;400;500;600',references:['Toggl','Harvest','Clockify'],feel:'Time accounted for. Not leaving money on the table.'},
29:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Toast POS','TouchBistro','Aloha'],feel:'Finger on the pulse of my restaurant.'},
30:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#7C3AED',accentHover:'#6D28D9',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'DM Serif Display',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Serif+Display:ital@0;1|DM+Sans:wght@300;400;500;600',references:['Maven','Docebo','TalentLMS'],feel:'My development matters.'},
31:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Luma','Eventbrite','Partiful'],feel:'Something worth going to. Need a ticket now.'},
32:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0F172A',accentHover:'#1E293B',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Fishbowl','inFlow','Cin7'],feel:'Operation is under control.'},
33:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#8B5CF6',accentHover:'#7C3AED',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'DM Sans',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Sans:wght@300;400;500;600;700',references:['Zendesk','Intercom','Front'],feel:'Every issue will be resolved.'},
34:{mode:'dark',background:'#0A0A0A',surface:'#111111',accent:'#C8FF00',accentHover:'#B8EF00',text:'#F0EDE6',textMuted:'rgba(240,237,230,.6)',border:'rgba(240,237,230,.07)',shadow:'0 8px 32px rgba(0,0,0,.6)',radius:'0px',fontDisplay:'Lora',fontBody:'Syne',fontMono:'JetBrains Mono',googleFonts:'Lora:ital,wght@0,400;0,500;1,400;1,500|Syne:wght@400;500;600;700',references:['Betterment','Wealthfront','Personal Capital'],feel:'I know exactly where I stand.'},
35:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#F59E0B',accentHover:'#D97706',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'Outfit',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Outfit:wght@300;400;500;600;700|DM+Sans:wght@300;400;500',references:['Typeform','Tally','SurveyMonkey'],feel:'Going to learn something real.'},
36:{mode:'light',background:'#F9F7F4',surface:'#0F1923',accent:'#E8D5B0',accentHover:'#F5EDD8',text:'#0F1923',textMuted:'rgba(15,25,35,.55)',border:'rgba(15,25,35,.09)',shadow:'0 8px 32px rgba(0,0,0,.4)',radius:'0px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300|DM+Sans:wght@200;300;400;500',references:['Aesop','Flamingo Estate','Graza'],feel:'Curated just for me.'},
37:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0891B2',accentHover:'#0E7490',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Buildium','AppFolio','Propertyware'],feel:'Properties managed. I can sleep.'},
38:{mode:'dark',background:'#07090F',surface:'#0C0F18',accent:'#B8FF3C',accentHover:'#A8EF2C',text:'#E8EAF0',textMuted:'rgba(232,234,240,.6)',border:'rgba(232,234,240,.07)',shadow:'0 8px 32px rgba(0,0,0,.5)',radius:'0px',fontDisplay:'Barlow Condensed',fontBody:'Barlow',fontMono:'JetBrains Mono',googleFonts:'Barlow+Condensed:wght@600;700;800;900|Barlow:wght@300;400;500',references:['Spotify','Overcast','Pocket Casts'],feel:'Deep listening invited.'},
39:{mode:'light',background:'#FFFFFF',surface:'#F9FAFB',accent:'#0EA5E9',accentHover:'#0284C7',text:'#111827',textMuted:'#6B7280',border:'#E5E7EB',shadow:'0 2px 8px rgba(0,0,0,0.08)',radius:'12px',fontDisplay:'Outfit',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Outfit:wght@300;400;500;600;700|DM+Sans:wght@300;400;500',references:['Toptal','Contra','Fiverr Pro'],feel:'Trust signals everywhere.'},
40:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['VolunteerMatch','Galaxy Digital','InitLive'],feel:'Impact is visible.'},
41:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#EC4899',accentHover:'#DB2777',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'12px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Buffer','Later','Sprout Social'],feel:'Content calendar under control.'},
42:{mode:'light',background:'#FFFFFF',surface:'#F8FAFC',accent:'#0891B2',accentHover:'#0E7490',text:'#0F172A',textMuted:'#64748B',border:'#E2E8F0',shadow:'0 1px 3px rgba(0,0,0,0.06)',radius:'8px',fontDisplay:'DM Sans',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Sans:wght@300;400;500;600;700',references:['Lever','Greenhouse','Ashby'],feel:'Going to find the right person.'},
43:{mode:'light',background:'#FFFFFF',surface:'#FAFAF9',accent:'#1A1A1A',accentHover:'#374151',text:'#1C1917',textMuted:'#78716C',border:'#E7E5E4',shadow:'0 1px 2px rgba(0,0,0,0.04)',radius:'8px',fontDisplay:'Lora',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Lora:wght@400;500;600|DM+Sans:wght@300;400;500;600',references:['Notion','Confluence','GitBook'],feel:'Everything organized and findable.'},
44:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['NYT Cooking','Milk Street','Smitten Kitchen'],feel:'Week handled. Eating well.'},
45:{mode:'dark',background:'#0C0D10',surface:'rgba(255,255,255,0.05)',accent:'#F59E0B',accentHover:'#D97706',text:'#F1F5F9',textMuted:'#94A3B8',border:'rgba(255,255,255,0.07)',shadow:'0 1px 3px rgba(0,0,0,0.4)',radius:'8px',fontDisplay:'Fraunces',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Fraunces:wght@400;500;600;700;900|DM+Sans:wght@300;400;500;600',references:['Pitch','Beautiful.ai','Tome'],feel:'Investors will take us seriously.'},
46:{mode:'dark',background:'#0A0E14',surface:'rgba(255,255,255,0.05)',accent:'#0EA5E9',accentHover:'#0284C7',text:'#F9FAFB',textMuted:'#9CA3AF',border:'rgba(255,255,255,0.07)',shadow:'0 1px 3px rgba(0,0,0,0.5)',radius:'8px',fontDisplay:'Syne',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Syne:wght@400;500;600;700;800|DM+Sans:wght@300;400;500;600',references:['Samsara','Verizon Connect','Fleetio'],feel:'Every vehicle accounted for.'},
47:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Duolingo','Babbel','Pimsleur'],feel:'I am making progress. This is working.'},
48:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Calm','Waking Up','Ten Percent Happier'],feel:'Ten minutes of peace. I can exhale.'},
49:{mode:'dark',background:'#0D1117',surface:'rgba(255,255,255,0.04)',accent:'#3B82F6',accentHover:'#2563EB',text:'#E6EDF3',textMuted:'#7D8590',border:'rgba(255,255,255,0.08)',shadow:'0 1px 3px rgba(0,0,0,0.5)',radius:'6px',fontDisplay:'DM Sans',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'DM+Sans:wght@300;400;500;600;700',references:['GitHub','Linear','GitLab'],feel:'Team is shipping. Quality maintained.'},
50:{mode:'light',background:'#F5F2EC',surface:'#EDE8DC',accent:'#B5714A',accentHover:'#A8632E',text:'#1A1208',textMuted:'rgba(26,18,8,.55)',border:'rgba(26,18,8,.09)',shadow:'0 4px 20px rgba(26,18,8,.06)',radius:'0px',fontDisplay:'Cormorant Garamond',fontBody:'DM Sans',fontMono:'JetBrains Mono',googleFonts:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400|DM+Sans:wght@200;300;400;500',references:['Havenly','Article','CB2'],feel:'I can see it. This is how I want my room.'},
}
export function getDesignSystem(blueprintId: number): string {
  const ds = DESIGN_SYSTEMS[blueprintId]
  if (!ds) return ''
  return `
DESIGN SYSTEM FOR THIS APP — FOLLOW EXACTLY:
Mode: ${ds.mode}
Background: ${ds.background}
Surface/Card: ${ds.surface}
Primary Accent: ${ds.accent}
Accent Hover: ${ds.accentHover}
Primary Text: ${ds.text}
Muted Text: ${ds.textMuted}
Border: ${ds.border}
Shadow: ${ds.shadow}
Border Radius: ${ds.radius}
Display Font: ${ds.fontDisplay}
Body Font: ${ds.fontBody}
Mono Font: ${ds.fontMono}
Google Fonts Import: https://fonts.googleapis.com/css2?family=${ds.googleFonts}&display=swap

REFERENCE APPS THIS SHOULD LOOK LIKE: ${ds.references.join(', ')}
THE FEELING THIS APP MUST PRODUCE: ${ds.feel}

LOAD THE GOOGLE FONT IN THE STYLE TAG. USE THESE EXACT COLORS. NO EXCEPTIONS.
`
}
