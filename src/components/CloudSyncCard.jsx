import { useState } from 'react'
import { CloudUpload, CloudDownload, Link2, LogOut, Loader2 } from 'lucide-react'
import { getStoredSyncId, setStoredSyncId, createSyncCode, pullRemote, pushRemote, getSyncToken, setSyncToken } from '../hooks/cloudSync.js'

export default function CloudSyncCard({ state, importDataJSON, notify }) {
  const [syncId, setSyncId] = useState(getStoredSyncId())
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(null) // null | 'create' | 'link' | 'push' | 'pull'
  const [lastSynced, setLastSynced] = useState(localStorage.getItem('forge_last_sync') || null)
  const [hasToken, setHasToken] = useState(!!getSyncToken())
  const [tokenInput, setTokenInput] = useState('')

  const saveToken = () => {
    if (!tokenInput.trim()) return
    setSyncToken(tokenInput.trim())
    setHasToken(true)
    setTokenInput('')
    notify('Sync token saved on this device ✓')
  }

  const wrap = async (kind, fn) => {
    setBusy(kind)
    try {
      await fn()
    } catch (e) {
      notify(e.message || 'Sync failed')
    } finally {
      setBusy(null)
    }
  }

  const create = () =>
    wrap('create', async () => {
      const id = await createSyncCode()
      setStoredSyncId(id)
      setSyncId(id)
      await pushRemote(id, state)
      const t = new Date().toLocaleString('en-MY')
      localStorage.setItem('forge_last_sync', t)
      setLastSynced(t)
      notify('Sync account created — save your Sync ID ✓')
    })

  const link = () =>
    wrap('link', async () => {
      const id = input.trim()
      if (!id) return notify('Paste your Sync ID first')
      const remote = await pullRemote(id) // validates the ID before storing
      setStoredSyncId(id)
      setSyncId(id)
      if (remote && remote.profile) {
        // ask which side wins when both have data
        const hasLocal = state.profile && (state.schedule?.length || state.olyLogs?.length)
        if (hasLocal && confirm('Remote data found. Replace THIS device\'s data with the cloud copy?')) {
          const blob = new Blob([JSON.stringify(remote)], { type: 'application/json' })
          const file = new File([blob], 'remote.json', { type: 'application/json' })
          await importDataJSON(file)
        }
      }
      const t = new Date().toLocaleString('en-MY')
      localStorage.setItem('forge_last_sync', t)
      setLastSynced(t)
      notify('Linked to cloud — devices share data ✓')
    })

  const push = () =>
    wrap('push', async () => {
      await pushRemote(syncId, state)
      const t = new Date().toLocaleString('en-MY')
      localStorage.setItem('forge_last_sync', t)
      setLastSynced(t)
      notify('Pushed to cloud ✓')
    })

  const pull = () =>
    wrap('pull', async () => {
      const remote = await pullRemote(syncId)
      if (!remote || !remote.profile) return notify('Cloud is empty — push first')
      if (!confirm('Replace THIS device\'s data with the cloud copy?')) return
      const blob = new Blob([JSON.stringify(remote)], { type: 'application/json' })
      const file = new File([blob], 'remote.json', { type: 'application/json' })
      await importDataJSON(file)
      const t = new Date().toLocaleString('en-MY')
      localStorage.setItem('forge_last_sync', t)
      setLastSynced(t)
      notify('Pulled from cloud ✓')
    })

  const signOut = () => {
    if (!confirm('Sign out of sync on this device? Cloud data is kept.')) return
    setStoredSyncId(null)
    setSyncId(null)
    notify('Signed out — local data kept')
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-bold text-sm text-soft flex items-center gap-2">
        <Link2 className="w-4 h-4 accent-text" /> Cloud Sync (Cross-Device)
      </h3>

      {!hasToken ? (
        <>
          <p className="text-xs text-mid">
            One-time setup: create a GitHub token with <strong className="text-ink">gists read/write</strong> access at
            github.com/settings/personal-access-tokens/new, then paste it here. It stays on this device.
          </p>
          <div className="flex gap-2">
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste GitHub token (github_pat_… / ghp_…)"
              className="input text-xs"
            />
            <button onClick={saveToken} className="btn-primary text-xs shrink-0">Save</button>
          </div>
        </>
      ) : !syncId ? (
        <>
          <p className="text-xs text-mid">
            Sign in to link this device to your training data. Create a Sync ID on your main device, then paste it on any other phone or laptop.
          </p>
          <button onClick={create} disabled={busy !== null} className="btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {busy === 'create' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            Create Sync ID (Sign In)
          </button>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste existing Sync ID…"
              className="input tnum text-xs"
            />
            <button onClick={link} disabled={busy !== null} className="btn-ghost text-xs flex items-center gap-1.5 shrink-0 disabled:opacity-50">
              {busy === 'link' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />} Link
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl p-3 bg-sunken border border-soft">
            <p className="text-[10px] font-black uppercase tracking-widest accent-text mb-1">Your Sync ID — copy to other devices</p>
            <p className="text-sm font-black tnum break-all select-all text-ink">{syncId}</p>
            {lastSynced && <p className="text-[10px] text-mid mt-1 tnum">Last synced: {lastSynced}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={push} disabled={busy !== null} className="btn-primary text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
              {busy === 'push' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />} Push Up
            </button>
            <button onClick={pull} disabled={busy !== null} className="btn-ghost text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
              {busy === 'pull' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudDownload className="w-4 h-4" />} Pull Down
            </button>
          </div>
          <button onClick={signOut} className="btn-ghost w-full text-xs flex items-center justify-center gap-1.5 !border-red-500/40 !text-red-400">
            <LogOut className="w-3.5 h-3.5" /> Sign Out (this device)
          </button>
        </>
      )}
      <p className="text-[10px] text-faint">
        Sync stores your data in a private cloud note. Anyone with your Sync ID can read it — keep it safe.
      </p>
    </div>
  )
}
