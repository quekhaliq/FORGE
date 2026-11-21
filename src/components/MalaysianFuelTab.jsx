import { useState } from 'react'
import { Plus, ChevronDown, ShoppingBasket, Flame, Sparkles } from 'lucide-react'
import { malaysianMeals, mealPrepChecklist } from '../data/malaysianMeals.js'
import { computeMetrics, todayKey } from '../hooks/useAppState.js'
import CustomMealModal from './CustomMealModal.jsx'
import PageHeader from './PageHeader.jsx'
import Modal from './Modal.jsx'

const FILTERS = ['All', 'My Custom', 'Halal', 'Vegetarian', 'Mamak']

export default function MalaysianFuelTab({ state, profile, logProtein, logProteinTo, removeProteinItemAt, resetDailyFood, togglePrepItem, customMeals, saveCustomMeal, deleteCustomMeal, selectedDate, setSelectedDate }) {
  const [filter, setFilter] = useState('All')
  const [showQuick, setShowQuick] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [showPrep, setShowPrep] = useState(false)
  const [quickGrams, setQuickGrams] = useState('')

  const metrics = computeMetrics(profile)
  const target = metrics.proteinG
  const dayItems = state.nutritionByDate?.[selectedDate] || []
  const consumed = dayItems.reduce((s, it) => s + it.grams, 0)
  const dayCal = dayItems.reduce((s, it) => s + (it.kcal || 0), 0)
  const pct = Math.min(100, Math.round((consumed / target) * 100))
  // dietary preference pre-filters the dish list (still overridable via pills)
  const isVeg = profile.dietaryPref === 'halal-vegetarian'
  const baseMeals = isVeg ? malaysianMeals.filter((m) => m.tags.includes('Vegetarian')) : malaysianMeals
  const allMeals = [
    ...baseMeals,
    ...(customMeals || []).map((m) => ({ id: 'c' + m.id, name: m.name, protein: m.protein, kcal: m.kcal, tags: ['My Custom'], customId: m.id })),
  ]
  const filtered =
    filter === 'All' ? allMeals
    : filter === 'My Custom' ? allMeals.filter((m) => m.tags.includes('My Custom'))
    : allMeals.filter((m) => m.tags.includes(filter))
  const prepDone = Object.keys(state.nutrition.prepChecklist).length

  return (
    <div className="space-y-5">
      <PageHeader
        index={3}
        title={"My Fuel"}
        subtitle={"Malaysian meals to power your next session."}
      />

      {/* multi-day switcher */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { offset: -1, label: 'Yesterday' },
          { offset: 0, label: 'Today' },
          { offset: 1, label: 'Tomorrow' },
          { offset: 2, label: '+2 Days' },
        ].map(({ offset, label }) => {
          const d = new Date()
          d.setDate(d.getDate() + offset)
          const key = d.toISOString().split('T')[0]
          const sel = selectedDate === key
          return (
            <button
              key={label}
              onClick={() => setSelectedDate(key)}
              className={`min-h-[52px] rounded-xl text-[10px] font-black uppercase transition flex flex-col items-center justify-center gap-0.5 ${sel ? 'pill-active' : 'pill-idle'}`}
            >
              <span>{label}</span>
              <span className="tnum text-[9px] opacity-70">{d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
            </button>
          )
        })}
      </div>
      {/* protein progress card with computed metrics */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg">Daily Protein</h2>
            <p className="text-xs text-mid tnum">
              LBM {metrics.lbm}kg • {metrics.proteinPerKg}g/kg = <span className="text-ink font-bold">{target}g</span>
            </p>
          </div>
          <span className="flex flex-col items-end gap-1">
            {consumed >= target && (
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg" style={{ background: 'color-mix(in srgb, var(--uv) 18%, transparent)', color: 'var(--uv)' }}>
                🎯 Target Hit!
              </span>
            )}
            <span className="text-2xl font-black tnum">
              <span className={consumed >= target ? 'text-orange-400' : 'text-ink'}>{consumed}</span>
              <span className="text-sm text-mid">/{target}g</span>
            </span>
          </span>
        </div>
        <div className="w-full bg-sunken h-3 rounded-full overflow-hidden border border-soft">
          <div className={`h-full transition-all duration-300 ${consumed >= target ? 'bg-orange-500' : 'bg-orange-500/70'}`} style={{ width: `${pct}%` }} />
        </div>
        {/* calorie context — calm and non-judgmental */}
        <p className="text-[11px] tnum text-mid flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>
            <span className="font-bold text-ink">{dayCal.toLocaleString()}</span> of {metrics.calories.toLocaleString()} kcal logged for {selectedDate === todayKey() ? 'today' : selectedDate} — steady, not perfect.
          </span>
        </p>
        <p className="text-[11px] tnum text-mid flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>
            <span className="font-bold text-ink">{metrics.calories.toLocaleString()} kcal/day</span> • {metrics.goalLabel} • fats {metrics.fatG}g / carbs {metrics.carbsG}g
            {metrics.floored && <span className="text-orange-500 font-bold"> (held at {metrics.floor.toLocaleString()} safety floor)</span>}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setShowQuick(true)} className="btn-primary text-sm flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> Quick Protein
          </button>
          <button onClick={() => setShowCustom(true)} className="btn-ghost text-sm flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Customize / Describe Meal
          </button>
        </div>
        <button onClick={() => resetDailyFood(selectedDate)} className="text-[11px] text-faint underline w-full text-left min-h-[32px]">
          Clear logged items for {selectedDate === todayKey() ? 'today' : selectedDate}
        </button>
        {/* today's items */}
        {dayItems.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {dayItems.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-sunken border border-soft rounded-lg px-2.5 py-2">
                <span className="text-soft truncate">{it.name}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="tnum font-bold text-orange-400">+{it.grams}g</span>
                  <button onClick={() => removeProteinItemAt(selectedDate, i)} className="text-mid hover:text-red-400 min-h-[44px] min-w-[44px] -my-2" aria-label="Remove">
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
              onClick={() => logProteinTo(selectedDate, { name: m.name, grams: m.protein, kcal: m.kcal, at: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) })}
              className="surface-btn w-full text-xs font-bold min-h-[44px] rounded-xl"
            >
              + Add {m.protein}g
            </button>
          </div>
        ))}
      </div>

      {showCustom && (
        <CustomMealModal
          open={showCustom}
          onClose={() => setShowCustom(false)}
          remaining={{ protein: Math.max(0, target - consumed), calories: Math.max(0, metrics.calories - dayCal) }}
          goalLabel={metrics.goalLabel}
          onSave={(entry) => logProteinTo(selectedDate, entry)}
          onSaveCustom={saveCustomMeal}
          savedCustom={customMeals}
          onDeleteCustom={deleteCustomMeal}
        />
      )}

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
