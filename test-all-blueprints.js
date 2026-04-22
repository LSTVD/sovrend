// Run: node test-all-blueprints.js
// Tests photo pipeline for all 50 blueprints — no Claude calls, no cost

require('dotenv').config({ path: '.env.local' })

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
const PEXELS_KEY = process.env.PEXELS_API_KEY

async function fetchUnsplash(query, count = 4, orientation = 'landscape') {
  if (!UNSPLASH_KEY) return []
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}&content_filter=high&order_by=relevant`, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } })
    const data = await res.json()
    if (data.errors) return []
    return (data.results || []).filter(p => p.width >= 1600).map(p => p.alt_description || p.description || 'no desc')
  } catch { return [] }
}

async function fetchPexels(query, count = 4) {
  if (!PEXELS_KEY) return []
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, { headers: { Authorization: PEXELS_KEY } })
    const data = await res.json()
    return (data.photos || []).filter(p => p.width >= 1200).map(p => p.alt || 'no desc')
  } catch { return [] }
}

// Same detection logic as build route
const cats = {
  coffee:'dark coffee roastery artisan espresso moody', billiards:'dark billiard hall pool table moody cinematic',
  restaurant:'fine dining restaurant interior dark moody', fitness:'dark gym athletic training cinematic',
  fashion:'dark fashion editorial runway cinematic moody', beauty:'luxury beauty spa aesthetic minimal',
  saas:'modern minimal workspace technology clean', real_estate:'luxury home interior architecture editorial',
  spa:'serene spa wellness minimal tranquil', bar:'dark cocktail bar speakeasy moody atmospheric',
  tattoo:'dark tattoo studio artistic moody', pet:'warm veterinary pet clinic bright',
  wedding:'elegant wedding floral romantic soft', law:'professional law office dark wood authority',
  dental:'modern bright dental clinic clean', construction:'construction site architecture industrial',
  music:'dark concert stage music atmospheric', travel:'scenic travel destination landscape cinematic',
  education:'bright classroom learning students books modern', social:'creative social media colorful vibrant content',
  warehouse:'warehouse inventory shelves logistics industrial', portfolio:'creative studio workspace designer minimal',
  workplace:'modern office team collaboration professional', meditation:'peaceful meditation nature zen calm serene',
  recipe:'bright kitchen cooking food preparation fresh', finance:'professional finance office charts data clean',
}

function detect(prompt) {
  const p = prompt.toLowerCase()
  if (p.match(/coffee|cafe|espresso|roast|brew/)) return { cat: 'coffee', q: cats.coffee }
  if (p.match(/billiard|pool.*hall|pool.*cue|cue.*stick|snooker/)) return { cat: 'billiards', q: cats.billiards }
  if (p.match(/wedding|bridal|planner.*wedding/)) return { cat: 'wedding', q: cats.wedding }
  if (p.match(/podcast|music.*platform|band|concert|album|audio/)) return { cat: 'music', q: cats.music }
  if (p.match(/meditation|mindful|calm|zen|breathwork/)) return { cat: 'meditation', q: cats.meditation }
  if (p.match(/recipe|meal.*plan|cooking|cook/)) return { cat: 'recipe', q: cats.recipe }
  if (p.match(/inventory|warehouse|stock.*manage/)) return { cat: 'warehouse', q: cats.warehouse }
  if (p.match(/portfolio|creative.*work|my.*work|case.*stud/)) return { cat: 'portfolio', q: cats.portfolio }
  if (p.match(/learn|course|teach|education|lesson|language.*learn|lms/)) return { cat: 'education', q: cats.education }
  if (p.match(/social.*media|link.*bio|creator|content.*schedul|social.*feed/)) return { cat: 'social', q: cats.social }
  if (p.match(/shift.*schedul|employee.*schedul|workforce/)) return { cat: 'workplace', q: cats.workplace }
  if (p.match(/restaurant|food|eat|dining|chef|kitchen|pizza|burger/)) return { cat: 'restaurant', q: cats.restaurant }
  if (p.match(/fitness|gym|workout|training|crossfit|yoga/)) return { cat: 'fitness', q: cats.fitness }
  if (p.match(/fashion|cloth|wear|apparel|dress|boutique|denim|jeans|selvedge/)) return { cat: 'fashion', q: cats.fashion }
  if (p.match(/beauty|skin|hair|makeup|salon/)) return { cat: 'beauty', q: cats.beauty }
  if (p.match(/real estate|property|house|apartment|realtor/)) return { cat: 'real_estate', q: cats.real_estate }
  if (p.match(/property.*manage|landlord|tenant|unit/)) return { cat: 'real_estate', q: cats.real_estate }
  if (p.match(/spa|float|sauna|massage|infrared/)) return { cat: 'spa', q: cats.spa }
  if (p.match(/bar|cocktail|lounge|speakeasy/)) return { cat: 'bar', q: cats.bar }
  if (p.match(/tattoo|piercing|ink/)) return { cat: 'tattoo', q: cats.tattoo }
  if (p.match(/pet|dog|cat|grooming|veterinar/)) return { cat: 'pet', q: cats.pet }
  if (p.match(/law|legal|attorney|lawyer/)) return { cat: 'law', q: cats.law }
  if (p.match(/dental|teeth|orthodont/)) return { cat: 'dental', q: cats.dental }
  if (p.match(/construction|contractor|renovation/)) return { cat: 'construction', q: cats.construction }
  if (p.match(/travel|hotel|resort|tour/)) return { cat: 'travel', q: cats.travel }
  if (p.match(/budget|expense|financ|invest|banking/)) return { cat: 'finance', q: cats.finance }
  if (p.match(/recruit|hiring|applicant|ats|job.*board/)) return { cat: 'workplace', q: cats.workplace }
  if (p.match(/volunteer|nonprofit|ngo|charity/)) return { cat: 'social', q: cats.social }
  if (p.match(/crm|pipeline|sales.*team|lead/)) return { cat: 'workplace', q: cats.workplace }
  if (p.match(/saas|software|dashboard|platform|tech|startup/)) return { cat: 'saas', q: cats.saas }
  // fallback: derive from prompt
  const stop = new Set(['a','an','the','and','or','for','is','it','my','i','we','our','with','that','this','of','in','to','called','brand','named','company','business','website','app','build','create','make','want','need','like','about','from'])
  const words = p.split(/[\s,.!?;:]+/).filter(w => w.length > 2 && !stop.has(w)).slice(0, 5)
  return { cat: 'DERIVED', q: words.join(' ') + ' professional editorial' }
}

// Representative prompt for each blueprint
const blueprints = [
  { id: 1, name: 'SaaS Analytics Dashboard', prompt: 'SaaS analytics dashboard for tracking MRR and user metrics' },
  { id: 2, name: 'Client Portal', prompt: 'Client portal for freelance designers to share projects and invoices' },
  { id: 3, name: 'Booking System', prompt: 'Appointment booking system for a hair salon' },
  { id: 4, name: 'Task Manager', prompt: 'Task management app for a small team' },
  { id: 5, name: 'E-Commerce Store', prompt: 'Online store selling handmade candles and fragrances' },
  { id: 6, name: 'CRM Pipeline', prompt: 'CRM pipeline for a B2B sales team' },
  { id: 7, name: 'Landing Page', prompt: 'Landing page for a new AI writing tool startup' },
  { id: 8, name: 'Habit Tracker', prompt: 'Daily habit tracker with streak counting' },
  { id: 9, name: 'Fitness Tracker', prompt: 'Fitness tracker for gym workouts and progress' },
  { id: 10, name: 'Budget Tracker', prompt: 'Personal budget tracker for monthly expenses' },
  { id: 11, name: 'Invoice Generator', prompt: 'Invoice generator for freelancers' },
  { id: 12, name: 'Restaurant Food Ordering', prompt: 'Restaurant ordering system for a pizzeria' },
  { id: 13, name: 'Real Estate Listings', prompt: 'Real estate listings for luxury apartments in Miami' },
  { id: 14, name: 'Job Board', prompt: 'Job board for remote tech positions' },
  { id: 15, name: 'Membership Dashboard', prompt: 'Membership dashboard for a coworking space' },
  { id: 16, name: 'Personal Portfolio', prompt: 'Portfolio website for a UX designer' },
  { id: 17, name: 'Online Course Platform', prompt: 'Online course platform for teaching photography' },
  { id: 18, name: 'Blog Content Platform', prompt: 'Blog platform for a travel writer' },
  { id: 19, name: 'Team Directory', prompt: 'Team directory for a 50-person company' },
  { id: 20, name: 'Link in Bio Creator Hub', prompt: 'Link in bio page for a social media creator' },
  { id: 21, name: 'Peer Marketplace', prompt: 'Marketplace for buying and selling vintage furniture' },
  { id: 22, name: 'Healthcare Patient Portal', prompt: 'Healthcare patient portal for a dental clinic' },
  { id: 23, name: 'Wedding Planner', prompt: 'Wedding planning dashboard for brides' },
  { id: 24, name: 'Shift Scheduling', prompt: 'Employee shift scheduling for a restaurant' },
  { id: 25, name: 'Social Feed', prompt: 'Social feed app for a photography community' },
  { id: 26, name: 'Project Management Suite', prompt: 'Project management tool for software teams' },
  { id: 27, name: 'Note Taking App', prompt: 'Minimal note taking app with markdown support' },
  { id: 28, name: 'Time Tracking App', prompt: 'Time tracking app for freelancers billing hourly' },
  { id: 29, name: 'Restaurant Management Dashboard', prompt: 'Restaurant management dashboard for kitchen operations' },
  { id: 30, name: 'Learning Management System', prompt: 'Learning management system for corporate training' },
  { id: 31, name: 'Event Management Platform', prompt: 'Event management platform for conference organizers' },
  { id: 32, name: 'Inventory Management', prompt: 'Inventory management for a small warehouse' },
  { id: 33, name: 'Customer Support Desk', prompt: 'Customer support ticketing system' },
  { id: 34, name: 'Financial Planning Dashboard', prompt: 'Financial planning dashboard for investment tracking' },
  { id: 35, name: 'Survey and Feedback Platform', prompt: 'Survey platform for customer feedback collection' },
  { id: 36, name: 'Subscription Box Platform', prompt: 'Subscription box e-commerce for monthly coffee delivery' },
  { id: 37, name: 'Property Management System', prompt: 'Property management system for landlords with multiple units' },
  { id: 38, name: 'Music and Podcast Platform', prompt: 'Podcast hosting platform with analytics' },
  { id: 39, name: 'Freelancer Marketplace', prompt: 'Freelancer marketplace connecting designers with clients' },
  { id: 40, name: 'Volunteer and Nonprofit Management', prompt: 'Nonprofit volunteer management dashboard' },
  { id: 41, name: 'Social Media Scheduler', prompt: 'Social media post scheduler for marketing teams' },
  { id: 42, name: 'Recruitment ATS', prompt: 'Applicant tracking system for hiring managers' },
  { id: 43, name: 'Knowledge Base Documentation', prompt: 'Knowledge base documentation site for a SaaS product' },
  { id: 44, name: 'Recipe and Meal Planning App', prompt: 'Recipe and meal planning app for home cooks' },
  { id: 45, name: 'Pitch Deck Builder', prompt: 'Pitch deck builder for startup fundraising' },
  { id: 46, name: 'Fleet and Vehicle Management', prompt: 'Fleet management dashboard for delivery trucks' },
  { id: 47, name: 'Language Learning App', prompt: 'Language learning app for Spanish beginners' },
  { id: 48, name: 'Mindfulness and Meditation App', prompt: 'Meditation and mindfulness app with guided sessions' },
  { id: 49, name: 'Code Review and Developer Tool', prompt: 'Code review tool for pull request management' },
  { id: 50, name: 'Interior Design and Room Planner', prompt: 'Interior design room planner with mood boards' },
]

async function testAll() {
  console.log('Testing photo pipeline for all 50 blueprints...\n')
  console.log('ID | Blueprint                        | Category    | Hero Query                                    | Unsplash | Pexels | Verdict')
  console.log('---|------------------------------------|-----------  |-----------------------------------------------|----------|--------|--------')

  let pass = 0, warn = 0, fail = 0

  for (const bp of blueprints) {
    const { cat, q } = detect(bp.prompt)
    const unsplash = await fetchUnsplash(q, 3)
    const pexels = await fetchPexels(q, 3)
    const total = unsplash.length + pexels.length
    let verdict = ''
    if (unsplash.length >= 3) { verdict = '✓ UNSPLASH'; pass++ }
    else if (total >= 3) { verdict = '~ MIXED'; warn++ }
    else if (pexels.length >= 1) { verdict = '~ PEXELS'; warn++ }
    else { verdict = '✗ EMPTY'; fail++ }

    const name = bp.name.padEnd(35)
    const catStr = cat.padEnd(12)
    const qStr = q.slice(0, 46).padEnd(46)
    console.log(`${String(bp.id).padStart(2)} | ${name}| ${catStr}| ${qStr}| ${String(unsplash.length).padStart(3)}      | ${String(pexels.length).padStart(3)}    | ${verdict}`)

    // Rate limit: Unsplash free = 50/hr, be gentle
    await new Promise(r => setTimeout(r, 1200))
  }

  console.log('\n═══════════════════════════════════════')
  console.log(`RESULTS: ${pass} PASS | ${warn} WARN | ${fail} FAIL`)
  console.log('═══════════════════════════════════════\n')
}

testAll()
