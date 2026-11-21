# FORGE.

**Built on Strength | Driven by Purpose** — a device-first hybrid training companion for Malaysian athletes. React 19, Vite, Tailwind CSS 3, Lucide icons, Web Audio and lazy-loaded html2canvas. No application server is required.

## Development and verification

Use Node.js 24 and the committed npm lockfile. `npm ci` installs dependencies; `npm run dev` starts Vite. Run `npm run lint -- --deny-warnings` and `npm run build` before releasing. `npm run preview` serves the generated `dist/` directory. Use a secure origin (HTTPS or localhost) for service workers and optional authentication.

## GitHub Pages

1. In **quekhaliq/FORGE → Settings → Pages**, choose **GitHub Actions** as the source.
2. Review the changes and merge the working branch into `main`. The included `.github/workflows/deploy.yml` installs from the lockfile, checks lint, builds and publishes `dist/`.
3. Open **https://quekhaliq.github.io/FORGE/** after the Pages deployment succeeds. Vite uses `base: './'`; tab navigation uses hashes and does not need a server rewrite.

## Using FORGE

Start with the dashboard, then select **Set up athlete profile** for the three-step setup, or skip it and edit Profile later. The initial race name and date are editable training targets, not an official event listing. Choose a week and day, record results or a custom three-part workout, launch the session timer, and log runs. Olympic mode substitutes a non-consecutive technical lifting block. Lifts records personal bests; Fuel tracks Malaysian meals and your prep checklist. Profile calculates estimated nutrition targets from your inputs. These adult training estimates are educational, not individualized medical or dietetic advice.

## Offline and data

On the first online visit to the **production build**, allow the service worker to finish caching the app, fonts, photo, icons and lazy-loaded modules. The app can then reload offline. Development mode does not install the worker. Google sign-in, cloud transfers and external GitHub links require connectivity. Private browsing, clearing site data or device storage eviction can remove records: export a JSON backup regularly.

`src/hooks/useAppState.js` owns version-2 local data under `hybrid_prep_hub_my_v2`. Daily food entries roll over using local calendar dates; the checklist survives. Session logs are keyed by sport, week and day. Imported files and restored cloud snapshots use the same validation as local loads (`src/hooks/schema.js`). Existing compatible v2 schedules are migrated. Firebase's SDK manages its own authentication session separately.

## Optional Firebase sync

The existing Firebase client wiring lives in `src/hooks/firebase.js`. Verify project ownership before using it; use your own Firebase web app configuration when forking. Enable Google authentication, create Firestore, authorize the deployed domain (for the target above, `quekhaliq.github.io`), and publish the rules in `firestore.rules`. Web client configuration is public; never include service-account credentials. Firestore security rules, not the client configuration, protect athlete data.

Sign in from Profile. A cloud copy can replace local data after confirmation. **Push Up** and **Pull Down** are explicit whole-snapshot transfers, not real-time merges. Export before replacing records. Embedded browsers may block Google OAuth; open the app in Safari or Chrome if required. Test redirect return and cross-account isolation on the actual Pages origin before enabling sync for athletes.

## Source layout

- `src/App.jsx`: navigation, setup, timer and sharing, feedback, notifications.
- `src/components/`: Train dashboard, race hero, session editor, Olympic block, Lifts, Fuel, Profile, cloud sync and device install UI.
- `src/data/crossFitTracks.js`, `olyBlock.js`, `programmingTracks.js`: workouts, prescriptions and run types.
- `src/data/malaysianMeals.js`: meals, checklist, lift catalog and feedback destination.
- `src/hooks/`: state, validation, metric calculations and Firebase access.
- `public/`: locally bundled race artwork, manifest and device icons.
- `vite.config.js`: relative asset paths and versioned offline precache generation.
