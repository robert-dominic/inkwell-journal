import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEntries } from '../contexts/EntriesContext'
import AuthModal from "../components/Auth/AuthModal"
import JournalHeader from '../components/Layout/JournalHeader'
import EntryList from '../components/Journal/EntryList'
import { PenLine } from 'lucide-react'

export default function Journal() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { entries, loading, deleteEntry } = useEntries()

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const handleEntryClick = (entry) => {
    navigate(`/entry/${entry.id}`)
  }

  const handleEdit = (entry) => {
    navigate(`/editor/${entry.id}`)
  }

  const handleDelete = async (entry) => {
    // Simple confirm for now (we'll make a modal tomorrow)
    const confirmDelete = window.confirm(`Delete "${entry.title}"?`)
    if (!confirmDelete) return

    try {
      await deleteEntry(entry.id)
    } catch (error) {
      alert('Failed to delete entry')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JournalHeader onSignUp={() => setIsAuthModalOpen(true)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Journal</h2>
          <p className="text-gray-600 mt-1">
            {user 
              ? 'Your thoughts, beautifully organized' 
              : 'Writing in guest mode - sign up to save permanently'}
          </p>
        </div>

        {/* Guest Mode Banner */}
        {!user && entries.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              📝 You have <strong>{entries.length}</strong> {entries.length === 1 ? 'entry' : 'entries'} saved locally. 
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="ml-2 text-orange-600 font-medium hover:underline"
              >
                Sign up to sync across devices
              </button>
            </p>
          </div>
        )}

        {/* Entries List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading entries...</p>
          </div>
        ) : (
          <EntryList 
            entries={entries} 
            onEntryClick={handleEntryClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/editor')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-orange-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="New Entry"
      >
        <PenLine size={24} />
      </button>

      {/* Auth Modal for Guest Users */}
      {!user && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}