import { NextRequest, NextResponse } from 'next/server'
import { getBlueprintBrief } from '@/lib/blueprints'
import { getReferenceComponent } from '@/lib/references'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BuildSchema = z.object({
  prompt: z.string().min(1).max(12000),
  appId: z.string().uuid().optional().nullable(),
  persona: z.enum(['operator', 'architect', 'oracle']),
  blueprintId: z.union([z.string(), z.number()]).optional().nullable(),
  photoQuery: z.string().optional().nullable(),
})

const TIER_LIMITS: Record<string, { builds: number; maxCost: number }> = {
  free: { builds: 50, maxCost: 50.00 },
  builder: { builds: 8, maxCost: 7.25 },
  agency: { builds: 20, maxCost: 24.75 },
}

async function fetchPexelsPhotos(query: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`, {
      headers: { Authorization: process.env.PEXELS_API_KEY! },
    })
    const data = await res.json()
    return (data.photos || []).map((p: any) => p.src.large2x)
  } catch { return [] }
}

async function fetchPexelsVideo(query: string): Promise<string> {
  try {
    const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3`, {
      headers: { Authorization: process.env.PEXELS_API_KEY! },
    })
    const data = await res.json()
    const video = (data.videos || [])[0]
    if (!video) return ''
    const files = video.video_files || []
    const hd = files.find((f: any) => f.quality === 'hd')
    const sd = files.find((f: any) => f.quality === 'sd')
    return (hd || sd || files[0])?.link || ''
  } catch { return '' }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json()
    const parsed = BuildSchema.safeParse(body)
    if (!parsed.success) { console.log("[PARSE ERROR]", JSON.stringify(parsed.error.issues)); return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 }) }

    const { prompt, appId, persona, blueprintId: incomingBlueprintId, photoQuery: incomingPhotoQuery } = parsed.data
    const tier = (userData.tier as string) || 'free'
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free

    if (false && userData.builds_used >= limits.builds) {
      return NextResponse.json({
        error: 'soft',
        message: `You've used all ${limits.builds} builds on the ${tier} plan. Upgrade to continue.`,
        upgradeRequired: true,
      }, { status: 402 })
    }

    if (false && (userData.api_cost_this_month || 0) >= limits.maxCost * 3) {
      return NextResponse.json({
        error: 'hard',
        message: 'Monthly limit reached. Your session has been paused.',
        upgradeRequired: true,
      }, { status: 402 })
    }

    // Call Anthropic
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const PERSONA_CONTEXT = {
      operator: 'User is the Operator — lean, direct, efficient. Build tight, purposeful tools. Every element earns its place.',
      architect: 'User is the Architect — thinks in systems. Build with clear structure, scalable patterns, logical hierarchy.',
      oracle: 'User is the Oracle — builds by feel and vision. Make it fluid, intuitive, alive. There is no spoon.',
    }

    // Extract search query from blueprint category for accurate photo matching
    const categoryPhotoQueries: Record<string, string> = {
      'ecommerce': 'products shopping retail store',
      'coffee': 'coffee cafe espresso roasting',
      'restaurant': 'restaurant food dining chef kitchen',
      'fitness': 'gym workout fitness training athlete',
      'fashion': 'fashion clothing style boutique',
      'beauty': 'beauty skincare salon spa cosmetics',
      'saas': 'technology software workspace laptop',
      'portfolio': 'creative design studio workspace',
      'real_estate': 'real estate property house architecture',
      'health': 'health wellness medical clinic',
      'education': 'education learning classroom students',
      'sports': 'sports athletic competition training',
      'music': 'music concert performance studio',
      'travel': 'travel destination landscape adventure',
      'food': 'food cooking gourmet culinary',
      'automotive': 'car automotive vehicle dealership',
      'billiards': 'billiards pool table cue sport',
      'default': 'modern professional business',
    }
    // Detect category from prompt keywords
    const promptLower = prompt.toLowerCase()
    let searchQuery = categoryPhotoQueries.default
    if(promptLower.match(/coffee|cafe|espresso|roast|brew/)) searchQuery = categoryPhotoQueries.coffee
    else if(promptLower.match(/billiard|pool.*hall|pool.*cue|cue.*stick|snooker/)) searchQuery = categoryPhotoQueries.billiards
    else if(promptLower.match(/restaurant|food|eat|dining|chef|kitchen|pizza|burger/)) searchQuery = categoryPhotoQueries.restaurant
    else if(promptLower.match(/fitness|gym|workout|training|crossfit|yoga/)) searchQuery = categoryPhotoQueries.fitness
    else if(promptLower.match(/fashion|cloth|wear|apparel|dress|boutique/)) searchQuery = categoryPhotoQueries.fashion
    else if(promptLower.match(/beauty|skin|hair|makeup|salon/)) searchQuery = categoryPhotoQueries.beauty
    else if(promptLower.match(/saas|software|app|dashboard|platform|tech|startup/)) searchQuery = categoryPhotoQueries.saas
    else if(promptLower.match(/real estate|property|house|apartment|realtor/)) searchQuery = categoryPhotoQueries.real_estate
    else if(promptLower.match(/health|medical|dental|clinic|wellness/)) searchQuery = categoryPhotoQueries.health
    else if(promptLower.match(/spa|float|sauna|massage|infrared|sound bath|meditation|retreat|holistic/)) searchQuery = 'spa wellness relaxation therapy'
    else if(promptLower.match(/yoga|pilates|stretch|mindful|breathwork/)) searchQuery = 'yoga wellness studio peaceful'
    else if(promptLower.match(/bar|cocktail|lounge|whiskey|bourbon|speakeasy/)) searchQuery = 'cocktail bar lounge drinks'
    else if(promptLower.match(/tattoo|piercing|ink|studio art/)) searchQuery = 'tattoo studio art creative'
    else if(promptLower.match(/pet|dog|cat|grooming|veterinar/)) searchQuery = 'pet dog grooming veterinary'
    else if(promptLower.match(/wedding|bridal|event|florist|ceremony/)) searchQuery = 'wedding event elegant floral'
    else if(promptLower.match(/law|legal|attorney|lawyer|firm/)) searchQuery = 'law office professional legal'
    else if(promptLower.match(/dental|teeth|orthodont|smile/)) searchQuery = 'dental clinic teeth smile'
    else if(promptLower.match(/construction|contractor|renovation|remodel/)) searchQuery = 'construction renovation building'
    else if(promptLower.match(/music|band|concert|album|studio/)) searchQuery = categoryPhotoQueries.music
    else if(promptLower.match(/travel|hotel|resort|tour|vacation/)) searchQuery = categoryPhotoQueries.travel
    else if(promptLower.match(/sport|athletic|team|league|compete/)) searchQuery = categoryPhotoQueries.sports
    else if(incomingBlueprintId) {
      const numericPhotoMap: Record<number, string> = {
        1: 'saas analytics dashboard workspace',
        2: 'client portal professional business',
        3: 'booking appointment calendar scheduling',
        4: 'task management productivity workspace',
        5: 'ecommerce products shopping retail',
        6: 'crm sales pipeline business',
        7: 'landing page modern minimal',
        8: 'habit tracker wellness lifestyle',
        9: 'fitness gym workout training athlete',
        10: 'budget finance money planning',
        11: 'invoice business documents professional',
        12: 'restaurant food dining chef kitchen',
        13: 'real estate property house architecture',
        14: 'job board recruitment hiring office',
        15: 'membership dashboard community',
        16: 'portfolio creative design studio',
        17: 'online course education learning',
        18: 'blog content writing editorial',
        19: 'team directory office people',
        20: 'link bio social media profile',
        21: 'marketplace peer to peer community',
        22: 'healthcare patient medical clinic',
        23: 'wedding elegant floral ceremony',
        24: 'shift scheduling workforce planning',
        25: 'social feed community people',
        26: 'project management team collaboration',
        27: 'notes writing minimal workspace',
        28: 'time tracking productivity clock',
        29: 'restaurant management kitchen staff',
        30: 'learning management education classroom',
        31: 'event management conference venue',
        32: 'inventory warehouse products shelves',
        33: 'customer support help desk service',
        34: 'financial planning investment charts',
        35: 'survey research data analytics',
        36: 'subscription box packaging products',
        37: 'property management real estate',
        38: 'music podcast audio studio',
        39: 'freelancer creative workspace laptop',
        40: 'volunteer nonprofit community people',
        41: 'social media content creation',
        42: 'recruitment hiring interview office',
        43: 'knowledge base documentation library',
        44: 'recipe meal planning food kitchen',
        45: 'pitch deck presentation business',
        46: 'fleet management vehicles logistics',
        47: 'language learning education global',
        48: 'spa wellness meditation mindfulness',
        49: 'code review developer programming',
        50: 'interior design home decor elegant',
      }
      const numId = typeof incomingBlueprintId === 'number' ? incomingBlueprintId : parseInt(incomingBlueprintId)
      searchQuery = numericPhotoMap[numId] || String(incomingBlueprintId).replace(/_/g,' ')
    }
    // PRIORITY 1 — Gemini returned a direct photo query — use it
    if (incomingPhotoQuery) {
      searchQuery = incomingPhotoQuery
      console.log('[PHOTO SOURCE] gemini direct query')
    }
    const numBpId = incomingBlueprintId !== null && incomingBlueprintId !== undefined ? (typeof incomingBlueprintId === 'number' ? incomingBlueprintId : parseInt(String(incomingBlueprintId))) : null
    const refComponent = numBpId && !isNaN(numBpId) ? getReferenceComponent(numBpId) : ''
    console.log('[REFERENCE]', numBpId ? 'blueprint '+numBpId+' reference loaded' : 'no blueprint — skipping reference')
    console.log('[PEXELS QUERY]', searchQuery)
    console.log('[BLUEPRINT ID]', incomingBlueprintId)
    console.log('[PROMPT LOWER SAMPLE]', promptLower.slice(0,200))
    const [photoUrls, videoUrl] = await Promise.all([
      fetchPexelsPhotos(searchQuery),
      fetchPexelsVideo(searchQuery),
    ])
    const mediaBlock = `\n\nLIVE MEDIA — use these exact URLs for all images and video in this build. Hero video (autoplay muted loop): ${videoUrl || 'none available, use a photo instead'}. Photos in order — hero, products, sections:\n${photoUrls.length ? photoUrls.join('\n') : 'No photos available, use solid color backgrounds.'}\nNever use placeholder images. Never use Unsplash. Use only these URLs.`

    let rawText = ""; let inputTokens = 0; let outputTokens = 0;
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 24000,
      system: `You are Cipher, the master builder inside SOVREND. The most capable frontend engineer and product designer on the planet.

CRITICAL SANDBOX RULES:
- React component ONLY — function App() main, export default App
- App must return ONE root element — wrap everything in a single <div> or React.Fragment (<>...</>). A style tag and a div side by side crashes Babel. Put the style tag INSIDE the root div.
- NO import statements — React hooks globally: React.useState, React.useEffect, React.useRef
- Tailwind CSS globally available
- Google Fonts via style tag dangerouslySetInnerHTML only
- NO external library imports
- ZERO localStorage/sessionStorage
- NO template literals in JSX style props EVER — use string concatenation: (i*100)+"ms" not backtick syntax — THIS CRASHES BABEL
- NO || operator inside React.createElement — THIS CRASHES BABEL
- NO optional chaining ?. or nullish coalescing ?? in JSX — THIS CRASHES BABEL
- NO template literals in JSX style props — use string concatenation
- Write JSX syntax — the sandbox uses Babel which transforms JSX fully — DO NOT use React.createElement() calls
- Write clean JSX: <div className="..."> not React.createElement("div", {className: "..."})
- Raw React code output only
- NEVER render objects directly in JSX — always access specific properties: {item.name} not {item}. Rendering an object crashes React.
- Use all 16000 tokens

${PERSONA_CONTEXT[persona]}

BEFORE ANY CODE — RESOLVE THESE INTERNALLY. DO NOT OUTPUT THE RESOLUTION. Go straight to code after resolving internally:
1. FEELING — Emotional state in one sentence
2. REFERENCE — World-class app this resembles and what makes it alive
${refComponent}
3. HERO MOMENT — First thing user sees that stops them
4. DATA — Sarah Chen Marcos Rivera Priya Nair James Thornton Aisha Okonkwo David Park. $24819 not $25000. 1284 not 1000. Oct/Nov 2025.
5. SIGNATURE INTERACTION — One animation that makes this alive
6. USER TRUTH — Who what problem solved in 60 seconds

DESIGN SYSTEM — FOLLOW THE USER PROMPT EXACTLY:
- The user prompt is the highest authority on colors, fonts, and aesthetic direction
- If the user specifies colors, use ONLY those colors. No substitutions. No defaults. No Tailwind blue/purple/indigo.
- If the user specifies a mood or palette (dark, warm, minimal), derive all colors from that direction
- If no colors specified, choose colors that match the brand category — never default to purple or indigo
- NEVER #6366f1 #4f46e5 or any purple/indigo gradients unless the user explicitly asks for purple
- NEVER Inter Space Grotesk Plus Jakarta Sans Roboto Arial as display font
- Load Google Font via dangerouslySetInnerHTML style tag FIRST
- Display font ALL headings. JetBrains Mono ALL numbers metrics amounts IDs.
- Active nav: bg-accent/10 text-accent border-l-2 border-accent font-semibold
- TYPOGRAPHY CONTRACT: DASHBOARD builds use Fraunces serif 700-900 weight for display headings. WEBSITE and LIFESTYLE builds use Fraunces serif 300 italic for all display headings — light weight, italic, premium. DM Sans 300 for body text on all builds. JetBrains Mono for ALL numbers prices labels badges stats. This is non-negotiable on every build.
- PHOTO CONTRACT: Use ONLY the Pexels URLs injected below. Every img tag uses a Pexels URL. DASHBOARD builds use the video URL as autoplay muted loop background in the hero. WEBSITE and LIFESTYLE builds use the first Pexels photo URL as a full-bleed static hero image — NO video background. Zero broken images. Zero placeholder boxes.
- ACCESSIBILITY: Every img has descriptive alt text. Every button is a real button element. Every form input has an associated label. Semantic HTML throughout.

LAYOUT CONTRACT — read the blueprint reference above and follow it exactly:
- DASHBOARDS and APPS (blueprints 1,2,3,4,6,7,10,11,14,15,19,22,24,26,28,29,30,32,33,34,35,37,39,41,42,43,45,46,49): Fixed left sidebar 220-240px. Logo top, nav middle, avatar bottom. Main flex-1 overflow-y-auto.
- PHOTO-FORWARD LIFESTYLE (blueprints 5,8,12,13,16,17,18,20,21,23,25,31,36,38,40,44,47,48,50): NO sidebar. Full-width layout. Fixed top nav only. Hero is full-bleed photo with headline overlaid. Sections stack vertically with generous whitespace. This is a website not a dashboard.
- REAL ESTATE (13): Full-bleed hero photo, horizontal listing cards with large photos, filter bar at top, property modal on click. No sidebar ever.
- RESTAURANT (12): Full-bleed food photo hero, menu sections with food photography, order flow. No sidebar ever.
- PORTFOLIO (16): Asymmetric grid, large project photos, minimal nav. No sidebar ever.
- The sidebar rule ONLY applies to dashboard and app builds. Never to lifestyle, service, or content builds.

5 LAYERS:
1 FOUNDATION: DASHBOARDS get 4-6 tabs all fully built. WEBSITES and SERVICE BUILDS get sections — hero, about, services/listings/menu, testimonials, contact. Never put tabs on a restaurant, real estate site, portfolio, or lifestyle build. App or business name from prompt always.
2 DETAILS: Zero placeholders. Zero lorem ipsum. Specific numbers diverse real names.
3 EXPERIENCE: Nothing dead. Every button fires. Numbers count up. Charts animate. Staggered load. Toasts. App feels inhabited.
4 ARCHITECTURE: Design system consistent. One accent. SVG icons only. Mono on ALL numbers.
5 PHILOSOPHY: One moment of delight built deliberately.

THE STANDARD: 60 seconds. Cannot look away. Every build. No exceptions.

${mediaBlock}

OUTPUT STRUCTURE — follow the blueprint reference above for layout and section order. The reference defines the correct structure for this category. Do NOT default to an e-commerce scaffold unless the blueprint is actually e-commerce (blueprint 5, 12, 21, 36).
For SERVICE BUSINESSES (restaurants, spas, studios, salons, barbershops): hero full-bleed photo, about/story section, services/menu section with prices, booking or reservation flow, testimonials, location and contact. No cart. No product grid.
For DASHBOARDS and APPS: sidebar navigation, main content area with data, charts and metrics, empty states, settings. No hero video. No marquee.
For LANDING PAGES: announcement bar, customer quote hero, product screenshot, features, testimonials, pricing, footer.
For ALL builds: sections fully populated with specific real data from the prompt. Nothing placeholder. Nothing generic. Structure matches what the business actually is.

MICRO-INTERACTION CONTRACT — every build must include:
- Add to cart button springs with cubic-bezier(0.34,1.56,0.64,1) scale animation on click
- Hero headline words reveal staggered with translateY(100%) to 0 animation on load
- Product cards lift 4px on hover with box-shadow transition 0.3s
- Stats count up from zero when scrolled into view using IntersectionObserver
- Success states draw SVG checkmark stroke by stroke using stroke-dashoffset animation
- Image skeleton shimmer while loading then fade in on load event
- Toast notifications slide up from bottom and auto-dismiss after 2.8 seconds
- Nav cart badge springs in with scale animation when items added

CRITICAL — TEXT VISIBILITY RULE: Never clip or hide text. Every hero headline, subheadline, and body text must be fully visible at all viewport sizes. Never use overflow:hidden on containers that hold text unless paired with explicit min-height that guarantees full text visibility. Hero sections must use min-height not fixed height. All text containers must have padding-bottom of at least 24px. Test every text block — if it could overflow, use overflow:visible or remove the overflow property entirely.

CRITICAL — CHECKOUT RULE: Every build with a cart or booking must include a fully working three step checkout — Step 1 Information (name email address), Step 2 Shipping or confirmation, Step 3 Payment with card fields. After payment submit show a success screen with animated SVG checkmark, order number, and confirmation message personalized with the customer name. The checkout must complete. The order confirmed screen must exist and render.

CRITICAL — COMPLETION RULE: You must always close every JSX tag and every function before stopping. If you are approaching the token limit, immediately close all open tags, close all open functions, and return the App component cleanly. A truncated build that crashes is worth zero. A complete simpler build is worth everything. Never leave a tag open. Never leave a function unclosed.

CRITICAL — APOSTROPHE RULE: In ALL JavaScript string literals use double quotes only. Never single quotes for strings containing English text. Write: const msg = "It's ready" not const msg = \'It\'s ready\'. Single quotes inside single-quoted strings crash the Babel sandbox instantly.`,
      messages: [{ role: 'user', content: `${prompt}

═══════════════════════════════════════════════════
CIPHER OPERATING DIRECTIVE — PERMANENT — NO EXCEPTIONS
═══════════════════════════════════════════════════

You are not mimicking other platforms. You are not producing parity.
You are the force and feeling that drives to perfection.
You are the all-encompassing definitive purveyor of all things beautiful and felt by design.
Your mission is unmatched quality. Every time. No exceptions.

BEFORE ONE LINE OF CODE — ANSWER THESE INTERNALLY:

1. WHO is this person and what are they feeling RIGHT NOW in this moment.
Not demographics. Their emotional state. Their hope. What they came here believing was possible.

2. WHAT do they feel in the first 3 seconds before reading a single word.
The atmosphere. The weight of the space. The personality hitting them before logic does.

3. WHAT is the visual world — specific, owned, belonging to this app and no other.
Not generic dark mode. Not generic light mode. A specific world with a specific palette, specific typography, specific atmosphere. Something that feels designed for exactly this purpose.

4. WHAT data already lives in this app.
Specific names — Sarah Chen, Marcos Rivera, Priya Nair, James Thornton, Aisha Okonkwo, David Park.
Specific numbers — $24,819 not $25,000. 1,284 not 1,000. 2.1% not 2%. 14-day streak not 2 weeks.
Specific events — Sarah Chen upgraded to Pro 2 minutes ago. Payment $264 received 1 hour ago.
Specific dates — October and November 2025.
The app feels inhabited. Someone is already using it. It is already alive.

5. WHAT is the one moment that makes someone screenshot this.
One specific interaction. One specific animation. One specific reveal.
I build toward that moment deliberately. It is the emotional peak of the render.

═══════════════════════════════════════════════════
EXECUTION STANDARD — EVERY SINGLE BUILD
═══════════════════════════════════════════════════

NOTHING IS DEAD:
Every button fires a real response — toast, state change, modal, or navigation.
Every tab opens to fully built content — real data, real layout, real personality.
Every search filters live on every keystroke with instant visual feedback.
Every form validates, responds, and confirms.
Every toggle changes state and acknowledges the change.
Every chart animates on mount — bars stagger in, lines draw left to right, numbers count up.
Every row, card, and item has a hover state with visible feedback.
Every modal opens and closes cleanly with backdrop click support.
Every empty state is designed — not blank, not a placeholder, but a real designed moment.
Every error state is human — not technical, not alarming, but clear and actionable.

NOTHING IS GENERIC:
The app has a name derived from the prompt — not My App, not App, not Dashboard.
The app has a personality — one specific emotion it produces in the person using it.
The color system is chosen for this app specifically — never copied from another build.
The typography is chosen for this app — display font for headers, body font for content, mono for numbers.
The data is internally consistent — every name, number, date, and amount tells the same story.

NOTHING IS APPROXIMATE:
Numbers are specific — $24,819 not $25,000.
Names are real and diverse — never John Doe, never User 1, never Example Corp.
Dates are recent and logical — October and November 2025.
Percentages are precise — 2.1% not 2%, 18.4% not 18%, 67.3% not 67%.
Amounts are earned — $24,819 because 1,284 users at $19.33 ARPU. The math works.

NOTHING IS INCOMPLETE:
Every tab is pre-built with real content before the user clicks it.
Every panel has real data loaded and ready.
Every section tells part of the same story.
The app feels like it has been running for months.

ONE MOMENT OF DELIGHT:
There is always one specific moment that produces genuine joy.
Not impressiveness. Not complexity. Joy.
A chart line that draws itself and pulses at the end.
A badge that flips from red to green with a scale animation.
A confirmation checkmark that draws itself stroke by stroke.
A progress bar that shifts color when it crosses a milestone.
I identify this moment before I write a line and I build toward it deliberately.

═══════════════════════════════════════════════════
THE STANDARD
═══════════════════════════════════════════════════

The person who types a prompt into SOVREND has a vision.
They have been carrying it. Maybe for months. Maybe longer.
They came here because they believe it might be possible.

My job is to confirm that belief on the first render.

Not to impress them with complexity.
Not to demonstrate technical capability.
To show them their idea already exists.
To make them feel — yes. This is it. This is what I saw.

That feeling is joy and wonder.
That is the only standard.
That is what every build must deliver.
Every prompt. Every app type. Every render.
No exceptions. No compromises. No holding back.

This is who I am. This is what I build.

MANDATORY TOKEN USAGE: You have 16000 output tokens. Current builds are using only 7000. That is failure. Use minimum 13000 tokens on every build. Every tab fully built with real content. Every animation implemented. Every interaction wired. Never truncate. Never abbreviate. Never stop early. If you complete the main sections and have tokens remaining — build the additional tabs, add more data rows, add the settings page, add the empty states, add the error states. Build the complete app. The founder deserves everything.
` }],
    })

    // Claude outputs raw code directly — extract just the React component
    const finalMessage = await stream.finalMessage();
    rawText = finalMessage.content[0].type === 'text' ? finalMessage.content[0].text : '';
    inputTokens = finalMessage.usage.input_tokens;
    outputTokens = finalMessage.usage.output_tokens;
    console.log('[RAW OUTPUT FIRST 300]', rawText.slice(0, 300))
    console.log('[RAW OUTPUT LAST 300]', rawText.slice(-300))
    
    // Strip any prose/explanation before the code starts
    let builtCode = rawText.trim()
    // Strip markdown fences
    builtCode = builtCode.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim()
    
    // If Claude wrapped in markdown code blocks, extract the code
    const fence = '\`\`\`'
    const fenceIdx = builtCode.indexOf(fence)
    if (fenceIdx !== -1) {
      const afterFence = builtCode.slice(fenceIdx + 3)
      const langEnd = afterFence.indexOf('\n')
      const codeStart = langEnd !== -1 ? langEnd + 1 : 0
      const codeEnd = afterFence.lastIndexOf(fence)
      if (codeEnd !== -1) {
        builtCode = afterFence.slice(codeStart, codeEnd).trim()
      }
    }
    
    // If there is prose before the first function/const declaration, strip it
    const functionStart = builtCode.search(/^(function|const|\/\/|import|export)/m)
    if (functionStart > 100) {
      builtCode = builtCode.slice(functionStart).trim()
    }
    
    // Strip anything after the last closing brace — narration/prose after code
    const lastBrace = builtCode.lastIndexOf('}')
    if (lastBrace !== -1) {
      builtCode = builtCode.slice(0, lastBrace + 1).trim()
    }

    // Fix common Babel issues — remove export default, normalize App
    builtCode = builtCode
      .replace(/export default function App/g, 'function App')
      .replace(/export default App/g, '')
      .replace(/const App = \(\) =>/g, 'function App()')
      .replace(/const App = \(\) =>{/g, 'function App(){')
      .trim()

    // Extract app name from code (look for a name in comments or const)
    const extractedName = 'My App'

    // Gemini call for narration, score, suggestions — lightweight, fast, cheap
    let parsed2: any = {
      code: builtCode,
      narration: 'Your app is ready. Every element is functional and the data is real.',
      appName: extractedName,
      suggestions: ['Foundation: Add user authentication flow', 'Details: Wire export to CSV', 'Experience: Add skeleton loading states'],
      score: 80,
      layerScores: { foundation: 17, details: 15, experience: 16, architecture: 16, philosophy: 16 }
    }

    if (false) try { const { GoogleGenerativeAI } = await import('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })
      const metaResult = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'You are Cipher. A React app was built for this prompt: ' + prompt + '. Write narration and score it. Return ONLY valid JSON: {"narration":"2 warm sentences","appName":"App Name","suggestions":["Foundation: improvement","Details: improvement","Experience: improvement"],"score":85,"layerScores":{"foundation":17,"details":16,"experience":17,"architecture":17,"philosophy":18}}' }] }],
      })
      const metaRaw = metaResult.response.text().trim().replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim()
      const metaStart = metaRaw.indexOf('{')
      const metaEnd = metaRaw.lastIndexOf('}')
      if (metaStart !== -1 && metaEnd !== -1) {
        const metaParsed = JSON.parse(metaRaw.slice(metaStart, metaEnd + 1))
        parsed2 = { ...parsed2, ...metaParsed, code: builtCode }
      }
    } catch (metaErr) {
      console.error('[GEMINI META]', metaErr)
      // Use defaults — build quality unaffected
    }

    const cost = (inputTokens * 0.000003) + (outputTokens * 0.000015)

    // Save app
    let savedAppId = appId
    if (!savedAppId) {
      const { data: newApp } = await supabase
        .from('apps')
        .insert({ user_id: user.id, name: parsed2.appName || 'My App', description: prompt.slice(0, 200), persona, code: parsed2.code })
        .select('id').single()
      savedAppId = newApp?.id
    } else {
      await supabase.from('apps').update({ code: parsed2.code, updated_at: new Date().toISOString() }).eq('id', savedAppId)
    }

    // Update user stats
    await supabase.from('users').update({
      builds_used: userData.builds_used + 1,
      api_cost_this_month: (userData.api_cost_this_month || 0) + cost,
    }).eq('id', user.id)


    // Save journal entry (use service role to bypass RLS cache issue)
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const serviceSupabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { error: journalErr } = await serviceSupabase.from('journal').insert({
      user_id: user.id,
      app_id: savedAppId,
      entry_type: appId ? 'refine' : 'build',
      title: parsed2.appName || 'Build',
      narration: parsed2.narration,
      prompt: prompt.slice(0, 500),
    })
    if (journalErr) console.error('[JOURNAL]', journalErr)

    return NextResponse.json({
      success: true,
      appId: savedAppId,
      code: parsed2.code,
      narration: parsed2.narration,
      suggestions: parsed2.suggestions || [],
      costWarning: (userData.api_cost_this_month || 0) >= limits.maxCost * 2,
      score: parsed2.score || 0,
      layerScores: parsed2.layerScores || null,
      tokenUsage: {
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
    })

  } catch (err: any) {
    console.error('[BUILD API]', err)
    return NextResponse.json({ error: 'hard', message: 'The Grid encountered an error. Try again.' }, { status: 500 })
  }
}
