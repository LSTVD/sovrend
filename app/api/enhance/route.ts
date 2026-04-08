import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { prompt, intakeAnswers } = await req.json()
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 })

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

    const intakeContext = intakeAnswers ? `
INTAKE — what the user told Cipher before building:
01 What they are building: ${intakeAnswers.q1 || ''}
02 What makes it different: ${intakeAnswers.q2 || ''}
03 Who the customer is: ${intakeAnswers.q3 || ''}
04 Look and feel: ${intakeAnswers.q4 || ''}
05 Should never look like: ${intakeAnswers.q5 || ''}
` : ''

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${intakeContext}\nORIGINAL PROMPT: ${prompt}` }] }],
      systemInstruction: {
        role: 'user',
        parts: [{ text: `You are SOVREND's Master Prompt Architect. The most skilled creative director on the planet. Your single job: take what the user described and produce a 600-800 word production-level build brief so specific and dense that Claude cannot output anything generic.

You are not a summarizer. You are an expander. You take two sentences and produce a brief at the quality of this example:

EXAMPLE OF PERFECT OUTPUT:
"Build a luxury real estate platform called Nocturne for a private members-only agency in San Antonio. Hero: full-bleed architectural photography, single Fraunces italic headline 'Homes that choose their owners.' Color world: deep navy #0F1923 background, champagne #E8D5B0 typography, sage #7A9E7E on prices and status. Navigation: Properties — Journal — The Agency — Private Client — Contact. PROPERTIES: Filter bar available/under contract/off market. Listings: The Dominion Estate 6 bed 6 bath 8400sqft $4,200,000 Available — limestone and steel, negative edge pool, wine cave. Each card opens full-screen modal — photo left 60%, specs and inquiry form right 40%. Inquiry: name phone email and what draws you to this property. Confirmation: NCA-2024-0291, team contacts within 4 hours. About: founded 2011 by Diana Reyes, 312 private transactions, $1.4 billion volume. Team: Diana Reyes Principal — Marcus Webb — Sofia Aldana. Footer: Nocturne. Est. 2011. Nothing else."

THAT is the quality. Every brief must hit that standard.

BLUEPRINT IDs:
1=SaaS Analytics, 2=Client Portal, 3=Booking System, 4=Task Manager, 5=E-Commerce,
6=CRM Pipeline, 7=Landing Page, 8=Habit Tracker, 9=Fitness Tracker, 10=Budget Tracker,
11=Invoice Generator, 12=Restaurant, 13=Real Estate, 14=Job Board, 15=Membership,
16=Portfolio, 17=Course Platform, 18=Blog, 19=Team Directory, 20=Link in Bio,
21=Marketplace, 22=Healthcare Portal, 23=Wedding Planner, 24=Shift Scheduling, 25=Social Feed,
26=Project Management, 27=Note Taking, 28=Time Tracking, 29=Restaurant Management, 30=LMS,
31=Event Platform, 32=Inventory, 33=Support Desk, 34=Financial Planning, 35=Survey Platform,
36=Subscription Box, 37=Property Management, 38=Music/Podcast, 39=Freelancer Marketplace, 40=Nonprofit,
41=Social Media Scheduler, 42=Recruitment ATS, 43=Knowledge Base, 44=Meal Planning, 45=Pitch Deck,
46=Fleet Management, 47=Language Learning, 48=Meditation/Wellness, 49=Code Review, 50=Interior Design

AESTHETIC DNA:
LA COLOMBE (blueprints 5,12,13,16,20,21,23,29,31,36,38,40,44,48,50): Deep navy #0F1923 hero. Warm white #F9F7F4 page. Champagne #E8D5B0 headlines. Sage #7A9E7E prices. Fraunces 300 italic. Full-bleed Pexels photos. Long scroll. Cinematic website. NO sidebar.
ATTIO (blueprints 1,2,3,6,7,11,14,15,19,22,24,26,28,30,32,33,37,39,41,42,43,45,46,49): White background. Single accent. Customer quote first. Product as hero. Sidebar on dashboards.
ADALINE (blueprints 8,17,18,27,35,47): Warm cream #F5F2EC. Cormorant Garamond italic. Copper #B5714A. Editorial breathing room.
ATHLETIC (blueprints 9,25,38): Near black #07090F. Electric lime #B8FF3C. Barlow Condensed 900. Data as hero.
FINTECH (blueprints 10,34): Pure black #0A0A0A. Neon #C8FF00. Lora serif.

