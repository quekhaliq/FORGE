import { useState, useEffect } from 'react'
import { CloudUpload, CloudDownload, LogOut, Loader2, User } from 'lucide-react'
import { watchAuth, signInGoogle, getRedirectResultSafe, signOutUser, cloudPull, cloudPush } from '../hooks/firebase.js'

export default function CloudSyncCard({ state, importDataJSON, notify }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [busy, setBusy] = useState(null) // 'push' | 'pull' | 'signin'
  const [lastSynced, setLastSynced] = useState(localStorage.getItem('forge_last_sync') || null)

  useEffect(() => {
    const unsub = watchAuth((u) => {
      setUser(u)
      setAuthReady(true)
    })
    return unsub
  }, [])

  const markSynced = () => {
    const t = new Date().toLocaleString('en-MY')
    localStorage.setItem('forge_last_sync', t)
    setLastSynced(t)
  }

  const afterSignIn = async (u) => {
    try {
      // auto-pull: if the cloud has data, offer to restore it on this device
      const remote = await cloudPull(u.uid)
      if (remote && remote.profile) {
        const hasLocalData = state.profile && (state.schedule?.length > 0 || state.olyLogs?.length > 0)
        if (!hasLocalData || confirm("Cloud data found. Replace THIS device's data with your cloud copy?")) {
          const blob = new Blob([JSON.stringify(remote)], { type: 'application/json' })
          const file = new File([blob], 'remote.json', { type: 'application/json' })
          await importDataJSON(file)
        }
      }
      markSynced()
      notify(`Signed in as ${u.displayName || u.email} ✓`)
    } catch (e) {
      notify(e.message)
    }
  }

  // handle returning from the Google redirect
  useEffect(() => {
    getRedirectResultSafe()
      .then(async (result) => {
        if (result?.user) await afterSignIn(result.user)
      })
      .catch((e) => notify(e.message || 'Sign-in failed'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doSignIn = async () => {
    setBusy('signin')
    try {
      await signInGoogle() // redirects to Google, then back here
    } catch (e) {
      notify(e.message || 'Sign-in failed')
      setBusy(null)
    }
  }

  const doSignOut = async () => {
    if (!confirm('Sign out? Cloud data is kept and will restore on next sign-in.')) return
    await signOutUser()
    notify('Signed out ✓')
  }

  const doPush = async () => {
    setBusy('push')
    try {
      await cloudPush(user.uid, state)
      markSynced()
      notify('Pushed to cloud ✓')
    } catch (e) {
      notify(e.message)
    } finally {
      setBusy(null)
    }
  }

  const doPull = async () => {
    setBusy('pull')
    try {
      const remote = await cloudPull(user.uid)
      if (!remote || !remote.profile) return notify('Cloud is empty — push first')
      if (!confirm("Replace THIS device's data with the cloud copy?")) return
      const blob = new Blob([JSON.stringify(remote)], { type: 'application/json' })
      const file = new File([blob], 'remote.json', { type: 'application/json' })
      await importDataJSON(file)
      markSynced()
      notify('Pulled from cloud ✓')
    } catch (e) {
      notify(e.message)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-bold text-sm text-soft flex items-center gap-2">
        <User className="w-4 h-4 accent-text" /> Cloud Sync (Cross-Device)
      </h3>

      {!authReady ? (
        <p className="text-xs text-mid flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting…
        </p>
      ) : !user ? (
        <>
          <p className="text-xs text-mid">
            Sign in with Google to sync your training data across all devices — phone, tablet, laptop.
          </p>
          <button onClick={doSignIn} disabled={busy !== null} className="btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {busy === 'signin' ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleMark />}
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <div className="rounded-xl p-3 bg-sunken border border-soft flex items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border-2 border-soft" referrerPolicy="no-referrer" />
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-ink truncate">{user.displayName}</p>
              <p className="text-xs text-mid truncate">{user.email}</p>
              {lastSynced && <p className="text-[10px] text-faint tnum">Last synced: {lastSynced}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={doPush} disabled={busy !== null} className="btn-primary text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
              {busy === 'push' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />} Push Up
            </button>
            <button onClick={doPull} disabled={busy !== null} className="btn-ghost text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
              {busy === 'pull' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />} Pull Down
            </button>
          </div>
          <button onClick={doSignOut} className="btn-ghost w-full text-xs flex items-center justify-center gap-1.5 !border-red-500/40 !text-red-400">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </>
      )}
      <p className="text-[10px] text-faint">
        Your data syncs to your private Firebase account — only you can read it.
      </p>
    </div>
  )
}

// inline Google "G" mark (multicolor, official shape)
function GoogleMark() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-3.9 3C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.1 14.4c-.3-.8-.4-1.6-.4-2.4s.2-1.7.4-2.4l-3.9-3C.5 8.3 0 10.1 0 12s.5 3.7 1.2 5.4l3.9-3z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l3.9 3c1-2.9 3.7-4.8 6.9-4.8z" />
    </svg>
  )
}
