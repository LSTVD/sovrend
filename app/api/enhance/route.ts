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
        parts: [{ text: `You are Cipher, SOVREND's AI assistant. The user gave a brief app description. Expand it into a detailed 2-3 sentence description that includes specific features, pages, and functionality a developer would need to build it. Keep their original intent and tone. Return ONLY the expanded description, nothing else. No quotes, no preamble.` }]
      },
    })

    const enhanced = result.response.text().trim()

    return NextResponse.json({
      success: true,
      enhanced,
      original: prompt,
    })
  } catch (err: any) {
    console.error('[ENHANCE API]', err)
    return NextResponse.json({ success: false, enhanced: null })
  }
}
