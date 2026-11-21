import { Share2, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
export default function PageHeader({
  index,
  eyebrow = 'Athlete workspace',
  title,
  subtitle,
  onShare,
}) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="page-heading">
      <div>
        <p className="kicker">
          <i />
          {eyebrow} <em>/</em> {String(index).padStart(2, '0')}
        </p>
        <h1>
          {title.replace(/\.$/, '')}
          <b>.</b>
        </h1>
        <p className="deck">{subtitle}</p>
      </div>
      <div className="head-tools">
        <span className="clock">
          <CalendarDays size={13} />
          {now.toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}{' '}
          <span>·</span>{' '}
          {now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          })}
        </span>
        {onShare && (
          <button className="subtle-btn" onClick={onShare}>
            <Share2 size={14} />
            Share progress
          </button>
        )}
      </div>
    </div>
  )
}
