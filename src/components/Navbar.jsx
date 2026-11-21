import {
  Activity,
  Dumbbell,
  Utensils,
  UserRound,
  Timer,
  Sun,
  Moon,
  Share2,
} from 'lucide-react'
const tabs = [
  ['train', 'Train', Activity],
  ['oly', 'Lifts', Dumbbell],
  ['fuel', 'Fuel', Utensils],
  ['profile', 'Profile', UserRound],
]
export default function Navbar({
  activeTab,
  setActiveTab,
  onLaunchTimer,
  theme,
  onToggleTheme,
  onSetup,
  daysLeft,
  onShare,
}) {
  const navigation = tabs.map(([id, label, Icon]) => (
    <button
      key={id}
      aria-current={id === activeTab ? 'page' : undefined}
      onClick={() => {
        setActiveTab(id)
        window.scrollTo(0, 0)
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  ))
  return (
    <>
      <header className="mast">
        <div className="mast-inner">
          <button
            className="wordmark"
            onClick={() => setActiveTab('train')}
            aria-label="FORGE home"
          >
            <i className="racing-mark" />
            FORGE<span>.</span>
          </button>
          <div className="hub-label">
            HYBRID PREP HUB <b>MY</b>
          </div>
          <nav className="desktop-tabs" aria-label="Workspace">
            {navigation}
          </nav>
          <div className="tools">
            <span className="nav-count" title="Days until your target event">
              T−{daysLeft}
            </span>
            {activeTab !== 'train' && (
              <button
                className="icon-btn"
                aria-label="Share story card"
                onClick={onShare}
              >
                <Share2 size={16} />
              </button>
            )}
            <button onClick={onLaunchTimer} className="timer-btn">
              <Timer size={16} />
              <span>WOD timer</span>
            </button>
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label="Toggle light or dark theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="avatar"
              aria-label="Athlete setup"
              onClick={onSetup}
            >
              <UserRound size={17} />
            </button>
          </div>
        </div>
      </header>
      <nav className="mobile-tabs" aria-label="Workspace">
        {navigation}
      </nav>
    </>
  )
}
