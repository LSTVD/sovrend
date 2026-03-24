import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { key } = await request.json()
  
  console.log('Received key:', key)
  console.log('Expected key:', process.env.CLIENT_KEY)
  console.log('Match?', key === process.env.CLIENT_KEY)
  
  if (key === process.env.CLIENT_KEY) {
    return NextResponse.json({ ok: true })
  }
  
  return NextResponse.json({ ok: false }, { status: 401 })
}
