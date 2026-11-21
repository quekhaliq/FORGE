import { useState } from 'react'
import { RUN_TYPES } from '../data/programmingTracks.js'
import Modal from './Modal.jsx'
export default function SessionEditor({
  log,
  save,
  onTimer,
  customOpen,
  close,
}) {
  const [run, setRun] = useState(log.selectedRunType || 'zone2'),
    r = RUN_TYPES.find((x) => x.id === run) || RUN_TYPES[0],
    custom = log.customProgram || {}
  return (
    <div className="p-5 space-y-5">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const f = Object.fromEntries(new FormData(e.currentTarget))
          save({
            ...f,
            selectedRunType: run,
            distanceKm: Number(f.distanceKm),
            rpe: Number(f.rpe),
          })
        }}
      >
        <div className="form-grid">
          <label>
            Run type
            <select
              className="input"
              value={run}
              onChange={(e) => setRun(e.target.value)}
            >
              {RUN_TYPES.map((x) => (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Distance (km)
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              name="distanceKm"
              defaultValue={log.distanceKm}
            />
          </label>
          <label>
            Average pace (min/km)
            <input
              className="input"
              placeholder="5:30"
              pattern="[0-9]{1,2}:[0-5][0-9]"
              name="avgPace"
              defaultValue={log.avgPace}
            />
          </label>
        </div>
        <div className="card text-sm">
          <strong>
            {r.zone} · {r.rpe}
          </strong>
          <p>{r.workout}</p>
          <p className="text-mid">{r.cue}</p>
          <button
            type="button"
            className="accent-text min-h-[44px]"
            onClick={() => onTimer(r.timerPreset)}
          >
            Launch run timer →
          </button>
        </div>
        <div className="form-grid">
          <label>
            Score or result
            <input
              className="input"
              name="scoreOrResult"
              key={log.scoreOrResult}
              defaultValue={log.scoreOrResult}
            />
          </label>
          <label>
            RPE (1–10)
            <input
              type="number"
              min="1"
              max="10"
              className="input"
              name="rpe"
              defaultValue={log.rpe || ''}
            />
          </label>
          <label>
            Session notes
            <input name="notes" className="input" defaultValue={log.notes} />
          </label>
        </div>
        <button className="btn-primary">Save session log</button>
      </form>
      {customOpen && (
        <Modal title="Custom WOD builder" onClose={close}>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              const { mode, durationSec, intervalSec, rounds, ...f } =
                Object.fromEntries(new FormData(e.currentTarget))
              save({
                customProgram: {
                  ...f,
                  timerPreset: {
                    mode,
                    durationSec: +durationSec,
                    intervalSec: +intervalSec,
                    rounds: +rounds,
                  },
                },
              })
              close()
            }}
          >
            {[
              ['title', 'Workout title'],
              ['sourceTag', 'Source'],
              ['partA', 'Part A'],
              ['partB', 'Part B'],
              ['partC', 'Part C'],
              ['stimulusNotes', 'Stimulus notes'],
            ].map(([k, label]) => (
              <label key={k}>
                {label}
                <textarea
                  className="input"
                  name={k}
                  rows={k.startsWith('part') ? 2 : 1}
                  required={k === 'title' || k === 'partA'}
                  defaultValue={custom[k]}
                />
              </label>
            ))}
            <label>
              Timer mode
              <select
                className="input"
                name="mode"
                defaultValue={custom.timerPreset?.mode}
              >
                {['amrap', 'emom', 'intervals'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            {[
              ['durationSec', 'Work / countdown (s)', 60],
              ['intervalSec', 'Interval / rest (s)', 30],
              ['rounds', 'Rounds', 8],
            ].map(([k, l, v]) => (
              <label key={k}>
                {l}
                <input
                  name={k}
                  type="number"
                  className="input"
                  required
                  min="1"
                  max="14400"
                  defaultValue={custom.timerPreset?.[k] || v}
                />
              </label>
            ))}
            <button className="btn-primary w-full">Save workout</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
