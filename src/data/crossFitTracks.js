// ============================================================================
// Box-Style CrossFit Programming — TheBoxProgramming format
// Each day: date line, big format title (FOR TIME / AMRAP X 14 MIN / …),
// movement list, loading line (M / W), optional TC (time cap) & coach notes.
// loading: [maleKg, femaleKg]; M- / W- renders like the box cards.
// ============================================================================

export const crossFitWeek = [
  {
    id: 'cf-mon', art: 'barbell',
    day: 'MON',
    date: '01.12',
    format: 'SESSION',
    sub: 'A — Back Squat  |  B — Metcon',
    blocks: [
      { tag: 'A / BACK SQUAT', lines: ['5 SETS', '5 Reps @ 80–82.5%', 'Rest 3-min between sets'] },
      {
        tag: 'B / FOR TIME',
        lines: ['21-18-15-12-9-6-3', 'THRUSTERS', 'BAR FACING BURPEES'],
        loading: [42.5, 30],
      },
    ],
    coach: 'Squats crisp and deep, then a leg burner. Burpees over the bar — no jumping over sideways.',
  },
  {
    id: 'cf-tue', art: 'kettlebell',
    day: 'TUE',
    date: '02.12',
    format: 'FOR MAX REPS',
    sub: 'EMOM X 12 MIN',
    blocks: [
      {
        tag: 'EMOM X 12 MIN',
        lines: [
          'MIN 1 / 6 BAR FACING BURPEES',
          'MIN 2 / MAX SNATCHES',
          'REPEAT 2 /',
          'MIN 5 / 6 SHUTTLE RUNS (10m)',
          'MIN 6 / MAX SNATCHES',
        ],
        loading: [61, 43],
      },
    ],
    coach: 'Snatches scored. Pick a weight you can cycle for 8+ reps every round. Shuttle = 2 × 5m.',
  },
  {
    id: 'cf-wed', art: 'barbell',
    day: 'WED',
    date: '03.12',
    format: 'AMRAP X 14 MIN',
    blocks: [
      {
        lines: ['7 BURPEES OVER BAR', '7 POWER CLEANS', '14 CAL ROW'],
        loading: [61, 43],
      },
    ],
    coach: 'Aim for 6+ rounds. Touch-and-go cleans; row at a pace you can hold the whole 14 min.',
  },
  {
    id: 'cf-thu', art: 'box',
    day: 'THU',
    date: '04.12',
    format: 'FOR TIME',
    blocks: [
      {
        lines: [
          '21-18-15-12-9-6-3',
          'DB SNATCHES',
          '30 TOES-TO-BAR (total)',
          '30 BURPEE BOX JUMP OVER',
          '30 TOES-TO-BAR',
          '30 SNATCHES',
        ],
        loading: [22.5, 15],
      },
      { tag: 'TC', lines: ['12 MIN'] },
    ],
    coach: 'One DB, switch arms as needed. Break the T2B early — 5s of chalk beats a failed set.',
  },
  {
    id: 'cf-fri', art: 'rig',
    day: 'FRI',
    date: '05.12',
    format: 'FOR TIME',
    sub: '50 C2B PULL-UPS + ENGINE CHIPS',
    blocks: [
      {
        lines: [
          '50 C2B PULL-UPS',
          '100 DOUBLE UNDER',
          '400-METER RUN',
          '100 DOUBLE UNDER',
          '30 DB SNATCHES',
          '100 DOUBLE UNDER',
          '20 DUAL DB SQUATS',
          '100 DOUBLE UNDER',
          '10 WALLWALKS',
        ],
        loading: [22.5, 15],
      },
    ],
    coach: 'Grip management day. C2B in sets of 5-8 from the start; wall walks are the payout.',
  },
  {
    id: 'cf-sat', art: 'bike',
    day: 'SAT',
    date: '06.12',
    format: 'IN TEAMS OF 2',
    sub: '30 MIN FOR MAX CAL',
    blocks: [
      {
        lines: [
          '30 MIN FOR MAX CAL ASSAULT BIKE',
          '*EVERY 3 MIN PERFORM:',
          '5 SYNC GROUND-TO-OH',
          '7 SYNC BURPEES OVER BAR',
          '9 SYNC TOES-TO-BAR',
        ],
        loading: [61, 43],
      },
    ],
    coach: 'Partner day — one works, one rests, sync movements together. Bring a friend.',
  },
  {
    id: 'cf-sun', art: 'kettlebell',
    day: 'SUN',
    date: '07.12',
    format: 'REST',
    sub: 'Mobility / Zone 1 Walk 20–30 min',
    blocks: [{ tag: 'RECOVERY', lines: ['Optional: easy walk, hips + shoulders mobility flow'] }],
    coach: 'Recovery is training. Sleep, eat, stretch.',
  },
]

