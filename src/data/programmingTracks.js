// ============================================================================
// HYBRID PREP HUB MY — Programming tracks, 4-week cycle, run types, Oly split
// ============================================================================

export const SPORT_MODES = ['HYROX', 'CrossFit', 'Olympic Weightlifting', 'Hybrid']
export const VOLUME_TRACKS = ['Athlete (60-90m)', 'Competitor (2-3h / 2-a-day)']
export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Pro']
export const DIVISIONS = ['Open', 'Pro', 'Doubles', 'Adaptive']

export const WEEKS = [
  {
    week: 1,
    phase: 'Foundation & Positional Control',
    focus: 'Bar path, pause/hang drills, 50–75% waves. Own every position before adding speed.',
  },
  {
    week: 2,
    phase: 'Complex Density & Speed Under Bar',
    focus: 'Multi-part complexes up to 80–85%. Move fast between reps, keep positions crisp.',
  },
  {
    week: 3,
    phase: 'Peak Technical Precision & Heavy Singles',
    focus: 'Wave ladders to 90%+ & max-out attempts. Only take singles that look and feel sharp.',
  },
  {
    week: 4,
    phase: 'Deload & Crisp Technique Taper',
    focus: 'Volume −40%, snappy singles @ 75–80%. Leave the bar feeling better than you arrived.',
  },
]

// ---------------------------------------------------------------------------
// 6 Performance Run Types
// ---------------------------------------------------------------------------
export const RUN_TYPES = [
  {
    id: 'zone2',
    name: 'Zone 2 / Easy Recovery',
    zone: 'HR Zone 2',
    rpe: 'RPE 4–5',
    cue: 'Conversational nasal-breathing effort. Build the aerobic base.',
    workout: '40–50 min steady nasal-breathing run',
    timerPreset: { mode: 'forTime', durationSec: 2700, intervalSec: 0, rounds: 1 },
  },
  {
    id: 'tempo',
    name: 'Tempo / Lactate Threshold',
    zone: 'HR Zone 3–4',
    rpe: 'RPE 7–8',
    cue: 'Comfortably-hard, sustained. Should feel controlled but hot.',
    workout: '10 min warmup + 3 × 8 min @ 10K threshold pace w/ 2 min jog rest',
    timerPreset: { mode: 'intervals', durationSec: 480, intervalSec: 120, rounds: 3 },
  },
  {
    id: 'vo2',
    name: 'Track / VO2 Max Intervals',
    zone: 'HR Zone 4–5',
    rpe: 'RPE 9',
    cue: 'Repeatability & oxygen uptake. Hit the same split every rep.',
    workout: '8 × 400m @ 5K pace w/ 90s rest (or 5 × 1km repeats)',
    timerPreset: { mode: 'intervals', durationSec: 100, intervalSec: 90, rounds: 8 },
  },
  {
    id: 'compromised',
    name: 'Compromised Running (HYROX)',
    zone: 'Race HR',
    rpe: 'RPE 8–9',
    cue: 'Run on heavy legs. Practice the race-day shuffle under fatigue.',
    workout: '4 Rounds: 500m Sled Push / Heavy Wall Balls + 1km Run @ Race Pace',
    timerPreset: { mode: 'amrap', durationSec: 1800, intervalSec: 0, rounds: 1 },
  },
  {
    id: 'fartlek',
    name: 'Fartlek / Speed Play',
    zone: 'Zone 2–5 rolling',
    rpe: 'RPE 6–9 surges',
    cue: 'Unstructured surges. Surge on feel, float to recover.',
    workout: '35 min run alternating 2 min hard surge / 2 min float',
    timerPreset: { mode: 'intervals', durationSec: 120, intervalSec: 120, rounds: 9 },
  },
  {
    id: 'hills',
    name: 'Hill Repeats / Incline Power',
    zone: 'HR Zone 5 reps',
    rpe: 'RPE 9 reps',
    cue: 'Posterior chain & calf power. Drive the knees, punch the arms.',
    workout: '8 × 45s steep hill/treadmill incline sprint @ 6–8% grade, walk down recovery',
    timerPreset: { mode: 'intervals', durationSec: 45, intervalSec: 90, rounds: 8 },
  },
]

// ---------------------------------------------------------------------------
// Olympic Weightlifting 3-day technical split (percentage wave ladders)
// Waves are week-multiplied: W1 0.75x, W2 0.9x, W3 1.0x, W4 0.8x intensity factor
// ---------------------------------------------------------------------------
export const OLY_WEEK_FACTOR = { 1: 0.75, 2: 0.9, 3: 1.0, 4: 0.8 }

