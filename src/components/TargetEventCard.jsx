import { MapPin, CalendarDays, Flag, Timer } from 'lucide-react'
export default function TargetEventCard({
  raceName,
  raceDate,
  daysLeft,
  division = 'Open',
}) {
  return (
    <section className="event-hero">
      <div className="event-photo" />
      <div className="race-copy">
        <span className="event-tag">
          <Flag size={12} fill="currentColor" />
          Target event
        </span>
        <h2>{raceName || 'HYROX Kuala Lumpur'}</h2>
        <div className="race-meta">
          <span>
            <CalendarDays />
            {raceDate
              ? new Date(raceDate + 'T00:00:00').toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Date TBC'}
          </span>
          <i />
          <span>
            <MapPin />
            Malaysia
          </span>
        </div>
        <span className="division-tag">{division} division</span>
      </div>
      <div className="countdown">
        <p>
          <Timer size={13} />
          Race countdown
        </p>
        <strong>{String(daysLeft ?? 0).padStart(2, '0')}</strong>
        <small>Days to go</small>
      </div>
    </section>
  )
}
