import { useState, useEffect } from 'react'
import { Dumbbell, Medal, Utensils, User, Share2, Timer, Sun, Moon, Menu, X } from 'lucide-react'

const TABS = [
  { id: 'train', label: 'Train', desc: 'Today\u2019s sessions', icon: Dumbbell },
  { id: 'oly', label: 'Lifts', desc: 'PRs & lifting log', icon: Medal },
  { id: 'fuel', label: 'Fuel', desc: 'Protein & meals', icon: Utensils },
  { id: 'profile', label: 'Profile', desc: 'Settings & data', icon: User },
]

// live local date + timezone, updates every minute
function useLocalDateTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const tz =
    Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/').pop().replace(/_/g, ' ') || 'Local'
  return { date, time, tz }
}

export default function Navbar({ activeTab, setActiveTab, daysLeft, onShare, onLaunchTimer, theme, onToggleTheme }) {
  const { date, time, tz } = useLocalDateTime()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeMeta = TABS.find((t) => t.id === activeTab) || TABS[0]

  const go = (id) => {
    setActiveTab(id)
    setDrawerOpen(false)
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur px-4 py-3"
        style={{
          background: 'color-mix(in srgb, var(--paper) 92%, transparent)',
          borderBottom: '1px solid var(--line-soft)',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-[44px] h-[44px] rounded-full border flex items-center justify-center transition hover:accent-text"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col leading-none min-w-0">
              <span className="display-font text-xl">
                FORGE<span className="accent-text">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-medium muted-text mt-1">
                {activeMeta.desc}
              </span>
            </div>
            {/* live local date + timezone */}
            <span className="hidden md:flex flex-col leading-none ml-2 pl-3 border-l border-soft">
              <span className="text-[10px] font-semibold text-soft tnum">{date} • {time}</span>
              <span className="text-[9px] font-medium text-faint uppercase tracking-wider">{tz}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {daysLeft !== null && (
              <span className="font-semibold text-xs px-3 py-1.5 rounded-full tnum" style={{ background: 'color-mix(in srgb, var(--uv) 12%, transparent)', color: 'var(--uv)' }}>
                T-{daysLeft}
              </span>
            )}
            <button
              onClick={onToggleTheme}
              className="w-[44px] h-[44px] rounded-full border flex items-center justify-center transition"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              aria-label={"Switch theme (current: " + theme + ")"}
            >
              <Sun className="w-5 h-5 sun-only" />
              <Moon className="w-5 h-5 moon-only" />
            </button>
            <button
              onClick={onLaunchTimer}
              className="w-[44px] h-[44px] rounded-full border flex items-center justify-center transition"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              aria-label="Launch WOD timer"
            >
              <Timer className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition"
              style={{ background: 'var(--uv)', color: '#fff' }}
              aria-label="Share story card"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* navigation drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-scrim" onClick={() => setDrawerOpen(false)} aria-hidden />
          <nav className="drawer-panel" aria-label="Main navigation">
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <span className="display-font text-xl">
                  FORGE<span className="accent-text">.</span>
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-faint">
                  Built on Strength
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-[40px] h-[40px] rounded-full border flex items-center justify-center transition"
                style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 flex flex-col gap-1">
              {TABS.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className={`drawer-item ${activeTab === id ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex flex-col items-start leading-tight">
                    <span>{label}</span>
                    <span className="text-[10px] font-medium muted-text">{desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-auto px-4 pt-3" style={{ borderTop: '1px solid var(--line-soft)' }}>
              <div className="flex items-center gap-2 py-2">
                <button
                  onClick={() => { onLaunchTimer(); setDrawerOpen(false) }}
                  className="flex-1 min-h-[40px] rounded-full border flex items-center justify-center gap-2 text-xs font-semibold transition"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <Timer className="w-4 h-4" /> WOD Timer
                </button>
                <button
                  onClick={() => { onShare(); setDrawerOpen(false) }}
                  className="flex-1 min-h-[40px] rounded-full flex items-center justify-center gap-2 text-xs font-semibold transition"
                  style={{ background: 'var(--uv)', color: '#fff' }}
                >
                  <Share2 className="w-4 h-4" /> Share Card
                </button>
              </div>
              <p className="text-[10px] text-faint text-center pt-1">
                {date} • {tz}
              </p>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
