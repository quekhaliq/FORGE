import { z } from 'zod'
import {
  SPORTS,
  LEVELS,
  DIVISIONS,
  LIFT_VARIATIONS,
} from '../data/malaysianMeals.js'
const s = z.string().max(16000),
  n = z.number().finite(),
  key = z.union([n, s]),
  day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  positive = n.positive(),
  timer = z.object({
    mode: z.enum(['amrap', 'emom', 'intervals', 'forTime']),
    durationSec: n.nonnegative(),
    intervalSec: n.nonnegative(),
    rounds: positive.int(),
  })
const profile = z
  .object({
    name: s,
    sportMode: z.enum(SPORTS),
    skillLevel: z.enum(LEVELS),
    division: z.enum(DIVISIONS),
    adaptiveNotes: s.nullable(),
    targetRaceName: s,
    targetRaceDate: z.union([day, z.literal('')]),
    bodyWeightKg: positive.max(650),
    heightCm: positive.max(300),
    bodyFatPct: n.min(3).max(60),
    age: n.min(14).max(90),
    sex: z.enum(['male', 'female']),
    activityDays: n.int().min(0).max(7),
    goal: z.enum(['lean', 'muscle', 'recomp', 'bulk']),
    targetWeightKg: positive,
    targetBodyFatPct: n.min(0).max(70),
    dietaryPref: z.enum(['halal-omnivore', 'halal-vegetarian']),
  })
  .partial()
const session = z
  .object({
    completed: z.boolean(),
    selectedRunType: s,
    distanceKm: n.nonnegative(),
    avgPace: s,
    scoreOrResult: s,
    rpe: n.min(0).max(10),
    notes: s,
    customProgram: z
      .object({
        title: s,
        sourceTag: s,
        partA: s,
        partB: s,
        partC: s,
        stimulusNotes: s,
        timerPreset: timer,
      })
      .nullable(),
  })
  .partial()
export const backup = z.object({
  version: z.literal(2),
  profile,
  onboarded: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional(),
  installDismissed: z.boolean().optional(),
  lastSync: s.nullable().optional(),
  schedule: z.array(
    z.object({
      id: key,
      day: s,
      title: s,
      type: s,
      done: z.boolean(),
      notes: s,
      result: s.optional(),
    }),
  ),
  sessionLogs: z
    .record(
      z
        .string()
        .regex(/^(HYROX|CrossFit|Olympic Weightlifting|Hybrid)_w[1-4]_d[0-6]$/),
      session,
    )
    .optional(),
  olyLogs: z.array(
    z.object({
      id: key,
      date: s,
      variation: z.enum(LIFT_VARIATIONS),
      weight: positive,
      sets: s,
      feedback: s,
      isPR: z.boolean(),
      liftFocus: s.optional(),
      complexScheme: s.optional(),
      waveSteps: z.array(n).optional(),
      topWeightKg: positive.optional(),
      refPRKg: n.optional(),
      technicalCues: s.optional(),
    }),
  ),
  nutrition: z.object({
    dateKey: day,
    loggedItems: z.array(z.object({ name: s, at: s, grams: positive })),
    prepChecklist: z.record(z.string(), z.boolean()),
  }),
})
