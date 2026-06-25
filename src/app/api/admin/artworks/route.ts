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
  const artworks = await getClient().fetch(
    `*[_type == "artwork"] | order(year desc) {
      _id, title, year, medium, dimensions, series, status, price, description,
      artist->{ _id, name },
      "imageUrl": images[0].asset->url
    }`
  )
  return NextResponse.json(artworks)
}

export async function POST(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const body = await req.json()
  const doc = await getClient().create({ _type: 'artwork', ...body })
  revalidateTag('artworks')
  return NextResponse.json(doc)
}

export async function PATCH(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id, ...patch } = await req.json()
  const doc = await getClient().patch(id).set(patch).commit()
  revalidateTag('artworks')
  revalidateTag('site-settings')
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id } = await req.json()
  await getClient().delete(id)
  revalidateTag('artworks')
  revalidateTag('site-settings')
  return NextResponse.json({ ok: true })
}
