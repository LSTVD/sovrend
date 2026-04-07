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
        parts: [{ text: `You are SOVREND's prompt classifier. Read the user's app description and do two things:

1. Identify which blueprint number (1-50) best matches what they want to build.
2. Write an enhanced version of their prompt that is more specific and buildable.

BLUEPRINT IDs:
1=SaaS Analytics Dashboard, 2=Client Portal, 3=Booking System, 4=Task Manager, 5=E-Commerce Store,
6=CRM Pipeline, 7=Landing Page, 8=Habit Tracker, 9=Fitness Tracker, 10=Budget Tracker,
11=Invoice Generator, 12=Restaurant/Food Ordering, 13=Real Estate Listings, 14=Job Board, 15=Membership Dashboard,
16=Personal Portfolio, 17=Online Course Platform, 18=Blog/Content Platform, 19=Team Directory, 20=Link in Bio,
21=Peer Marketplace, 22=Healthcare Patient Portal, 23=Wedding Planner, 24=Shift Scheduling, 25=Social Feed,
26=Project Management Suite, 27=Note Taking App, 28=Time Tracking App, 29=Restaurant Management Dashboard, 30=Learning Management System,
31=Event Management Platform, 32=Inventory Management, 33=Customer Support Desk, 34=Financial Planning Dashboard, 35=Survey Platform,
36=Subscription Box Platform, 37=Property Management System, 38=Music/Podcast Platform, 39=Freelancer Marketplace, 40=Volunteer/Nonprofit,
41=Social Media Scheduler, 42=Recruitment/ATS, 43=Knowledge Base, 44=Recipe/Meal Planning, 45=Pitch Deck Builder,
46=Fleet Management, 47=Language Learning App, 48=Mindfulness/Meditation App, 49=Code Review Tool, 50=Interior Design Planner.

For the enhanced prompt: add specifics about features, data types, and user experience missing from the original. Keep it under 200 words. Make it precise and buildable.

Analyze the 5 layers:
- Layer 1 FOUNDATION: features and pages
- Layer 2 DETAILS: data, states, rules
- Layer 3 EXPERIENCE: UI style, animations, feel
- Layer 4 ARCHITECTURE: database, auth, integrations
- Layer 5 PHILOSOPHY: scope and constraints

Return ONLY valid JSON, no markdown, no backticks, no extra text:
{
  "blueprintId": 1,
  "blueprintName": "SaaS Analytics Dashboard",
  "enhanced": "Enhanced prompt here under 200 words",
  "layers": [
    {"layer": 1, "name": "Foundation", "status": "strong", "added": null},
    {"layer": 2, "name": "Details", "status": "weak", "added": "what was added"},
    {"layer": 3, "name": "Experience", "status": "missing", "added": "what was added"},
    {"layer": 4, "name": "Architecture", "status": "weak", "added": "what was added"},
    {"layer": 5, "name": "Philosophy", "status": "missing", "added": "what was added"}
  ],
  "score": 3,
  "photoQuery": "3 to 5 word Pexels search query specific to this business visual world"
}` }]
      },
    })

    const raw = result.response.text().trim()
    let parsed
    try {
      const stripped = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      const jsonStr = start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped
      parsed = JSON.parse(jsonStr)
    } catch {
      parsed = {
        blueprintId: 1,
        blueprintName: 'App',
        enhanced: prompt,
        layers: [],
        score: 3
      }
    }

    return NextResponse.json({
      success: true,
      enhanced: parsed.enhanced || prompt,
      original: prompt,
      layers: parsed.layers || [],
      promptScore: parsed.score || 3,
      blueprintId: parsed.blueprintId || 1,
      photoQuery: parsed.photoQuery || null,
      blueprintName: parsed.blueprintName || 'App',
    })
  } catch (err: any) {
    console.error('[ENHANCE API]', err)
    return NextResponse.json({ success: false, enhanced: null })
  }
}
