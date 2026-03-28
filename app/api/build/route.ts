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
      max_tokens: 8000,
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

QUALITY BAR:
Build as if a real user will use this in 60 seconds. Every screen should feel intentional. If the prompt mentions a dashboard, include real-looking mock data, not "Item 1, Item 2." If it mentions a form, include validation. If it mentions a list, include search/filter. Don't build skeletons — build apps that feel alive. Include loading states, error handling, empty states, hover effects, transitions, and focus states. Make it responsive mobile-first.

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
