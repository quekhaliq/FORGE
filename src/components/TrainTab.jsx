import { useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  CalendarRange,
  ListChecks,
  Timer,
  Check,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import PageHeader from './PageHeader.jsx'
import TargetEventCard from './TargetEventCard.jsx'
import PerformanceStats from './PerformanceStats.jsx'
import SessionEditor from './SessionEditor.jsx'
import EquipmentArt from './EquipmentArt.jsx'
import OlyBlockProgram from './OlyBlockProgram.jsx'
import { crossFitWeeks } from '../data/crossFitTracks.js'
const phases = [
  'Foundation',
  'Density & speed',
  'Peak intensity',
  'Deload & test',
]
const jump = (id) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
function timerFor(w) {
  const s = [w.format, w.sub].join(' '),
    n = Number(s.match(/(\d+) MIN/)?.[1] || 15)
  return s.includes('EMOM')
    ? { mode: 'emom', intervalSec: 60, rounds: n }
    : s.includes('EVERY')
      ? {
          mode: 'emom',
          intervalSec: n * 60,
          rounds: Number(s.match(/X (\d+) SETS/)?.[1] || 8),
        }
      : { mode: 'amrap', durationSec: n * 60, rounds: 1 }
}
export default function TrainTab({
  state,
  onLaunchTimer,
  prs,
  onShareProgress,
  daysLeft,
  proteinConsumed,
  proteinTarget,
  snatchPR,
  onNavigate,
  saveSession,
}) {
  const p = state.profile
  const [today] = useState(() => (new Date().getDay() + 6) % 7)
  const [week, setWeek] = useState(1),
    [day, setDay] = useState(today)
  const program = crossFitWeeks[week - 1],
    wod = program[day],
    keyFor = (i) => `${p.sportMode}_w${week}_d${i}`,
    id = keyFor(day),
    log = state.sessionLogs?.[id] || {},
    custom = log.customProgram,
    completed = program.filter(
      (_, i) => state.sessionLogs?.[keyFor(i)]?.completed,
    ).length
  const preset = custom?.timerPreset || timerFor(wod)
  const [editor, setEditor] = useState(false)
  return (
    <div className="train">
      <PageHeader
        index={1}
        title="Training dashboard"
        subtitle="Your weekly command centre for race-day readiness."
        onShare={onShareProgress}
      />
      <TargetEventCard
        raceName={p.targetRaceName}
        raceDate={p.targetRaceDate}
        daysLeft={daysLeft}
        division={p.division}
      />
      <PerformanceStats
        done={completed}
        total={p.sportMode === 'Olympic Weightlifting' ? 3 : program.length}
        protein={proteinConsumed}
        target={proteinTarget}
        pr={snatchPR}
        onLifts={() => onNavigate('oly')}
        onFuel={() => onNavigate('fuel')}
      />
      {p.sportMode === 'Olympic Weightlifting' ? (
        <OlyBlockProgram
          state={state}
          saveSession={saveSession}
          prs={prs}
          week={week}
          setWeek={setWeek}
        />
      ) : (
        <>
          <div className="quick-jump">
            <span>Quick jump</span>
            {[
              [Activity, 'Today’s session', 'session'],
              [CalendarRange, 'Weekly plan', 'plan'],
              [ListChecks, 'Day details', 'details'],
            ].map(([Icon, name, section]) => (
              <button
                key={name}
                onClick={() => {
                  if (section === 'session') setDay(today)
                  jump(section)
                }}
              >
                <Icon size={13} />
                {name}
                <ArrowDownRight size={12} />
              </button>
            ))}
          </div>
          <div className="engine-title">
            <div>
              <p className="kicker">
                <i />
                Training plan
              </p>
              <h2>
                Weekly engine<b>.</b>
              </h2>
            </div>
            <span className="block-tag">
              <i />
              4-week block
            </span>
          </div>
          <div className="engine-grid">
            <section id="session" className="module">
              <div className="module-head">
                <span className="section-chip">01</span>
                <h3>
                  {day === today ? 'Today’s session' : 'Selected session'}
                </h3>
                <span className="module-badge">{wod.day}</span>
              </div>
              <div className="featured-session">
                <div className="session-art">
                  <EquipmentArt kind={wod.art} className="w-full h-full" />
                </div>
                <p className="tiny-label">
                  Week {String(week).padStart(2, '0')} <em>/</em>{' '}
                  {phases[week - 1]}
                </p>
                <h4>{custom?.title || wod.format}</h4>
                <p className="session-sub">
                  {custom?.sourceTag || wod.sub || 'Conditioning session'}
                </p>
              </div>
              <div className="movements">
                {(custom
                  ? [
                      {
                        tag: 'CUSTOM WORKOUT',
                        lines: [
                          custom.partA,
                          custom.partB,
                          custom.partC,
                        ].filter(Boolean),
                      },
                    ]
                  : wod.blocks
                ).map((block, i) => (
                  <div key={i}>
                    <p className="tiny-label">
                      {block.tag || 'Workout prescription'}
                    </p>
                    {block.lines.map((line, j) => (
                      <p className="move-line" key={j}>
                        <i />
                        {line}
                      </p>
                    ))}
                    {block.loading && (
                      <small>
                        M: {block.loading[0]} kg &nbsp; / &nbsp; W:{' '}
                        {block.loading[1]} kg
                      </small>
                    )}
                  </div>
                ))}
              </div>
              <div className="session-actions">
                <button
                  className="btn-primary"
                  onClick={() => saveSession(id, { completed: !log.completed })}
                >
                  <Check size={16} />
                  {log.completed ? 'Session done' : 'Mark done'}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => onLaunchTimer(preset, id)}
                >
                  <Timer size={15} />
                  Launch timer
                </button>
              </div>
              <details className="stimulus">
                <summary>
                  <Zap size={15} />
                  Coach stimulus
                  <ChevronDown size={14} />
                </summary>
                <p>{custom?.stimulusNotes || wod.coach}</p>
              </details>
            </section>
            <section id="plan" className="module">
              <div className="module-head">
                <span className="section-chip">02</span>
                <h3>Weekly plan</h3>
                <CalendarRange size={16} className="ml-auto muted-text" />
              </div>
              <div className="week-tabs">
                {phases.map((ph, i) => (
                  <button
                    key={ph}
                    aria-pressed={week === i + 1}
                    onClick={() => setWeek(i + 1)}
                  >
                    Week {i + 1}
                  </button>
                ))}
              </div>
              {program.map((w, i) => (
                <button
                  className="week-row"
                  key={w.id}
                  aria-pressed={day === i}
                  onClick={() => setDay(i)}
                >
                  <span>{w.day}</span>
                  <strong>
                    {state.sessionLogs?.[keyFor(i)]?.customProgram?.title ||
                      w.format}
                  </strong>
                  {state.sessionLogs?.[keyFor(i)]?.completed ? (
                    <Check size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ))}
            </section>
          </div>
          <section id="details" className="module">
            <div className="module-head">
              <span className="section-chip">03</span>
              <h3>Day details</h3>
              <button
                className="subtle-btn ml-auto"
                onClick={() => setEditor(true)}
              >
                <SlidersHorizontal size={14} />
                Custom WOD
              </button>
            </div>
            <SessionEditor
              key={id}
              log={log}
              save={(patch) => saveSession(id, patch)}
              onTimer={(pr) => onLaunchTimer(pr, id)}
              customOpen={editor}
              close={() => setEditor(false)}
            />
          </section>
        </>
      )}
    </div>
  )
}
