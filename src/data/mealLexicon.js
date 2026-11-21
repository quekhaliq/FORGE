// ============================================================================
// Malaysian food keyword lexicon + natural-language meal estimator.
// Parses plain-text descriptions ("nasi campur less rice, ayam kunyit,
// 2 telur separuh masak, teh o kosong") into protein/kcal/carbs/fat.
// Estimates are approximations — per-serving values vary by vendor.
// ============================================================================

// base dishes: per regular serving
const LEXICON = [
  // rice & noodle mains
  { keys: ['nasi lemak'], name: 'Nasi Lemak', protein: 14, kcal: 640, carbs: 80, fat: 26 },
  { keys: ['nasi campur', 'nasi campak'], name: 'Nasi Campur', protein: 25, kcal: 700, carbs: 85, fat: 28 },
  { keys: ['nasi goreng'], name: 'Nasi Goreng', protein: 16, kcal: 640, carbs: 82, fat: 26 },
  { keys: ['nasi kerabu'], name: 'Nasi Kerabu', protein: 18, kcal: 550, carbs: 75, fat: 18 },
  { keys: ['nasi goreng kampung'], name: 'Nasi Goreng Kampung', protein: 16, kcal: 620, carbs: 80, fat: 25 },
  { keys: ['mee goreng'], name: 'Mee Goreng', protein: 15, kcal: 660, carbs: 84, fat: 27 },
  { keys: ['mee hoon goreng'], name: 'Mee Hoon Goreng', protein: 13, kcal: 560, carbs: 76, fat: 20 },
  { keys: ['char kuey teow', 'kuey teow goreng'], name: 'Char Kuey Teow', protein: 16, kcal: 740, carbs: 88, fat: 32 },
  { keys: ['kuey teow soup', 'mee soup'], name: 'Noodle Soup', protein: 20, kcal: 450, carbs: 62, fat: 12 },
  { keys: ['laksa'], name: 'Laksa', protein: 18, kcal: 590, carbs: 70, fat: 24 },
  { keys: ['mee rebus'], name: 'Mee Rebus', protein: 15, kcal: 550, carbs: 75, fat: 18 },
  { keys: ['bihun goreng'], name: 'Bihun Goreng', protein: 12, kcal: 520, carbs: 72, fat: 18 },
  // proteins / lauk
  { keys: ['ayam goreng'], name: 'Ayam Goreng', protein: 28, kcal: 380, carbs: 10, fat: 26 },
  { keys: ['ayam kunyit'], name: 'Ayam Kunyit', protein: 30, kcal: 340, carbs: 12, fat: 18 },
  { keys: ['ayam masak merah'], name: 'Ayam Masak Merah', protein: 28, kcal: 380, carbs: 14, fat: 22 },
  { keys: ['rendang'], name: 'Rendang', protein: 28, kcal: 420, carbs: 10, fat: 32 },
  { keys: ['ayam bakar', 'grilled chicken'], name: 'Ayam Bakar', protein: 38, kcal: 320, carbs: 6, fat: 14 },
  { keys: ['ayam penyet'], name: 'Ayam Penyet', protein: 30, kcal: 400, carbs: 12, fat: 26 },
  { keys: ['ikan bakar', 'grilled fish'], name: 'Ikan Bakar', protein: 36, kcal: 280, carbs: 4, fat: 12 },
  { keys: ['ikan goreng'], name: 'Ikan Goreng', protein: 32, kcal: 340, carbs: 6, fat: 20 },
  { keys: ['ikan kembung'], name: 'Ikan Kembung', protein: 30, kcal: 220, carbs: 0, fat: 10 },
  { keys: ['sotong', 'squid'], name: 'Sotong', protein: 22, kcal: 180, carbs: 4, fat: 6 },
  { keys: ['udang', 'prawn'], name: 'Udang', protein: 24, kcal: 160, carbs: 2, fat: 4 },
  { keys: ['telur separuh masak', 'half boiled egg', 'soft boiled egg'], name: 'Telur Separuh Masak', protein: 6, kcal: 70, carbs: 1, fat: 5 },
  { keys: ['telur dadar', 'omelette'], name: 'Telur Dadar', protein: 12, kcal: 200, carbs: 2, fat: 15 },
  { keys: ['telur mata', 'fried egg'], name: 'Telur Mata', protein: 7, kcal: 110, carbs: 1, fat: 9 },
  { keys: ['telur', 'egg'], name: 'Telur', protein: 6, kcal: 78, carbs: 1, fat: 5 },
  { keys: ['daging', 'beef'], name: 'Daging', protein: 30, kcal: 350, carbs: 6, fat: 22 },
  { keys: ['paru', 'lung'], name: 'Paru', protein: 22, kcal: 280, carbs: 4, fat: 18 },
  { keys: ['hati', 'liver'], name: 'Hati', protein: 24, kcal: 200, carbs: 6, fat: 8 },
  { keys: ['sate', 'satay'], name: 'Satay (5 sticks)', protein: 24, kcal: 380, carbs: 12, fat: 24 },
  { keys: ['tempeh'], name: 'Tempeh', protein: 18, kcal: 190, carbs: 12, fat: 9 },
  { keys: ['tauhu', 'tofu'], name: 'Tauhu', protein: 12, kcal: 130, carbs: 6, fat: 7 },
  // sides & staples
  { keys: ['nasi putih', 'rice'], name: 'Nasi Putih', protein: 4, kcal: 200, carbs: 45, fat: 0.5 },
  { keys: ['nasi'], name: 'Nasi', protein: 4, kcal: 200, carbs: 45, fat: 0.5 },
  { keys: ['roti canai'], name: 'Roti Canai', protein: 9, kcal: 300, carbs: 38, fat: 14 },
  { keys: ['roti bakar'], name: 'Roti Bakar', protein: 7, kcal: 230, carbs: 34, fat: 8 },
  { keys: ['chapati'], name: 'Chapati', protein: 8, kcal: 220, carbs: 36, fat: 6 },
  { keys: ['tosai', 'dosa'], name: 'Tosai', protein: 7, kcal: 210, carbs: 34, fat: 6 },
  { keys: ['idli'], name: 'Idli', protein: 4, kcal: 120, carbs: 26, fat: 0.5 },
  { keys: ['kuih'], name: 'Kuih (2 pcs)', protein: 3, kcal: 180, carbs: 28, fat: 6 },
  // drinks
  { keys: ['teh tarik'], name: 'Teh Tarik', protein: 3, kcal: 180, carbs: 28, fat: 6 },
  { keys: ['teh o kosong'], name: 'Teh O Kosong', protein: 0, kcal: 5, carbs: 1, fat: 0 },
  { keys: ['kopi o kosong'], name: 'Kopi O Kosong', protein: 0, kcal: 5, carbs: 1, fat: 0 },
  { keys: ['kopi tarik'], name: 'Kopi Tarik', protein: 3, kcal: 190, carbs: 28, fat: 6 },
  { keys: ['milo ais', 'milo'], name: 'Milo Ais', protein: 5, kcal: 240, carbs: 40, fat: 6 },
  { keys: ['air suam', 'plain water', 'air kosong'], name: 'Air', protein: 0, kcal: 0, carbs: 0, fat: 0 },
]

