import { useRef, useState } from 'react'
import Modal from './Modal.jsx'
import { Download } from 'lucide-react'

export default function ShareStoryModal({
  open,
  onClose,
  profile,
  daysLeft,
  completed,
  total,
  proteinConsumed,
  targetProtein,
  prs, notify,
}) {
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef(null)
  const [dateStamp] = useState(() => new Date().toLocaleDateString('en-MY'))

  if (!open) return null

  const snatchPR = prs['Full Snatch']

  const download = () => {
    setDownloading(true)
    import('html2canvas').then(({ default: html2canvas }) => {
      return html2canvas(cardRef.current, { scale: 3, backgroundColor: '#09090b' }).then((canvas) => {
        const link = document.createElement('a')
        link.download = `hybrid-prep-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        notify('Story PNG downloaded')
      })
    }).catch(()=>notify('PNG export failed. Please try again.')).finally(()=>setDownloading(false))
  }

  return (
    <Modal title="9:16 Story Card" onClose={onClose}><div className="space-y-4">

        <div
          ref={cardRef}
          className="story-print rounded-2xl p-5 flex flex-col justify-between text-ink border border-soft"
          style={{ aspectRatio: '9/16', background: '#141517',color:'#fff','--muted':'#b8b8b8','--ink':'#fafafa' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase">MY</span>
              <span className="display-font text-base" style={{ color: 'var(--uv)' }}>FORGE<span style={{ color: 'var(--ink)' }}>.</span></span>
            </div>
            <p className="font-black text-3xl text-orange-400 mt-5 uppercase">{profile.name}</p>
            <p className="text-[11px] font-bold text-mid tracking-widest uppercase">
              {profile.sportMode} • {profile.division} • {profile.skillLevel}
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-sunken border border-orange-500/40 rounded-xl p-3.5">
              <span className="text-[10px] text-mid uppercase tracking-widest block">Race Countdown</span>
              <span className="font-black text-2xl text-orange-400 tnum">
                {daysLeft === null ? 'NO DATE SET' : `${daysLeft} DAYS TO GO`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-sunken border border-soft rounded-xl p-3">
                <span className="text-[10px] text-mid uppercase block">Sessions</span>
                <span className="font-black text-lg tnum">{completed}/{total}</span>
              </div>
              <div className="bg-sunken border border-soft rounded-xl p-3">
                <span className="text-[10px] text-mid uppercase block">Snatch PR</span>
                <span className="font-black text-lg text-orange-400 tnum">{snatchPR ? `${snatchPR}KG` : '--'}</span>
              </div>
              <div className="bg-sunken border border-soft rounded-xl p-3 col-span-2">
                <span className="text-[10px] text-mid uppercase block">Daily Protein</span>
                <span className="font-black text-lg tnum">
                  {proteinConsumed}<span className="text-mid text-sm">/{targetProtein}g</span>
                </span>
                <div className="w-full bg-sunken h-2 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, Math.round((proteinConsumed / targetProtein) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <span className="text-[10px] text-mid font-bold">FORGE.</span>
            <span className="bg-orange-500 text-white font-black text-[10px] px-2 py-1 rounded">{dateStamp}</span>
          </div>
        </div>

        <button
          onClick={download}
          disabled={downloading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> {downloading ? 'Rendering…' : 'Download PNG'}
        </button>
      </div>
    </Modal>
  )
}
