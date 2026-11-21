// Meals, constants, and prep checklist
export const GITHUB_REPO = 'quekhaliq/FORGE'

export const SPORTS = ['HYROX', 'CrossFit', 'Olympic Weightlifting', 'Hybrid']
export const LEVELS = ['Beginner', 'Intermediate', 'Pro']
export const DIVISIONS = ['Open', 'Pro', 'Doubles', 'Adaptive']

export const NUTRITION_GOALS = [
  { value: 1.6, label: 'Endurance / Carb Focus (1.6g/kg)' },
  { value: 1.8, label: 'Performance (1.8g/kg)' },
  { value: 2.1, label: 'Lean Cut (2.1g/kg)' },
]

export const FEEDBACK_CATEGORIES = ['Bug', 'Feature', 'Adaptive Request', 'Malaysian Meal Suggestion']

export const LIFT_GROUPS = [
  {
    group: 'Olympic Lifts',
    lifts: ['Full Snatch', 'Power Snatch', 'Hang Snatch', 'Clean & Jerk', 'Power Clean', 'Hang Clean', 'Split Jerk', 'Overhead Squat'],
  },
  {
    group: 'Squat Variations',
    lifts: ['Back Squat', 'Front Squat', 'Box Squat', 'Pause Back Squat'],
  },
  {
    group: 'Pull & Hinge Variations',
    lifts: ['Conventional Deadlift', 'Sumo Deadlift', 'Romanian Deadlift (RDL)', 'Trap Bar Deadlift'],
  },
  {
    group: 'Pressing Variations',
    lifts: ['Strict Press', 'Push Press', 'Push Jerk', 'Bench Press', 'Weighted Pull-Up / Dip'],
  },
]

export const LIFT_VARIATIONS = LIFT_GROUPS.flatMap((g) => g.lifts)

export const ADAPTIVE_NOTES =
  'Adaptive mode: swap seated SkiErg/Row for standing ergs, use handcycle/wheelchair push equivalents for runs, seated or single-arm press variations for overhead work, and log your specific modifications in Profile → Adaptive Notes.'

export const malaysianMeals = [
  { id: 1, name: 'Ayam Bakar (200g Breast) + Brown Rice & Ulam', protein: 48, kcal: 520, tags: ['Halal'] },
  { id: 2, name: 'Tandoori Chicken (Quarter) + 1 Chapati & Dhal', protein: 42, kcal: 490, tags: ['Halal', 'Mamak'] },
  { id: 3, name: 'Steamed Chicken Rice (Extra Breast, Less Oil)', protein: 44, kcal: 550, tags: ['Halal'] },
  { id: 4, name: 'Ikan Bakar (Kembung/Siakap) + Sambal & Rice', protein: 38, kcal: 480, tags: ['Halal'] },
  { id: 5, name: '4 Half-Boiled Eggs (Telur Separuh Masak) + 2 Roti Bakar', protein: 28, kcal: 360, tags: ['Halal', 'Vegetarian', 'Mamak'] },
  { id: 6, name: 'Nasi Lemak Fit Swap (Grilled Chicken + Boiled Egg + Less Sambal)', protein: 40, kcal: 560, tags: ['Halal'] },
  { id: 7, name: 'Sambal Tempeh & Tauhu Stir-Fry + Quinoa/Rice', protein: 30, kcal: 450, tags: ['Halal', 'Vegetarian'] },
  { id: 8, name: 'Sup Ayam / Sup Daging (Clear Broth + Extra Lean Meat)', protein: 36, kcal: 390, tags: ['Halal'] },
]

export const mealPrepChecklist = [
  { id: 'p1', text: 'Marinate & grill 1kg ayam bakar (portion into 3 containers)', tag: 'Prep' },
  { id: 'p2', text: 'Ikan bakar / grilled fish × 2 portions', tag: 'Prep' },
  { id: 'p3', text: 'Boil 8 eggs (telur separuh masak, 4 min)', tag: 'Prep' },
  { id: 'p4', text: 'Batch-cook 3 cups brown rice (cool & box)', tag: 'Prep' },
  { id: 'p5', text: 'Chapati × 4 (wholemeal, for tandoori nights)', tag: 'Prep' },
  { id: 'p6', text: 'Stir-fry sambal tempeh & tauhu (2 portions)', tag: 'Prep' },
  { id: 'p7', text: 'Chop ulam / salad veg for 3 days', tag: 'Prep' },
  { id: 'p8', text: 'Prep sup broth (ayam/daging) & freeze 1 portion', tag: 'Prep' },
  { id: 'p9', text: 'Shopping: chicken breast 1kg, kembung/siakap, tempeh, tauhu, eggs × 12', tag: 'Grocery' },
  { id: 'p10', text: 'Shopping: brown rice, chapati, ulam veg, sambal ingredients', tag: 'Grocery' },
]
