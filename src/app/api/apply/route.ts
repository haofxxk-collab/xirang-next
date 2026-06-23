import { NextRequest, NextResponse } from 'next/server'
import type { Application } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: Application = await req.json()

    if (!body.name || !body.email || !body.agreedToTerms) {
      return NextResponse.json({ error: '必填欄位不完整' }, { status: 400 })
    }

    /* Insert to Supabase */
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { error } = await supabase.from('applications').insert({
      name: body.name,
      name_en: body.nameEn,
      email: body.email,
      phone: body.phone,
      region: body.region,
      applicant_type: body.applicantType,
      media: body.media,
      years_active: body.yearsActive,
      work_count: body.workCount,
      bio: body.bio,
      exhibitions: body.exhibitions,
      referral: body.referral,
      portfolio_url: body.portfolioUrl,
      notes: body.notes,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[apply]', err)
    return NextResponse.json({ error: '提交失敗，請稍後再試' }, { status: 500 })
  }
}
