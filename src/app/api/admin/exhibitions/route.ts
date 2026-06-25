import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

function getClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

function auth() {
  const session = cookies().get('admin_session')?.value
  return session === (process.env.ADMIN_SECRET ?? 'xirang-admin-secret')
}

export async function GET() {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const exhibitions = await getClient().fetch(
    `*[_type == "exhibition"] | order(startDate desc) {
      _id, title, titleEn, type, status, startDate, endDate, description,
      "coverUrl": coverImage.asset->url
    }`
  )
  return NextResponse.json(exhibitions)
}

export async function PATCH(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id, ...patch } = await req.json()
  const doc = await getClient().patch(id).set(patch).commit()
  revalidateTag('exhibitions')
  revalidateTag('site-settings')
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id } = await req.json()
  await getClient().delete(id)
  revalidateTag('exhibitions')
  revalidateTag('site-settings')
  return NextResponse.json({ ok: true })
}
