import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

const SETTINGS_ID = 'siteSettings'

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
  const client = getClient()
  let doc = await client.fetch(`*[_id == "${SETTINGS_ID}"][0]`)
  if (!doc) {
    doc = await client.createOrReplace({
      _id: SETTINGS_ID,
      _type: 'siteSettings',
      introHeadline: '藝術，不該只有年輕的臉。',
      introSubline: '深耕數十年的創作者，值得一座展館。',
      introCtaText: '進入展館',
      navBrandZh: '息壤',
      navBrandEn: 'Digital Art Museum',
      navLinks: [
        { label: '當期策展', href: '/exhibitions' },
        { label: '藝術家', href: '/artists' },
        { label: '典藏', href: '/works' },
        { label: '關於', href: '/about' },
      ],
      footerTagline: '為深耕創作者，建一座永恆的展館。',
      applyTitle: '成為息壤藝術家',
      applySubtitle: '我們尋找深耕創作超過二十年、擁有獨特藝術語言的資深藝術家。',
      dimTextOpacity: 50,
      secondaryTextColor: '#AAA69D',
      accentColor: '#B8935A',
    })
  }
  return NextResponse.json(doc)
}

export async function PATCH(req: NextRequest) {
  if (!auth()) return NextResponse.json({ error: '未授權' }, { status: 401 })
  const body = await req.json()
  const client = getClient()
  const doc = await client.patch(SETTINGS_ID).set(body).commit()
  revalidateTag('site-settings')
  return NextResponse.json(doc)
}
