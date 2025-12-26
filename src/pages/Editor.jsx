import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Editor() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/journal')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Journal
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">New Entry</h1>
          <p className="text-gray-500">Entry editor will be built next...</p>
        </div>
      </div>
    </div>
  )
}