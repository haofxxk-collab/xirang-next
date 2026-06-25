import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const test = url.searchParams.get('pw') ?? ''
  const pw = process.env.ADMIN_PASSWORD ?? 'xirang2026'
  return NextResponse.json({
    env_length: pw.length,
    env_first3: pw.slice(0, 3),
    env_last3: pw.slice(-3),
    test_length: test.length,
    match: test === pw,
    env_codes: [...pw].map(c => c.charCodeAt(0)),
  })
}