// Week 2 — density & gymnastics focus
export const crossFitWeek2 = [
  {
    id: 'cf2-mon', art: 'rower',
    day: 'MON',
    date: '08.12',
    format: 'DEATH BY',
    sub: 'Every 60-sec until failure',
    blocks: [
      {
        lines: [
          'AT MIN 1 / 7 SHUTTLE RUN + 2 LINE FACING BURPEES',
          'AT 2:00 MIN / 7 SHUTTLE RUN + 4 LINE FACING BURPEES',
          'AT 3:00 MIN / 7 SHUTTLE RUN + 6 LINE FACING BURPEES',
          '*IF ROUND 3 IS COMPLETED / CONTINUE WITH:',
        ],
      },
      {
        tag: 'EVERY 90-SEC UNTIL FAILURE',
        lines: [
          'AT 3:30 MIN / 7 SHUTTLE RUN + 8 LINE FACING BURPEES',
          'AT 4:30 MIN / 10 LINE FACING BURPEES',
          '*CONTINUE TO 7 SHUTTLE + 2 BURPEES UNTIL FAILURE',
        ],
      },
    ],
    coach: 'Three tiers — survive as long as possible. Record your failed round as your score.',
  },
  {
    id: 'cf2-tue', art: 'rower',
    day: 'TUE',
    date: '09.12',
    format: 'EVERY 3 MIN X 8 SETS',
    blocks: [
      {
        lines: ['3 WALLWALKS', '12 DB SNATCHES', '15 BOX JUMP OVER', 'MAX CAL ASSAULT/ECHO BIKE'],
        loading: [22.5, 15],
      },
    ],
    coach: '8 scored rounds (max bike cals). Quality wallwalks — full lockout at the wall.',
  },
  {
    id: 'cf2-wed', art: 'barbell',
    day: 'WED',
    date: '10.12',
    format: 'A / SQUAT',
    sub: 'Strength + short pump',
    blocks: [
      { tag: 'A / BACK SQUAT', lines: ['5 SETS', '5 Reps @ 80–82.5%', 'Rest 3-min'] },
      {
        tag: 'B / FOR TIME',
        lines: ['100 WALLBALLS', '80 TOES-TO-BAR', '60 CAL ROW', '40 BURPEES OVER ROWER'],
        loading: [9, 6],
      },
    ],
    coach: 'Partition B as you like. Big sets on the wallballs while the legs are fresh.',
  },
  {
    id: 'cf2-thu', art: 'rig',
    day: 'THU',
    date: '11.12',
    format: 'FOR TIME',
    sub: '2 MIN ON / 1 MIN OFF until completion',
    blocks: [
      { lines: ['30 MUSCLE UPS', '60 BURPEE BOX JUMP OVER 24/20"', '*PARTITION AS YOU LIKE'] },
      { tag: 'TC', lines: ['6 SETS'] },
    ],
    coach: 'Work 2 min, rest 1 min, repeat. Scale MU to burpee pull-ups ×2.',
  },
  {
    id: 'cf2-fri', art: 'rower',
    day: 'FRI',
    date: '12.12',
    format: 'EVERY 12 MIN X 3 SETS',
    blocks: [
      {
        lines: [
          '1,000-METER ROW + MOVEMENT X',
          'SET 1 / 1,000-METER RUN',
          'SET 2 / 300 DOUBLE UNDER',
          'SET 3 / 60/48 CAL ASSAULT BIKE',
        ],
      },
      { tag: 'TC', lines: ['9-MIN PER SET'] },
    ],
    coach: 'Three engineered tests. Row starts each set; pace to finish inside the cap.',
  },
  {
    id: 'cf2-sat', art: 'bike',
    day: 'SAT',
    date: '13.12',
    format: 'IN TEAMS OF 2',
    blocks: [
      {
        lines: [
          '100 WALLBALLS',
          '100 CAL ROW',
          '100 BURPEES OVER ROWER',
          '100 CAL ROW',
          '100 WALLBALLS',
        ],
        tag: 'WORKING 1-MIN EACH',
      },
    ],
    coach: 'Switch every minute on the minute — pure teamwork sufferfest.',
  },
  {
    id: 'cf2-sun', art: 'rower',
    day: 'SUN',
    date: '14.12',
    format: 'REST',
    sub: 'Zone 1 / Mobility',
    blocks: [{ tag: 'RECOVERY', lines: ['Easy 20–30 min walk or swim, full-body mobility'] }],
    coach: 'Big week coming. Recharge.',
  },
]

