// Editorial page header in the reference style:
// — ATHLETE WORKSPACE / 01  →  giant italic display title  →  subtitle
export default function PageHeader({ index, eyebrow = 'ATHLETE WORKSPACE', title, subtitle, onShare }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-yellow-400 flex items-center gap-2">
        <span className="inline-block w-8 h-[3px] bg-yellow-400" />
        {eyebrow} / {index}
      </p>
      <div className="flex items-end justify-between gap-3">
        <h1 className="display-font text-4xl sm:text-5xl leading-[0.95] text-ink">{title}</h1>
        {onShare && (
          <button onClick={onShare} className="btn-ghost text-xs shrink-0 flex items-center gap-1.5">
            <Share /> Share Progress
          </button>
        )}
      </div>
      {subtitle && <p className="text-sm text-mid">{subtitle}</p>}
    </div>
  )
}

function Share() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
