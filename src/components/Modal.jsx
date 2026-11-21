import { X } from 'lucide-react'

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div
        className="bg-sunken border border-soft rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 space-y-2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-base">{title}</h3>
          <button onClick={onClose} className="w-[44px] h-[44px] flex items-center justify-center text-mid hover:text-ink -mr-2" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
