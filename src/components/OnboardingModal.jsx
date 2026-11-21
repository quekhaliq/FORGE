import { useState } from 'react'
import { Dumbbell, Zap, ChevronRight } from 'lucide-react'
import { SPORTS, LEVELS, DIVISIONS, ADAPTIVE_NOTES } from '../data/malaysianMeals.js'
import { GOALS, DIETARY_PREFS, computeMetrics } from '../hooks/useAppState.js'

export default function OnboardingModal({ onComplete, onSkip }) {
  const [step, setStep] = useState(1)
  const [sportMode, setSportMode] = useState('HYROX')
  const [skillLevel, setSkillLevel] = useState('Intermediate')
  const [division, setDivision] = useState('Open')
  const [adaptiveNotes, setAdaptiveNotes] = useState('')
  const [bodyWeightKg, setBodyWeightKg] = useState(70)
  const [heightCm, setHeightCm] = useState(170)
  const [bodyFatPct, setBodyFatPct] = useState(20)
  const [sex, setSex] = useState('male')
  const [goal, setGoal] = useState('recomp')
  const [targetWeightKg, setTargetWeightKg] = useState(70)
  const [targetBodyFatPct, setTargetBodyFatPct] = useState(15)
  const [dietaryPref, setDietaryPref] = useState('halal-omnivore')
  // captured once per mount so render stays pure
  const [defaultRaceDate] = useState(() => new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0])
  const [targetRaceDate, setTargetRaceDate] = useState(defaultRaceDate)

  const num = (v, d) => (parseFloat(v) || d)
  const finish = () =>
    onComplete({
      sportMode, skillLevel, division, adaptiveNotes, targetRaceDate,
      bodyWeightKg: num(bodyWeightKg, 70),
      heightCm: num(heightCm, 170),
      bodyFatPct: num(bodyFatPct, 20),
      sex,
      goal,
      targetWeightKg: num(targetWeightKg, 70),
      targetBodyFatPct: num(targetBodyFatPct, 15),
      dietaryPref,
    })

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-sunken border border-soft rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* progress dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">MY</span>
            <h2 className="font-black text-lg">Welcome, Athlete</h2>
          </div>
          <button onClick={onSkip} className="text-xs text-mid underline hover:text-ink min-h-[44px] px-2">
            Skip for now
          </button>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? 'bg-orange-500' : 'bg-sunken'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-mid">3 quick questions to set up your prep hub.</p>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Sport Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSportMode(s)}
                    className={`min-h-[44px] rounded-xl text-sm font-bold px-3 transition ${sportMode === s ? 'pill-active' : 'pill-idle'}`}
                  >
                    {s === 'Olympic Weightlifting' ? 'Oly Lifting' : s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Level</label>
              <div className="grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSkillLevel(l)}
                    className={`min-h-[44px] rounded-xl text-xs font-bold px-2 transition ${skillLevel === l ? 'pill-active' : 'pill-idle'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Division</label>
              <div className="grid grid-cols-2 gap-2">
                {DIVISIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDivision(d)}
                    className={`min-h-[44px] rounded-xl text-sm font-bold px-3 transition ${division === d ? 'pill-active' : 'pill-idle'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            {division === 'Adaptive' && (
              <div className="bg-orange-500/5 border border-orange-500/40 rounded-xl p-3 space-y-2">
                <p className="text-xs text-soft">{ADAPTIVE_NOTES}</p>
                <textarea
                  rows={2}
                  value={adaptiveNotes}
                  onChange={(e) => setAdaptiveNotes(e.target.value)}
                  placeholder="Your modifications (e.g. seated sled push, 6kg ball)…"
                  className="input text-xs"
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Body Weight (kg)</label>
                <input type="number" step="0.1" value={bodyWeightKg} onChange={(e) => setBodyWeightKg(e.target.value)} className="input tnum" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Height (cm)</label>
                <input type="number" step="1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="input tnum" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Body Fat (%)</label>
                <input type="number" step="0.5" value={bodyFatPct} onChange={(e) => setBodyFatPct(e.target.value)} className="input tnum" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Sex (for calorie floor)</label>
                <select value={sex} onChange={(e) => setSex(e.target.value)} className="input">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Goal</label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => setGoal(g.id)} className={`min-h-[44px] rounded-xl text-xs font-bold px-2 transition ${goal === g.id ? 'pill-active' : 'pill-idle'}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Weight (kg)</label>
                <input type="number" step="0.1" value={targetWeightKg} onChange={(e) => setTargetWeightKg(e.target.value)} className="input tnum" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Body Fat (%)</label>
                <input type="number" step="0.5" value={targetBodyFatPct} onChange={(e) => setTargetBodyFatPct(e.target.value)} className="input tnum" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Dietary Preference</label>
              <div className="grid grid-cols-1 gap-2">
                {DIETARY_PREFS.map((d) => (
                  <button key={d.id} onClick={() => setDietaryPref(d.id)} className={`min-h-[44px] rounded-xl text-xs font-bold px-3 text-left transition ${dietaryPref === d.id ? 'pill-active' : 'pill-idle'}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid block mb-1.5">Target Race Date</label>
              <input type="date" value={targetRaceDate} onChange={(e) => setTargetRaceDate(e.target.value)} className="input tnum" />
            </div>
            {(() => {
              const m = computeMetrics({
                bodyWeightKg: parseFloat(bodyWeightKg) || 70,
                heightCm: parseFloat(heightCm) || 170,
                bodyFatPct: parseFloat(bodyFatPct) || 20,
                sex,
                goal,
              })
              return (
                <p className="text-[11px] p-2.5 rounded-xl bg-sunken">
                  <span className="accent-text font-bold">Your targets:</span>{' '}
                  <span className="tnum text-soft">
                    LBM {m.lbm}kg • {m.proteinG}g protein • {m.calories.toLocaleString()} kcal/day
                  </span>
                  {m.floored && <span className="block text-orange-500 mt-1">⚠ Adjusted up to the {m.floor.toLocaleString()} kcal safety floor.</span>}
                </p>
              )
            })()}
          </div>
        )}

        <div className="flex gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 flex items-center justify-center gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={finish} className="btn-primary flex-1 flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4" /> Start Training
            </button>
          )}
        </div>

        <p className="text-[11px] text-mid flex items-center gap-1.5">
          <Dumbbell className="w-3.5 h-3.5 text-orange-400" /> Everything stays on this device — no account needed.
        </p>
      </div>
    </div>
  )
}
