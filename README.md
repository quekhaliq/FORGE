# HYBRID PREP HUB MY

A zero-backend, single-athlete training companion for Malaysian hybrid athletes — built with **Vite + React + Tailwind CSS + Lucide React + html2canvas**, styled in a **Funky Street-Athletic Dark & Electric Green** design system (carbon `#09090b`, Electric Emerald `#22c55e`, Volt Lime `#a3e635`, neo-brutalist hard-offset shadows, grid dot-matrix texture), and deployable free on **GitHub Pages**.

## Features

1. **4-Week Progressive Programming** (`src/data/programmingTracks.js`) — interactive week switcher with phase badges:
   - **W1** Foundation & Positional Control (50–75% waves)
   - **W2** Complex Density & Speed Under Bar (up to 80–85%)
   - **W3** Peak Technical Precision & Heavy Singles (90%+, max-outs)
   - **W4** Deload & Crisp Technique Taper (−40% volume, 75–80%)
   - Sport modes: HYROX / CrossFit / Olympic Weightlifting / Hybrid; volume tracks: Athlete (60–90m) vs Competitor (2-a-day, extra engine & technique sessions).
2. **Olympic Weightlifting Technical Split** — 3-day complex-based lifting split (Hang Clean & Catch Mechanics / Snatch Positions & Overhead Receiving / Clean & Split Jerk Timing) with barbell primers, multi-part technique complexes, and percentage wave ladders. **"Send to Oly Tracker"** pre-fills the tracker with the session's complex + waves, **kg auto-calculated from the athlete's stored PR × week intensity factor**.
3. **6 Performance Run Types** — every run day has a selector: Zone 2 Recovery, Tempo / Lactate Threshold, Track / VO2 Max, Compromised Running (HYROX), Fartlek, and Hill Repeats — each with HR zone, RPE, prescribed workout, pacing cue, and a matching timer preset. Run metrics logger: distance, avg pace, notes.
4. **Box WOD & Rest Interval Timer** (`WodTimerModal.jsx`) — AMRAP / For Time, EMOM (custom interval × rounds, ideal between wave sets), Tabata / Intervals with color-coded phases (amber prep / green work / crimson rest). 10-second prep countdown with Web Audio API synthesized **3-2-1-GO** beeps (mute toggle), massive `tabular-nums` display, one-click "Save Result to Log".
5. **Oly Wave Tracker** (`OlyTrackerTab.jsx`) — lift focus selector, **built-in percentage wave calculator** (enter a reference PR → 50/60/70/80/90% kg ladder rounded to 2.5kg plates), complex builder, per-entry **% of PR** badges and **PR!** flags, coach cue log.
6. **Adaptive Athlete Support** — selecting the Adaptive division reveals a persistent Movement Modification & Scaling Notes panel (seated erg swaps, handcycle equivalents, single-arm/seated press variations) plus custom notes.
7. **Malaysian Fuel & Protein Tracker** — daily target from bodyweight (1.6–2.1 g/kg), Halal/Vegetarian/Mamak filters over local dishes (Ayam Bakar, Ikan Bakar, Tandoori + Chapati, Telur Separuh Masak, Nasi Lemak Fit Swap, Tempeh/Tauhu, Sup Ayam), itemized log with undo, 3-day batch meal-prep checklist.
8. **9:16 Story Card Generator** — electric-green themed card with countdown, division, PR, and protein progress; PNG export via html2canvas.
9. **Feedback Column & Backup** — category-tagged GitHub Issues submission; versioned JSON export/import with schema validation.

All data persists in `localStorage` under the versioned key `hybrid_prep_hub_my_v1`; daily nutrition logs auto-reset on date change while preserving the prep checklist and profile.

## Quick Start

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

> **Note (macOS / rolldown):** if `npm run build` fails with "Cannot find native binding", install the platform binding explicitly: `npm i -D @rolldown/binding-darwin-arm64` (or your platform's equivalent). This works around a known npm optional-dependencies bug.

## Deploy to GitHub Pages

1. **Create a repo** on GitHub (e.g. `hybrid-prep-hub-my`) and push:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hybrid-prep-hub-my.git
   git push -u origin main
   ```

2. **Build & publish:**

   ```bash
   npm run build
   npx gh-pages -d dist
   ```

3. Or via repo **Settings → Pages → Build and deployment** using a GitHub Actions Vite workflow, deploying from `gh-pages` / `dist`.

4. Live at `https://YOUR_USERNAME.github.io/hybrid-prep-hub-my/` — relative asset paths (`base: './'` in `vite.config.js`) make it work from any sub-path.

## Configuration

- **GitHub Issues feedback**: `GITHUB_REPO` in `src/data/malaysianMeals.js`.
- **Programming / run types / Oly split**: `src/data/programmingTracks.js`.
- **Default profile / schema**: `src/hooks/useAppState.js`.

## Project Structure

```
src/
├── App.jsx                      # tab shell + timer/share modal wiring
├── components/
│   ├── Navbar.jsx               # sticky header, countdown badge, bottom nav, quick actions
│   ├── Footer.jsx               # brand footer ("Built by quekhaliq")
│   ├── TrainTab.jsx             # 4-week cycle, session cards, run selectors, send-to-tracker
│   ├── WodTimerModal.jsx        # AMRAP/EMOM/Intervals timer + Web Audio beeps
│   ├── OlyTrackerTab.jsx        # wave calculator, complex builder, PR tracking
│   ├── MalaysianFuelTab.jsx     # meals, protein log, prep checklist
│   ├── ProfileFeedbackTab.jsx   # profile, backup, feedback
│   └── ShareStoryModal.jsx      # 9:16 PNG story card
├── hooks/
│   └── useAppState.js           # v1 localStorage schema + backup utilities
└── data/
    ├── programmingTracks.js     # weeks, run types, oly split, sport schedules
    └── malaysianMeals.js        # meals, prep checklist, constants, GITHUB_REPO
```
