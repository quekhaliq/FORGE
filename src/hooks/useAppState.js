import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'hybrid_prep_hub_my_v2'

export function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function defaultState() {
  return {
    version: 2,
    onboarded: false,
    profile: {
      name: 'Athlete MY',
      sportMode: 'HYROX',
      skillLevel: 'Intermediate',
      division: 'Open',
      adaptiveNotes: '',
      targetRaceDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
      bodyWeightKg: 70,
      heightCm: 170,
      bodyFatPct: 20,
      sex: 'male',
      goal: 'recomp', // lean | muscle | recomp | bulk
      targetWeightKg: 70,
      targetBodyFatPct: 15,
      dietaryPref: 'halal-omnivore', // halal-omnivore | halal-vegetarian
      nutritionGoal: 1.8,
    },
    schedule: [
      { id: 1, day: 'Monday', title: 'HIIT Engine + Sled/Erg Intervals', type: 'HIIT', done: false, notes: '' },
      { id: 2, day: 'Tuesday', title: 'Zone 2 Aerobic Base Run (5–8km)', type: 'RUN', done: false, notes: '' },
      { id: 3, day: 'Wednesday', title: 'HIIT Power + Wall Balls & Lunges', type: 'HIIT', done: false, notes: '' },
      { id: 4, day: 'Thursday', title: 'Tempo / Threshold Run (4–6km)', type: 'RUN', done: false, notes: '' },
      { id: 5, day: 'Friday', title: 'HIIT Race Sim + Compromised 1km Repeats', type: 'HIIT', done: false, notes: '' },
      { id: 6, day: 'Saturday', title: 'Optional Recovery Run or Oly Technique', type: 'RUN', done: false, notes: '' },
    ],
    olyLogs: [],
    nutrition: {
      dateKey: todayKey(),
      loggedItems: [],
      prepChecklist: {},
    },
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== 2 || !parsed.profile) throw new Error('bad schema')
    const merged = { ...defaultState(), ...parsed, profile: { ...defaultState().profile, ...parsed.profile } }
    // daily auto-reset of logged items (checklist + profile preserved)
    if (merged.nutrition.dateKey !== todayKey()) {
      merged.nutrition = { ...merged.nutrition, dateKey: todayKey(), loggedItems: [] }
    }
    return merged
  } catch {
    return defaultState()
  }
}

export function useAppState() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const completeOnboarding = useCallback((patch) => {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: { ...s.profile, ...(patch || {}) },
    }))
  }, [])

  const skipOnboarding = useCallback(() => setState((s) => ({ ...s, onboarded: true })), [])

  const updateProfile = useCallback(
    (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
    [],
  )

  const toggleWorkout = useCallback((id) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((w) => (w.id === id ? { ...w, done: !w.done } : w)),
    }))
  }, [])

  const updateWorkout = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }))
  }, [])

  const addCustomWorkout = useCallback((title, metric) => {
    setState((s) => ({
      ...s,
      schedule: [
        ...s.schedule,
        {
          id: Date.now(),
          day: 'Bonus',
          title: metric ? `${title} (${metric})` : title,
          type: 'CUSTOM',
          done: true,
          notes: '',
        },
      ],
    }))
  }, [])

  // ensure a schedule entry exists for a program WOD (stable id), without
  // auto-marking it done — the user toggles completion themselves
  const ensureWodEntry = useCallback((id, title) => {
    setState((s) => {
      if (s.schedule.some((w) => w.id === id)) return s
      return {
        ...s,
        schedule: [
          ...s.schedule,
          { id, day: '', title, type: 'WOD', done: false, notes: '', result: '' },
        ],
      }
    })
  }, [])

  const addOlyLog = useCallback((log) => {
    setState((s) => ({
      ...s,
      olyLogs: [...s.olyLogs, { ...log, id: Date.now(), date: new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short' }) }],
    }))
  }, [])

  const deleteOlyLog = useCallback(
    (id) => setState((s) => ({ ...s, olyLogs: s.olyLogs.filter((l) => l.id !== id) })),
    [],
  )

  const logProtein = useCallback((entry) => {
    setState((s) => ({
      ...s,
      nutrition: { ...s.nutrition, dateKey: todayKey(), loggedItems: [...s.nutrition.loggedItems, entry] },
    }))
  }, [])

  const removeProteinItem = useCallback((index) => {
    setState((s) => {
      const items = [...s.nutrition.loggedItems]
      items.splice(index, 1)
      return { ...s, nutrition: { ...s.nutrition, loggedItems: items } }
    })
  }, [])

  const resetDailyFood = useCallback(() => {
    setState((s) => ({ ...s, nutrition: { ...s.nutrition, dateKey: todayKey(), loggedItems: [] } }))
  }, [])

  const togglePrepItem = useCallback((id) => {
    setState((s) => {
      const done = { ...s.nutrition.prepChecklist }
      if (done[id]) delete done[id]
      else done[id] = true
      return { ...s, nutrition: { ...s.nutrition, prepChecklist: done } }
    })
  }, [])

  const exportDataJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hybrid-prep-backup-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state])

  const importDataJSON = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const imported = JSON.parse(reader.result)
            if (!imported || imported.version !== 2 || !imported.profile) {
              throw new Error('Invalid backup: schema version mismatch')
            }
            setState({ ...defaultState(), ...imported, profile: { ...defaultState().profile, ...imported.profile } })
            resolve()
          } catch (e) {
            reject(e)
          }
        }
        reader.onerror = reject
        reader.readAsText(file)
      }),
    [],
  )

  const resetAll = useCallback(() => {
    if (!confirm('Reset ALL data? Onboarding will run again.')) return
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState())
  }, [])

  return {
    state,
    completeOnboarding,
    skipOnboarding,
    updateProfile,
    toggleWorkout,
    updateWorkout,
    addCustomWorkout,
    ensureWodEntry,
    addOlyLog,
    deleteOlyLog,
    logProtein,
    removeProteinItem,
    resetDailyFood,
    togglePrepItem,
    exportDataJSON,
    importDataJSON,
    resetAll,
  }
}

