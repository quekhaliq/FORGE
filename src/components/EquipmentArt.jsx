// Line-art gym equipment illustrations — stroke uses currentColor so they
// adapt to light/dark automatically. Wrap in a container with a bg tint.

const S = {
  fill: 'none',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function BarbellArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* bar */}
        <line x1="30" y1="60" x2="170" y2="60" strokeWidth="5" />
        {/* plates */}
        <rect x="55" y="30" width="14" height="60" rx="3" fill="currentColor" fillOpacity="0.15" />
        <rect x="73" y="22" width="16" height="76" rx="3" fill="currentColor" fillOpacity="0.15" />
        <rect x="131" y="30" width="14" height="60" rx="3" fill="currentColor" fillOpacity="0.15" />
        <rect x="111" y="22" width="16" height="76" rx="3" fill="currentColor" fillOpacity="0.15" />
        {/* collars */}
        <line x1="52" y1="42" x2="52" y2="78" />
        <line x1="92" y1="42" x2="92" y2="78" />
        <line x1="148" y1="42" x2="148" y2="78" />
        <line x1="108" y1="42" x2="108" y2="78" />
        {/* knurl marks */}
        <line x1="42" y1="54" x2="42" y2="66" />
        <line x1="158" y1="54" x2="158" y2="66" />
      </g>
    </svg>
  )
}

export function PlyoBoxArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* 3D box */}
        <path d="M60 45 L120 35 L155 55 L155 95 L95 105 L60 88 Z" fill="currentColor" fillOpacity="0.12" />
        <path d="M60 45 L95 55 L155 55" />
        <path d="M95 55 L95 105" />
        <path d="M60 45 L60 88" />
        {/* jump arrows */}
        <path d="M40 100 C45 75 55 60 78 40" strokeDasharray="4 5" />
        <path d="M78 40 L70 42 M78 40 L76 48" />
      </g>
    </svg>
  )
}

export function RowerArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* rail */}
        <line x1="25" y1="88" x2="175" y2="88" strokeWidth="5" />
        {/* seat */}
        <rect x="70" y="78" width="24" height="10" rx="3" fill="currentColor" fillOpacity="0.2" />
        {/* monitor arm */}
        <line x1="150" y1="88" x2="150" y2="55" />
        <rect x="135" y="35" width="34" height="22" rx="3" fill="currentColor" fillOpacity="0.15" />
        {/* handle + chain */}
        <path d="M60 60 C75 45 95 50 95 78" strokeDasharray="3 4" />
        <line x1="45" y1="66" x2="62" y2="58" strokeWidth="5" />
        {/* flywheel */}
        <circle cx="170" cy="80" r="10" fill="currentColor" fillOpacity="0.15" />
      </g>
    </svg>
  )
}

export function BikeArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* wheels */}
        <circle cx="50" cy="80" r="22" fill="currentColor" fillOpacity="0.12" />
        <circle cx="150" cy="80" r="22" fill="currentColor" fillOpacity="0.12" />
        {/* frame */}
        <path d="M50 80 L85 45 L120 80 M85 45 L130 45 L150 80" />
        {/* handlebar */}
        <path d="M130 45 L138 30 L150 30" />
        {/* saddle */}
        <line x1="75" y1="40" x2="95" y2="40" strokeWidth="6" />
        <line x1="85" y1="40" x2="85" y2="48" />
        {/* fan cage */}
        <circle cx="150" cy="80" r="9" />
        <line x1="150" y1="71" x2="150" y2="89" />
        <line x1="141" y1="80" x2="159" y2="80" />
      </g>
    </svg>
  )
}

export function RigArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* uprights */}
        <line x1="45" y1="15" x2="45" y2="105" strokeWidth="5" />
        <line x1="155" y1="15" x2="155" y2="105" strokeWidth="5" />
        {/* crossbar */}
        <line x1="45" y1="25" x2="155" y2="25" strokeWidth="5" />
        {/* pull-up bar */}
        <line x1="45" y1="50" x2="155" y2="50" />
        {/* rings */}
        <path d="M85 50 L85 72 M115 50 L115 72" strokeDasharray="3 4" />
        <circle cx="85" cy="80" r="9" fill="currentColor" fillOpacity="0.15" />
        <circle cx="115" cy="80" r="9" fill="currentColor" fillOpacity="0.15" />
        {/* hole marks */}
        <line x1="41" y1="35" x2="49" y2="35" />
        <line x1="41" y1="45" x2="49" y2="45" />
        <line x1="151" y1="35" x2="159" y2="35" />
        <line x1="151" y1="45" x2="159" y2="45" />
      </g>
    </svg>
  )
}

export function KettlebellArt({ className = '' }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <g stroke="currentColor" {...S}>
        {/* handle */}
        <path d="M85 35 C85 20 115 20 115 35" strokeWidth="6" />
        {/* body */}
        <circle cx="100" cy="70" r="28" fill="currentColor" fillOpacity="0.15" />
        <circle cx="100" cy="70" r="20" />
        {/* base */}
        <line x1="80" y1="98" x2="120" y2="98" strokeWidth="4" />
      </g>
    </svg>
  )
}

const ART_MAP = {
  barbell: BarbellArt,
  box: PlyoBoxArt,
  rower: RowerArt,
  bike: BikeArt,
  rig: RigArt,
  kettlebell: KettlebellArt,
}

export default function EquipmentArt({ kind = 'barbell', className = 'w-40 h-24' }) {
  const Art = ART_MAP[kind] || BarbellArt
  return <Art className={className} />
}
