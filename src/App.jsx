import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import OnboardingModal from './components/OnboardingModal.jsx'
import TrainTab from './components/TrainTab.jsx'
import OlyTrackerTab from './components/OlyTrackerTab.jsx'
import MalaysianFuelTab from './components/MalaysianFuelTab.jsx'
import ShareStoryModal from './components/ShareStoryModal.jsx'
import WodTimerModal from './components/WodTimerModal.jsx'
import AddToHomeScreenBanner from './components/AddToHomeScreenBanner.jsx'
import ScrollTopButton from './components/ScrollTopButton.jsx'
import {
  useAppState,
  getAllTimePRs,
  daysUntil,
  computeMetrics,
} from './hooks/useAppState.js'
const ProfileFeedbackTab = lazy(
  () => import('./components/ProfileFeedbackTab.jsx'),
)
const tabs = ['train', 'oly', 'fuel', 'profile']
export default function App() {
  const app = useAppState(),
    { state } = app,
    p = state.profile
  const [activeTab, tab] = useState(() =>
      tabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'train',
    ),
    [setup, setSetup] = useState(false),
    [share, setShare] = useState(false),
    [timer, setTimer] = useState(null),
    [toast, setToast] = useState(null)
  const notify = useCallback(
    (message) => setToast({ message, id: Date.now() }),
    [],
  )
  const nav = (t) => {
    location.hash = t
    tab(t)
    window.scrollTo(0, 0)
  }
  useEffect(() => {
    const sync = () =>
      tab(
        tabs.includes(location.hash.slice(1))
          ? location.hash.slice(1)
          : 'train',
      )
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme !== 'light')
  }, [state.theme])
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200)
      return () => clearTimeout(t)
    }
  }, [toast])
  const prs = getAllTimePRs(state.olyLogs),
    target = computeMetrics(p).proteinG,
    protein = state.nutrition.loggedItems.reduce((s, i) => s + i.grams, 0),
    days = daysUntil(p.targetRaceDate) ?? 0
  const launch = (preset, id) =>
    setTimer({
      preset,
      id: id || `${p.sportMode}_w1_d${(new Date().getDay() + 6) % 7}`,
    })
  const saveSession = (id, patch) => {
    app.saveSession(id, patch)
    notify(patch.completed === false ? 'Session unmarked' : 'Session saved')
  }
  const saved =
    (fn, msg) =>
    (...args) => {
      fn(...args)
      notify(msg)
    }
  return (
    <div className="min-h-screen pb-20 sm:pb-2">
      <Navbar
        activeTab={activeTab}
        daysLeft={days}
        onShare={() => setShare(true)}
        setActiveTab={nav}
        onLaunchTimer={() => launch()}
        onSetup={() => (state.onboarded ? nav('profile') : setSetup(true))}
        theme={state.theme}
        onToggleTheme={() =>
          app.setPref('theme', state.theme === 'light' ? 'dark' : 'light')
        }
      />
      <main className="workspace">
        {activeTab === 'train' && (
          <TrainTab
            state={state}
            saveSession={saveSession}
            onLaunchTimer={launch}
            prs={prs}
            onShareProgress={() => setShare(true)}
            daysLeft={days}
            proteinConsumed={protein}
            proteinTarget={target}
            snatchPR={prs['Full Snatch']}
            onNavigate={nav}
          />
        )}{' '}
        {activeTab === 'oly' && (
          <OlyTrackerTab
            state={state}
            addOlyLog={(l) => {
              app.addOlyLog(l)
              notify(l.isPR ? 'New personal record saved' : 'Lift saved')
            }}
            deleteOlyLog={saved(app.deleteOlyLog, 'Lift removed')}
          />
        )}{' '}
        {activeTab === 'fuel' && (
          <MalaysianFuelTab
            state={state}
            profile={p}
            logProtein={(e) => {
              app.logProtein(e)
              notify(`Logged ${e.grams} g protein`)
            }}
            removeProteinItem={saved(
              app.removeProteinItem,
              'Food entry removed',
            )}
            resetDailyFood={() => {
              if (confirm('Clear today’s food entries?')) {
                app.resetDailyFood()
                notify('Food log cleared')
              }
            }}
            togglePrepItem={saved(app.togglePrepItem, 'Checklist saved')}
          />
        )}{' '}
        {activeTab === 'profile' && (
          <Suspense fallback={<p>Opening profile…</p>}>
            <ProfileFeedbackTab
              key={state.restoreId}
              state={state}
              updateProfile={app.updateProfile}
              exportDataJSON={saved(app.exportDataJSON, 'Backup exported')}
              importDataJSON={app.importDataJSON}
              resetAll={app.resetAll}
              notify={notify}
              setPref={app.setPref}
            />
          </Suspense>
        )}
        {!state.onboarded && (
          <div className="card mt-5 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm">Make this workspace yours.</p>
            <div className="flex gap-3">
              <button
                className="btn-ghost text-xs"
                onClick={app.skipOnboarding}
              >
                Skip for now
              </button>
              <button
                className="btn-primary text-xs"
                onClick={() => setSetup(true)}
              >
                Set up athlete profile
              </button>
            </div>
          </div>
        )}
        {app.storageError && (
          <p role="status">
            Device storage unavailable. Export a backup before leaving.
          </p>
        )}
      </main>
      <footer className="forge-footer">
        <strong>FORGE.</strong>
        <span>Built by quekhaliq</span>
        <span className="motto">Built on Strength | Driven by Purpose</span>
        <a
          href="https://github.com/quekhaliq/FORGE"
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <button
          onClick={() => {
            nav('profile')
            requestAnimationFrame(() =>
              document.getElementById('feedback')?.scrollIntoView(),
            )
          }}
        >
          Feedback
        </button>
      </footer>
      {setup && (
        <OnboardingModal
          onComplete={(patch) => {
            app.completeOnboarding(patch)
            setSetup(false)
            notify('Athlete profile saved')
          }}
          onSkip={() => {
            app.skipOnboarding()
            setSetup(false)
          }}
        />
      )}
      {share && (
        <ShareStoryModal
          open
          onClose={() => setShare(false)}
          profile={p}
          daysLeft={days}
          completed={
            Object.values(state.sessionLogs).filter((x) => x.completed).length
          }
          total={p.sportMode === 'Olympic Weightlifting' ? 12 : 28}
          proteinConsumed={protein}
          targetProtein={target}
          prs={prs}
          notify={notify}
        />
      )}{' '}
      {timer && (
        <WodTimerModal
          open
          onClose={() => setTimer(null)}
          preset={timer.preset}
          onSaveResult={(result) =>
            saveSession(timer.id, { scoreOrResult: result, completed: true })
          }
        />
      )}
      <AddToHomeScreenBanner
        dismissed={state.installDismissed}
        onDismiss={() => app.setPref('installDismissed', true)}
      />
      <ScrollTopButton />
      {toast && (
        <div
          role="status"
          key={toast.id}
          className="toast-enter fixed bottom-20 sm:bottom-6 inset-x-0 z-[70] flex justify-center pointer-events-none"
        >
          <span className="card !py-3 text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
