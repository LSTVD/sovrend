import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const appId = searchParams.get('appId')
    if (!appId) return NextResponse.json({ error: 'Missing appId' }, { status: 400 })
    const { data } = await supabase
      .from('deploys')
      .select('*')
      .eq('user_id', user.id)
      .eq('app_id', appId)
      .single()
    return NextResponse.json({ success: true, deploy: data || null })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { appId, appName, buildScore, progress, completedActs } = await req.json()
    if (!appId) return NextResponse.json({ error: 'Missing appId' }, { status: 400 })
    const allComplete = completedActs?.length === 7
    const { data: existing } = await supabase
      .from('deploys')
      .select('id')
      .eq('user_id', user.id)
      .eq('app_id', appId)
      .single()
    if (existing) {
      await supabase.from('deploys').update({
        progress,
        completed_acts: completedActs || [],
        updated_at: new Date().toISOString(),
        ...(allComplete ? { completed_at: new Date().toISOString() } : {})
      }).eq('id', existing.id)
    } else {
      await supabase.from('deploys').insert({
        user_id: user.id,
        app_id: appId,
        app_name: appName || 'Untitled App',
        build_score: buildScore || 0,
        progress: progress || {"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]},
        completed_acts: completedActs || [],
      })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
