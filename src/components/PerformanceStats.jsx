import { Activity, Beef, Trophy, ArrowUpRight } from 'lucide-react'
export default function PerformanceStats({
  done,
  total,
  protein,
  target,
  pr,
  onLifts,
  onFuel,
}) {
  return (
    <div className="stats">
      {[
        [
          Activity,
          'Weekly sessions',
          done,
          `/ ${total}`,
          'Sessions completed',
          done / total,
          null,
        ],
        [
          Beef,
          'Daily protein',
          protein,
          `/ ${target} g`,
          'Daily intake',
          protein / target,
          onFuel,
        ],
        [
          Trophy,
          'Snatch PR',
          pr || '—',
          'kg',
          'All-time personal best',
          null,
          onLifts,
        ],
      ].map(([Icon, label, num, unit, help, ratio, action]) => (
        <div className="stat" key={label}>
          <div className="stat-label">
            <Icon size={16} />
            {label}
          </div>
          <div className="stat-number">
            {num} <span>{unit}</span>
          </div>
          <div className="stat-caption">
            {help}
            {ratio !== null && <span>{Math.round(ratio * 100)}%</span>}
          </div>
          {ratio !== null ? (
            <div className="track">
              <i style={{ width: `${Math.min(100, ratio * 100)}%` }} />
            </div>
          ) : (
            <div className="pr-rule" />
          )}
          {action && (
            <button
              className="stat-link"
              onClick={action}
              aria-label={'Open ' + label}
            >
              <ArrowUpRight size={15} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
