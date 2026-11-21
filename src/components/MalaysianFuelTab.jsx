import { useState } from 'react'
import { Plus, ChevronDown, RotateCcw, ShoppingBasket, Flame } from 'lucide-react'
import { malaysianMeals, mealPrepChecklist } from '../data/malaysianMeals.js'
import { computeMetrics } from '../hooks/useAppState.js'
import PageHeader from './PageHeader.jsx'
import Modal from './Modal.jsx'

const FILTERS = ['All', 'Halal', 'Vegetarian', 'Mamak']

export default function MalaysianFuelTab({ state, profile, logProtein, removeProteinItem, resetDailyFood, togglePrepItem }) {
  const [filter, setFilter] = useState('All')
  const [showQuick, setShowQuick] = useState(false)
  const [showPrep, setShowPrep] = useState(false)
  const [quickGrams, setQuickGrams] = useState('')

  const metrics = computeMetrics(profile)
  const target = metrics.proteinG
  const consumed = state.nutrition.loggedItems.reduce((s, it) => s + it.grams, 0)
  const pct = Math.min(100, Math.round((consumed / target) * 100))
  // dietary preference pre-filters the dish list (still overridable via pills)
  const isVeg = profile.dietaryPref === 'halal-vegetarian'
  const prefMeals = isVeg ? malaysianMeals.filter((m) => m.tags.includes('Vegetarian')) : malaysianMeals
  const filtered = filter === 'All' ? prefMeals : prefMeals.filter((m) => m.tags.includes(filter))
  const prepDone = Object.keys(state.nutrition.prepChecklist).length

  return (
    <div className="space-y-5">
      <PageHeader
        index={3}
        title={"My Fuel"}
        subtitle={"Malaysian meals to power your next session."}
      />
      {/* protein progress card with computed metrics */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg">Daily Protein</h2>
            <p className="text-xs text-mid tnum">
              LBM {metrics.lbm}kg • {metrics.proteinPerKg}g/kg = <span className="text-ink font-bold">{target}g</span>
            </p>
          </div>
          <span className="text-2xl font-black tnum">
            <span className={consumed >= target ? 'text-orange-400' : 'text-ink'}>{consumed}</span>
            <span className="text-sm text-mid">/{target}g</span>
          </span>
        </div>
        <div className="w-full bg-sunken h-3 rounded-full overflow-hidden border border-soft">
          <div className={`h-full transition-all duration-300 ${consumed >= target ? 'bg-orange-500' : 'bg-orange-500/70'}`} style={{ width: `${pct}%` }} />
        </div>
        {/* calorie context line */}
        <p className="text-[11px] tnum text-mid flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>
            <span className="font-bold text-ink">{metrics.calories.toLocaleString()} kcal/day</span> • {metrics.goalLabel} • fats {metrics.fatG}g / carbs {metrics.carbsG}g
            {metrics.floored && <span className="text-orange-500 font-bold"> (held at {metrics.floor.toLocaleString()} safety floor)</span>}
          </span>
        </p>
        <div className="flex gap-2">
          <button onClick={() => setShowQuick(true)} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> Quick Protein
          </button>
          <button onClick={resetDailyFood} className="btn-ghost px-3 flex items-center gap-1.5 text-xs" aria-label="Reset today's protein">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        {/* today's items */}
        {state.nutrition.loggedItems.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {state.nutrition.loggedItems.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-sunken border border-soft rounded-lg px-2.5 py-2">
                <span className="text-soft truncate">{it.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="tnum font-bold text-orange-400">+{it.grams}g</span>
                  <button onClick={() => removeProteinItem(i)} className="text-mid hover:text-red-400 min-h-[44px] min-w-[44px] -my-2" aria-label="Remove">
                    ×
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-h-[44px] px-4 rounded-full text-xs font-bold whitespace-nowrap transition ${filter === f ? 'pill-active' : 'pill-idle'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* meal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((m) => (
          <div key={m.id} className="card flex flex-col justify-between gap-3">
            <div>
              <div className="flex gap-1 mb-1.5 flex-wrap">
                {m.tags.map((t) => (
                  <span key={t} className="text-[9px] font-black uppercase bg-sunken border border-soft text-soft px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <h4 className="font-bold text-sm text-ink">{m.name}</h4>
              <p className="text-[11px] text-mid mt-0.5 tnum">
                {m.protein}g protein • ~{m.kcal} kcal
              </p>
            </div>
            <button
              onClick={() => logProtein({ name: m.name, grams: m.protein, at: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) })}
              className="surface-btn w-full text-xs font-bold min-h-[44px] rounded-xl"
            >
              + Add {m.protein}g
            </button>
          </div>
        ))}
      </div>

      {/* prep checklist accordion */}
      <div className="card !p-0 overflow-hidden">
        <button onClick={() => setShowPrep(!showPrep)} className="w-full flex items-center justify-between p-4 min-h-[44px]">
          <span className="font-bold text-sm flex items-center gap-2">
            <ShoppingBasket className="w-4 h-4 text-orange-400" /> 3-Day Batch Prep & Grocery
          </span>
          <span className="flex items-center gap-2 text-xs">
            <span className="tnum font-black text-orange-400">{prepDone}/{mealPrepChecklist.length}</span>
            <ChevronDown className={`w-4 h-4 text-mid transition ${showPrep ? 'rotate-180' : ''}`} />
          </span>
        </button>
        {showPrep && (
          <div className="px-4 pb-4 space-y-2">
            {mealPrepChecklist.map((item) => {
              const done = !!state.nutrition.prepChecklist[item.id]
              return (
                <button
                  key={item.id}
                  onClick={() => togglePrepItem(item.id)}
                  className={`w-full flex items-center gap-3 p-2.5 min-h-[44px] rounded-xl border transition text-left ${
                    done ? 'border-orange-500/50 bg-sunken' : 'border-soft bg-sunken'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center text-xs shrink-0 ${done ? 'bg-orange-500 border-orange-500 text-white' : 'border-soft text-transparent'}`}>
                    ✓
                  </div>
                  <span className={`text-xs flex-1 ${done ? 'line-through text-mid' : 'text-ink'}`}>{item.text}</span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${item.tag === 'Grocery' ? 'bg-orange-500/10 border border-orange-400/50 text-orange-400' : 'bg-sunken text-mid'}`}>
                    {item.tag}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* quick protein modal */}
      {showQuick && (
        <Modal title="Quick Log Protein" onClose={() => setShowQuick(false)}>
          <input
            type="number"
            value={quickGrams}
            onChange={(e) => setQuickGrams(e.target.value)}
            placeholder="Protein in grams e.g. 30"
            className="input tnum mb-3"
          />
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[20, 30, 40, 50].map((g) => (
              <button key={g} onClick={() => setQuickGrams(String(g))} className="btn-ghost !px-0 text-xs tnum">
                {g}g
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const g = parseInt(quickGrams)
              if (!g || g <= 0) return
              logProtein({ name: 'Quick log', grams: g, at: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) })
              setQuickGrams('')
              setShowQuick(false)
            }}
            className="btn-primary w-full"
          >
            Log Protein
          </button>
        </Modal>
      )}
    </div>
  )
}
