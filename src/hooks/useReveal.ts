'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useReveal(selector = '.reveal') {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    )

    // 只觀察還沒顯示的元素，不移除已顯示的
    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (!el.classList.contains('in')) io.observe(el)
      })
    }, 80)

    return () => {
      clearTimeout(timer)
      io.disconnect()
    }
  }, [pathname, selector])
}