// Week 3 — peak intensity
export const crossFitWeek3 = [
  {
    id: 'cf3-mon', art: 'barbell',
    day: 'MON',
    date: '15.12',
    format: 'FOR TIME',
    blocks: [
      { lines: ['1,000-METER ROW', '100 WALLBALLS', '10 POWER CLEANS'], loading: [102, 70] },
    ],
    coach: '*NOT heavier than 80%. One heavy barbell moment — make every clean count.',
  },
  {
    id: 'cf3-tue', art: 'barbell',
    day: 'TUE',
    date: '16.12',
    format: 'FOR MAX CAL',
    blocks: [
      {
        lines: [
          '10 MIN MAX CAL ASSAULT BIKE',
          '*EVERY MIN (START AT 0):',
          '10-9-8-7-6-5-4-3-2-1 SNATCHES',
        ],
        loading: [35, 25],
      },
    ],
    coach: 'Snatches eat into your bike minutes — small fast sets. Total cals = score.',
  },
  {
    id: 'cf3-wed', art: 'barbell',
    day: 'WED',
    date: '17.12',
    format: 'AMRAP X 18 MIN',
    blocks: [
      {
        lines: [
          '18 C2B PULL-UPS',
          'REST 30S',
          '12 BURPEE BOX JUMP OVER 24/20"',
          'REST 30S',
          '6 SNATCHES',
          'REST 30S',
        ],
        loading: [61, 43],
      },
    ],
    coach: 'Built-in rests — use them. Quality over rushing; this is repeatable intensity.',
  },
  {
    id: 'cf3-thu', art: 'rig',
    day: 'THU',
    date: '18.12',
    format: 'FOR TIME',
    blocks: [
      {
        lines: ['21/18 CAL ECHO BIKE', '3 LANES DB LUNGES', '3 LANES HS WALK', '15/12 CAL ECHO BIKE'],
        loading: [22.5, 15],
      },
      {
        lines: [
          '2 LANES DB FRONT RACK LUNGES',
          '2 LANES HS WALK',
          '9/6 CAL ECHO BIKE',
          '1 LANE DB OVERHEAD LUNGES',
          '1 LANE HS WALK',
        ],
      },
    ],
    coach: 'HS walk is the crux. Short unbroken lunge sets keep shoulders alive.',
  },
  {
    id: 'cf3-fri', art: 'box',
    day: 'FRI',
    date: '19.12',
    format: 'FOR TIME',
    blocks: [{ lines: ['10 ROUNDS', '10 TOES-TO-BAR', '8 BURPEE BOX JUMP OVER', '6 SHUTTLE RUNS'] }],
    coach: 'Steady rounds — target sub-20. T2B 5+5, box jumps facing.',
  },
  {
    id: 'cf3-sat', art: 'bike',
    day: 'SAT',
    date: '20.12',
    format: 'IN TEAMS OF 2',
    blocks: [
      {
        lines: [
          '100 WALLBALLS',
          '100 CAL ROW',
          '100 BURPEES OVER ROWER',
          '100 CAL ROW',
          '100 WALLBALLS',
        ],
        tag: 'WORKING 1-MIN ATHLETE A / B / C',
      },
    ],
    coach: 'Teams of 2 or 3. Chips: 10 wallballs / 10 cal / 10 burpees each turn.',
  },
  {
    id: 'cf3-sun', art: 'kettlebell',
    day: 'SUN',
    date: '21.12',
    format: 'REST',
    sub: 'Full rest before test week',
    blocks: [{ tag: 'RECOVERY', lines: ['Sleep 8h+. Light stretch only.'] }],
    coach: 'Peak week next — recover like it is your job.',
  },
]