export function getAllTimePRs(olyLogs) {
  const prs = {}
  olyLogs.forEach((log) => {
    if (log.weight > (prs[log.variation] || 0)) prs[log.variation] = log.weight
  })
  return prs
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  return diff >= 0 ? diff : null
}

// ============================================================================
// Athlete metrics & nutrition targets — direct numeric inputs, no sliders
// ============================================================================

export const GOALS = [
  { id: 'lean', label: 'Lean / Fat Loss', calorieAdjust: -400 },
  { id: 'muscle', label: 'Muscular / Hypertrophy', calorieAdjust: +250 },
  { id: 'recomp', label: 'Lean & Muscular Recomp', calorieAdjust: 0 },
  { id: 'bulk', label: 'Add Body Weight / Bulk', calorieAdjust: +400 },
]

export const DIETARY_PREFS = [
  { id: 'halal-omnivore', label: 'Malaysian Halal Omnivore' },
  { id: 'halal-vegetarian', label: 'Malaysian Halal Vegetarian' },
]

/**
 * Computes body composition + daily nutrition targets from direct inputs.
 * - LBM = weight × (1 − bodyFat%/100)
 * - Protein: 2.0 g/kg body weight (1.8–2.2 band), capped by LBM method 2.3 g/kg LBM
 * - Calories: Mifflin-St Jeor BMR × activity 1.55, then goal adjust
 * - Safety floors: ≥1,500 kcal (male) / ≥1,200 kcal (female), never below
 */
export function computeMetrics(profile) {
  const weight = profile.bodyWeightKg || 70
  const bf = Math.min(60, Math.max(3, profile.bodyFatPct ?? 20))
  const height = profile.heightCm || 170
  const sex = profile.sex || 'male'
  const age = 30 // conservative default; not collected

  const lbm = weight * (1 - bf / 100)

  // protein: overlap of 1.8–2.2 g/kg BW and ~2.2–2.4 g/kg LBM → take the higher, cap sanely
  const proteinPerKgBW = Math.min(2.2, Math.max(1.8, 2.0))
  const proteinByLBM = Math.min(2.4, Math.max(2.2, 2.3)) * lbm
  const proteinG = Math.round(Math.min(proteinByLBM, proteinPerKgBW * weight + 40))
  const proteinCal = proteinG * 4

  // Mifflin-St Jeor
  const bmr =
    sex === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5
  const tdee = Math.round(bmr * 1.55) // moderate training 3-5×/week

  const goal = GOALS.find((g) => g.id === (profile.goal || 'recomp')) || GOALS[2]
  const targetCal = Math.round(tdee + goal.calorieAdjust)

  // safety floors
  const floor = sex === 'female' ? 1200 : 1500
  const calories = Math.max(floor, targetCal)
  const floored = targetCal < floor

  // fats/carbs split: fat 25% of calories, carbs fill remainder
  const fatG = Math.round((calories * 0.25) / 9)
  const carbsG = Math.round(Math.max(0, (calories - proteinCal - fatG * 9) / 4))

  // estimated target weight at goal body fat, keeping LBM constant
  const targetBf = Math.min(50, Math.max(5, profile.targetBodyFatPct ?? 15))
  const estTargetWeight = Math.round((lbm / (1 - targetBf / 100)) * 10) / 10

  return {
    lbm: Math.round(lbm * 10) / 10,
    proteinG,
    proteinPerKg: Math.round((proteinG / weight) * 10) / 10,
    calories,
    tdee,
    floor,
    floored,
    fatG,
    carbsG,
    estTargetWeight,
    goalLabel: goal.label,
  }
}