// detail modifiers: multiplier patches on matched dishes
const MODIFIERS = [
  { keys: ['lebih ayam', 'extra chicken', 'double chicken', 'ayam more'], apply: { protein: +12, kcal: +80, fat: +5 } },
  { keys: ['lebih daging', 'extra beef'], apply: { protein: +12, kcal: +80, fat: +5 } },
  { keys: ['kurang nasi', 'less rice'], apply: { kcal: -100, carbs: -22 } },
  { keys: ['tanpa nasi', 'no rice'], apply: { kcal: -180, carbs: -40 } },
  { keys: ['kuah banjir', 'extra gravy', 'banjir'], apply: { kcal: +120, fat: +10, carbs: +8 } },
  { keys: ['air-fried', 'air fried', 'airfry'], apply: { kcal: -60, fat: -7 } },
  { keys: ['kurang manis', 'less sugar'], apply: { kcal: -20, carbs: -5 } },
  { keys: ['kosong'], apply: { kcal: -40, carbs: -6, fat: -3 } },
  { keys: ['extra egg', 'tambah telur'], apply: { protein: +6, kcal: +78, fat: +5 } },
  { keys: ['tanpa sambal', 'no sambal'], apply: { kcal: -40, carbs: -6, fat: -3 } },
]

// portion multipliers
export const PORTIONS = [
  { id: 0.5, label: '0.5× Small' },
  { id: 1, label: '1× Regular' },
  { id: 1.5, label: '1.5× Large' },
  { id: 2, label: '2× Double' },
]

