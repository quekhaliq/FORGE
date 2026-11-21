import { MapPin, CalendarDays, Flag } from 'lucide-react'

// Hero TARGET EVENT card in reference style: photo background, yellow flag
// chip, big event name, date/location row, race countdown with big yellow
// number, hazard-stripe footer.
export default function TargetEventCard({ raceName, raceDate, daysLeft }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-soft relative">
      {/* photo backdrop */}
      <div
        className="relative min-h-[190px] p-5 flex flex-col justify-between"
        style={{
          background:
            'linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.75)), radial-gradient(circle at 70% 30%, #2e2a1f 0%, #131316 60%), #131316',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-zinc-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
              <Flag className="w-3 h-3" /> Target Event
            </span>
            <h2 className="display-font text-3xl text-white mt-3 truncate">{raceName || 'Target Event'}</h2>
            <p className="text-xs font-bold text-zinc-300 mt-1.5 flex items-center gap-3 tnum">
              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-yellow-400" /> {raceDate ? new Date(raceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBC'}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-yellow-400" /> Malaysia</span>
            </p>
          </div>
          {/* countdown panel */}
          <div className="shrink-0 text-center bg-black/70 border border-soft rounded-xl px-4 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Race Countdown</p>
            <p className="display-font text-5xl text-yellow-400 leading-none mt-1 tnum">{daysLeft ?? '--'}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Days to go</p>
          </div>
        </div>
      </div>
      {/* hazard stripe footer */}
      <div className="h-2.5 w-full" style={{ background: 'repeating-linear-gradient(45deg, #facc15 0 12px, #0a0a0a 12px 24px)' }} />
    </div>
  )
}
