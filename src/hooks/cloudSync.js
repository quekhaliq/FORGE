// ============================================================================
// Cross-device sync via GitHub Gist (secret gist = the sync code)
// Devices sign in with a Sync ID (the gist ID) and pull/push state.
// Reads are anonymous + CORS-open; writes require the device's token.
// Token setup: the athlete creates their own GitHub fine-grained token
// (gists read/write) and pastes it once per device — stored in
// localStorage, never committed to the repo.
// ============================================================================

const GIST_FILENAME = 'forge-sync.json'
const TOKEN_KEY = 'forge_sync_token'
const OWNER = 'quekhaliq'
const SYNC_ID_KEY = 'forge_sync_id'

export function getSyncToken() {
  return localStorage.getItem(TOKEN_KEY) || null
}

export function setSyncToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token.trim())
  else localStorage.removeItem(TOKEN_KEY)
}

export function getStoredSyncId() {
  return localStorage.getItem(SYNC_ID_KEY) || null
}

export function setStoredSyncId(id) {
  if (id) localStorage.setItem(SYNC_ID_KEY, id)
  else localStorage.removeItem(SYNC_ID_KEY)
}

// Create a new secret gist → its ID becomes the Sync ID
export async function createSyncCode() {
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Authorization: `token ${getSyncToken()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'FORGE athlete sync data',
      public: false,
      files: { [GIST_FILENAME]: { content: '{}' } },
    }),
  })
  if (!res.ok) throw new Error(`Sync service unavailable (${res.status})`)
  const j = await res.json()
  return j.id
}

// Pull remote state (anonymous raw read — works on any device)
export async function pullRemote(syncId) {
  const res = await fetch(`https://gist.githubusercontent.com/${OWNER}/${syncId}/raw/${GIST_FILENAME}`, {
    cache: 'no-store',
  })
  if (res.status === 404) throw new Error('Sync ID not found — check the code and try again.')
  if (!res.ok) throw new Error(`Sync service error (${res.status})`)
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Sync data is corrupted — contact support.')
  }
}

// Push local state up
export async function pushRemote(syncId, state) {
  const payload = JSON.stringify({
    ...state,
    syncedAt: new Date().toISOString(),
  })
  const res = await fetch(`https://api.github.com/gists/${syncId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${getSyncToken()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: { [GIST_FILENAME]: { content: payload } } }),
  })
  if (!res.ok) throw new Error(`Push failed (${res.status})`)
  return new Date().toISOString()
}