// Week 4 — deload / taper with a test
export const crossFitWeek4 = [
  {
    id: 'cf4-mon', art: 'barbell',
    day: 'MON',
    date: '22.12',
    format: 'A / BACK SQUAT',
    sub: 'Deload percentages',
    blocks: [{ tag: 'A / BACK SQUAT', lines: ['3 SETS', '5 Reps @ 65-70%', 'Rest 2-min'] }],
    coach: 'Move well, leave 3 reps in the tank.',
  },
  {
    id: 'cf4-tue', art: 'kettlebell',
    day: 'TUE',
    date: '23.12',
    format: 'AMRAP X 12 MIN',
    blocks: [
      { lines: ['10 WALLBALLS', '10 CAL ROW', '10 BURPEES'], loading: [9, 6] },
    ],
    coach: 'Light and snappy — technique at speed, HR under control.',
  },
  {
    id: 'cf4-wed', art: 'rig',
    day: 'WED',
    date: '24.12',
    format: 'FOR MAX REPS',
    sub: 'EMOM X 12 MIN',
    blocks: [
      { lines: ['MIN 1 / 10 SHUTTLE RUNS (5m)', 'MIN 2 / MAX C2B PULL-UPS', 'REPEAT × 6'] },
    ],
    coach: 'Volume taper −40%. Gymnastics quality focus.',
  },
  {
    id: 'cf4-thu', art: 'rower',
    day: 'THU',
    date: '25.12',
    format: 'REST',
    sub: 'Holiday / Recovery',
    blocks: [{ tag: 'RECOVERY', lines: ['Family walk counts.'] }],
    coach: 'Merry Christmas — recover.',
  },
  {
    id: 'cf4-fri', art: 'box',
    day: 'FRI',
    date: '26.12',
    format: 'TEST — FOR TIME',
    sub: 'Benchmark retest',
    blocks: [
      {
        lines: ['30 DB SNATCHES', '30 TOES-TO-BAR', '30 BURPEE BOX JUMP OVER', '30 TOES-TO-BAR', '30 SNATCHES'],
        loading: [22.5, 15],
      },
      { tag: 'TC', lines: ['12 MIN'] },
    ],
    coach: 'Retest Week-1 Thursday. Same weights — beat your score, log it.',
  },
  {
    id: 'cf4-sat', art: 'bike',
    day: 'SAT',
    date: '27.12',
    format: 'IN TEAMS OF 2',
    blocks: [{ lines: ['30 MIN FOR MAX CAL BIKE', '*EVERY 3 MIN: 5 SYNC GTOH / 7 SYNC BURPEES / 9 SYNC T2B'], loading: [61, 43] }],
    coach: 'Community day. Fun one.',
  },
  {
    id: 'cf4-sun', art: 'barbell',
    day: 'SUN',
    date: '28.12',
    format: 'REST',
    sub: 'Cycle complete',
    blocks: [{ tag: 'RECOVERY', lines: ['Review your 4-week logs — PRs, scores, notes.'] }],
    coach: 'New cycle starts Monday. Bring the notebook.',
  },
]

export const crossFitWeeks = [crossFitWeek, crossFitWeek2, crossFitWeek3, crossFitWeek4]
