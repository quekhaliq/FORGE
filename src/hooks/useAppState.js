import { useEffect, useState, useCallback } from 'react'

import { backup } from './schema.js'
import { crossFitWeeks } from '../data/crossFitTracks.js'
const STORAGE_KEY = 'hybrid_prep_hub_my_v2'

export function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function defaultState() {
  return {
    version: 2,
    onboarded: false,
    theme: 'dark',
    installDismissed: false,
    lastSync: null,
    sessionLogs: {},
    restoreId: 0,
    profile: {
      name: 'Athlete MY',
      sportMode: 'HYROX',
      skillLevel: 'Intermediate',
      division: 'Open',
      adaptiveNotes: '',
      targetRaceName: 'HYROX Kuala Lumpur',
      targetRaceDate: todayKey(new Date(Date.now() + 28 * 86400000)),
      bodyWeightKg: 70,
      heightCm: 170,
      bodyFatPct: 20,
      age: 30,
      activityDays: 4,
      sex: 'male',
      goal: 'recomp', // lean | muscle | recomp | bulk
      targetWeightKg: 70,
      targetBodyFatPct: 15,
      dietaryPref: 'halal-omnivore', // halal-omnivore | halal-vegetarian
      nutritionGoal: 1.8,
    },
    schedule: [
      {
        id: 1,
        day: 'Monday',
        title: 'HIIT Engine + Sled/Erg Intervals',
        type: 'HIIT',
        done: false,
        notes: '',
      },
      {
        id: 2,
        day: 'Tuesday',
        title: 'Zone 2 Aerobic Base Run (5–8km)',
        type: 'RUN',
        done: false,
        notes: '',
      },
      {
        id: 3,
        day: 'Wednesday',
        title: 'HIIT Power + Wall Balls & Lunges',
        type: 'HIIT',
        done: false,
        notes: '',
      },
      {
        id: 4,
        day: 'Thursday',
        title: 'Tempo / Threshold Run (4–6km)',
        type: 'RUN',
        done: false,
        notes: '',
      },
      {
        id: 5,
        day: 'Friday',
        title: 'HIIT Race Sim + Compromised 1km Repeats',
        type: 'HIIT',
        done: false,
        notes: '',
      },
      {
        id: 6,
        day: 'Saturday',
        title: 'Optional Recovery Run or Oly Technique',
        type: 'RUN',
        done: false,
        notes: '',
      },
    ],
    olyLogs: [],
    nutrition: {
      dateKey: todayKey(),
      loggedItems: [],
      prepChecklist: {},
    },
  }
}

export function restore(raw) {
  const value = backup.parse(raw),
    defaults = defaultState(),
    s = {
      ...defaults,
      ...value,
      profile: { ...defaults.profile, ...value.profile },
    }
  if (!value.sessionLogs)
    crossFitWeeks.forEach((week, w) =>
      week.forEach((day, d) => {
        const old = s.schedule.find((x) => x.id === day.id)
        if (old)
          s.sessionLogs[`${s.profile.sportMode}_w${w + 1}_d${d}`] = {
            completed: old.done,
            notes: old.notes,
            scoreOrResult: old.result || '',
          }
      }),
    )
  if (s.nutrition.dateKey !== todayKey())
    s.nutrition = { ...s.nutrition, dateKey: todayKey(), loggedItems: [] }
  return s
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return restore(JSON.parse(raw))
  } catch {
    return defaultState()
  }
}

