/**
 * 息壤・一鍵設定精靈
 * 用法：node scripts/setup.mjs
 */

import { createInterface } from 'readline'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((r) => rl.question(q, r))

async function main() {
  console.log('\n╔════════════════════════════════════╗')
  console.log('║     息壤 Xirang — 設定精靈         ║')
  console.log('╚════════════════════════════════════╝\n')

  // ── 1. Sanity ──────────────────────────────────
  console.log('【第一步】Sanity CMS 設定')
  console.log('  前往 https://sanity.io/manage → 建立新專案（名稱：xirang）')
  console.log('  然後在 API → Tokens → 建立一個 Editor token\n')

  const sanityProjectId = (await ask('  Sanity Project ID：')).trim()
  const sanityToken     = (await ask('  Sanity API Token（Editor）：')).trim()

  // ── 2. Supabase ────────────────────────────────
  console.log('\n【第二步】Supabase 設定')
  console.log('  前往 https://supabase.com → 建立新專案')
  console.log('  Settings → API → 取得 URL 和 anon key 及 service_role key')
  console.log('  SQL Editor → 貼上 scripts/supabase-schema.sql → 執行\n')

  const supabaseUrl      = (await ask('  Supabase URL：')).trim()
  const supabaseAnon     = (await ask('  Supabase anon key：')).trim()
  const supabaseService  = (await ask('  Supabase service_role key：')).trim()

  // ── 3. 寫入 .env.local ─────────────────────────
  const revalidateSecret = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)

  const envContent = `NEXT_PUBLIC_SANITY_PROJECT_ID=${sanityProjectId}
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=${sanityToken}

NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnon}
SUPABASE_SERVICE_ROLE_KEY=${supabaseService}

REVALIDATE_SECRET=${revalidateSecret}
`
  writeFileSync('.env.local', envContent)
  console.log('\n  ✅  .env.local 已更新')

  // ── 4. 寫入 xirang-studio/.env ─────────────────
  const studioEnv = `SANITY_STUDIO_PROJECT_ID=${sanityProjectId}
SANITY_STUDIO_DATASET=production
`
  try {
    writeFileSync('../xirang-studio/.env', studioEnv)
    console.log('  ✅  xirang-studio/.env 已更新')
  } catch {}

  // ── 5. 匯入種子資料 ────────────────────────────
  const doSeed = (await ask('\n  是否匯入種子資料（6 位藝術家、8 件作品、1 個展覽）？[Y/n]：')).trim()
  if (!doSeed || doSeed.toLowerCase() === 'y') {
    console.log('\n  🌱  匯入種子資料中...')
    try {
      execSync('node scripts/seed.mjs', { stdio: 'inherit' })
    } catch (e) {
      console.error('  ⚠️  種子資料匯入失敗，請手動執行 node scripts/seed.mjs')
    }
  }

  // ── 6. 部署到 Vercel ───────────────────────────
  const doDeploy = (await ask('\n  是否立即部署到 Vercel？[Y/n]：')).trim()
  if (!doDeploy || doDeploy.toLowerCase() === 'y') {
    console.log('\n  🚀  準備部署到 Vercel...')
    console.log('  （首次部署會開啟瀏覽器進行 Vercel 登入）\n')

    try {
      execSync(`npx vercel --build-env NEXT_PUBLIC_SANITY_PROJECT_ID=${sanityProjectId} --build-env NEXT_PUBLIC_SANITY_DATASET=production --build-env NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl} --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnon}`, { stdio: 'inherit' })
    } catch (e) {
      console.error('  ⚠️  Vercel 部署請手動執行：npx vercel --prod')
    }
  }

  // ── 7. 部署 Studio ─────────────────────────────
  const deployStudio = (await ask('\n  是否部署 Sanity Studio（xirang.sanity.studio）？[Y/n]：')).trim()
  if (!deployStudio || deployStudio.toLowerCase() === 'y') {
    console.log('\n  📦  部署 Sanity Studio...\n')
    try {
      execSync('cd ../xirang-studio && npm run deploy', { stdio: 'inherit' })
    } catch (e) {
      console.error('  ⚠️  Studio 部署請手動：cd xirang-studio && npm run deploy')
    }
  }

  // ── 完成 ───────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║  息壤已建置完成！                         ║')
  console.log('╠══════════════════════════════════════════╣')
  console.log('║  本地開發：npm run dev  →  :3000         ║')
  console.log('║  後台管理：https://xirang.sanity.studio  ║')
  console.log(`║  Revalidate secret：${revalidateSecret.slice(0,16)}...  ║`)
  console.log('╚══════════════════════════════════════════╝\n')
  console.log('  記得在 Sanity Studio 設定 Webhook：')
  console.log('  https://你的網域.vercel.app/api/revalidate')
  console.log(`  Header：x-revalidate-secret: ${revalidateSecret}\n`)

  rl.close()
}

main().catch((e) => { console.error(e); rl.close(); process.exit(1) })
