
import { Dumbbell, Medal, Utensils, User, Share2, Timer, Sun, Moon } from 'lucide-react'

const TABS = [
  { id: 'train', label: 'Train', icon: Dumbbell },
  { id: 'oly', label: 'Lifts', icon: Medal },
  { id: 'fuel', label: 'Fuel', icon: Utensils },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function Navbar({ activeTab, setActiveTab, daysLeft, onShare, onLaunchTimer, theme, onToggleTheme }) {
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
            <div className="leading-none">
              <span className="display-font text-2xl" style={{ color: 'var(--uv)' }}>
                FORGE<span style={{ color: 'var(--ink)' }}>.</span>
              </span>
              <p className="hidden sm:block text-[9px] font-black uppercase tracking-[0.18em] mt-0.5" style={{ color: 'var(--muted)' }}>
                Built on Strength | Driven by Purpose
              </p>
            </div>
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
