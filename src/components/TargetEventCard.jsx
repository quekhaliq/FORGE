import { useState } from 'react'
import { MapPin, CalendarDays, Flag, Plus, Trash2, Pencil } from 'lucide-react'
import Modal from './Modal.jsx'

// Hero card showing the ACTIVE event with countdown, plus an
// "upcoming events" strip. Tap an event to make it active.
// "+ Manage Events" opens add/edit/delete for custom events
// (e.g. ATHX Las Vegas 2027, Borneo Pangazou 2026 Kota Kinabalu).
export default function TargetEventCard({ profile, notify, addEvent, updateEvent, deleteEvent, setActiveEvent }) {
  const events = profile.events || []
  const active = events.find((e) => e.id === profile.activeEventId) || events[0]
  const [showManage, setShowManage] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', date: '', location: '', venue: '', notes: 'More info coming soon' })

  const openNew = () => {
    setForm({ name: '', date: '', location: '', venue: '', notes: 'More info coming soon' })
    setEditing('new')
  }

  const openEdit = (ev) => {
    setForm({ ...ev })
    setEditing(ev.id)
  }

  const saveEvent = () => {
    if (!form.name.trim() || !form.date) {
      notify('Event needs at least a name and date')
      return
    }
    if (editing === 'new') {
      addEvent(form)
      notify('Event added ✓ — tap its card to make it the active target')
    } else if (editing) {
      updateEvent(editing, form)
      notify('Event updated ✓')
    }
    setEditing(null)
  }

  const fmtDate = (iso) =>
    iso ? new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBC'

  const dl = (iso) => {
    if (!iso) return null
    const diff = Math.ceil((new Date(iso + 'T00:00:00') - new Date()) / 86400000)
    return diff >= 0 ? diff : null
  }

  return (
    <div className="space-y-3">
      {/* active event hero */}
      <div className="rounded-2xl overflow-hidden border border-soft relative">
        <div
          className="relative min-h-[190px] p-5 flex flex-col justify-between"
          style={{
            background:
              'linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.75)), radial-gradient(circle at 70% 30%, #2e2a1f 0%, #131316 60%), #131316',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pr-1">
              <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
                <Flag className="w-3 h-3" /> Target Event
              </span>
              <h2 className="display-font text-3xl text-white mt-3 truncate">{active?.name || 'Target Event'}</h2>
              {active?.venue && <p className="text-xs font-bold text-zinc-300 mt-1 truncate">{active.venue}</p>}
              <p className="text-xs font-bold text-zinc-300 mt-1.5 flex items-center gap-3 tnum">
                <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-orange-400" /> {fmtDate(active?.date)}</span>
                {active?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-400" /> {active.location}</span>}
              </p>
              {active?.notes && <p className="text-[11px] text-zinc-400 mt-1.5 italic">{active.notes}</p>}
            </div>
            <div className="shrink-0 text-center bg-black/70 border border-soft rounded-xl px-4 py-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Race Countdown</p>
              <p className="display-font text-5xl text-orange-400 leading-none mt-1 tnum">{dl(active?.date) ?? '--'}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Days to go</p>
            </div>
          </div>
          <button
            onClick={() => setShowManage(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 border border-soft text-zinc-200 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg hover:text-orange-400"
          >
            <Pencil className="w-3 h-3" /> Manage
          </button>
        </div>
        <div className="h-2.5 w-full" style={{ background: 'repeating-linear-gradient(45deg, #f97316 0 12px, #0a0a0a 12px 24px)' }} />
      </div>

      {/* upcoming events strip */}
      {events.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
          {events.map((ev) => {
            const isActive = ev.id === active?.id
            const evDays = dl(ev.date)
            return (
              <button
                key={ev.id}
                onClick={() => setActiveEvent(ev.id)}
                className={`card !p-3 min-w-[150px] max-w-[170px] shrink-0 text-left transition ${isActive ? 'border-orange-500/70' : ''}`}
              >
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isActive ? 'bg-orange-500 text-white' : 'bg-sunken text-mid'}`}>
                  {isActive ? 'ACTIVE' : 'Upcoming'}
                </span>
                <span className="font-bold text-xs text-ink block truncate mt-1">{ev.name}</span>
                <span className="text-[10px] text-mid tnum block truncate">{fmtDate(ev.date)}</span>
                {evDays !== null && <span className="text-[10px] font-black accent-text tnum block">T-{evDays}</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* manage modal */}
      {showManage && (
        <Modal title="Manage Events" onClose={() => { setShowManage(false); setEditing(null) }}>
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 bg-sunken border border-soft rounded-xl px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-ink truncate">{ev.name}</p>
                  <p className="text-[11px] text-mid tnum">{fmtDate(ev.date)} • {ev.location || '—'}</p>
                </div>
                <button onClick={() => openEdit(ev)} className="w-[44px] h-[44px] flex items-center justify-center text-mid hover:text-orange-400" aria-label="Edit event">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${ev.name}"?`)) deleteEvent(ev.id) }}
                  className="w-[44px] h-[44px] flex items-center justify-center text-mid hover:text-red-400"
                  aria-label="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={openNew} className="btn-primary w-full text-sm flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>
        </Modal>
      )}

      {/* add/edit form */}
      {editing && (
        <Modal title={editing === 'new' ? 'Add Event' : 'Edit Event'} onClose={() => setEditing(null)}>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Event Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. ATHX Las Vegas 2027"
            className="input mb-3"
          />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input tnum mb-3" />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Location (Country / State)</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Kota Kinabalu, Sabah"
            className="input mb-3"
          />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Venue (optional)</label>
          <input
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            placeholder="e.g. Expo at World Market Center"
            className="input mb-3"
          />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Notes (optional)</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="More info coming soon"
            className="input mb-3"
          />
          <button onClick={saveEvent} className="btn-primary w-full">
            {editing === 'new' ? 'Add Event' : 'Save Changes'}
          </button>
        </Modal>
      )}
    </div>
  )
}
