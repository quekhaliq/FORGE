
import { useState, useEffect } from 'react'
import { Dumbbell, Medal, Utensils, User, Share2, Timer, Sun, Moon } from 'lucide-react'

const TABS = [
  { id: 'train', label: 'Train', icon: Dumbbell },
  { id: 'oly', label: 'Lifts', icon: Medal },
  { id: 'fuel', label: 'Fuel', icon: Utensils },
  { id: 'profile', label: 'Profile', icon: User },
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
  return (
    <>
      <header
        className="sticky top-0 z-40 backdrop-blur px-4 py-3"
        style={{
          background: 'color-mix(in srgb, var(--paper) 92%, transparent)',
          borderBottom: '2px solid var(--line)',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <svg viewBox="0 0 24 10" className="w-7 h-3 shrink-0" aria-hidden><g fill="var(--uv)"><rect x="0" y="0" width="4" height="10"/><rect x="6" y="0" width="4" height="10"/><rect x="12" y="0" width="4" height="10"/></g></svg>
            <span className="display-font text-base tracking-tight">HYBRID PREP HUB</span>
            <span className="bg-yellow-400 text-zinc-950 font-black text-[10px] px-1.5 py-0.5 rounded uppercase shrink-0">MY</span>
            {/* live local date + timezone */}
            <span className="hidden md:flex flex-col leading-none ml-2 pl-2 border-l border-soft">
              <span className="text-[10px] font-bold text-ink tnum">{date} • {time}</span>
              <span className="text-[9px] font-semibold text-faint uppercase tracking-wider">{tz}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {daysLeft !== null && (
              <span className="font-black text-xs px-2.5 py-1.5 rounded-lg tnum border-2" style={{ borderColor: 'var(--uv)', color: 'var(--uv)' }}>
                T-{daysLeft}
              </span>
            )}
            <button
              onClick={onToggleTheme}
              className="w-[44px] h-[44px] rounded-xl border-2 flex items-center justify-center transition"
              style={{ borderColor: 'var(--line-soft)', color: 'var(--ink)' }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Sun className="w-5 h-5 sun-only" />
              <Moon className="w-5 h-5 moon-only" />
            </button>
            <button
              onClick={onLaunchTimer}
              className="w-[44px] h-[44px] rounded-xl border-2 flex items-center justify-center transition"
              style={{ borderColor: 'var(--uv)', color: 'var(--uv)' }}
              aria-label="Launch WOD timer"
            >
              <Timer className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="w-[44px] h-[44px] rounded-xl flex items-center justify-center transition"
              style={{ background: 'var(--uv)', color: '#fff' }}
              aria-label="Share story card"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* desktop: top segmented bar */}
      <nav className="max-w-4xl mx-auto px-4 pt-3 hidden sm:block">
        <div className="panel !rounded-2xl p-1.5 grid grid-cols-4 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition ${
                  active ? 'pill-active !rounded-lg' : 'muted-text hover:text-current'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* mobile: bottom bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur sm:hidden" style={{ background: 'color-mix(in srgb, var(--paper) 95%, transparent)', borderTop: '2px solid var(--line)', paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
        <div className="grid grid-cols-4 px-2 py-1.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-0.5 font-bold text-[10px] uppercase transition ${
                  active ? 'accent-text' : 'muted-text'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
