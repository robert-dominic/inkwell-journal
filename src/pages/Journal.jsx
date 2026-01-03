import { useState, useMemo } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEntries } from '../contexts/EntriesContext'
import AuthModal from "../components/Auth/AuthModal"
import JournalHeader from '../components/Layout/JournalHeader'
import EntryList from '../components/Journal/EntryList'
import { PenLine, SlidersHorizontal } from 'lucide-react'

export default function Journal() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { entries, loading } = useEntries()

  // Sort entries based on selected filter
  const sortedEntries = useMemo(() => {
    const entriesCopy = [...entries]
    
    switch (sortBy) {
      case 'newest':
        return entriesCopy.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )
      case 'oldest':
        return entriesCopy.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        )
      case 'a-z':
        return entriesCopy.sort((a, b) => 
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        )
      case 'z-a':
        return entriesCopy.sort((a, b) => 
          b.title.toLowerCase().localeCompare(a.title.toLowerCase())
        )
      default:
        return entriesCopy
    }
  }, [entries, sortBy])

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  const handleEntryClick = (entry) => {
    navigate(`/entry/${entry.id}`)
  }

  const handleEdit = (entry) => {
    navigate(`/editor/${entry.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header now displays username instead of email */}
      <JournalHeader onSignUp={() => setIsAuthModalOpen(true)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
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

        {/* Filter Section */}
        {entries.length > 0 && user && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
            </p>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          </div>
        )}

        {/* Entries List / Empty State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading entries...</p>
          </div>
        ) : entries.length === 0 && user ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No entries yet. Start journaling today!
            </p>
          </div>
        ) : (
          <EntryList 
            entries={sortedEntries}
            onEntryClick={handleEntryClick}
            onEdit={handleEdit}
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