export const olySplit = [
  {
    day: 'Monday',
    dayIndex: 0,
    title: 'Day 1 — Hang Clean & Catch Mechanics',
    primer: 'Empty Bar / Light Complex: Power Clean + Squat Clean + Front Squat × 3 rounds',
    complexName: 'Power Clean + Squat Clean + Front Squat',
    waves: [
      { pct: 50, scheme: '2+2+2 × 2 sets' },
      { pct: 65, scheme: '1+1+1 × 2 sets' },
      { pct: 80, scheme: '1+1 × 2 sets' },
      { pct: 90, scheme: '1 × 4 sets' },
    ],
    finisher: 'Optional Heavy Single (> Max if crisp)',
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 150, rounds: 10 },
    cues: 'Elbows fast through the catch; ride the bar down; front squat positions tall.',
  },
  {
    day: 'Wednesday',
    dayIndex: 2,
    title: 'Day 2 — Snatch Positions & Overhead Receiving',
    primer: 'Snatch Balance + Overhead Squat positional primer × 3 rounds',
    complexName: 'Hang Power Snatch + Full Snatch + OHS',
    waves: [
      { pct: 50, scheme: '2+1+1 × 2 sets' },
      { pct: 70, scheme: '1+1+1 × 2 sets' },
      { pct: 82, scheme: '1+1 × 3 sets' },
      { pct: 90, scheme: '1 × 3 sets' },
    ],
    finisher: 'Snatch Balance 3 × 2 @ 70% — overhead confidence',
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 150, rounds: 10 },
    cues: 'Punch through the ceiling in the OHS; pause 1s in the hang; bar close to hip.',
  },
  {
    day: 'Friday',
    dayIndex: 4,
    title: 'Day 3 — Clean & Split Jerk Timing + Pull Balance',
    primer: 'Tall Clean + Jerk Footwork & Lockout Drills × 3 rounds',
    complexName: 'Clean Pull (pause @ knee) + Hang Clean + Split Jerk',
    waves: [
      { pct: 55, scheme: '2+1+1 × 2 sets' },
      { pct: 70, scheme: '1+1+1 × 2 sets' },
      { pct: 80, scheme: '1+1 × 3 sets' },
      { pct: 88, scheme: '1 × 4 sets' },
    ],
    finisher: 'Jerks from blocks/rack 5 × 1 @ 85% — drive & dip discipline',
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 180, rounds: 10 },
    cues: 'Balanced pull, patience over the bar; split jerk back-knee bend; fast front foot.',
  },
]

// ---------------------------------------------------------------------------
// Adaptive scaling notes
// ---------------------------------------------------------------------------
export const ADAPTIVE_SCALING = [
  'Seated SkiErg / Row swaps for standing engine work; arm-crank as erg substitute.',
  'Wheelchair push / handcycle equivalents for run days (1km run ≈ 2km handcycle push pace).',
  'Single-arm / seated press variations for jerks; rack or strap-supported hangs.',
  'Box-height adjustable wall balls; sled push/pull widths per chair or standing setup.',
  'Coach note: log your modification in Adaptive Notes (Profile tab) so every session carries it.',
]

// ---------------------------------------------------------------------------
// 4-week session programs per sport mode
// Sessions: { dayIndex, day, kind: 'skill'|'metcon'|'run'|'recovery'|'partner'|'rest',
//             title, parts: [{label, text}], runType (default id), timerPreset, stimulus, scaling }
// ---------------------------------------------------------------------------

