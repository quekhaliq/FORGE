import { useState } from 'react'
import { X, Plus, ChevronDown, Zap, Timer, CheckSquare, Square } from 'lucide-react'
import { crossFitWeeks } from '../data/crossFitTracks.js'
import OlyBlockProgram from './OlyBlockProgram.jsx'
import RunBlockProgram from './RunBlockProgram.jsx'
import EquipmentArt from './EquipmentArt.jsx'
import PageHeader from './PageHeader.jsx'
import TargetEventCard from './TargetEventCard.jsx'
import { Flame, Beef, Trophy } from 'lucide-react'

const WEEK_PHASES = ['Foundation', 'Density & Speed', 'Peak Intensity', 'Deload & Test']

// derive a timer preset from the WOD's format title
function timerPresetFor(wod) {
  const f = wod.format.toUpperCase()
  const amrap = f.match(/AMRAP X (\d+) MIN/)
  if (amrap) return { mode: 'amrap', durationSec: parseInt(amrap[1]) * 60, intervalSec: 0, rounds: 1 }
  const everyMin = f.match(/EVERY (\d+) MIN X (\d+) SETS/)
  if (everyMin) return { mode: 'emom', durationSec: 0, intervalSec: parseInt(everyMin[1]) * 60, rounds: parseInt(everyMin[2]) }
  if (f.includes('EMOM X')) {
    const m = wod.sub?.match(/EMOM X (\d+) MIN/)
    if (m) return { mode: 'emom', durationSec: 0, intervalSec: 60, rounds: parseInt(m[1]) }
    return { mode: 'emom', durationSec: 0, intervalSec: 60, rounds: 12 }
  }
  if (f.includes('DEATH BY')) return { mode: 'intervals', durationSec: 0, intervalSec: 60, rounds: 20 }
  if (f.includes('FOR MAX')) {
    const m = wod.blocks[0]?.lines.join(' ').match(/(\d+) MIN MAX/)
    return { mode: 'amrap', durationSec: (m ? parseInt(m[1]) : 10) * 60, intervalSec: 0, rounds: 1 }
  }
  return null
}

const TODAY_INDEX = (new Date().getDay() + 6) % 7 // Mon=0

