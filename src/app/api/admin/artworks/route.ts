import { NextResponse } from 'next/server'
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

export async function GET() {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const artworks = await getClient().fetch(
    `*[_type == "artwork"] | order(year desc) { _id, title, year, medium, status, artist->{ name } }`
  )
  return NextResponse.json(artworks)
}
