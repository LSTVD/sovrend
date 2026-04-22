import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: userData } = await supabase.from('users').select('tier').eq('id', user.id).single()
    const tier = userData?.tier || 'free'

    const { code, appName, suggestions, score } = await req.json()
    if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite', generationConfig: { maxOutputTokens: 3000 } })

    const isArchitect = tier === 'architect' || tier === 'agency'

    const prompt = `Analyze this React/TypeScript/Tailwind application code and produce a structured developer handoff brief.

APP NAME: ${appName || 'Untitled App'}
BUILD SCORE: ${score || 0}/100
SUGGESTIONS FOR IMPROVEMENT: ${(suggestions || []).join(', ')}

CODE:
${code.slice(0, 6000)}

Return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence overview of what this app does",
  "architecture": {
    "framework": "React + TypeScript + Tailwind CSS",
    "pattern": "component architecture pattern used (e.g. Single Page App, Multi-view, Dashboard)",
    "stateManagement": "how state is managed (useState, context, etc.)",
    "dataFlow": "how data moves through the app"
  },
  "pages": [
    {"name": "page name", "purpose": "what it does", "components": ["list of components on this page"]}
  ],
  "components": [
    {"name": "ComponentName", "purpose": "what it does", "props": "key props it accepts", "children": ["child components if any"]}
  ],
  "database": {
    "tables": [{"name": "table name", "fields": ["field1", "field2"], "purpose": "what this table stores"}],
    "relationships": "how tables connect",
    "note": "if no real database, describe the mock data structure"
  },
  "wired": ["list of features that are fully functional"],
  "notWired": ["list of features that exist in UI but aren't connected or functional"],
  "nextSteps": [
    {"priority": "HIGH/MEDIUM/LOW", "task": "specific task description", "effort": "estimated effort (hours)", "impact": "what this unlocks"}
  ]${isArchitect ? `,
  "strategic": {
    "marketPosition": "where this app sits in the market",
    "monetization": "recommended revenue model",
    "scalability": "what needs to change for 10x users",
    "techDebt": "technical debt to address before scaling",
    "launchChecklist": ["specific items needed before launch"]
  }` : ''}
}`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: {
        role: 'user',
        parts: [{ text: 'You are a senior software architect producing a professional developer handoff document. Be specific, actionable, and thorough. Analyze the actual code — do not guess or generalize. Return ONLY valid JSON, no markdown, no preamble.' }]
      },
    })

    const raw = result.response.text().trim()
    let parsed
    try {
      const match = raw.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(match?.[0] || raw)
    } catch {
      parsed = { error: 'Could not parse handoff analysis' }
    }

    return NextResponse.json({
      success: true,
      tier,
      appName: appName || 'Untitled App',
      score: score || 0,
      handoff: parsed,
    })
  } catch (err: any) {
    console.error('[HANDOFF API]', err)
    return NextResponse.json({ success: false, error: 'Failed to generate handoff brief' }, { status: 500 })
  }
}