const hyroxSchedule = (week) => [
  {
    dayIndex: 0, day: 'Monday', kind: 'metcon', title: 'Engine + Sled / Station Intervals',
    parts: [
      { label: 'Part A — Skill', text: '15 min barbell technique: hang power clean + front squat EMOM 10 @ 60%' },
      { label: 'Part B — Conditioning', text: week < 3 ? '6 × 500m ski + 15 wall balls, rest 90s' : '4 rounds race sim: 500m ski / 50m sled push / 25 wall balls / 500m row' },
      ...(week === 3 ? [{ label: 'Part B finisher', text: 'Max-out attempt: 1RM wall-ball 1-min test' }] : []),
    ],
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 60, rounds: 10 },
    stimulus: 'Hard efforts, strict rest. Race simulation quality over volume.',
    scaling: 'Beginner: 2 fewer rounds. Adaptive: seated ski / lighter ball per notes.',
  },
  {
    dayIndex: 1, day: 'Tuesday', kind: 'run', title: 'Zone 2 Aerobic Base Run',
    runType: 'zone2', defaultRunType: 'zone2', allowedRunTypes: true,
    stimulus: 'Keep HR Zone 2 the whole time — even when feeling great.',
    scaling: 'Beginner: 25–30 min. Adaptive: handcycle equivalent distance.',
  },
  {
    dayIndex: 2, day: 'Wednesday', kind: 'metcon', title: 'Power Endurance + Lunges',
    parts: [
      { label: 'Part A — Skill', text: 'Snatch-grip technique work: hang power snatch 5 × 3 @ 55–65%' },
      { label: 'Part B — Conditioning', text: week === 3 ? 'Compromised: 800m run + 100 walking lunges × 3' : 'EMOM 16: odd 12 lunges, even 10 burpees' },
    ],
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 60, rounds: 16 },
    stimulus: 'Leg fatigue tolerance. Shuffle runs after lunges.',
    scaling: 'Beginner: assisted burpees. RX as written. Adaptive: seated lunge/press swaps.',
  },
  {
    dayIndex: 3, day: 'Thursday', kind: 'run', title: 'Tempo / Threshold Run',
    runType: 'tempo', defaultRunType: 'tempo', allowedRunTypes: true,
    stimulus: 'Threshold work. Splits should be repeatable.',
    scaling: 'Beginner: 2 × 6 min. Adaptive: handcycle tempo intervals.',
  },
  {
    dayIndex: 4, day: 'Friday', kind: 'metcon', title: 'HYROX Race Sim + Compromised 1km Repeats',
    parts: [
      { label: 'Part A — Skill', text: 'Clean & jerk footwork drills, 15 min' },
      { label: 'Part B — Race Sim', text: week === 3 ? 'Full station sim: 8 × (500m run + station) @ race pace' : '4 × (1km compromised run + 20 burpees) @ race pace' },
    ],
    timerPreset: { mode: 'amrap', durationSec: 2400, intervalSec: 0, rounds: 1 },
    stimulus: 'Race-pace discipline. Log station splits.',
    scaling: 'Beginner: 4 stations. Adaptive: scaled station loads per notes.',
  },
  {
    dayIndex: 5, day: 'Saturday', kind: 'run', title: 'Run Variation Builder Session',
    runType: 'fartlek', defaultRunType: 'fartlek', allowedRunTypes: true,
    stimulus: 'Pick the run type you need most this week.',
    scaling: 'Adaptive: handcycle / push equivalent per notes.',
  },
  { dayIndex: 6, day: 'Sunday', kind: 'rest', title: 'Full Rest / Mobility 20 min' },
]

const crossfitSchedule = (week) => [
  {
    dayIndex: 0, day: 'Monday', kind: 'metcon', title: 'Squat Strength + Metcon',
    parts: [
      { label: 'Part A — Strength', text: week === 3 ? 'Back squat heavy single, then 3 × 3 @ 85%' : 'Back squat 5 × 3 @ 70–80% (week-scaled)' },
      { label: 'Part B — Metcon', text: 'AMRAP 12: 10 thrusters (40/30kg) + 12 box jumps + 200m run' },
    ],
    timerPreset: { mode: 'amrap', durationSec: 720, intervalSec: 0, rounds: 1 },
    stimulus: 'Legs under fatigue. Unbroken thrusters early rounds.',
    scaling: 'Beginner: 30/20kg, step-ups. Adaptive: seated press / box step per notes.',
  },
  {
    dayIndex: 1, day: 'Tuesday', kind: 'run', title: 'Engine Run — choose your type',
    runType: 'zone2', defaultRunType: 'zone2', allowedRunTypes: true,
    stimulus: 'Non-negotiable aerobic work.',
    scaling: 'Adaptive: handcycle equivalent.',
  },
  {
    dayIndex: 2, day: 'Wednesday', kind: 'metcon', title: 'Gymnastics Density',
    parts: [
      { label: 'Part A — Skill', text: 'Bar muscle-up / pull-up technique 20 min' },
      { label: 'Part B — Metcon', text: week === 3 ? 'For time: 50 pull-ups + 50 burpees + 50 wall balls' : '5 rounds: 10 pull-ups + 10 burpees + 200m run' },
    ],
    timerPreset: { mode: 'forTime', durationSec: 0, intervalSec: 0, rounds: 1 },
    stimulus: 'Grip management. Small sets, fast transitions.',
    scaling: 'Beginner: jumping pull-ups. Adaptive: ring rows / seated pulls.',
  },
  {
    dayIndex: 3, day: 'Thursday', kind: 'run', title: 'Threshold / Intervals Run',
    runType: 'tempo', defaultRunType: 'tempo', allowedRunTypes: true,
    stimulus: 'Threshold or VO2 selection welcome.',
    scaling: 'Adaptive: handcycle intervals.',
  },
  {
    dayIndex: 4, day: 'Friday', kind: 'metcon', title: 'Heavy Day + Partner WOD Prep',
    parts: [
      { label: 'Part A — Strength', text: week === 3 ? 'Clean & jerk max-out ladder to heavy single' : 'Clean & jerk waves 5 × (2+1) @ 75–85%' },
      { label: 'Part B — Engine', text: 'EMOM 10: 15/12 cal row' },
    ],
    timerPreset: { mode: 'emom', durationSec: 0, intervalSec: 60, rounds: 10 },
    stimulus: 'Heavy but crisp. Drop technique quality = stop.',
    scaling: 'Beginner: power variations. Adaptive: seated jerk variations per notes.',
  },
  {
    dayIndex: 5, day: 'Saturday', kind: 'partner', title: 'Saturday Partner / Team WOD',
    parts: [
      { label: 'Partner WOD', text: 'In pairs, I-go-you-go: 8 rounds each — 10 burpees + 15 wall balls + 200m run' },
    ],
    timerPreset: { mode: 'amrap', durationSec: 1800, intervalSec: 0, rounds: 1 },
    stimulus: 'Community day. Push the pace with your partner.',
    scaling: 'Sync loads to the weaker partner, scale per notes.',
  },
  { dayIndex: 6, day: 'Sunday', kind: 'rest', title: 'Full Rest / Zone 1 walk 30 min' },
]

