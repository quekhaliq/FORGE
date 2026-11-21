import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

// Floating scroll-to-top button — appears after scrolling 400px down.
// Positioned above the mobile bottom nav, right-aligned.
export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-3 bottom-32 sm:bottom-20 z-[45] w-[44px] h-[44px] rounded-full border-2 flex items-center justify-center shadow-lg transition hover:opacity-90"
      style={{ background: 'var(--uv)', borderColor: 'var(--uv)', color: '#0a0a0a' }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
