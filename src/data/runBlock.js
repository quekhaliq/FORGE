// ============================================================================
// RUN BLOCK — structured interval running program (Apple Workouts style)
// Every session is segmented: Warmup / Work / Recovery / Cooldown, each with
// a distance or duration and a target HR zone. 4 weeks × 3 key sessions.
// ============================================================================

// seg: warmup | work | rest | cooldown — determines the icon/color
// dist: meters (or null) ; dur: minutes (or null) ; zone: HR zone label

export const runBlock = [
  {
    week: 1,
    phase: 'Aerobic Base & Cadence',
    focus: 'Build the engine. Easy miles at conversational effort, short sharp strides for leg speed.',
    sessions: [
      {
        id: 'rb1-a',
        day: 'Tuesday',
        title: 'Easy Aerobic Run',
        total: '5 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 3000, zone: 'HR Zone 2' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
      {
        id: 'rb1-b',
        day: 'Thursday',
        title: 'Speed & Endurance',
        total: '5 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Work', dist: 2000, zone: 'HR Zone 3' },
          { seg: 'work', name: 'Work', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 2' },
        ],
      },
      {
        id: 'rb1-c',
        day: 'Saturday',
        title: 'Long Run',
        total: '8 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 6000, zone: 'HR Zone 2' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
    ],
  },
  {
    week: 2,
    phase: 'Threshold Development',
    focus: 'Raise the ceiling. Lactate-threshold work at comfortably-hard effort with controlled recoveries.',
    sessions: [
      {
        id: 'rb2-a',
        day: 'Tuesday',
        title: 'Easy Aerobic Run',
        total: '6 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 4000, zone: 'HR Zone 2' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
      {
        id: 'rb2-b',
        day: 'Thursday',
        title: 'Tempo Intervals',
        total: '7 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Work', dist: 1000, zone: 'HR Zone 3' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 2000, zone: 'HR Zone 3' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 2' },
        ],
      },
      {
        id: 'rb2-c',
        day: 'Saturday',
        title: 'Progressive Long Run',
        total: '10 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 2000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Zone 2 Block', dist: 4000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Zone 3 Block', dist: 3000, zone: 'HR Zone 3' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
    ],
  },
  {
    week: 3,
    phase: 'VO2 Max & Speed',
    focus: 'Sharpen the top end. Short, fast VO2-max intervals with full recovery between reps.',
    sessions: [
      {
        id: 'rb3-a',
        day: 'Tuesday',
        title: 'Easy Aerobic Run',
        total: '6 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 4000, zone: 'HR Zone 2' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
      {
        id: 'rb3-b',
        day: 'Thursday',
        title: 'VO2 Max Intervals',
        total: '6 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Work', dist: 800, zone: 'HR Zone 4' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 800, zone: 'HR Zone 4' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 800, zone: 'HR Zone 5' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 800, zone: 'HR Zone 4' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
      {
        id: 'rb3-c',
        day: 'Saturday',
        title: 'Long Run + Strides',
        total: '11 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 2000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 8000, zone: 'HR Zone 2' },
          { seg: 'work', name: '4 × 100m Strides', dist: 400, zone: 'HR Zone 5' },
          { seg: 'cooldown', name: 'Cooldown', dist: 600, zone: 'HR Zone 1' },
        ],
      },
    ],
  },
  {
    week: 4,
    phase: 'Race Simulation & Taper',
    focus: 'Put it together. Race-pace blocks that mimic HYROX station-to-run transitions, then freshen up.',
    sessions: [
      {
        id: 'rb4-a',
        day: 'Tuesday',
        title: 'Compromised Run',
        total: '6 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Race Pace 1 km', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Race Pace 1 km', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Race Pace 1 km', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 2' },
        ],
      },
      {
        id: 'rb4-b',
        day: 'Thursday',
        title: 'Speed Sharpening',
        total: '5 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 2' },
          { seg: 'work', name: 'Work', dist: 1000, zone: 'HR Zone 4' },
          { seg: 'rest', name: 'Recovery', dur: 2, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Work', dist: 1000, zone: 'HR Zone 3' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
      {
        id: 'rb4-c',
        day: 'Saturday',
        title: 'Pre-Race Long Run',
        total: '8 km',
        segs: [
          { seg: 'warmup', name: 'Warmup', dist: 1000, zone: 'HR Zone 1' },
          { seg: 'work', name: 'Steady Run', dist: 6000, zone: 'HR Zone 2' },
          { seg: 'cooldown', name: 'Cooldown', dist: 1000, zone: 'HR Zone 1' },
        ],
      },
    ],
  },
]

// total weekly volume per week, for the header chips
export function runWeekVolume(week) {
  const kms = week.sessions
    .flatMap((s) => s.segs)
    .reduce((sum, seg) => sum + (seg.dist || 0), 0)
  return Math.round(kms / 100) / 10 // → "20.4 km"
}

export function segLabel(seg) {
  if (seg.dist) return `${seg.dist.toLocaleString()} m`
  if (seg.dur) return `${seg.dur} min`
  return '—'
}
