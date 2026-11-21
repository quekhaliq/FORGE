import { useState } from 'react'
import { Target, AlertCircle } from 'lucide-react'
import { olyBlock, OLY_BLOCK_RULES } from '../data/olyBlock.js'
import EquipmentArt from './EquipmentArt.jsx'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TODAY_INDEX = (new Date().getDay() + 6) % 7
const TODAY_NAME = DAYS_OF_WEEK[TODAY_INDEX]

export default function OlyBlockProgram({ state, toggleWorkout, updateWorkout, ensureWodEntry, prs }) {
  const p = state.profile
  const [week, setWeek] = useState(Math.min(p.currentWeek || 1, 4))
  const [openDay, setOpenDay] = useState(null)
  const block = olyBlock[week - 1]
  const doneCount = block.days.filter((d) => state.schedule.find((s) => s.id === d.day)?.done).length

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] accent-text flex items-center">
            <span className="accent-bar" /> Olympic Weightlifting • Technique Block
          </p>
          <h1 className="display-font text-4xl sm:text-5xl mt-2 leading-[0.95]">
            Block<br />Progression<span className="accent-text">.</span>
          </h1>
          <p className="text-sm muted-text mt-2">Non-consecutive days. Percentages from 1RM. No running.</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest muted-text">This Week</p>
          <p className="display-font text-2xl tnum">
            {doneCount}<span className="text-sm muted-text">/{block.days.length}</span>
          </p>
        </div>
      </div>

      {/* effort & load rules + cues */}
      <section className="panel p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="section-chip"><Target className="w-4 h-4" /></span>
          <h2 className="display-font text-base">Effort & Load Rules</h2>
        </div>
        <p className="text-sm text-soft">{OLY_BLOCK_RULES.schedule}</p>
        <p className="text-sm text-soft">{OLY_BLOCK_RULES.effort}</p>
        <div className="space-y-2 pt-1">
          {OLY_BLOCK_RULES.cues.map((c) => (
            <div key={c.lift} className="rounded-xl p-3 bg-sunken border border-soft">
              <p className="text-[10px] font-black uppercase tracking-widest accent-text mb-0.5">{c.lift} Setup</p>
              <p className="text-xs text-soft italic">"{c.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* week pills + phase goal */}
      <section className="panel">
        <div className="grid grid-cols-4 gap-2 p-4 pb-0">
          {olyBlock.map((b, i) => (
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
          <p className="display-font text-sm">{block.phase}<span className="muted-text font-normal normal-case"> — {block.sub || ''}</span></p>
          <p className="text-xs muted-text mt-1">{block.goal}</p>
        </div>
        {/* dotted day plan */}
        <div className="px-4 pb-2 pt-1">
          {block.days.map((d) => {
            const log = state.schedule.find((s) => s.id === d.day)
            const isToday = d.dayName === TODAY_NAME
            return (
              <button key={d.day} onClick={() => setOpenDay(openDay === d.day ? null : d.day)} className="plan-row w-full text-left min-h-[56px]">
                <span className={`day-chip ${isToday ? 'today' : ''}`}>{d.dayName.slice(0, 3).toUpperCase()}</span>
                <span className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-ink block truncate">{d.focus}</span>
                  <span className="text-xs muted-text block truncate tnum">{d.work[0].movement} • {d.work[0].sets} × {d.work[0].reps}</span>
                </span>
                {isToday && <span className="today-chip shrink-0">Today</span>}
                {log?.done && <span className="text-orange-500 shrink-0">✓</span>}
              </button>
            )
          })}
        </div>
      </section>

      {/* per-day detail cards */}
      <div className="space-y-4">
        {block.days.map((d) => (
          <DayCard
            key={d.day}
            dayData={d}
            log={state.schedule.find((s) => s.id === d.day)}
            prs={prs}
            open={openDay === d.day}
            onToggleOpen={() => setOpenDay(openDay === d.day ? null : d.day)}
            onToggleDone={() => {
              ensureWodEntry(d.day, `${d.focus} — ${d.dayName}`)
              toggleWorkout(d.day)
            }}
            onLog={(patch) => {
              ensureWodEntry(d.day, `${d.focus} — ${d.dayName}`)
              updateWorkout(d.day, patch)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function DayCard({ dayData, log, prs, open, onToggleOpen, onToggleDone, onLog }) {
  const [notes, setNotes] = useState('')
  const [result, setResult] = useState('')
  const done = !!log?.done

  const handleSave = () => {
    onLog({ notes: result ? `[${result}] ${notes}` : notes, done: true })
    onToggleOpen()
  }

  return (
    <div className={`rounded-2xl border-2 transition overflow-hidden ${done ? 'border-orange-500/70' : 'border-soft'}`} style={{ background: 'var(--paper-card)' }}>
      <div className="p-5" style={{ background: 'linear-gradient(160deg, var(--paper) 30%, var(--paper-card))' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-widest muted-text tnum uppercase">
              {dayData.day} • {dayData.dayName}
            </p>
            <h3 className="display-font text-2xl mt-1">{dayData.focus}</h3>
          </div>
          <EquipmentArt kind={dayData.art || 'barbell'} className="w-24 h-16 accent-text shrink-0 hidden sm:block" />
        </div>

        {/* movement table */}
        <div className="mt-4 space-y-0">
          {dayData.work.map((w, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 plan-row !py-2.5">
              <span className="day-chip tnum !px-2">{i + 1}</span>
              <span className="flex-1 min-w-0">
                <span className="font-bold text-sm text-ink block leading-snug">{w.movement}</span>
                <span className="text-xs text-mid tnum">
                  {w.sets} × {w.reps} <span className="accent-text font-bold">{w.load}</span>
                  {prs && w.load.includes('%') && kgHint(w.movement, w.load, prs) && (
                    <span className="text-faint"> ≈ {kgHint(w.movement, w.load, prs)} kg</span>
                  )}
                </span>
              </span>
            </div>
          ))}
        </div>

        {log?.notes && (
          <p className="text-xs mt-2 p-2.5 rounded-xl bg-sunken border border-soft text-soft">
            <strong className="accent-text">Your Log:</strong> {log.notes}
          </p>
        )}
      </div>

      <div className="flex border-t-2" style={{ borderColor: 'var(--line-soft)' }}>
        <button
          onClick={onToggleDone}
          className={`flex-1 min-h-[52px] font-black uppercase text-xs tracking-wider transition ${
            done ? 'text-white' : ''
          }`}
          style={done ? { background: 'var(--uv)' } : { background: 'var(--paper)', color: 'var(--muted)' }}
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

      {open && (
        <div className="border-t-2 p-4 space-y-2 bg-sunken" style={{ borderColor: 'var(--line-soft)' }}>
          <input
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Top set e.g. 92.5kg × 1 @ 8.5"
            className="input tnum"
          />
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Technical notes e.g. bar path drifted forward on catch…"
            className="input"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save Score</button>
            <button onClick={onToggleOpen} className="btn-ghost text-sm">Cancel</button>
          </div>
          {!prs || Object.keys(prs).length === 0 ? (
            <p className="text-[11px] text-mid flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-400" />
              No 1RMs logged yet — kg hints will appear once you log lifts in the Lifts tab. Use the RPE targets.
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}

// "≈ kg" hint: parse low end of the % range and match against stored PRs
function kgHint(movement, load, prs) {
  const m = load.match(/(\d+)(?:[–-](\d+))?%/)
  if (!m) return null
  const pctLow = parseInt(m[1]) / 100
  let base = null
  if (movement.toLowerCase().includes('snatch') && prs['Full Snatch']) base = prs['Full Snatch']
  else if (movement.toLowerCase().includes('clean') && prs['Clean & Jerk']) base = prs['Clean & Jerk']
  else if (movement.toLowerCase().includes('squat')) {
    base = movement.toLowerCase().includes('front') ? prs['Front Squat'] : prs['Back Squat']
  } else if (movement.toLowerCase().includes('push press')) base = prs['Push Press']
  if (!base) return null
  return Math.round((base * pctLow) / 2.5) * 2.5
}
