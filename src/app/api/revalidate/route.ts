import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/* Sanity webhook → trigger ISR revalidation */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const type: string = body._type ?? ''

  if (type === 'artist') {
    revalidatePath('/artists')
    revalidatePath(`/artists/${body.slug?.current ?? ''}`)
  } else if (type === 'artwork') {
    revalidatePath('/works')
    revalidatePath(`/works/${body.slug?.current ?? ''}`)
  } else if (type === 'exhibition') {
    revalidatePath('/exhibitions')
    revalidatePath('/')
  }

  return NextResponse.json({ revalidated: true, type })
}