const olyOnlySchedule = (week, competitor) => {
  const base = [
    { dayIndex: 0, day: 'Monday', kind: 'skill', title: olySplit[0].title, olyRef: 0, parts: [{ label: 'Primer', text: olySplit[0].primer }, { label: 'Wave Ladder', text: olySplit[0].waves.map(w => `${w.pct}% (${w.scheme})`).join(' → ') + ` → ${olySplit[0].finisher}` }], timerPreset: olySplit[0].timerPreset, stimulus: 'Technique quality gate: crisp or lighter.', scaling: 'Beginner: stay ≤80%. RX full ladder. Adaptive: seated/jerk-rack variations per notes.' },
    { dayIndex: 2, day: 'Wednesday', kind: 'skill', title: olySplit[1].title, olyRef: 1, parts: [{ label: 'Primer', text: olySplit[1].primer }, { label: 'Wave Ladder', text: olySplit[1].waves.map(w => `${w.pct}% (${w.scheme})`).join(' → ') + ` → ${olySplit[1].finisher}` }], timerPreset: olySplit[1].timerPreset, stimulus: 'Overhead positions before load.', scaling: 'Beginner: hang power only. Adaptive: per notes.' },
    { dayIndex: 4, day: 'Friday', kind: 'skill', title: olySplit[2].title, olyRef: 2, parts: [{ label: 'Primer', text: olySplit[2].primer }, { label: 'Wave Ladder', text: olySplit[2].waves.map(w => `${w.pct}% (${w.scheme})`).join(' → ') + ` → ${olySplit[2].finisher}` }], timerPreset: olySplit[2].timerPreset, stimulus: 'Jerk timing under fatigue-free legs.', scaling: 'Beginner: ≤85%. Adaptive: per notes.' },
  ]
  if (competitor) {
    base.push(
      { dayIndex: 1, day: 'Tuesday', kind: 'recovery', title: 'Zone 2 Recovery + Mobility', runType: 'zone2', defaultRunType: 'zone2', allowedRunTypes: true, stimulus: 'Blood flow, not fitness. Easy. / 20 min mobility flow.', scaling: 'Adaptive: handcycle easy spin.' },
      { dayIndex: 3, day: 'Thursday', kind: 'recovery', title: 'Positional Drill Session + Core', runType: 'fartlek', defaultRunType: 'fartlek', allowedRunTypes: true, stimulus: 'Bar-in-hand drills @ 50%; light positions only.', scaling: 'Adaptive: per notes.' },
    )
  }
  base.push({ dayIndex: 6, day: 'Sunday', kind: 'rest', title: 'Full Rest / Foam Roll' })
  return base
}

const hybridSchedule = (week) => [
  ...hyroxSchedule(week).slice(0, 5),
  {
    dayIndex: 5, day: 'Saturday', kind: 'partner', title: 'Partner WOD + Saturday Positional Drills',
    parts: [
      { label: 'Partner WOD', text: 'Alternating: 10 rounds — 10 wall balls + 10 cal row + 10 burpees' },
      { label: 'Bonus (Competitor)', text: 'Snatch positional drills 30 min @ 50–60%' },
    ],
    timerPreset: { mode: 'amrap', durationSec: 1800, intervalSec: 0, rounds: 1 },
    stimulus: 'Team energy, then barbell quality.',
    scaling: 'Scale loads to partner parity; adaptive per notes.',
  },
  { dayIndex: 6, day: 'Sunday', kind: 'rest', title: 'Full Rest / Mobility 20 min' },
]

export const buildSchedule = (sportMode, week, volumeTrack) => {
  const competitor = volumeTrack === 'Competitor (2-3h / 2-a-day)'
  switch (sportMode) {
    case 'Olympic Weightlifting':
      return olyOnlySchedule(week, competitor)
    case 'CrossFit':
      return crossfitSchedule(week)
    case 'Hybrid':
      return hybridSchedule(week)
    case 'HYROX':
    default:
      return hyroxSchedule(week)
  }
}
