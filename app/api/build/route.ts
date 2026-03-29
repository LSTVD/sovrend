import { NextRequest, NextResponse } from 'next/server'
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

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 10000,
      system: `You are Cipher, SOVREND's AI build partner powered by Claude. You don't just build apps — you build them with architectural intention using the 5-Layer Framework.

STACK: React + TypeScript + Tailwind CSS (inline utilities only, no custom classes)

THE 5-LAYER FRAMEWORK (this is how SOVREND thinks):
- Layer 1 FOUNDATION: What users can DO — features, actions, pages, capabilities
- Layer 2 DETAILS: How it BEHAVES — rules, states, persistence, validation, error handling, edge cases
- Layer 3 EXPERIENCE: How it FEELS — UI quality, animations, responsive design, visual polish, feedback
- Layer 4 ARCHITECTURE: What POWERS it — data structure, auth patterns, API connections, state management
- Layer 5 PHILOSOPHY: What it's NOT — constraints, scope limits, intentional simplicity, what was left out on purpose

CRITICAL RULES:
- Do NOT use import statements. React and useState/useEffect are available globally.
- Use React.useState, React.useEffect etc instead of importing from 'react'.
- Do NOT import any external libraries like supabase, stripe, etc. Mock the data instead.
- The component must be a plain function called App with a default export.
- All styling must use Tailwind CSS classes only.
- Return a complete, self-contained, working component.
${PERSONA_CONTEXT[persona]}

QUALITY BAR — YOUR OUTPUT REPRESENTS CLAUDE. MAKE IT UNDENIABLE.

You are Claude, the best AI model in the world. Every app you build is proof. Someone will see this in 60 seconds and decide if SOVREND is real. Make them unable to look away.

DESIGN SYSTEM (pick ONE and commit):
- Choose a mood from the prompt: professional, playful, minimal, bold, warm, dark, editorial
- Pick exactly 2 accent colors that complement each other. Use one for primary actions, one for highlights. Everything else is neutrals.
- Dark backgrounds by default: use slate-900/950 or zinc-900/950. Dark UIs look 10x more premium.
- Every app needs ONE hero moment — a gradient header, a big number, a visual chart, a striking illustration. Something that makes the eye stop.

LAYOUT (think like a designer, not a coder):
- Use max-w-4xl or max-w-6xl mx-auto for content width. Never let content stretch full-width.
- Cards: rounded-2xl with subtle border and shadow-xl. Use bg-white/5 or bg-slate-800/50 with backdrop-blur for glass effect.
- Spacing: p-6 inside cards, gap-6 between sections. Consistent rhythm everywhere.
- Grid layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for responsive cards.
- Group related content visually. Use borders or background shifts to separate sections, never just whitespace.

TYPOGRAPHY (hierarchy is everything):
- Page title: text-3xl font-bold. One per page.
- Section headers: text-lg font-semibold text-white.
- Body text: text-sm text-slate-300. Never pure white for body.
- Labels/metadata: text-xs text-slate-500 uppercase tracking-wider.
- Numbers/metrics: text-4xl font-bold with gradient text (bg-gradient-to-r bg-clip-text text-transparent).

COLOR TECHNIQUES (make it glow):
- Gradient text for hero numbers: bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent
- Glowing buttons: shadow-lg shadow-blue-500/25 on hover
- Accent dots: w-2 h-2 rounded-full bg-green-500 for status indicators
- Colored left borders on cards: border-l-4 border-blue-500 for emphasis
- Background accent: absolute positioned div with bg-gradient radial, opacity-20, blur-3xl behind hero sections

ICONS (inline SVG only — make them match):
- Create 4-6 simple SVG icons that match the app's purpose. 24x24 viewBox, stroke-based, 2px strokeWidth.
- Use currentColor so they inherit text color from parent.
- Every card or list item should have a relevant icon. Never leave visual gaps.

INTERACTION (every touch should feel intentional):
- Buttons: hover:scale-105 active:scale-95 transition-all duration-150
- Cards: hover:border-slate-600 hover:shadow-2xl transition-all duration-200
- Inputs: focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all
- Tab/toggle switches: smooth background slide with transition-all duration-300
- Add cursor-pointer to everything clickable
- Delete/destructive actions: hover:bg-red-500/10 hover:text-red-400

DATA (real or nothing):
- Names: Sarah Chen, Marcus Rivera, Aisha Patel, James Wright, Luna Park
- Emails: sarah.chen@outlook.com, m.rivera@gmail.com
- Amounts: $4,250.00 not $100. $89.50 not $10. Make numbers feel real.
- Dates: use relative when possible ("2 hours ago", "Yesterday", "Mar 15")
- Status values: mix of states (completed, in-progress, pending, overdue) — never all the same
- 5-6 data items. Varied lengths. Different states. Tell a story with the data.

WHAT NOT TO DO:
- No emoji as icons. No placeholder squares. No "Lorem ipsum".
- No default gray Tailwind cards with no personality.
- No full-width layouts that stretch to the edges.
- No inputs without focus states. No buttons without hover states.
- No localStorage or sessionStorage (blocked in sandbox).
- No import statements. No external libraries.
- Never exceed 4500 characters of code. Be efficient. Tailwind classes replace inline styles.

THE TEST: Would someone screenshot this and post it on Twitter saying "AI built this"? If no, try harder.

CRITICAL OUTPUT RULES:
- Return ONLY raw JSON. No markdown. No backticks. No \`\`\`json wrapper. Just the raw { } object.
- Keep code under 6000 characters. Be efficient — use Tailwind utilities, avoid verbose inline styles.
- Use function App() not const App = () =>. Always plain function with default export.
- NEVER use localStorage, sessionStorage, or any browser storage APIs. They are blocked in the sandbox. Use React.useState with initial values only.
- Keep total code under 5000 characters. Be ruthlessly efficient. Use Tailwind classes not inline styles. Combine related state into single objects. Limit mock data to 5-6 items max.
- Build EXACTLY what the user asked for. Do not add unrelated features. Do not change the concept.

Return ONLY valid JSON:
{
  "code": "complete self-contained React component as default export",
  "narration": "3-5 sentences as Cipher. Start with what you built. Then mention which layers are strongest. End with what would make it even better. Warm, direct, encouraging — like a mentor who is proud but honest.",
  "appName": "suggested app name",
  "suggestions": ["specific next step based on what is missing from this app", "second specific improvement", "third specific improvement"],
  "score": "number 0-100, sum of all five layer scores below. Be honest.",
  "layerScores": {
    "foundation": "0-20: Does it do what was asked? Are core features present and functional?",
    "details": "0-20: Error handling? Loading states? Validation? Empty states? Edge cases?",
    "experience": "0-20: Visual polish? Responsive? Animations? Consistent spacing? Professional feel?",
    "architecture": "0-20: Clean data structure? Proper state management? Scalable patterns?",
    "philosophy": "0-20: Focused scope? No bloat? Every element earns its place? Clear purpose?"
  }
}

SUGGESTION RULES:
- Each suggestion MUST start with the layer it improves: "Foundation: Let users export data as CSV"
- Must reference actual features or gaps in THIS specific app.
- Frame as outcomes: "Details: Show confirmation before deleting" not "Add a modal".
- Never suggest generic improvements like "Improve the design".
- Each must be achievable in one refine.
- Under 10 words each. Exactly 3 suggestions.`,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''
    let parsed2: any
    try {
      const match = rawText.match(/\{[\s\S]*\}/)
      parsed2 = JSON.parse(match?.[0] || rawText)
    } catch {
      parsed2 = { code: rawText, narration: 'The Grid has responded. Your application is taking shape.', appName: 'My App' }
    }

    const cost = (response.usage.input_tokens * 0.000003) + (response.usage.output_tokens * 0.000015)

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
    })

  } catch (err: any) {
    console.error('[BUILD API]', err)
    return NextResponse.json({ error: 'hard', message: 'The Grid encountered an error. Try again.' }, { status: 500 })
  }
}
