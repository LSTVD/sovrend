import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { element, context } = await req.json()
    if (!element) return NextResponse.json({ error: 'No element' }, { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite', generationConfig: { maxOutputTokens: 150 } })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Element: <${element.tag}> with classes "${element.classes}" and text "${element.text}"\n\nContext: This element is inside a user-built web app. ${context || ''}` }] }],
      systemInstruction: {
        role: 'user',
        parts: [{ text: `You are Cipher, SOVREND's teaching AI. A non-technical user just tapped an element in their app preview to understand what it does.

Explain in 2-3 short sentences:
1. What this element IS (in plain language — button, heading, container, input, etc.)
2. What it DOES for the user's app visitors
3. One practical insight about why it matters

Rules:
- Write for someone who has never coded before
- No jargon — if you must use a technical term, define it inline
- Be warm and encouraging, like a great teacher
- Keep it under 60 words
- Return ONLY the explanation, no preamble` }]
      },
    })

    return NextResponse.json({
      success: true,
      explanation: result.response.text().trim(),
    })
  } catch (err: any) {
    console.error('[EXPLAIN API]', err)
    return NextResponse.json({ success: false, explanation: 'Cipher couldn\'t analyze that element. Try tapping another one.' })
  }
}
