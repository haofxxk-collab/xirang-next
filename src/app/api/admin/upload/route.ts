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
  return session === (process.env.ADMIN_SECRET ?? 'xirang-admin-secret')
}

export async function POST(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: '沒有檔案' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const client = getClient()

  const asset = await client.assets.upload('image', buffer, {
    filename: file.name,
    contentType: file.type,
  })

  return NextResponse.json({ assetId: asset._id, url: asset.url })
}
