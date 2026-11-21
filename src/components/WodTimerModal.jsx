import { useState, useEffect, useRef } from 'react'
import Modal from './Modal.jsx'
import { Volume2, VolumeX, Play, Pause, RotateCcw, Save } from 'lucide-react'

const PREP_SECONDS = 10

function beep(ctx, frequency = 880, duration = 0.15) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

const MODES = [
  { id: 'amrap', name: 'AMRAP / For Time', desc: 'Countdown timer — crisp round counting for the clock.' },
  { id: 'emom', name: 'EMOM', desc: 'Every N seconds × rounds — strict rest between Oly wave sets.' },
  { id: 'intervals', name: 'Tabata / Intervals', desc: 'Work / Rest cycles × rounds.' },
]

export default function WodTimerModal({ open, onClose, preset, onSaveResult }) {
  const [mode, setMode] = useState(preset?.mode==='forTime'?'amrap':preset?.mode||'amrap')
  const [minutes, setMinutes] = useState(['amrap','forTime'].includes(preset?.mode) ? (preset?.durationSec || 1200) / 60 : 20)
  const [intervalSec, setIntervalSec] = useState(preset?.intervalSec || 60)
  const [rounds, setRounds] = useState(preset?.rounds || 8)
  const [workSec, setWorkSec] = useState(preset?.durationSec||45)
  const [restSec, setRestSec] = useState(preset?.intervalSec||30)
  const [muted, setMuted] = useState(false)
  const [result, setResult] = useState('')

  // timer = { phase, secondsLeft, round, elapsed }
  const [timer, setTimer] = useState({ phase: 'idle', secondsLeft: 0, round: 1, elapsed: 0 })

  // keep refs current during render so the Start click always has config ready
  const timerRef = useRef(timer)
  const cfgRef = useRef({ mode, minutes, intervalSec, rounds, workSec, restSec, muted })
  useEffect(() => {
    timerRef.current = timer
    cfgRef.current = { mode, minutes, intervalSec, rounds, workSec, restSec, muted }
  })

  const audioCtxRef = useRef(null)
  useEffect(()=>()=>{audioCtxRef.current?.close().catch(()=>{})},[])
  const getCtx = () => {
    if(!(window.AudioContext||window.webkitAudioContext))return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  const start = () => {
    const ctx = getCtx()
    if (ctx?.state === 'suspended') ctx.resume().catch(()=>{})
    setTimer({ phase: 'prep', secondsLeft: PREP_SECONDS, round: 1, elapsed: 0 })
    setResult('')
  }

  const stop = () => setTimer({ phase: 'idle', secondsLeft: 0, round: 1, elapsed: 0 })

  // single 1s ticker drives the whole phase machine (transitions happen in the callback)
  useEffect(() => {
    if (timer.phase === 'idle' || timer.phase === 'done') return
    const id = setInterval(() => {
      const cfg = cfgRef.current
      const t = timerRef.current
      const ctx = getCtx()
      const next = { ...t, elapsed: t.elapsed + 1 }

      if (t.phase === 'prep') {
        if (t.secondsLeft - 1 > 0) {
          if (!cfg.muted && t.secondsLeft - 1 <= 3) beep(ctx, 700, 0.12) // 3-2-1
          setTimer({ ...next, secondsLeft: t.secondsLeft - 1 })
          return
        }
        if (!cfg.muted) beep(ctx, 1100, 0.4) // GO
        if (cfg.mode === 'intervals') {
          setTimer({ ...next, phase: 'work', secondsLeft: cfg.workSec, round: 1 })
        } else if (cfg.mode === 'emom') {
          setTimer({ ...next, phase: 'work', secondsLeft: cfg.intervalSec, round: 1 })
        } else {
          setTimer({ ...next, phase: 'work', secondsLeft: cfg.minutes * 60, round: 1 })
        }
        return
      }

      if (t.phase === 'work') {
        if(t.secondsLeft>1){setTimer({...next,secondsLeft:t.secondsLeft-1});return}
        if (cfg.mode === 'intervals') {
          if (t.round >= cfg.rounds) {
            if (!cfg.muted) beep(ctx, 660, 0.5)
            setTimer({ ...next, phase: 'done', secondsLeft: 0 })
            return
          }
          if (!cfg.muted) beep(ctx, 500, 0.3)
          setTimer({ ...next, phase: 'rest', secondsLeft: cfg.restSec })
          return
        }
        if (cfg.mode === 'emom') {
          if (t.round >= cfg.rounds) {
            if (!cfg.muted) beep(ctx, 660, 0.5)
            setTimer({ ...next, phase: 'done', secondsLeft: 0 })
            return
          }
          if (!cfg.muted) beep(ctx, 700, 0.15)
          setTimer({ ...next, secondsLeft: cfg.intervalSec, round: t.round + 1 })
          return
        }
        // AMRAP countdown complete
        if (!cfg.muted) beep(ctx, 660, 0.5)
        setTimer({ ...next, phase: 'done', secondsLeft: 0 })
        return
      }

      if (t.phase === 'rest') {
        if (t.secondsLeft - 1 > 0) {
          setTimer({ ...next, secondsLeft: t.secondsLeft - 1 })
          return
        }
        if (!cfg.muted) beep(ctx, 900, 0.2)
        setTimer({ ...next, phase: 'work', secondsLeft: cfg.workSec, round: t.round + 1 })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [timer.phase])

  if (!open) return null

  const { phase, secondsLeft, round, elapsed } = timer
  const phaseColor = phase === 'work' ? 'text-green-400' : phase === 'rest' ? 'text-red-500' : 'text-amber-400'

  const idleDisplay = mode === 'amrap' ? minutes * 60 : mode === 'emom' ? intervalSec : workSec
  const display = phase === 'idle' ? idleDisplay : phase === 'done' ? 0 : Math.max(0, secondsLeft)
  const mm = String(Math.floor(display / 60)).padStart(2, '0')
  const ss = String(display % 60).padStart(2, '0')

  const phaseLabel =
    phase === 'prep' ? 'Get Ready…'
    : phase === 'work' ? (mode === 'intervals' ? 'WORK' : mode === 'emom' ? `Round ${round} / ${rounds}` : 'ON')
    : phase === 'rest' ? 'REST'
    : phase === 'done' ? 'TIME — GREAT WORK'
    : ''

  return (
    <Modal title="Box WOD Timer" onClose={onClose}><div className="space-y-4">

        {phase === 'idle' && (
          <>
            <div className="flex gap-2 flex-wrap">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`text-xs font-black uppercase px-3.5 min-h-[44px] rounded-xl border-2 transition ${
                    mode === m.id
                      ? 'bg-orange-500 text-white border-orange-500 hard-shadow-brand'
                      : 'bg-sunken border-soft text-mid'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-mid">{MODES.find((m) => m.id === mode)?.desc}</p>

            <div className="grid grid-cols-2 gap-2">
              {mode === 'amrap' && <NumberField label="Minutes" value={minutes} onChange={setMinutes} min={1} />}
              {mode === 'emom' && (
                <>
                  <NumberField label="Interval (sec)" value={intervalSec} onChange={setIntervalSec} min={10} step={15} />
                  <NumberField label="Rounds" value={rounds} onChange={setRounds} min={1} />
                </>
              )}
              {mode === 'intervals' && (
                <>
                  <NumberField label="Work (sec)" value={workSec} onChange={setWorkSec} min={5} />
                  <NumberField label="Rest (sec)" value={restSec} onChange={setRestSec} min={5} />
                  <NumberField label="Rounds" value={rounds} onChange={setRounds} min={1} />
                </>
              )}
            </div>
          </>
        )}

        {phase !== 'idle' && (
          <div className="text-center space-y-2 py-2">
            <p className={`text-xs font-black uppercase tracking-widest ${phaseColor}`}>{phaseLabel}</p>
            <p className={`tnum font-black ${phaseColor} ${phase === 'prep' ? 'text-7xl' : 'text-8xl'}`}>
              {phase === 'prep' ? secondsLeft : `${mm}:${ss}`}
            </p>
            {mode === 'amrap' && phase === 'work' && (
              <p className="tnum text-xs text-mid">
                elapsed {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {phase === 'idle' && (
            <button
              onClick={start}
              className="flex-1 bg-orange-500 text-white font-black uppercase text-base min-h-[56px] rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 hard-shadow-brand"
            >
              <Play className="w-5 h-5" /> Start
            </button>
          )}
          {phase !== 'idle' && phase !== 'done' && (
            <button
              onClick={stop}
              className="flex-1 bg-sunken border-2 border-amber-400 text-amber-400 font-black uppercase text-sm min-h-[56px] rounded-xl flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" /> Stop
            </button>
          )}
          {phase === 'done' && (
            <button
              onClick={stop}
              className="flex-1 bg-sunken border-2 border-soft text-soft font-black uppercase text-sm min-h-[56px] rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Again
            </button>
          )}
          <button
            onClick={() => setMuted(!muted)}
            className="bg-sunken border-2 border-soft text-soft p-3 min-h-[56px] min-w-[56px] rounded-xl flex items-center justify-center"
            aria-label={muted ? 'Unmute beeps' : 'Mute beeps'}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {phase === 'done' && (
          <div className="space-y-2">
            <input
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder={`Result e.g. ${mode === 'amrap' ? '14 rounds + 6 reps' : mode === 'emom' ? '10/10 rounds made' : '8 reps done'}`}
              className="w-full bg-sunken border-2 border-soft rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => {
                onSaveResult(result || 'Session complete')
                onClose()
              }}
              className="w-full bg-orange-600 text-white font-black uppercase text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
            >
              <Save className="w-4 h-4" /> Save Result to Log
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

function NumberField({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-mid block mb-1">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) => {
          const v = parseInt(e.target.value)
          if (!isNaN(v) && v >= min) onChange(v)
        }}
        className="w-full bg-sunken border-2 border-soft rounded-lg px-3 py-2 text-sm tnum focus:outline-none focus:border-orange-500"
      />
    </label>
  )
}
