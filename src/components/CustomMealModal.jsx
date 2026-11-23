import { useState, useMemo } from 'react'
import { Sparkles, Hash, Save, Trash2 } from 'lucide-react'
import Modal from './Modal.jsx'
import { estimateMeal, coachCheck, PORTIONS } from '../data/mealLexicon.js'

export default function CustomMealModal({
  open: _open,
  onClose,
  remaining, // { protein, calories } — what's left today after logged items
  goalLabel,
  onSave, // (entry) => log to day
  onSaveCustom, // (meal) => save to My Meals library
  savedCustom, // array of saved custom meals
  onDeleteCustom,
}) {
  const [mode, setMode] = useState('describe') // 'describe' | 'exact'
  const [desc, setDesc] = useState('')
  const [portion, setPortion] = useState(1)
  const [mealName, setMealName] = useState('')
  const [p, setP] = useState('')
  const [k, setK] = useState('')
  const [c, setC] = useState('')
  const [f, setF] = useState('')
  const [saveToggle, setSaveToggle] = useState(false)
  const [search, setSearch] = useState('')

  // describe-mode: apply portion multiplier live
  const est = useMemo(() => estimateMeal(desc), [desc])
  const scaled = useMemo(
    () => ({
      protein: Math.round(est.totals.protein * portion),
      kcal: Math.round(est.totals.kcal * portion),
      carbs: Math.round(est.totals.carbs * portion),
      fat: Math.round(est.totals.fat * portion),
    }),
    [est, portion]
  )
  const mealTotals =
    mode === 'describe'
      ? scaled
      : {
          protein: parseInt(p) || 0,
          kcal: parseInt(k) || 0,
          carbs: parseInt(c) || 0,
          fat: parseInt(f) || 0,
        }

  const tips = coachCheck(mealTotals, remaining, goalLabel)
  // describe-mode needs a recognizable dish; exact-mode needs a name + numbers
  const canSave =
    mode === 'describe'
      ? desc.trim().length > 3 && est.matched
      : (mealName.trim() || desc.trim()) && mealTotals.protein + mealTotals.kcal > 0

  const finalName = mode === 'exact' && mealName.trim() ? mealName.trim() : desc.trim() || 'Custom Meal'

  const logIt = () => {
    if (!canSave) return
    onSave({
      name: finalName,
      grams: mealTotals.protein,
      kcal: mealTotals.kcal,
      carbs: mealTotals.carbs,
      fat: mealTotals.fat,
      at: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
    })
    if (saveToggle) {
      onSaveCustom({
        name: finalName,
        protein: mealTotals.protein,
        kcal: mealTotals.kcal,
        carbs: mealTotals.carbs,
        fat: mealTotals.fat,
      })
    }
    // reset
    setDesc('')
    setMealName('')
    setP(''); setK(''); setC(''); setF('')
    setSaveToggle(false)
    onClose()
  }

  // saved meals filtered by search
  const filteredSaved = (savedCustom || []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Modal title="Customize / Describe Meal" onClose={onClose}>
      {/* mode pills */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => setMode('describe')}
          className={`min-h-[44px] rounded-xl text-xs font-black px-2 transition flex items-center justify-center gap-1.5 ${mode === 'describe' ? 'pill-active' : 'pill-idle'}`}
        >
          <Sparkles className="w-4 h-4" /> Quick Describe
        </button>
        <button
          onClick={() => setMode('exact')}
          className={`min-h-[44px] rounded-xl text-xs font-black px-2 transition flex items-center justify-center gap-1.5 ${mode === 'exact' ? 'pill-active' : 'pill-idle'}`}
        >
          <Hash className="w-4 h-4" /> Exact Digits
        </button>
      </div>

      {mode === 'describe' ? (
        <div className="space-y-3">
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder='Describe it: "nasi campur kurang nasi, ayam kunyit, 2 telur separuh masak, teh o kosong"'
            className="input"
          />
          {/* portion pills */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-mid block mb-1.5">Portion</label>
            <div className="grid grid-cols-4 gap-1.5">
              {PORTIONS.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setPortion(pt.id)}
                  className={`min-h-[44px] rounded-xl text-[11px] font-black transition ${portion === pt.id ? 'pill-active' : 'pill-idle'}`}
                >
                  {pt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          {/* matched items */}
          {est.matched && (
            <div className="rounded-xl p-2.5 bg-sunken border border-soft space-y-1">
              {est.items.map((it, i) => (
                <p key={i} className="text-xs text-soft tnum flex justify-between">
                  <span>{it.name}</span>
                  <span className="accent-text font-bold">{it.protein}g • {it.kcal} kcal</span>
                </p>
              ))}
            </div>
          )}
          {!est.matched && desc.trim().length > 3 && (
            <div className="rounded-xl p-3 bg-sunken border border-soft space-y-2">
              <p className="text-xs text-mid leading-relaxed">
                We couldn't estimate "<span className="font-semibold text-ink">{desc.trim()}</span>" yet — try keywords like nasi campur, ayam goreng, teh tarik…
              </p>
              <button onClick={() => { setMode('exact'); setMealName(desc.trim()) }} className="btn-primary w-full text-xs">
                Enter Numbers Manually Instead
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Meal name e.g. Post-gym smoothie"
            className="input"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-mid block mb-1.5">Protein (g)</label>
              <input type="number" min="0" value={p} onChange={(e) => setP(e.target.value)} className="input tnum" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-mid block mb-1.5">Calories</label>
              <input type="number" min="0" value={k} onChange={(e) => setK(e.target.value)} className="input tnum" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-mid block mb-1.5">Carbs (g)</label>
              <input type="number" min="0" value={c} onChange={(e) => setC(e.target.value)} className="input tnum" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-mid block mb-1.5">Fat (g)</label>
              <input type="number" min="0" value={f} onChange={(e) => setF(e.target.value)} className="input tnum" />
            </div>
          </div>
        </div>
      )}

      {/* live totals + coach check */}
      {(canSave || mealTotals.protein + mealTotals.kcal > 0) && (
        <div className="rounded-xl p-3 space-y-2 border-2" style={{ borderColor: 'var(--uv)', background: 'color-mix(in srgb, var(--uv) 8%, var(--paper-card))' }}>
          <p className="text-[10px] font-black uppercase tracking-widest accent-text">Will This Fit Your Day?</p>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div><p className="text-sm font-black tnum accent-text">{mealTotals.protein}g</p><p className="text-[8px] font-bold uppercase muted-text">Protein</p></div>
            <div><p className="text-sm font-black tnum accent-text">{mealTotals.kcal}</p><p className="text-[8px] font-bold uppercase muted-text">kcal</p></div>
            <div><p className="text-sm font-black tnum accent-text">{mealTotals.carbs}g</p><p className="text-[8px] font-bold uppercase muted-text">Carbs</p></div>
            <div><p className="text-sm font-black tnum accent-text">{mealTotals.fat}g</p><p className="text-[8px] font-bold uppercase muted-text">Fat</p></div>
          </div>
          <p className="text-[10px] muted-text tnum">
            Remaining today: {Math.max(0, remaining.protein - mealTotals.protein)}g protein • {Math.max(0, remaining.calories - mealTotals.kcal).toLocaleString()} kcal
          </p>
          <div className="space-y-1">
            {tips.map((tip, i) => (
              <p key={i} className="text-[11px] text-soft leading-relaxed">💡 {tip}</p>
            ))}
          </div>
        </div>
      )}

      {/* save toggle (describe mode only needs a name fallback) */}
      {canSave && (
        <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
          <input type="checkbox" checked={saveToggle} onChange={(e) => setSaveToggle(e.target.checked)} className="sr-only peer" />
          <span className="w-5 h-5 rounded-md border-2 border-soft flex items-center justify-center text-xs peer-checked:bg-orange-500 peer-checked:border-orange-500 text-transparent peer-checked:text-white">✓</span>
          <span className="text-xs text-soft flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 accent-text" /> Save to My Meals (reuse anytime)
          </span>
        </label>
      )}

      <button onClick={logIt} disabled={!canSave} className="btn-primary w-full disabled:opacity-50">
        Log This Meal
      </button>

      {/* saved custom meals with search */}
      {(savedCustom || []).length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-mid">My Custom Meals</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my meals…"
            className="input text-xs"
          />
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {filteredSaved.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs bg-sunken border border-soft rounded-lg px-2.5 py-2">
                <span className="text-soft truncate">{m.name} <span className="text-faint tnum">({m.protein}g)</span></span>
                <span className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onSave({ name: m.name, grams: m.protein, kcal: m.kcal, carbs: m.carbs, fat: m.fat, at: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) })
                      onClose()
                    }}
                    className="text-[11px] font-black accent-text px-2 min-h-[36px]"
                  >
                    Log
                  </button>
                  <button onClick={() => onDeleteCustom(m.id)} className="text-mid hover:text-red-400 px-1 min-h-[36px]" aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
