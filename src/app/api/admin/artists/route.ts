import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { cookies } from 'next/headers'

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
  const secret = process.env.ADMIN_SECRET ?? 'xirang-admin-secret'
  return session === secret
}

export async function GET() {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const client = getClient()
  const artists = await client.fetch(
    `*[_type == "artist"] | order(index asc) { _id, name, nameEn, slug, index, medium, yearsActive, birthYear, location, featured, portrait }`
  )
  return NextResponse.json(artists)
}

export async function POST(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const body = await req.json()
  const client = getClient()
  const doc = await client.create({ _type: 'artist', ...body })
  return NextResponse.json(doc)
}

export async function PATCH(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id, ...patch } = await req.json()
  const client = getClient()
  const doc = await client.patch(id).set(patch).commit()
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id } = await req.json()
  const client = getClient()
  await client.delete(id)
  return NextResponse.json({ ok: true })
}
