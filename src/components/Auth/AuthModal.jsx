import { useEffect } from "react"
import { X } from "lucide-react"
import AuthForm from "./AuthForm"

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className="flex gap-2 sm:justify-center pt-4">
            <img src="/logo.svg" alt="Inkwell's logo" className="w-9 h-9"/>
            <span className="text-[1.35rem] whitespace-nowrap font-bold text-gray-900 mb-8">
              Welcome to Inkwell
            </span>
          </div>
          <AuthForm onSuccess={onSuccess} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
