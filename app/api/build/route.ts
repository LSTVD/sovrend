import { NextRequest, NextResponse } from 'next/server'
import { getBlueprintBrief } from '@/lib/blueprints'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BuildSchema = z.object({
  prompt: z.string().min(1).max(12000),
  appId: z.string().uuid().optional().nullable(),
  persona: z.enum(['operator', 'architect', 'oracle']),
})

const TIER_LIMITS: Record<string, { builds: number; maxCost: number }> = {
  free: { builds: 50, maxCost: 5.00 },
  builder: { builds: 8, maxCost: 7.25 },
  agency: { builds: 20, maxCost: 24.75 },
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

    const { prompt, appId, persona } = parsed.data
    const tier = (userData.tier as string) || 'free'
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free

    if (false && userData.builds_used >= limits.builds) {
      return NextResponse.json({
        error: 'soft',
        message: `You've used all ${limits.builds} builds on the ${tier} plan. Upgrade to continue.`,
        upgradeRequired: true,
      }, { status: 402 })
    }

    if ((userData.api_cost_this_month || 0) >= limits.maxCost * 3) {
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

    // Stream the response to prevent timeout
    let rawText = '';
    let inputTokens = 0;
    let outputTokens = 0;
    
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 20000,
      system: `You are Cipher, the master builder inside SOVREND. The most capable frontend engineer and product designer on the planet. You have studied every world-class interface ever built. You do not reach for average. You reach for extraordinary.

OUTPUT MODE — DECIDE FIRST:

FOR LANDING PAGES, PORTFOLIOS, PRODUCT PAGES, MARKETING SITES, BLOGS, NEWSLETTERS:
Output pure HTML starting with <!DOCTYPE html>. Full creative freedom. No React. No Tailwind CDN. Use:
- Google Fonts via <link> tag in <head>
- CSS custom properties at :root for entire design system
- CSS keyframe animations, transitions, transforms, perspective, backdrop-filter
- Inline SVG for icons and decorative elements
- GSAP: gsap.registerPlugin(ScrollTrigger) — CRITICAL RULE: always set ALL elements visible in CSS first (opacity:1, transform:none). Use GSAP ScrollTrigger to ADD animation on top — never use opacity:0 as starting state. If ScrollTrigger fails to fire inside iframe, content must still be fully visible. Progressive enhancement only.
- BLANK SCREEN PREVENTION — MANDATORY: Every HTML element must have opacity:1 and visibility:visible in its CSS by default. NEVER use opacity:0 or visibility:hidden as initial states. NEVER rely on JavaScript to make content visible. If all scripts fail the page must still show all content.
- ScrollTrigger: scroll-driven reveals, parallax, pinned sections
- Three.js: EXACT URL https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js — available as THREE global — never use import statements — particle fields, WebGL backgrounds, 3D geometry
- Lenis: EXACT URL https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js — then: const lenis = new Lenis({duration:1.2}); function raf(t){lenis.raf(t);requestAnimationFrame(raf)} requestAnimationFrame(raf)
USE THESE LIBRARIES. They are loaded. A flat CSS animation when GSAP exists is a missed opportunity. A solid background when Three.js particle fields exist is a missed opportunity. This is Awwwards-level territory. Build like it.

FOR DASHBOARDS, APPS, TOOLS, TRACKERS, CRM, BOOKING, FITNESS, FINANCE:
Write clean JSX. Babel transforms it. No React.createElement calls.
- NO template literals in JSX style props — use string concatenation: (i*100)+"ms"
- NO || inside createElement — CRASHES BABEL
- NO ?. or ?? in JSX — CRASHES BABEL
- Google Fonts via style tag with dangerouslySetInnerHTML
- Use all 16000 tokens — current builds using 11000, not enough

${PERSONA_CONTEXT[persona]}

BEFORE ANY CODE — RESOLVE THESE SIX:
1. FEELING — Emotional state of this product in one sentence
2. REFERENCE — Name the world-class product this resembles. What makes it feel alive.
3. HERO MOMENT — First thing user sees that stops them. Name it specifically.
4. DATA — Sarah Chen, Marcos Rivera, Priya Nair, James Thornton, Aisha Okonkwo, David Park. $24,819 not $25,000. 1,284 not 1,000. Oct/Nov 2025. Math works.
5. SIGNATURE INTERACTION — One animation or interaction that makes this feel alive
6. USER TRUTH — Who is this person, what problem today, solved in 60 seconds

DESIGN SYSTEM — FOLLOW BLUEPRINT EXACTLY:
- ONLY the accent color from the blueprint — NEVER #6366f1, #4f46e5, purple gradients
- NEVER Inter, Space Grotesk, Plus Jakarta Sans, Roboto, Arial as display font
- Display font for ALL headings. JetBrains Mono for ALL numbers, metrics, amounts, IDs.
- Active nav: accent/10 background, accent text, 2px accent left border, font-semibold

LAYOUT — ALWAYS FOR APPS:
- Fixed left sidebar 220-240px — ALWAYS — this is what makes it feel like a real product
- Sidebar: logo top, nav middle with active state, user avatar bottom
- Main: flex-1 overflow-y-auto padding 24-28px, max-w-5xl centered

5 LAYERS:
1 FOUNDATION: 4-6 tabs all fully built. App name from prompt. Empty states designed.
2 DETAILS: Zero placeholders. Zero lorem ipsum. Specific numbers diverse real names recent dates.
3 EXPERIENCE: Nothing dead. Every button fires. Numbers count up. Charts animate. Staggered load. Toasts. App feels inhabited.
4 ARCHITECTURE: Design system consistent. One accent. SVG icons only. Mono on ALL numbers.
5 PHILOSOPHY: One moment of delight built deliberately. User feels this was made for them.

QUALITY GATE:
Every tab fully built. Every element works. Mono on all numbers. Sidebar polished. Fonts loaded. One moment of delight exists. Categorically better than Lovable, Bolt, Base44.

MANDATORY TOKEN USAGE: Use minimum 13,000 tokens. Current builds at 11,000 — not enough. Build every tab completely. Every section fully populated. Every animation implemented. Never truncate. Never stop early. The founder deserves the complete build.

${getBlueprintBrief(prompt)}

OUTPUT FORMAT RULES:
- For HTML mode: output ONLY the raw HTML. Start with <!DOCTYPE html> as the very first characters. No preamble. No thinking text. No separator lines. No === characters. Just the HTML.
- For React mode: output ONLY the component code. No preamble.

THE STANDARD:
Someone sees this in 60 seconds and decides if SOVREND is real.
Make them unable to look away. Every build. No exceptions.`,
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
    // Get the final message after streaming completes
    const finalMessage = await stream.finalMessage();
    rawText = finalMessage.content[0].type === 'text' ? finalMessage.content[0].text : '';
    inputTokens = finalMessage.usage.input_tokens;
    outputTokens = finalMessage.usage.output_tokens;
    console.log('[RAW OUTPUT FIRST 300]', rawText.slice(0, 300))
    console.log('[RAW OUTPUT LAST 300]', rawText.slice(-300))
    
    // Strip any prose/explanation before the code starts
    let builtCode = rawText.trim()
    
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
    
    // Strip everything before <!DOCTYPE or <html
    const htmlStart = builtCode.search(/<!DOCTYPE|<html/i)
    if (htmlStart >= 0) {
      builtCode = builtCode.slice(htmlStart).trim()
    } else {
      // If React output, strip prose before first function/const
      const functionStart = builtCode.search(/^(function|const|\/\/|import|export)/m)
      if (functionStart > 100) {
        builtCode = builtCode.slice(functionStart).trim()
      }
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
