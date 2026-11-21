import { useState } from 'react'
import { ChevronDown, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, Play } from 'lucide-react'
import { runBlock, segLabel } from '../data/runBlock.js'

const SEG_STYLE = {
  warmup: { icon: ArrowUpRight, color: 'text-sky-400', label: 'Warmup' },
  work: { icon: ArrowUp, color: 'text-orange-400', label: 'Work' },
  rest: { icon: ArrowDown, color: 'text-emerald-400', label: 'Recovery' },
  cooldown: { icon: ArrowDownRight, color: 'text-cyan-400', label: 'Cooldown' },
}

export default function RunBlockProgram({ state, toggleWorkout, updateWorkout, ensureWodEntry, onLaunchTimer }) {
  const p = state.profile
  const [week, setWeek] = useState(Math.min(p.currentWeek || 1, 4))
  const [openDay, setOpenDay] = useState(null)
  const block = runBlock[week - 1]
  const doneCount = block.sessions.filter((s) => state.schedule.find((x) => x.id === s.id)?.done).length

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] accent-text flex items-center">
            <span className="accent-bar" /> Running Program • Structured Intervals
          </p>
          <h1 className="display-font text-4xl sm:text-5xl mt-2 leading-[0.95]">
            Run<br />Block<span className="accent-text">.</span>
          </h1>
          <p className="text-sm muted-text mt-2">Segmented sessions: warmup → work → recovery → cooldown.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest muted-text">This Week</p>
          <p className="display-font text-2xl tnum">
            {doneCount}<span className="text-sm muted-text">/{block.sessions.length}</span>
          </p>
        </div>
      </div>

      {/* week pills + phase */}
      <section className="panel">
        <div className="grid grid-cols-4 gap-2 p-4 pb-0">
          {runBlock.map((b, i) => (
            <button
              key={b.week}
              onClick={() => setWeek(i + 1)}
              className={`min-h-[44px] rounded-xl text-xs font-black uppercase transition ${week === i + 1 ? 'pill-active' : 'pill-idle'}`}
            >
              W{b.week}
            </button>
          ))}
        </div>
        <div className="p-4 pt-3">
          <p className="display-font text-sm">{block.phase}</p>
          <p className="text-xs muted-text mt-1">{block.focus}</p>
        </div>
        {/* dotted session plan */}
        <div className="px-4 pb-2 pt-1">
          {block.sessions.map((s) => {
            const log = state.schedule.find((x) => x.id === s.id)
            return (
              <button key={s.id} onClick={() => setOpenDay(openDay === s.id ? null : s.day)} className="plan-row w-full text-left min-h-[56px]">
                <span className="day-chip">{s.day.slice(0, 3).toUpperCase()}</span>
                <span className="flex-1 min-w-0">
                  <span className={`font-bold text-sm block truncate ${log?.done ? 'line-through text-faint' : 'text-ink'}`}>{s.title}</span>
                  <span className="text-xs muted-text tnum block">{s.total} • {s.segs.length} segments</span>
                </span>
                {log?.done && <span className="text-orange-500 shrink-0">✓</span>}
              </button>
            )
          })}
        </div>
      </section>

      {/* structured session cards */}
      <div className="space-y-4">
        {block.sessions.map((s) => (
          <SessionCard
            key={s.id}
            session={s}
            log={state.schedule.find((x) => x.id === s.id)}
            open={openDay === s.day}
            onToggleOpen={() => setOpenDay(openDay === s.id ? null : s.day)}
            onToggleDone={() => {
              ensureWodEntry(s.id, `${s.title} — ${s.day}`)
              toggleWorkout(s.id)
            }}
            onLog={(patch) => {
              ensureWodEntry(s.id, `${s.title} — ${s.day}`)
              updateWorkout(s.id, patch)
            }}
            onLaunchTimer={onLaunchTimer}
          />
        ))}
      </div>
    </div>
  )
}

function SessionCard({ session, log, open, onToggleOpen, onToggleDone, onLog }) {
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState('')
  const done = !!log?.done

  const handleSave = () => {
    onLog({ notes: result ? `[${result}] ${notes}` : notes, done: true })
    onToggleOpen()
  }

  return (
    <div className={`rounded-2xl border-2 transition overflow-hidden ${done ? 'border-orange-500/70' : 'border-soft'}`} style={{ background: 'var(--paper-card)' }}>
      <button onClick={onToggleOpen} className="w-full text-left p-5">
        <p className="text-[11px] font-bold tracking-widest muted-text tnum uppercase">
          {session.day} • Total {session.total}
        </p>
        <h3 className="display-font text-2xl mt-1">{session.title}</h3>
        <p className="text-xs muted-text mt-1.5 tnum">{session.segs.length} segments</p>
        {log?.notes && (
          <p className="text-xs mt-2 p-2.5 rounded-xl bg-sunken border border-soft text-soft">
            <strong className="accent-text">Your Log:</strong> {log.notes}
          </p>
        )}
        <span className="flex items-center gap-1 text-[11px] font-bold uppercase muted-text mt-2">
          {open ? 'Hide segments' : 'View segments'} <ChevronDown className={`w-3.5 h-3.5 transition ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-4 space-y-2.5">
          {session.segs.map((seg, i) => {
            const st = SEG_STYLE[seg.seg]
            const Icon = st.icon
            return (
              <div key={i} className="rounded-2xl border-2 border-soft p-4 flex items-center gap-3" style={{ background: 'var(--paper)' }}>
                <Icon className={`w-5 h-5 shrink-0 ${st.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-ink">{seg.name}</p>
                  <p className="text-xs muted-text tnum">{segLabel(seg)}</p>
                </div>
                <span className="text-xs font-bold text-mid tnum shrink-0 flex items-center gap-1">
                  <Play className="w-3 h-3" /> {seg.zone}
                </span>
              </div>
            )
          })}

          {/* score logging */}
          <div className="space-y-2 pt-1">
            <input
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Result e.g. 31:42 / avg pace 5:50 /km"
              className="input tnum"
            />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes e.g. held Zone 3 the whole tempo block…"
              className="input"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save Score</button>
              <button
                onClick={() => {
                  onLog({ done: !done })
                  onToggleOpen()
                }}
                className="btn-ghost text-sm"
              >
                {done ? 'Undo' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-t-2" style={{ borderColor: 'var(--line-soft)' }}>
        <button
          onClick={onToggleDone}
          className={`flex-1 min-h-[52px] font-black uppercase text-xs tracking-wider transition ${done ? 'text-white' : ''}`}
          style={done ? { background: 'var(--uv)', color: '#0a0a0a' } : { background: 'var(--paper)', color: 'var(--muted)' }}
        >
          {done ? '✓ Session Done' : 'Tap When Done'}
        </button>
        <button
          onClick={onToggleOpen}
          className="px-4 min-h-[52px] border-l-2 text-xs font-bold uppercase"
          style={{ borderColor: 'var(--line-soft)', background: 'var(--paper)', color: 'var(--muted)' }}
        >
          Log Score
        </button>
      </div>
    </div>
  )
}
