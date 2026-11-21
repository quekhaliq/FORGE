import { useState } from 'react'
import { Plus, Trash2, ChevronDown, Trophy, CalendarDays } from 'lucide-react'
import { LIFT_GROUPS, LIFT_VARIATIONS } from '../data/malaysianMeals.js'
import { getAllTimePRs } from '../hooks/useAppState.js'
import PageHeader from './PageHeader.jsx'
import Modal from './Modal.jsx'

export default function OlyTrackerTab({ state, addOlyLog, deleteOlyLog }) {
  const [showLog, setShowLog] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [showPRBoard, setShowPRBoard] = useState(false)
  const [historyFilter, setHistoryFilter] = useState('all')

  const [variation, setVariation] = useState(LIFT_VARIATIONS[0])
  const [sets, setSets] = useState('')
  const [weight, setWeight] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  // customizable session date — lets the athlete back-fill last week's
  // session and still get correct chronological PR comparison
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [maxDate] = useState(() => new Date().toISOString().split('T')[0])

  // PRs computed chronologically (sort by date) so back-dated entries
  // don't wrongly claim PRs over earlier sessions
  const sortedLogs = [...state.olyLogs].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const prs = getAllTimePRs(sortedLogs)

  const save = () => {
    const w = parseFloat(weight)
    if (!w || w <= 0) {
      setError('Enter a valid top weight in kg.')
      return
    }
    setError('')
    // chronological PR check: max weight recorded for this lift BEFORE the
    // chosen date (same-date entries count too, so re-logging a PR day works)
    const earlier = sortedLogs.filter(
      (l) => l.variation === variation && (l.date || '') <= date
    )
    const prBefore = earlier.reduce((max, l) => Math.max(max, l.weight), 0)
    addOlyLog({
      variation,
      sets: sets.trim(),
      weight: w,
      feedback: feedback.trim(),
      date,
      isPR: w > prBefore,
    })
    setWeight('')
    setFeedback('')
    setSets('')
    setDate(new Date().toISOString().split('T')[0])
    setShowLog(false)
  }

  // display helper: "21 Nov" or "21 Nov 2025" when not the current year
  const formatDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso + 'T00:00:00')
    const opts = { day: 'numeric', month: 'short' }
    if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric'
    return d.toLocaleDateString(undefined, opts)
  }

  const history = state.olyLogs
    .slice()
    .reverse()
    .filter((l) => historyFilter === 'all' || l.variation === historyFilter)

  // PRs with dates (first log that achieved the max)
  const prBoard = LIFT_VARIATIONS.map((lift) => {
    const logs = state.olyLogs.filter((l) => l.variation === lift)
    if (logs.length === 0) return null
    const max = Math.max(...logs.map((l) => l.weight))
    const prLog = logs.find((l) => l.weight === max)
    return { lift, weight: max, date: prLog.date, sets: prLog.sets }
  }).filter(Boolean)

  return (
    <div className="space-y-5">
      <PageHeader
        index={2}
        title={"Olympic Lifts"}
        subtitle={"Track your barbell sessions, technical cues and personal bests."}
      />
      <div className="flex sm:justify-end">
        <button onClick={() => setShowLog(true)} className="btn-primary text-sm flex items-center gap-1.5 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Log Lift
        </button>
      </div>

      {/* PR strip — horizontal scroll, top lifts */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4">
        {LIFT_VARIATIONS.slice(0, 10).map((lift) => (
          <div key={lift} className="card !p-3 min-w-[120px] shrink-0">
            <span className="text-[10px] font-bold text-mid block truncate">{lift}</span>
            <span className={`text-xl font-black tnum ${prs[lift] ? 'text-orange-400' : 'text-mid'}`}>
              {prs[lift] ? `${prs[lift]}` : '--'}<span className="text-xs font-bold"> kg</span>
            </span>
          </div>
        ))}
      </div>

      {/* PR & Strength Tracker module */}
      <section className="panel">
        <button onClick={() => setShowPRBoard(!showPRBoard)} className="w-full flex items-center justify-between px-4 py-3 min-h-[56px]">
          <span className="flex items-center gap-2.5">
            <span className="section-chip"><Trophy className="w-4 h-4" /></span>
            <span className="display-font text-base">PR & Strength Tracker</span>
          </span>
          <span className="flex items-center gap-2 text-xs">
            <span className="tnum font-black accent-text">{prBoard.length}/{LIFT_VARIATIONS.length}</span>
            <ChevronDown className={`w-4 h-4 muted-text transition ${showPRBoard ? 'rotate-180' : ''}`} />
          </span>
        </button>
        {showPRBoard && (
          <div className="px-4 pb-4 border-t-2 border-soft space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-mid pt-3 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> All-time 1RM by lift, with date achieved
            </p>
            {prBoard.length === 0 && (
              <p className="text-sm text-mid py-3">No PRs yet — log a lift to start the board.</p>
            )}
            {prBoard.map((pr, i) => (
              <div key={pr.lift} className="plan-row">
                <span className="day-chip tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-ink block truncate">{pr.lift}</span>
                  <span className="text-xs text-mid tnum block">{formatDate(pr.date)}{pr.sets ? ` • ${pr.sets}` : ''}</span>
                </span>
                <span className="text-right shrink-0">
                  <span className="text-lg font-black tnum accent-text">{pr.weight}</span>
                  <span className="text-xs font-bold text-mid"> kg</span>
                </span>
              </div>
            ))}
            {/* grouped catalog reference */}
            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-mid">Movement Catalog</p>
              {LIFT_GROUPS.map((g) => (
                <div key={g.group} className="text-xs">
                  <p className="font-black uppercase tracking-wide accent-text">{g.group}</p>
                  <p className="text-mid">{g.lifts.join(' • ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* session feed with filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-black text-sm uppercase tracking-wide">Session History</h3>
          <select
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
            className="input !min-h-[44px] !w-auto text-xs font-bold"
            aria-label="Filter history by lift"
          >
            <option value="all">All Lifts</option>
            {LIFT_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.lifts.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {state.olyLogs.length === 0 ? (
          <div className="card text-center py-8 space-y-3">
            <p className="text-4xl">🏋️</p>
            <p className="text-sm text-mid">No lifts logged yet.</p>
            <button onClick={() => setShowLog(true)} className="btn-primary inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Log Your First Lift
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-sm text-mid">No sessions for this lift yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {history.map((log) => {
              const pr = prs[log.variation] || log.weight
              const pct = pr ? Math.round((log.weight / pr) * 100) : 100
              const expanded = expandedId === log.id
              return (
                <div key={log.id} className="card space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-ink">{log.variation}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            log.isPR
                              ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                              : 'bg-sunken text-soft'
                          }`}
                        >
                          {log.isPR ? 'NEW PR' : `${pct}% of PR`}
                        </span>
                      </div>
                      <p className="text-xs text-mid mt-1 tnum">
                        <span className="text-ink font-bold">{log.weight} kg</span>
                        {log.sets && <> • {log.sets}</>} • {formatDate(log.date)}
                      </p>
                    </div>
                    <div className="flex shrink-0">
                      {log.feedback && (
                        <button
                          onClick={() => setExpandedId(expanded ? null : log.id)}
                          className="w-[44px] h-[44px] flex items-center justify-center text-mid hover:text-ink"
                          aria-label="Toggle coach feedback"
                        >
                          <ChevronDown className={`w-4 h-4 transition ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteOlyLog(log.id)}
                        className="w-[44px] h-[44px] flex items-center justify-center text-mid hover:text-red-400"
                        aria-label="Delete lift"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {expanded && log.feedback && (
                    <p className="text-xs bg-sunken border border-soft rounded-xl p-2.5 text-soft">
                      <strong className="text-orange-400">Coach Cue:</strong> {log.feedback}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* log modal — grouped dropdown */}
      {showLog && (
        <Modal title="Log Lift Session" onClose={() => setShowLog(false)}>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Lift Variation (by movement pattern)</label>
          <select value={variation} onChange={(e) => setVariation(e.target.value)} className="input mb-3">
            {LIFT_GROUPS.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.lifts.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Sets × Reps</label>
          <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="e.g. 5 × 2 @ 85%" className="input mb-3" />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Session Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
            className="input tnum mb-3"
          />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Daily Top Weight / 1RM (kg)</label>
          <input type="number" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 80" className="input tnum mb-3" />
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Coach Feedback / Cues (optional)</label>
          <textarea rows={2} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="e.g. Fast elbows, bar closer past knees…" className="input mb-3" />
          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
          <button onClick={save} className="btn-primary w-full">
            Save Lift
          </button>
        </Modal>
      )}
    </div>
  )
}
