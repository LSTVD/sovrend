import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { key } = await request.json()
  
  // Hardcoded test
  if (key === 'TEST123') {
    return NextResponse.json({ ok: true })
  }
  
  return NextResponse.json({ ok: false }, { status: 401 })
}
