// ============================================================================
// Olympic Weightlifting Block Progression — technique-only, 4 weeks × 3 days
// Non-consecutive training days (Mon / Wed / Fri). No running or metcons.
// Percentages are based on current 1RM for each lift; RPE targets provided
// for athletes without a known 1RM (stop with 2–3 crisp reps in the tank).
// ============================================================================

export const OLY_BLOCK_RULES = {
  schedule: 'Train on non-consecutive days — Mon / Wed / Fri (or Tue / Thu / Sat).',
  effort:
    'Percentages are based on your current 1RM for that lift. If you do not know your 1RM, use the RPE targets — stop every set with 2–3 crisp reps in the tank.',
  cues: [
    {
      lift: 'Snatch',
      text: 'Set hips slightly higher than a squat, engage lats to keep the bar close, and punch aggressively into the overhead catch.',
    },
    {
      lift: 'Clean & Jerk',
      text: 'Keep your chest tall off the floor, whip elbows fast into the front rack, and dip straight down on the jerk before driving vertically.',
    },
  ],
}

const D = (movement, sets, reps, load, note) => ({ movement, sets, reps, load, note })

export const olyBlock = [
  // ---------------------------------------------------------------- Week 1
  {
    week: 1,
    phase: 'Ramp-Up & Movement Precision',
    goal: 'Establish clean bar paths, dial in positions, and build baseline work capacity without excess fatigue.',
    days: [
      {
        day: 'Day 1',
        dayName: 'Monday',
        focus: 'Snatch & Back Squat',
        art: 'barbell',
        work: [
          D('Hang Snatch (above knee) + Snatch', '4 sets', '(1+1) reps', '@ 70–73% (RPE 7)'),
          D('Snatch Pull', '3 sets', '4 reps', '@ 85% Snatch 1RM'),
          D('Back Squat', '4 sets', '5 reps', '@ 72–75% (RPE 7)'),
          D('Chest-Supported Row + Hanging Knee Raises', '3 sets', '10 reps each', '—'),
        ],
      },
      {
        day: 'Day 2',
        dayName: 'Wednesday',
        focus: 'Clean & Jerk + Overhead',
        art: 'barbell',
        work: [
          D('Clean & Jerk (1 Clean + 1 Jerk)', '4 sets', '(1+1) reps', '@ 70–73% (RPE 7)'),
          D('Push Press', '3 sets', '5 reps', '@ RPE 7'),
          D('Romanian Deadlift (RDL)', '3 sets', '6 reps', '@ RPE 7'),
          D('Face Pulls', '3 sets', '15 reps', '—'),
        ],
      },
      {
        day: 'Day 3',
        dayName: 'Friday',
        focus: 'Complexes & Front Squat',
        art: 'rig',
        work: [
          D('Power Snatch + Overhead Squat', '4 sets', '(1+2) reps', '@ 68–70% (RPE 7)'),
          D('Power Clean + Jerk', '4 sets', '(1+1) reps', '@ 70–72% (RPE 7)'),
          D('Front Squat', '4 sets', '4 reps', '@ 75% (RPE 7)'),
          D('Back Extensions', '3 sets', '12 reps', '—'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Week 2
  {
    week: 2,
    phase: 'Progressive Overload',
    sub: 'Volume & Positional Strength',
    goal: 'Add moderate load (+2–4%) while maintaining identical technical speed.',
    days: [
      {
        day: 'Day 1',
        dayName: 'Monday',
        focus: 'Snatch & Back Squat',
        art: 'barbell',
        work: [
          D('Hang Snatch (above knee) + Snatch', '5 sets', '(1+1) reps', '@ 74–77% (RPE 7.5)'),
          D('Snatch Pull', '4 sets', '3 reps', '@ 90% Snatch 1RM'),
          D('Back Squat', '4 sets', '5 reps', '@ 76–78% (RPE 7.5)'),
          D('Chest-Supported Row + Hanging Leg Raises', '3 sets', '10–12 reps each', '—'),
        ],
      },
      {
        day: 'Day 2',
        dayName: 'Wednesday',
        focus: 'Clean & Jerk + Overhead',
        art: 'barbell',
        work: [
          D('Clean & Jerk (1 Clean + 1 Jerk)', '5 sets', '(1+1) reps', '@ 74–77% (RPE 7.5)'),
          D('Push Press', '4 sets', '4 reps', '@ RPE 7.5–8'),
          D('Romanian Deadlift (RDL)', '3 sets', '6 reps', '@ RPE 7.5'),
          D('Face Pulls', '3 sets', '15 reps', '—'),
        ],
      },
      {
        day: 'Day 3',
        dayName: 'Friday',
        focus: 'Complexes & Front Squat',
        art: 'rig',
        work: [
          D('Power Snatch + Overhead Squat', '4 sets', '(1+2) reps', '@ 72–75% (RPE 7.5)'),
          D('Power Clean + Jerk', '4 sets', '(1+1) reps', '@ 74–76% (RPE 7.5)'),
          D('Front Squat', '4 sets', '3 reps', '@ 78–80% (RPE 7.5)'),
          D('Weighted Back Extensions', '3 sets', '10 reps', '—'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Week 3
  {
    week: 3,
    phase: 'Peak Intensity',
    sub: 'Heavy Singles & Strength',
    goal: 'Transition to heavy singles on the competition lifts and peak squat intensity.',
    days: [
      {
        day: 'Day 1',
        dayName: 'Monday',
        focus: 'Snatch & Back Squat',
        art: 'barbell',
        work: [
          D('Snatch', '5 sets', '1 rep', '@ 80–85% (RPE 8–8.5)'),
          D('Snatch Pull', '4 sets', '3 reps', '@ 95% Snatch 1RM'),
          D('Back Squat', '4 sets', '3 reps', '@ 82–85% (RPE 8)'),
          D('Dumbbell Row + Planks', '3 sets', '10 reps / 45 sec', '—'),
        ],
      },
      {
        day: 'Day 2',
        dayName: 'Wednesday',
        focus: 'Clean & Jerk + Overhead',
        art: 'barbell',
        work: [
          D('Clean & Jerk', '5 sets', '(1+1) reps', '@ 80–85% (RPE 8–8.5)'),
          D('Push Press', '4 sets', '3 reps', '@ RPE 8.5'),
          D('Romanian Deadlift (RDL)', '3 sets', '5 reps', '@ RPE 8'),
          D('Rear Delt Flyes', '3 sets', '15 reps', '—'),
        ],
      },
      {
        day: 'Day 3',
        dayName: 'Friday',
        focus: 'Heavy Total & Front Squat',
        art: 'barbell',
        work: [
          D('Snatch (Heavy Single)', 'Work up to', '3 sets × 1 rep', '@ 82–86% (RPE 8.5)'),
          D('Clean & Jerk (Heavy Single)', 'Work up to', '3 sets × (1+1) reps', '@ 82–86% (RPE 8.5)'),
          D('Front Squat', '3 sets', '3 reps', '@ 83–86% (RPE 8.5)'),
          D('Back Extensions', '3 sets', '10 reps', '—'),
        ],
      },
    ],
  },
  // ---------------------------------------------------------------- Week 4
  {
    week: 4,
    phase: 'Deload & Speed',
    sub: 'Supercompensation',
    goal: 'Shed accumulated fatigue (~40% volume reduction) so strength gains express cleanly.',
    days: [
      {
        day: 'Day 1',
        dayName: 'Monday',
        focus: 'Snatch & Back Squat',
        art: 'barbell',
        work: [
          D('Snatch', '3 sets', '2 reps', '@ 70% (RPE 6)'),
          D('Back Squat', '3 sets', '3 reps', '@ 70% (RPE 6)'),
          D('Face Pulls + Dead Bugs', '2 sets', '12 reps each', '—'),
        ],
      },
      {
        day: 'Day 2',
        dayName: 'Wednesday',
        focus: 'Clean & Jerk + Overhead',
        art: 'barbell',
        work: [
          D('Clean & Jerk', '3 sets', '(1+1) reps', '@ 70% (RPE 6)'),
          D('Push Press', '3 sets', '4 reps', '@ RPE 6'),
          D('Romanian Deadlift (RDL)', '2 sets', '6 reps', '@ light weight (RPE 6)'),
        ],
      },
      {
        day: 'Day 3',
        dayName: 'Friday',
        focus: 'Light Technique & Front Squat',
        art: 'barbell',
        work: [
          D('Power Snatch', '3 sets', '2 reps', '@ 65% (RPE 6)'),
          D('Power Clean + Jerk', '3 sets', '(1+1) reps', '@ 65% (RPE 6)'),
          D('Front Squat', '3 sets', '3 reps', '@ 70% (RPE 6)'),
        ],
      },
    ],
  },
]

// kg per rep, computed from the athlete's stored PR for a matching lift.
// pct like "70–73%" → uses the low end. Falls back to null when no PR exists.
export function kgFor(movement, prs) {
  const key = Object.keys(prs).find(
    (k) => movement.toLowerCase().includes(k.toLowerCase().split(' ')[0]) && prs[k] > 0
  )
  if (!key) return null
  return prs[key]
}
