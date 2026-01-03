import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Zap, Cloud, Lock } from "lucide-react"
import AuthModal from "../components/Auth/AuthModal"
import HomeHeader from "../components/Layout/HomeHeader"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
    navigate('/journal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-80 via-white to-orange-50">
      <HomeHeader onSignIn={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 text-balance">
            Your thoughts, <span className="text-orange-500">beautifully organized</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Capture your daily thoughts, memories, and reflections in one secure place. Start journaling in seconds, no
            signup required.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/journal')}
              className="w-full sm:w-auto px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg transition-colors active:scale-95 shadow-lg hover:shadow-xl"
            >
              Start Journaling
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Instant Start */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Start</h3>
            <p className="text-gray-600 leading-relaxed">
              No signup required. Start journaling immediately as a guest and create an account later to save your
              entries.
            </p>
          </div>

          {/* Feature 2: Cloud Sync */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cloud Sync</h3>
            <p className="text-gray-600 leading-relaxed">
              Access your journal entries from any device. Your thoughts are automatically synced and always available.
            </p>
          </div>

          {/* Feature 3: Privacy & Security */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
            <p className="text-gray-600 leading-relaxed">
              Your entries are encrypted and private. Only you can read your journal. We take your privacy seriously.
            </p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}