export function useAppState() {
  const [state, setState] = useState(loadState)

  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      queueMicrotask(() => setStorageError(false))
    } catch {
      queueMicrotask(() => setStorageError(true))
    }
  }, [state])
  useEffect(() => {
    const rollover = () =>
      setState((s) =>
        s.nutrition.dateKey === todayKey()
          ? s
          : {
              ...s,
              nutrition: {
                ...s.nutrition,
                dateKey: todayKey(),
                loggedItems: [],
              },
            },
      )
    const id = setInterval(rollover, 30000)
    window.addEventListener('focus', rollover)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', rollover)
    }
  }, [])
  const setPref = useCallback((k, v) => setState((s) => ({ ...s, [k]: v })), [])
  const saveSession = useCallback(
    (id, patch) =>
      setState((s) => ({
        ...s,
        sessionLogs: {
          ...s.sessionLogs,
          [id]: {
            completed: false,
            selectedRunType: 'zone2',
            distanceKm: 0,
            avgPace: '',
            scoreOrResult: '',
            rpe: 0,
            notes: '',
            customProgram: null,
            ...s.sessionLogs[id],
            ...patch,
          },
        },
      })),
    [],
  )

  const completeOnboarding = useCallback((patch) => {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: { ...s.profile, ...(patch || {}) },
    }))
  }, [])

  const skipOnboarding = useCallback(
    () => setState((s) => ({ ...s, onboarded: true })),
    [],
  )

  const updateProfile = useCallback(
    (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
    [],
  )

  const toggleWorkout = useCallback((id) => {
    setState((s) => ({
      ...s,
      schedule: s.schedule.map((w) =>
        w.id === id ? { ...w, done: !w.done } : w,
      ),
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
          {
            id,
            day: '',
            title,
            type: 'WOD',
            done: false,
            notes: '',
            result: '',
          },
        ],
      }
    })
  }, [])

  const addOlyLog = useCallback((log) => {
    setState((s) => ({
      ...s,
      olyLogs: [
        ...s.olyLogs,
        {
          ...log,
          liftFocus: log.variation,
          complexScheme: log.sets,
          waveSteps: log.waveSteps || [],
          topWeightKg: log.weight,
          refPRKg: getAllTimePRs(s.olyLogs)[log.variation] || 0,
          technicalCues: log.feedback,
          id: Date.now(),
          date: todayKey(),
        },
      ],
    }))
  }, [])

  const deleteOlyLog = useCallback(
    (id) =>
      setState((s) => ({
        ...s,
        olyLogs: s.olyLogs.filter((l) => l.id !== id),
      })),
    [],
  )

  const logProtein = useCallback((entry) => {
    setState((s) => ({
      ...s,
      nutrition: {
        ...s.nutrition,
        dateKey: todayKey(),
        loggedItems: [...s.nutrition.loggedItems, entry],
      },
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
    setState((s) => ({
      ...s,
      nutrition: { ...s.nutrition, dateKey: todayKey(), loggedItems: [] },
    }))
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
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
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
            const checked = restore(imported)
            setState({ ...checked, restoreId: Date.now() })
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
    setPref,
    saveSession,
    storageError,
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
  const diff = (Date.parse(dateStr) - Date.parse(todayKey())) / 86400000
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
  const age = Math.min(90, Math.max(14, profile.age ?? 30))
  // activity multiplier from training days/week
  const days = Math.min(7, Math.max(0, profile.activityDays ?? 4))
  const activityMult =
    days === 0
      ? 1.2
      : days <= 2
        ? 1.375
        : days <= 4
          ? 1.55
          : days <= 6
            ? 1.725
            : 1.9

  const lbm = weight * (1 - bf / 100)

  // protein: overlap of 1.8–2.2 g/kg BW and ~2.2–2.4 g/kg LBM → take the higher, cap sanely
  const proteinG = Math.round(
    Math.max(1.8 * weight, Math.min(2.3 * lbm, 2.2 * weight)),
  )
  const proteinCal = proteinG * 4

  // Mifflin-St Jeor
  const bmr =
    sex === 'female'
      ? 10 * weight + 6.25 * height - 5 * age - 161
      : 10 * weight + 6.25 * height - 5 * age + 5
  const tdee = Math.round(bmr * activityMult)

  const goal =
    GOALS.find((g) => g.id === (profile.goal || 'recomp')) || GOALS[2]
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
    fatMass: Math.round((weight - lbm) * 10) / 10,
    bmr,
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
// NUTRITIONIST PRESCRIPTION ENGINE — user enters baseline digits + goal only;
// the app prescribes target weight, BF%, timeline, calories & macros.
// Healthy athletic BF ranges: men 10–14%, women 18–22%.
// ============================================================================

const HEALTHY_BF = { male: { min: 10, max: 14 }, female: { min: 18, max: 22 } }

export function prescribe(profile) {
  const weight = profile.bodyWeightKg || 70
  const bf = Math.min(60, Math.max(3, profile.bodyFatPct ?? 20))
  const sex = profile.sex || 'male'
  const goalId = profile.goal || 'recomp'
  const healthy = HEALTHY_BF[sex]
  const m = computeMetrics(profile)

  const fatMass = Math.round((weight - m.lbm) * 10) / 10
  let targetBf, targetWeight, weeklyRate, weeks

  if (goalId === 'lean') {
    if (bf > healthy.max) {
      targetBf = healthy.max
      weeklyRate = Math.min(0.7, Math.max(0.3, weight * 0.0075))
    } else {
      // already within healthy range — gentle further cut
      targetBf = Math.max(healthy.min, bf - 2)
      weeklyRate = Math.min(0.4, Math.max(0.2, weight * 0.004))
    }
    targetWeight = m.lbm / (1 - targetBf / 100)
    weeks = Math.max(2, Math.ceil(Math.abs(weight - targetWeight) / weeklyRate))
  } else if (goalId === 'muscle' || goalId === 'bulk') {
    const ratePerWeek = goalId === 'bulk' ? 0.35 : 0.25
    const horizonWeeks = goalId === 'bulk' ? 16 : 12
    targetWeight = Math.round((weight + ratePerWeek * horizonWeeks) * 10) / 10
    targetBf = Math.min(
      healthy.max + 4,
      Math.round(bf + ratePerWeek * horizonWeeks * 0.35 * (100 / weight)),
    )
    weeks = horizonWeeks
    weeklyRate = ratePerWeek
  } else {
    // recomp: weight roughly stable, BF down 3–4 points
    targetBf = Math.max(healthy.min, bf - 4)
    targetWeight = Math.round((m.lbm / (1 - targetBf / 100)) * 10) / 10
    weeklyRate =
      Math.abs(targetWeight - weight) > 0.5
        ? Math.abs(targetWeight - weight) / 10
        : 0.1
    weeks = 10
  }

  targetBf = Math.round(targetBf * 10) / 10
  targetWeight = Math.round(targetWeight * 10) / 10

  // goal-specific nutritionist rules (Malaysian context)
  const rulesByGoal = {
    lean: [
      'Post-workout: keep 30–40g protein + a fist of carbs within 90 min after training (e.g. nasi lemak swap — grilled chicken + rice, less sambal).',
      'Swap liquid & hidden calories: teh tarik → teh O kosong, gravy/oil-heavy dishes → grilled or souped versions (sup ayam over goreng).',
      'Hydration: 3–4 litres of water daily — thirst often reads as hunger, especially in Malaysian heat.',
    ],
    recomp: [
      'Front-load protein: 30–40g across 4 meals (ayam bakar, telur separuh masak, tempeh & tauhu) — muscle needs steady supply.',
      'Time carbs around training: more rice/chapati on training days, lighter on rest days.',
      'Weigh weekly, not daily — recomp shows in the mirror and barbell numbers before the scale.',
    ],
    muscle: [
      'Eat to the prescription, not appetite — missed surplus calories = missed growth. Add a daily smoothie (milk, banana, oats, peanut butter).',
      'Post-workout carbs are non-negotiable: rice/noodles/chapati within 2h after training to refill glycogen for the next session.',
      'Weigh in weekly same time same day — gaining slower than 0.2 kg/week means add ~200 kcal.',
    ],
    bulk: [
      'Calorie-dense additions, not bigger meals: drizzle olive oil, extra rice, nuts, santan-based dishes in moderation.',
      'Keep protein at prescription even on rest days — recovery is when muscle is built.',
      'Cap the bulk at your prescribed timeline, then switch to Lean / Fat Loss to reveal the mass you built.',
    ],
  }

  return {
    fatMass,
    lbm: m.lbm,
    targetBf,
    targetWeight,
    weeklyRate: Math.round(weeklyRate * 100) / 100,
    weeks,
    weightChange: Math.round((targetWeight - weight) * 10) / 10,
    calories: m.calories,
    proteinG: m.proteinG,
    carbsG: m.carbsG,
    fatG: m.fatG,
    floor: m.floor,
    floored: m.floored,
    tdee: m.tdee,
    bmr: m.bmr,
    healthyRange: `${healthy.min}–${healthy.max}%`,
    rules: rulesByGoal[goalId] || rulesByGoal.recomp,
  }
}