export default function TrainTab({ state, toggleWorkout, updateWorkout, ensureWodEntry, addCustomWorkout, onLaunchTimer, prs, onShareProgress, daysLeft, proteinConsumed, proteinTarget, snatchPR }) {
  const p = state.profile
  const isOlyMode = p.sportMode === 'Olympic Weightlifting'
  const [viewMode, setViewMode] = useState('strength')
  const [week, setWeek] = useState(Math.min(p.currentWeek || 1, 4))
  const weekProgram = crossFitWeeks[week - 1]
  const doneCount = weekProgram.filter((w) => state.schedule.find((s) => s.id === w.id)?.done).length
  const todayWod = weekProgram[TODAY_INDEX] || weekProgram[0]

  if (isOlyMode) {
    return (
      <OlyBlockProgram
        state={state}
        toggleWorkout={toggleWorkout}
        updateWorkout={updateWorkout}
        ensureWodEntry={ensureWodEntry}
        prs={prs}
      />
    )
  }

  if (viewMode === 'run') {
    return (
      <RunBlockProgram
        state={state}
        toggleWorkout={toggleWorkout}
        updateWorkout={updateWorkout}
        ensureWodEntry={ensureWodEntry}
      />
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        index={1}
        title={`Training Dashboard`}
        subtitle={`Your weekly command centre for race-day readiness.`}
        onShare={onShareProgress}
      />

      {/* training concept switcher */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setViewMode('strength')}
          className={`min-h-[44px] rounded-xl text-xs font-black uppercase transition ${viewMode === 'strength' ? 'pill-active' : 'pill-idle'}`}
        >
          Strength & WOD Block
        </button>
        <button
          onClick={() => setViewMode('run')}
          className={`min-h-[44px] rounded-xl text-xs font-black uppercase transition ${viewMode === 'run' ? 'pill-active' : 'pill-idle'}`}
        >
          Running Block
        </button>
      </div>

      <TargetEventCard raceName={p.targetRaceName || 'Target Event'} raceDate={p.targetRaceDate} daysLeft={daysLeft} />

      {/* quick-jump navigation chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {[
          { id: 'sec-today', label: "Today's Session" },
          { id: 'sec-plan', label: 'Weekly Plan' },
          { id: 'sec-days', label: 'Day Details' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="btn-ghost !min-h-[40px] text-[11px] whitespace-nowrap shrink-0"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="card !p-3 space-y-1">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--uv) 18%, transparent)' }}>
            <Flame className="w-4 h-4 accent-text" />
          </span>
          <p className="text-[11px] font-bold text-mid">Weekly sessions</p>
          <p className="display-font text-xl tnum"><span className="accent-text">{doneCount}</span><span className="text-mid text-sm">/{weekProgram.length}</span></p>
          <p className="text-[10px] text-faint">Sessions this week</p>
        </div>
        <div className="card !p-3 space-y-1">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--uv) 18%, transparent)' }}>
            <Beef className="w-4 h-4 accent-text" />
          </span>
          <p className="text-[11px] font-bold text-mid">Daily protein</p>
          <p className="display-font text-xl tnum"><span className="accent-text">{proteinConsumed}</span><span className="text-mid text-sm">/{proteinTarget}g</span></p>
          <p className="text-[10px] text-faint">Daily protein target</p>
        </div>
        <div className="card !p-3 space-y-1">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--uv) 18%, transparent)' }}>
            <Trophy className="w-4 h-4 accent-text" />
          </span>
          <p className="text-[11px] font-bold text-mid">Snatch PR</p>
          <p className="display-font text-xl tnum">{snatchPR ? <span className="accent-text">{snatchPR}</span> : '—'}<span className="text-mid text-sm"> kg</span></p>
          <p className="text-[10px] text-faint">All-time personal best</p>
        </div>
      </div>

      <div className="pt-2 space-y-1">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-400 flex items-center gap-2">
          <span className="inline-block w-8 h-[3px] bg-orange-500" /> Training Plan
        </p>
        <h2 className="display-font text-3xl text-ink">Weekly Engine</h2>
        <p className="text-sm text-mid">Your session blueprint. Check off each session as you go.</p>
      </div>

            {/* 01 — TODAY'S SESSION panel (featured card with illustration) */}
      <section id="sec-today" className="panel scroll-mt-28">
        <div className="flex items-center justify-between px-4 py-3 hard-border-b">
          <div className="flex items-center gap-2.5">
            <span className="section-chip">01</span>
            <h2 className="display-font text-base">Today's Session</h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest muted-text tnum">
            WEEK {week} / {WEEK_PHASES[week - 1].toUpperCase()}
          </span>
        </div>
        <div className="grid sm:grid-cols-[1fr_220px]">
          <TodaySession
            wod={todayWod}
            log={state.schedule.find((s) => s.id === todayWod.id)}
            onEnsure={() => ensureWodEntry(todayWod.id, `${todayWod.format} — ${todayWod.day}`)}
            onToggle={toggleWorkout}
            onLog={updateWorkout}
            onLaunchTimer={onLaunchTimer}
            preset={timerPresetFor(todayWod)}
          />
          <div className="hidden sm:flex items-center justify-center border-l-2" style={{ borderColor: 'var(--line-soft)', background: 'color-mix(in srgb, var(--uv) 6%, var(--paper-card))' }}>
            <EquipmentArt kind={todayWod.art || 'barbell'} className="w-44 h-28 accent-text" />
          </div>
        </div>
      </section>

      {/* 02 — WEEKLY PLAN panel (dotted rows) */}
      <section id="sec-plan" className="panel scroll-mt-28">
        <div className="flex items-center justify-between px-4 py-3 hard-border-b">
          <div className="flex items-center gap-2.5">
            <span className="section-chip">02</span>
            <h2 className="display-font text-base">Weekly Plan</h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest muted-text tnum">
            {weekProgram.length - doneCount} SESSIONS LEFT
          </span>
        </div>
        {/* week pills */}
        <div className="grid grid-cols-4 gap-2 p-4 pb-0">
          {crossFitWeeks.map((_, i) => (
            <button
              key={i}
              onClick={() => setWeek(i + 1)}
              className={`min-h-[44px] rounded-xl text-xs font-black uppercase transition ${week === i + 1 ? 'pill-active' : 'pill-idle'}`}
            >
              W{i + 1}
            </button>
          ))}
        </div>
        <div className="px-4 pb-2 pt-2">
          {weekProgram.map((wod, i) => {
            const log = state.schedule.find((s) => s.id === wod.id)
            const isToday = i === TODAY_INDEX
            return (
              <button key={wod.id} onClick={() => ensureWodEntry(wod.id, `${wod.format} — ${wod.day}`)} className="plan-row w-full text-left min-h-[56px]">
                <span className={`day-chip ${isToday ? 'today' : ''}`}>{wod.day}</span>
                <span className="flex-1 min-w-0">
                  <span className="font-bold text-sm block truncate" style={{ color: log?.done ? 'var(--muted)' : 'var(--ink)', textDecoration: log?.done ? 'line-through' : 'none' }}>
                    {wod.format}
                  </span>
                  <span className="text-xs muted-text block truncate">{wod.sub || wod.blocks[0]?.lines[0]}</span>
                </span>
                {isToday && <span className="today-chip shrink-0">Today</span>}
                {log?.done && <span className="text-orange-500 shrink-0">✓</span>}
              </button>
            )
          })}
        </div>
        {/* expanded today card is shown in section 01; tapping a row jumps focus */}
      </section>

      {/* per-WOD detail cards (collapsible, below plan) */}
      <div className="space-y-3">
        {weekProgram.map((wod, i) => (
          <WodDetailCard
            key={wod.id}
            wod={wod}
            index={i}
            preset={timerPresetFor(wod)}
            log={state.schedule.find((s) => s.id === wod.id)}
            onEnsure={() => ensureWodEntry(wod.id, `${wod.format} — ${wod.day}`)}
            onToggle={toggleWorkout}
            onLog={updateWorkout}
            onLaunchTimer={onLaunchTimer}
          />
        ))}
      </div>

      <AddCustomWod onAdd={addCustomWorkout} />
    </div>
  )
}

// featured today card: big title, checklist-style movement lines, mark-done CTA
function TodaySession({ wod, log, onEnsure, onToggle, onLaunchTimer, preset }) {
  const done = !!log?.done

  const handleToggle = () => {
    onEnsure()
    onToggle(wod.id)
  }

  return (
    <div className="p-4 sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] accent-text">
        {wod.day} {wod.date} / Session
      </p>
      <h3 className="display-font text-3xl mt-1">{wod.format}</h3>
      {wod.sub && <p className="text-xs font-bold uppercase tracking-wide muted-text mt-1">{wod.sub}</p>}

      <div className="mt-3 space-y-1.5">
        {wod.blocks.flatMap((b, bi) =>
          b.lines.map((line, li) => (
            <p key={bi + '-' + li} className="text-sm font-semibold flex items-start gap-2">
              <span className="accent-text mt-0.5">{done ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}</span>
              <span className="uppercase tracking-wide">{line}</span>
            </p>
          ))
        )}
      </div>
      {wod.blocks.some((b) => b.loading) && (
        <p className="text-[11px] font-black muted-text tnum mt-2 uppercase">
          {wod.blocks.filter((b) => b.loading).map((b) => `M- ${b.loading[0]} / W- ${b.loading[1]} KG`).join('  •  ')}
        </p>
      )}
      {log?.notes && (
        <p className="text-xs mt-2 p-2.5 rounded-xl" style={{ background: 'var(--paper)', border: '1px solid var(--line-soft)' }}>
          <strong className="accent-text">Your Log:</strong> {log.notes}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={handleToggle} className="btn-primary flex items-center gap-1.5 text-sm flex-1 sm:flex-none sm:px-6">
          {done ? '✓ Session Done' : 'Mark Session Done'}
        </button>
        {preset && (
          <button onClick={() => onLaunchTimer(preset)} className="btn-ghost flex items-center gap-1.5 text-sm">
            <Timer className="w-4 h-4" /> Timer
          </button>
        )}
      </div>
    </div>
  )
}

// collapsible per-day card with score logging
function WodDetailCard({ wod, index, preset, log, onEnsure, onToggle, onLog, onLaunchTimer }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(log?.notes || '')
  const [result, setResult] = useState('')
  const done = !!log?.done

  const handleSave = () => {
    onEnsure()
    onLog(wod.id, { notes: result ? `[${result}] ${notes}` : notes, done: true })
    setOpen(false)
  }

  return (
    <div className="panel">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 text-left min-h-[56px]">
        <span className="section-chip">{String(index + 1).padStart(2, '0')}</span>
        <span className="flex-1 min-w-0">
          <span className="display-font text-sm block truncate">{wod.format}</span>
          <span className="text-[11px] muted-text block truncate">{wod.day} {wod.date} • {wod.sub || '—'}</span>
        </span>
        {log?.done && <span className="today-chip shrink-0">Done</span>}
        <ChevronDown className={`w-4 h-4 muted-text transition shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t-2" style={{ borderColor: 'var(--line-soft)' }}>
          <div className="flex gap-4 pt-3">
            <div className="flex-1 space-y-1">
              {wod.blocks.map((block, bi) => (
                <div key={bi} className="mb-2">
                  {block.tag && <p className="text-[10px] font-black uppercase tracking-widest muted-text mb-0.5">{block.tag}</p>}
                  <div className="border-l-2 pl-2.5 space-y-0.5" style={{ borderColor: 'var(--uv)' }}>
                    {block.lines.map((line, li) => (
                      <p key={li} className="text-xs font-bold uppercase tracking-wide leading-snug">{line}</p>
                    ))}
                  </div>
                  {block.loading && (
                    <p className="text-[10px] font-black muted-text tnum mt-1 uppercase">
                      M- {block.loading[0]} KG / W- {block.loading[1]} KG
                    </p>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs muted-text italic pr-2">{wod.coach}</p>
                {preset && (
                  <button
                    onClick={() => onLaunchTimer(preset)}
                    className="btn-ghost !min-h-[44px] !px-3 text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Timer className="w-3.5 h-3.5" /> Timer
                  </button>
                )}
              </div>
            </div>
            <div className="hidden sm:block shrink-0" style={{ background: 'color-mix(in srgb, var(--uv) 6%, var(--paper-card))' }}>
              <EquipmentArt kind={wod.art || 'barbell'} className="w-32 h-24 accent-text" />
            </div>
          </div>

          {/* score logging */}
          <div className="mt-3 space-y-2">
            <input
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Score e.g. 6 rounds + 7 reps / 11:24"
              className="input tnum"
            />
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes e.g. T2B broken 5/5 from round 3…"
              className="input"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="btn-primary flex-1 text-sm">Save Score</button>
              <button
                onClick={() => {
                  onEnsure()
                  onToggle(wod.id)
                }}
                className="btn-ghost text-sm"
              >
                {done ? 'Undo' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AddCustomWod({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [metric, setMetric] = useState('')

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-ghost w-full flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Extra Session
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            className="rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 space-y-3 max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--paper-card)', color: 'var(--ink)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Add Extra Session</h3>
              <button onClick={() => setOpen(false)} className="w-[44px] h-[44px] flex items-center justify-center muted-text -mr-2" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Zone 2 Run 40min / Fran" className="input" />
            <input value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Result e.g. 24:15 / RPE 8" className="input tnum" />
            <button
              onClick={() => {
                if (!title.trim()) return
                onAdd(title.trim(), metric.trim())
                setTitle('')
                setMetric('')
                setOpen(false)
              }}
              className="btn-primary w-full flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Save Session
            </button>
          </div>
        </div>
      )}
    </>
  )
}
