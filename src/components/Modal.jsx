import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
export default function Modal({ title, children, onClose }) {
  const ref = useRef(null),
    id = useId()
  useEffect(() => {
    const el = ref.current
    el.showModal()
    return () => el.close()
  }, [])
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className="native-sheet"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 id={id} className="font-bold">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="icon-btn min-h-[44px] grid place-items-center"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
