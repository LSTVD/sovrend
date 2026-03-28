import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { prompt } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: {
        role: 'user',
        parts: [{ text: `You are Cipher, SOVREND's AI build partner. The user gave an app description. Your job is to strengthen it using the 5-Layer Framework, then return a JSON response.

The 5 Layers:
- Layer 1 FOUNDATION: What users can DO (features, actions, pages)
- Layer 2 DETAILS: How it BEHAVES (rules, states, persistence, validation, edge cases)
- Layer 3 EXPERIENCE: How it FEELS (UI style, animations, responsive, vibe)
- Layer 4 ARCHITECTURE: What POWERS it (database tables, auth, APIs, integrations)
- Layer 5 PHILOSOPHY: What it's NOT (constraints, what to exclude, scope limits)

Analyze what the user wrote. Identify which layers are covered and which are missing. Then write an enhanced prompt that fills in the gaps.

Return ONLY valid JSON with this exact structure, no markdown, no backticks:
{
  "enhanced": "The full enhanced prompt ready to send to Claude for building (2-4 sentences, specific and buildable)",
  "layers": [
    {"layer": 1, "name": "Foundation", "status": "strong", "added": null},
    {"layer": 2, "name": "Details", "status": "weak", "added": "what you added for this layer"},
    {"layer": 3, "name": "Experience", "status": "missing", "added": "what you added"},
    {"layer": 4, "name": "Architecture", "status": "weak", "added": "what you added"},
    {"layer": 5, "name": "Philosophy", "status": "missing", "added": "what you added"}
  ],
  "score": 3
}

Status is strong, weak, or missing. Score is 1-5 based on how complete the ORIGINAL prompt was (1=vague, 5=architect-level).
Be specific in what you add. "Add a database" is weak. "Supabase table: tasks with id, title, status, priority, created_at, user_id" is strong.` }]
      },
    })

    const raw = result.response.text().trim()
    let parsed
    try {
      const match = raw.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(match?.[0] || raw)
    } catch {
      parsed = { enhanced: raw, layers: [], score: 3 }
    }
    return NextResponse.json({
      success: true,
      enhanced: parsed.enhanced || raw,
      original: prompt,
      layers: parsed.layers || [],
      promptScore: parsed.score || 3,
    })
  } catch (err: any) {
    console.error('[ENHANCE API]', err)
    return NextResponse.json({ success: false, enhanced: null })
  }
}
