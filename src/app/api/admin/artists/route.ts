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
  const secret = process.env.ADMIN_SECRET ?? 'xirang-admin-secret'
  return session === secret
}

export async function GET() {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const client = getClient()
  const artists = await client.fetch(
    `*[_type == "artist"] | order(index asc) { _id, name, nameEn, slug, index, medium, yearsActive, birthYear, location, featured, "portrait": portrait { asset->{ url } } }`
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
  revalidateTag('artists')
  revalidateTag('site-settings')
  return NextResponse.json(doc)
}

export async function DELETE(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 })
  const client = getClient()
  try {
    // 找出所有引用此藝術家的文件
    const refs: { _id: string; _type: string }[] = await client.fetch(
      `*[references($id)]{ _id, _type }`,
      { id }
    )

    const tx = client.transaction()

    for (const ref of refs) {
      if (ref._type === 'exhibition') {
        // 從展覽 artists 陣列移除此藝術家引用
        tx.patch(ref._id, (p) => p.unset([`artists[_ref=="${id}"]`]))
      } else if (ref._type === 'artwork') {
        // 直接刪除此藝術家的作品（cascade）
        // 先移除作品被展覽引用的部分
        const artworkRefs: { _id: string; _type: string }[] = await client.fetch(
          `*[references($id)]{ _id, _type }`,
          { id: ref._id }
        )
        for (const ar of artworkRefs) {
          if (ar._type === 'exhibition') {
            tx.patch(ar._id, (p) => p.unset([`works[_ref=="${ref._id}"]`]))
          }
        }
        tx.delete(ref._id)
      }
    }

    tx.delete(id)
    await tx.commit()

    revalidateTag('artists')
    revalidateTag('exhibitions')
    revalidateTag('artworks')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Sanity delete error:', e)
    return NextResponse.json({ error: e?.message ?? '刪除失敗' }, { status: 500 })
  }
}