// ============================================================================
// Coach-style recommendation engine — explains what the numbers mean
// and suggests safe, evidence-based targets for the selected goal.
// ============================================================================

const HEALTHY_BF = { male: { min: 10, ideal: 15 }, female: { min: 18, ideal: 23 } }

export function recommendPlan(profile) {
  const weight = profile.bodyWeightKg || 70
  const bf = Math.min(60, Math.max(3, profile.bodyFatPct ?? 20))
  const sex = profile.sex || 'male'
  const goal = profile.goal || 'recomp'
  const lbm = weight * (1 - bf / 100)
  const healthy = HEALTHY_BF[sex]
  const steps = []

  if (goal === 'lean') {
    // Fat loss: aim for healthy ideal BF, preserve LBM
    const targetBf = bf > healthy.ideal ? healthy.ideal : Math.max(healthy.min, bf - 3)
    const targetWeight = lbm / (1 - targetBf / 100)
    const fatToLose = Math.max(0, weight - targetWeight)
    const weeklyKg = Math.min(0.7, Math.max(0.3, weight * 0.0075)) // 0.5–0.75% BW/week
    const weeks = Math.ceil(fatToLose / weeklyKg)
    if (fatToLose >= 0.5) {
      steps.push(
        `Your body fat is ${bf}% — above the healthy athletic range for ${sex === 'female' ? 'women' : 'men'} (~${healthy.min}–${healthy.ideal}%). A lean target of ${targetBf}% body fat is realistic and healthy.`,
        `That means losing about ${fatToLose.toFixed(1)} kg of fat while keeping your ${lbm.toFixed(1)} kg of muscle — target weight ≈ ${targetWeight.toFixed(1)} kg.`,
        `Safe rate: ${weeklyKg.toFixed(1)} kg per week (0.5–0.75% of body weight). At that pace you'll reach it in roughly ${weeks} weeks.`,
        `Your calorie target already includes a moderate deficit (−400 kcal) — combined with ${computeMetrics(profile).proteinG}g protein daily to protect muscle.`
      )
    } else {
      steps.push(
        `You're already lean at ${bf}% body fat — within the healthy athletic range.`,
        `A fat-loss phase isn't necessary; staying at maintenance calories with high protein will keep you sharp.`,
        `If you want visible definition, a slow recomp (maintenance calories + progressive training) is the better tool.`
      )
    }
  } else if (goal === 'muscle' || goal === 'bulk') {
    const isBulk = goal === 'bulk'
    const weeklyKg = isBulk ? 0.35 : 0.25 // ~0.25–0.35 kg/week lean gain
    const months = isBulk ? 6 : 4
    const gain = (weeklyKg * 4.3 * months).toFixed(1)
    const targetWeight = (weight + weeklyKg * 4.3 * months).toFixed(1)
    const targetBf = Math.min(healthy.ideal + (isBulk ? 4 : 2), bf + 2)
    steps.push(
      `Building muscle is slower than fat loss — expect roughly ${weeklyKg} kg per week of mostly-lean gain (${gain} kg over ~${months} months).`,
      `Suggested checkpoint: reach ≈ ${targetWeight} kg body weight, letting body fat drift up modestly to ~${targetBf}% (normal when gaining).`,
      `Your ${computeMetrics(profile).proteinG}g protein target and the ${isBulk ? '+400' : '+250'} kcal surplus in your calorie goal are set for exactly this.`,
      `After the gain phase, a short lean/fat-loss block (−400 kcal, same protein) reveals the new muscle.`
    )
  } else {
    // Recomp: similar weight, lower BF
    const targetBf = Math.max(healthy.min, bf - 4)
    const targetWeight = lbm / (1 - targetBf / 100)
    const delta = (targetWeight - weight).toFixed(1)
    steps.push(
      `Recomposition means staying near your current weight while swapping fat for muscle — the scale barely moves, the mirror does.`,
      `Aim for body fat from ${bf}% → ~${targetBf}% over 8–12 weeks. That's about ${Math.abs(delta)} kg ${delta >= 0 ? 'gain' : 'loss'} on the scale — don't chase the scale here.`,
      `Maintenance calories (${computeMetrics(profile).calories.toLocaleString()} kcal) with ${computeMetrics(profile).proteinG}g protein is the right setup — protein is the driver of recomp.`,
      `Progress markers: same weight, lifts going up, waist measurement going down. Track those instead of scale weight.`
    )
  }

  return { steps, lbm, targetBf: steps.length ? undefined : undefined, bf, weight }
}
