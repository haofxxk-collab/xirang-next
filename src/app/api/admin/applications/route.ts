import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function auth() {
  const session = cookies().get('admin_session')?.value
  const secret = process.env.ADMIN_SECRET ?? 'xirang-admin-secret'
  return session === secret
}

export async function GET(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const status = req.nextUrl.searchParams.get('status')
  const supabase = getClient()
  let query = supabase.from('applications').select('*').order('created_at', { ascending: false })
  if (status && status !== 'all') query = query.eq('status', status)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id, status, reviewer_notes } = await req.json()
  const supabase = getClient()
  const { data, error } = await supabase
    .from('applications')
    .update({ status, reviewer_notes, reviewed_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id, ids } = await req.json()
  const supabase = getClient()

  if (ids && Array.isArray(ids)) {
    // 批量刪除
    const { error } = await supabase.from('applications').delete().in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, deleted: ids.length })
  }

  if (id) {
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: '缺少 id' }, { status: 400 })
}
