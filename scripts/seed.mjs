/**
 * 息壤種子資料匯入腳本
 * 用法：node scripts/seed.mjs
 * 需要先設好 .env.local 中的 NEXT_PUBLIC_SANITY_PROJECT_ID 和 SANITY_API_TOKEN
 */

import { createClient } from '@sanity/client'
import { artists, artworks, exhibitions } from './seed-data.mjs'
import { readFileSync } from 'fs'

// 讀取 .env.local
let env = {}
try {
  const raw = readFileSync('.env.local', 'utf8')
  raw.split('\n').forEach((line) => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token     = env.SANITY_API_TOKEN

if (!projectId || projectId === 'placeholder') {
  console.error('❌  請先在 .env.local 設定 NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!token) {
  console.error('❌  請先在 .env.local 設定 SANITY_API_TOKEN（需要 Editor 或 Administrator 權限）')
  console.error('    前往 https://sanity.io/manage → 你的專案 → API → Tokens → Add API token')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function seed() {
  console.log(`\n🌱  開始匯入息壤種子資料 → projectId: ${projectId}\n`)

  const allDocs = [...artists, ...artworks, ...exhibitions]
  let success = 0, fail = 0

  for (const doc of allDocs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  ✅  ${doc._type}  ${doc.name ?? doc.title}`)
      success++
    } catch (err) {
      console.error(`  ❌  ${doc._type}  ${doc.name ?? doc.title}  →  ${err.message}`)
      fail++
    }
  }

  console.log(`\n✨  完成！成功 ${success} 筆，失敗 ${fail} 筆\n`)

  if (success > 0) {
    console.log('下一步：')
    console.log('  1. 前往 Sanity Studio 上傳藝術家照片與作品圖片')
    console.log('  2. npx vercel --prod  →  部署網站\n')
  }
}

seed().catch(console.error)