/**
 * Estimates macros from a plain-text Malaysian meal description.
 * Returns { items: [{name, protein, kcal, carbs, fat}], totals, matched }
 */
export function estimateMeal(text) {
  const lower = text.toLowerCase()

  // apply portion multipliers written inline (e.g. "2 telur", "3 roti")
  // via simple digit+keyword capture
  const items = []
  const used = new Set()

  for (const entry of LEXICON) {
    for (const key of entry.keys) {
      if (!lower.includes(key) || used.has(key)) continue
      used.add(key)

      // inline quantity: "2 telur", "3 roti canai"
      const qtyMatch = lower.match(new RegExp(`(\\d+)\\s*(?:pc|pcs|biji|keping)?\\s*${key}`))
      let mult = qtyMatch ? parseInt(qtyMatch[1]) : 1

      let est = { name: entry.name, protein: entry.protein, kcal: entry.kcal, carbs: entry.carbs, fat: entry.fat }

      // apply modifiers that touch this item's context (global for simplicity)
      for (const mod of MODIFIERS) {
        if (lower.includes(mod.keys[0]) && !mod._applied) {
          // apply once per modifier across the meal
          mod._applied = true
          est = {
            name: est.name,
            protein: est.protein + (mod.apply.protein || 0),
            kcal: est.kcal + (mod.apply.kcal || 0),
            carbs: est.carbs + (mod.apply.carbs || 0),
            fat: est.fat + (mod.apply.fat || 0),
          }
        }
      }

      items.push({
        name: mult > 1 ? `${mult}× ${est.name}` : est.name,
        protein: Math.max(0, Math.round(est.protein * mult)),
        kcal: Math.max(0, Math.round(est.kcal * mult)),
        carbs: Math.max(0, Math.round(est.carbs * mult)),
        fat: Math.max(0, Math.round(est.fat * mult)),
      })
    }
  }

  // reset modifier flags for next call
  MODIFIERS.forEach((m) => delete m._applied)

  const totals = items.reduce(
    (acc, it) => ({
      protein: acc.protein + it.protein,
      kcal: acc.kcal + it.kcal,
      carbs: acc.carbs + it.carbs,
      fat: acc.fat + it.fat,
    }),
    { protein: 0, kcal: 0, carbs: 0, fat: 0 }
  )

  return { items, totals, matched: items.length > 0 }
}

/**
 * Live pre-meal coach check: compares meal against remaining daily budget.
 * Non-judgmental Malaysian swap tips. daysTarget: { proteinG, calories }.
 */
export function coachCheck(mealTotals, remaining, daysTarget) {
  const tips = []
  if (remaining.protein - mealTotals.protein < 0) {
    tips.push(`Protein covered for the day — you're at/over target. Balance the rest of the day with lighter protein (telur separuh masak, tauhu).`)
  } else if (remaining.protein - mealTotals.protein < 15) {
    tips.push(`Low protein remaining after this meal. Add 2 telur separuh masak or a whey shake to close the gap.`)
  }
  if (mealTotals.kcal > remaining.calories * 0.5 && remaining.calories > 0) {
    tips.push(`This meal uses over half your remaining calories. Swap teh tarik → teh O kosong, or kurang nasi to balance.`)
  }
  if (mealTotals.carbs > 90) {
    tips.push(`Carb-heavy meal. Pair with protein first (ayam/ikan before nasi) to soften the glucose response.`)
  }
  if (mealTotals.fat > 30) {
    tips.push(`Higher-fat meal (kuah banjir / goreng?). Air-fried or soup versions hit the same protein for less.`)
  }
  if (tips.length === 0) {
    tips.push(`Fits well within today's targets — solid choice for your ${daysTarget} goal. 👍`)
  }
  return tips
}
