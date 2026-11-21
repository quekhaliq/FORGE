import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar.jsx'
import OnboardingModal from './components/OnboardingModal.jsx'
import TrainTab from './components/TrainTab.jsx'
import OlyTrackerTab from './components/OlyTrackerTab.jsx'
import MalaysianFuelTab from './components/MalaysianFuelTab.jsx'
import ProfileFeedbackTab from './components/ProfileFeedbackTab.jsx'
import ShareStoryModal from './components/ShareStoryModal.jsx'
import WodTimerModal from './components/WodTimerModal.jsx'
import AddToHomeScreenBanner from './components/AddToHomeScreenBanner.jsx'
import ScrollTopButton from './components/ScrollTopButton.jsx'
import { useAppState, getAllTimePRs, daysUntil } from './hooks/useAppState.js'

export default function App() {
  const app = useAppState()
  const [activeTab, setActiveTab] = useState('train')
  const [shareOpen, setShareOpen] = useState(false)
  const [timerOpen, setTimerOpen] = useState(false)
  const [timerPreset, setTimerPreset] = useState(null)
  const [toast, setToast] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('forge_theme') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('forge_theme', theme)
  }, [theme])

  // cycles dark → light → aurora
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const p = app.state.profile
  const daysLeft = daysUntil(p.targetRaceDate)
  const prs = getAllTimePRs(app.state.olyLogs)
  const completed = app.state.schedule.filter((w) => w.done).length
  const targetProtein = Math.round(p.bodyWeightKg * (p.nutritionGoal || 1.8))
  const proteinConsumed = app.state.nutrition.loggedItems.reduce((s, it) => s + it.grams, 0)

  const notify = useCallback((message) => setToast({ message, id: Date.now() }), [])

  const launchTimer = useCallback((preset = null) => {
    setTimerPreset(preset)
    setTimerOpen(true)
  }, [])

  const saveTimerResult = useCallback(
    (result) => {
      const wodEntry = app.state.schedule.find((w) => w.type === 'WOD' && !w.done)
      if (wodEntry) {
        app.updateWorkout(wodEntry.id, { notes: `[Timer: ${result}]`, done: true })
        notify(`Result saved to ${wodEntry.title.slice(0, 24)}… ✓`)
      } else {
        notify('Timer result: ' + result)
      }
    },
    [app, notify],
  )

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  // one-tap workout toggles give instant feedback
  const toggleWorkout = useCallback(
    (id) => {
      const item = app.state.schedule.find((w) => w.id === id)
      app.toggleWorkout(id)
      if (item) notify(item.done ? 'Session unmarked' : `${item.day} session done ✓`)
    },
    [app, notify],
  )

  const logProtein = useCallback(
    (entry) => {
      app.logProtein(entry)
      notify(`+${entry.grams}g protein logged ✓`)
    },
    [app, notify],
  )

  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        daysLeft={daysLeft}
        onShare={() => setShareOpen(true)}
        onLaunchTimer={() => launchTimer(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'train' && (
          <TrainTab
            state={app.state}
            toggleWorkout={toggleWorkout}
            updateWorkout={app.updateWorkout}
            ensureWodEntry={app.ensureWodEntry}
            addCustomWorkout={app.addCustomWorkout}
            onLaunchTimer={launchTimer}
            prs={prs}
            onNotify={notify}
            onAddEvent={app.addEvent}
            onUpdateEvent={app.updateEvent}
            onDeleteEvent={app.deleteEvent}
            onSetActiveEvent={app.setActiveEvent}
            onShareProgress={() => setShareOpen(true)}
            daysLeft={daysLeft ?? 0}
            proteinConsumed={proteinConsumed}
            proteinTarget={targetProtein}
            snatchPR={prs['Full Snatch'] || null}
          />
        )}
        {activeTab === 'oly' && (
          <OlyTrackerTab
            state={app.state}
            addOlyLog={(log) => {
              app.addOlyLog(log)
              notify(log.isPR ? `NEW PR! ${log.weight}kg ${log.variation} 🏆` : `${log.weight}kg ${log.variation} logged ✓`)
            }}
            deleteOlyLog={app.deleteOlyLog}
          />
        )}
        {activeTab === 'fuel' && (
          <MalaysianFuelTab
            state={app.state}
            profile={p}
            logProtein={logProtein}
            removeProteinItem={app.removeProteinItem}
            resetDailyFood={() => {
              app.resetDailyFood()
              notify("Today's protein reset")
            }}
            togglePrepItem={app.togglePrepItem}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileFeedbackTab
            state={app.state}
            updateProfile={app.updateProfile}
            exportDataJSON={() => {
              app.exportDataJSON()
              notify('Backup exported ✓')
            }}
            importDataJSON={app.importDataJSON}
            resetAll={app.resetAll}
            notify={notify}
          />
        )}
      </main>

      {!app.state.onboarded && (
        <OnboardingModal onComplete={app.completeOnboarding} onSkip={app.skipOnboarding} />
      )}

      <ShareStoryModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        profile={p}
        daysLeft={daysLeft}
        completed={completed}
        total={app.state.schedule.length}
        proteinConsumed={proteinConsumed}
        targetProtein={targetProtein}
        prs={prs}
      />

      <WodTimerModal
        open={timerOpen}
        onClose={() => setTimerOpen(false)}
        preset={timerPreset}
        onSaveResult={saveTimerResult}
      />

      <AddToHomeScreenBanner />
      <ScrollTopButton />

      {/* non-intrusive toast */}
      {toast && (
        <div key={toast.id} className="toast-enter fixed bottom-20 sm:bottom-6 inset-x-0 z-[55] flex justify-center pointer-events-none">
          <span className="text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg max-w-[90%] truncate border-2" style={{ background: 'var(--paper-card)', color: 'var(--ink)', borderColor: 'var(--line-soft)' }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  )
}
