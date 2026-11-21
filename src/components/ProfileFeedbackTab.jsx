import { useRef, useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { SPORTS, LEVELS, DIVISIONS, FEEDBACK_CATEGORIES, GITHUB_REPO } from '../data/malaysianMeals.js'
import { GOALS, DIETARY_PREFS, computeMetrics } from '../hooks/useAppState.js'
import CloudSyncCard from './CloudSyncCard.jsx'

export default function ProfileFeedbackTab({ state, updateProfile, exportDataJSON, importDataJSON, resetAll, notify }) {
  const [fbCategory, setFbCategory] = useState(FEEDBACK_CATEGORIES[0])
  const [fbText, setFbText] = useState('')
  const fileRef = useRef(null)
  const p = state.profile

  const saveTraining = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    updateProfile({
      name: fd.get('name') || 'Athlete MY',
      sportMode: fd.get('sportMode'),
      skillLevel: fd.get('skillLevel'),
      division: fd.get('division'),
      adaptiveNotes: fd.get('adaptiveNotes'),
    })
    notify('Training profile saved ✓')
  }

  const saveBody = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    updateProfile({
      bodyWeightKg: parseFloat(fd.get('bodyWeightKg')) || 70,
      heightCm: parseFloat(fd.get('heightCm')) || 170,
      bodyFatPct: parseFloat(fd.get('bodyFatPct')) || 20,
      sex: fd.get('sex') || 'male',
      goal: fd.get('goal') || 'recomp',
      targetWeightKg: parseFloat(fd.get('targetWeightKg')) || 70,
      targetBodyFatPct: parseFloat(fd.get('targetBodyFatPct')) || 15,
      dietaryPref: fd.get('dietaryPref') || 'halal-omnivore',
      targetRaceDate: fd.get('targetRaceDate'),
    })
    notify('Metrics & goals saved ✓')
  }

  const submitFeedback = () => {
    const body = fbText.trim()
    if (!body) return notify('Please enter your feedback first')
    const title = encodeURIComponent(`[${fbCategory}] User Feedback`)
    const text = encodeURIComponent(
      `**Category:** ${fbCategory}\n**Athlete Mode:** ${p.sportMode} (${p.division})\n\n**Details:**\n${body}`
    )
    window.open(`https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${text}`, '_blank')
  }

  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    importDataJSON(file)
      .then(() => notify('Backup imported ✓'))
      .catch(() => notify('Import failed — invalid backup file'))
    e.target.value = ''
  }

  return (
    <div className="space-y-5">
      <h2 className="font-black text-lg">Profile</h2>

      {/* Training Profile card */}
      <form onSubmit={saveTraining} className="card space-y-3">
        <h3 className="font-bold text-sm text-soft">Training Profile</h3>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Athlete Name</label>
          <input name="name" defaultValue={p.name} className="input" />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Sport Mode</label>
          <select name="sportMode" defaultValue={p.sportMode} className="input">
            {SPORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Level</label>
            <select name="skillLevel" defaultValue={p.skillLevel} className="input">
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Division</label>
            <select name="division" defaultValue={p.division} className="input">
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        {p.division === 'Adaptive' && (
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Adaptive Modification Notes</label>
            <textarea name="adaptiveNotes" rows={2} defaultValue={p.adaptiveNotes} placeholder="e.g. Seated sled push, handcycle for runs…" className="input" />
          </div>
        )}
        <button type="submit" className="btn-primary w-full">Save Training Profile</button>
      </form>

      {/* Athlete Metrics & Goals card — direct numeric inputs only */}
      <form onSubmit={saveBody} className="card space-y-3">
        <h3 className="font-bold text-sm text-soft">Athlete Metrics & Goals</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Body Weight (kg)</label>
            <input name="bodyWeightKg" type="number" step="0.1" min="30" defaultValue={p.bodyWeightKg} className="input tnum" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Height (cm)</label>
            <input name="heightCm" type="number" step="1" min="120" defaultValue={p.heightCm ?? 170} className="input tnum" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Body Fat (%)</label>
            <input name="bodyFatPct" type="number" step="0.5" min="3" max="60" defaultValue={p.bodyFatPct ?? 20} className="input tnum" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Sex (calorie floor)</label>
            <select name="sex" defaultValue={p.sex || 'male'} className="input">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Goal</label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <label key={g.id} className="cursor-pointer">
                <input type="radio" name="goal" value={g.id} defaultChecked={(p.goal || 'recomp') === g.id} className="peer sr-only" />
                <span className="flex items-center min-h-[44px] rounded-xl text-xs font-bold px-2 border-2 transition peer-checked:pill-active peer-checked:!bg-orange-500 peer-checked:!text-white border-soft block text-center">
                  {g.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Weight (kg)</label>
            <input name="targetWeightKg" type="number" step="0.1" min="30" defaultValue={p.targetWeightKg ?? 70} className="input tnum" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Body Fat (%)</label>
            <input name="targetBodyFatPct" type="number" step="0.5" min="5" max="50" defaultValue={p.targetBodyFatPct ?? 15} className="input tnum" />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Dietary Preference</label>
          <select name="dietaryPref" defaultValue={p.dietaryPref || 'halal-omnivore'} className="input">
            {DIETARY_PREFS.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Race Date</label>
          <input name="targetRaceDate" type="date" defaultValue={p.targetRaceDate} className="input tnum" />
        </div>

        {/* computed targets preview */}
        {(() => {
          const m = computeMetrics(p)
          return (
            <div className="rounded-xl p-3 bg-sunken space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest accent-text">Computed Targets (live)</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-black tnum accent-text">{m.lbm}</p>
                  <p className="text-[9px] font-bold uppercase muted-text">LBM kg</p>
                </div>
                <div>
                  <p className="text-lg font-black tnum accent-text">{m.proteinG}g</p>
                  <p className="text-[9px] font-bold uppercase muted-text">Protein ({m.proteinPerKg}g/kg)</p>
                </div>
                <div>
                  <p className="text-lg font-black tnum accent-text">{m.calories.toLocaleString()}</p>
                  <p className="text-[9px] font-bold uppercase muted-text">kcal/day</p>
                </div>
              </div>
              <p className="text-[10px] muted-text tnum">
                {m.goalLabel} • fats {m.fatG}g / carbs {m.carbsG}g • est. weight @ target BF: {m.estTargetWeight}kg • TDEE {m.tdee.toLocaleString()}
              </p>
              {m.floored && (
                <p className="text-[10px] text-orange-500 font-bold">
                  ⚠ {m.goalLabel} would drop below the {m.floor.toLocaleString()} kcal {p.sex === 'female' ? 'female' : 'male'} safety floor — calories held at the floor.
                </p>
              )}
            </div>
          )
        })()}
        <button type="submit" className="btn-primary w-full">Save Metrics & Goals</button>
      </form>

      {/* Feedback card */}
      <div className="card space-y-3">
        <h3 className="font-bold text-sm text-soft">Feedback & Feature Requests</h3>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFbCategory(c)}
              className={`min-h-[44px] px-3 rounded-full text-xs font-bold transition ${fbCategory === c ? 'pill-active' : 'pill-idle'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={fbText}
          onChange={(e) => setFbText(e.target.value)}
          placeholder="Describe your feedback…"
          className="input"
        />
        <button onClick={submitFeedback} className="btn-ghost w-full">
          Submit via GitHub Issues
        </button>
      </div>

      {/* Data management */}
      <CloudSyncCard state={state} importDataJSON={importDataJSON} notify={notify} />

      <div className="card space-y-3">
        <h3 className="font-bold text-sm text-soft">Data Management</h3>
        <p className="text-xs text-mid">Everything is stored on this device only. Export a JSON backup to move devices.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportDataJSON} className="btn-ghost text-xs flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost text-xs flex items-center gap-1.5">
            <Upload className="w-4 h-4" /> Import JSON
          </button>
          <button onClick={resetAll} className="btn-ghost text-xs flex items-center gap-1.5 !border-red-500/40 !text-red-400">
            <Trash2 className="w-4 h-4" /> Reset All
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" onChange={onImport} className="hidden" />
        </div>
      </div>
    </div>
  )
}