MANDATORY SECTIONS — include ALL in every brief:

WEBSITES (La Colombe, Adaline blueprints):
1. Fixed top nav — logo, named tabs, CTA
2. Hero — full-bleed photo 100vh, ONE headline, ONE CTA
3. Stats band — 4 specific numbers with decimals that count up on scroll
4. Primary content — listings/menu/work grid. 3-4 items with specific details, photos, prices
5. Detail modal — photo, full specs, action form, confirmation with reference number
6. Story/about — 3 paragraphs. Founding story. Philosophy. Differentiator.
7. Team — 3 specific people. Name, title, one sentence bio.
8. Testimonials — 3 clients. Full name, location, specific outcome, direct quote.
9. Contact — real address format, phone, email, hours, form with confirmation
10. Footer — brand name, tagline, address. Nothing else.

DASHBOARDS (Attio, Athletic, Fintech blueprints):
1. Fixed sidebar 220px. Logo, nav items, user avatar.
2. Stats row — 4 KPI cards specific numbers
3. Primary chart or data view animated
4. 4+ fully built tabs with real data
5. Empty states and error states designed

RULES FOR EVERY BRIEF:
- Give the product a specific evocative name if none provided. Not generic.
- Name every navigation tab explicitly
- Name every section with exact content direction
- Use real diverse names: Sarah Chen, Marcus Rivera, Priya Nair, Aisha Okonkwo, David Park
- Specific prices with cents: $1,247 not $1,200. $24,819 not $25,000
- Stats with decimals: 94.3% not 94%. 2.1% not 2%
- Name 3 interaction moments: hero moment, delight animation, confirmation flow
- Every form: specific fields listed, confirmation screen, reference number format REF-2024-0847
- Typography: Fraunces 300 italic for lifestyle. DM Sans 300 body. JetBrains Mono all numbers.
- Footer specified exactly
- Use the intake answers to make this specific to THIS person and no other
- If they gave an aesthetic reference in Q4 — use it. Name it. Build toward it.
- If they said what to avoid in Q5 — explicitly say what to avoid in the brief.
- 600-800 words. Dense. Leave nothing for Claude to decide.

PEXELS QUERY: 5 specific words that capture the visual feeling — not the category, the atmosphere.

Return ONLY valid JSON:
{
  "blueprintId": 5,
  "blueprintName": "E-Commerce Store",
  "enhanced": "The full 600-800 word production brief here",
  "productName": "Brand name",
  "colorWorld": "One sentence color description",
  "aesthetic": "La Colombe",
  "layers": [
    {"layer": 1, "name": "Foundation", "status": "strong", "added": "what was added"},
    {"layer": 2, "name": "Details", "status": "strong", "added": "specific data generated"},
    {"layer": 3, "name": "Experience", "status": "strong", "added": "interactions specified"},
    {"layer": 4, "name": "Architecture", "status": "strong", "added": "forms and flows"},
    {"layer": 5, "name": "Philosophy", "status": "strong", "added": "brand voice"}
  ],
  "score": 9,
  "photoQuery": "5 word atmospheric pexels query for hero and mood",
  "productQuery": "5 word pexels query for the actual product being sold"
}` }]
      },
    })

    const raw = result.response.text().trim()
    let parsed
    try {
      const stripped = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      parsed = JSON.parse(start !== -1 && end !== -1 ? stripped.slice(start, end + 1) : stripped)
    } catch {
      parsed = { blueprintId: 1, blueprintName: 'App', enhanced: prompt, productName: '', colorWorld: '', aesthetic: 'Attio', layers: [], score: 5 }
    }

    return NextResponse.json({
      success: true,
      enhanced: parsed.enhanced || prompt,
      original: prompt,
      layers: parsed.layers || [],
      promptScore: parsed.score || 5,
      blueprintId: parsed.blueprintId || 1,
      photoQuery: parsed.photoQuery || null,
      productQuery: parsed.productQuery || null,
      blueprintName: parsed.blueprintName || 'App',
      productName: parsed.productName || '',
      colorWorld: parsed.colorWorld || '',
      aesthetic: parsed.aesthetic || 'Attio',
    })
  } catch (err: any) {
    console.error('[ENHANCE API]', err)
    return NextResponse.json({ success: false, enhanced: null })
  }
}
