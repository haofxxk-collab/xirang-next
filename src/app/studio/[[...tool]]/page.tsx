import { redirect } from 'next/navigation'

export default function StudioPage() {
  // Sanity Studio 獨立部署於 https://xirang.sanity.studio
  // 或前往 https://sanity.io/manage 管理內容
  redirect('https://sanity.io/manage')
}
