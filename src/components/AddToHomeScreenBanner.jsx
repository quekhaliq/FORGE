import { useState, useEffect } from 'react'
import { X, Share, Download, Smartphone } from 'lucide-react'

const DISMISS_KEY = 'forge_a2hs_dismissed'

// true when running as an installed PWA (no install prompt needed)
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export default function AddToHomeScreenBanner() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState(null) // 'ios' | 'android' | null
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    if (isStandalone()) return // already installed
    if (localStorage.getItem(DISMISS_KEY) === 'v1') return // they dismissed it

    const ua = navigator.userAgent || ''
    const iPad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const iPhone = /iPhone|iPod/.test(ua)
    const android = /Android/.test(ua)
    const safari = /Safari/.test(ua) && !/Chrome|CriOS|Edg|FxiOS/.test(ua)

    let detected = null
    if ((iPhone || iPad) && safari) detected = 'ios'
    else if (android && /Chrome/.test(ua)) detected = 'android'
    else return // desktop / unsupported mobile browsers: no guide

    // show after a short delay so the app loads first (also avoids
    // synchronous setState inside the effect)
    const t = setTimeout(() => {
      setPlatform(detected)
      setShow(true)
    }, 2500)

    // Android Chrome fires beforeinstallprompt — capture it for a real install button
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    return () => {
      clearTimeout(t)
      window.removeEventListener('beforeinstallprompt', onPrompt)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    localStorage.setItem(DISMISS_KEY, 'v1')
  }

  const installAndroid = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (!show || !platform) return null

  return (
    <div className="fixed inset-x-3 bottom-20 sm:bottom-4 z-[58]">
      <div
        className="rounded-2xl border-2 p-4 space-y-3 shadow-lg"
        style={{ background: 'var(--paper-card)', borderColor: 'var(--uv)' }}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-black text-sm flex items-center gap-2 text-ink">
            <Smartphone className="w-4 h-4 accent-text" />
            Add FORGE. to your {platform === 'ios' ? 'iPhone' : 'phone'}
          </p>
          <button onClick={dismiss} className="text-mid min-w-[44px] min-h-[44px] flex items-center justify-center -mt-1 -mr-1" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>

        {platform === 'ios' ? (
          <div className="space-y-2 text-xs text-soft">
            <p className="flex items-center gap-2">
              <span className="day-chip">1</span>
              Tap the <Share className="w-3.5 h-3.5 inline accent-text" /> <strong>Share</strong> button in Safari's toolbar (below)
            </p>
            <p className="flex items-center gap-2">
              <span className="day-chip">2</span>
              Scroll and tap <strong>"Add to Home Screen"</strong>
            </p>
            <p className="flex items-center gap-2">
              <span className="day-chip">3</span>
              Tap <strong>Add</strong> — the FORGE. icon appears on your home screen
            </p>
          </div>
        ) : deferredPrompt ? (
          <button onClick={installAndroid} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Install App
          </button>
        ) : (
          <div className="space-y-2 text-xs text-soft">
            <p className="flex items-center gap-2">
              <span className="day-chip">1</span>
              Open the <strong>⋮ menu</strong> (top-right in Chrome)
            </p>
            <p className="flex items-center gap-2">
              <span className="day-chip">2</span>
              Tap <strong>"Add to Home screen"</strong> → <strong>Install</strong>
            </p>
          </div>
        )}

        <button onClick={dismiss} className="text-[11px] text-faint underline w-full text-center min-h-[32px]">
          Maybe later
        </button>
      </div>
    </div>
  )
}
