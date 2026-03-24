import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { key } = await request.json()
  
  // Check against private env var (never exposed to client)
  if (key === process.env.CLIENT_KEY) {
    return NextResponse.json({ ok: true })
  }
  
  return NextResponse.json({ ok: false }, { status: 401 })
}
