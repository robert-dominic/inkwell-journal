import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEntries } from '../contexts/EntriesContext'
import { ArrowLeft, Edit2, Trash2, Calendar } from 'lucide-react'

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries, deleteEntry, loading } = useEntries() // Use entries directly
  const [entry, setEntry] = useState(null)

  useEffect(() => {
    // Wait for entries to load before checking
    if (loading) return

    const foundEntry = entries.find(e => e.id === id)
    if (foundEntry) {
      setEntry(foundEntry)
    } else {
      alert('Entry not found')
      navigate('/journal')
    }
  }, [id, loading, entries]) // Add entries to dependencies

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleEdit = () => {
    navigate(`/editor/${id}`)
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete "${entry.title}"?`)
    if (!confirmDelete) return

    try {
      await deleteEntry(id)
      navigate('/journal')
    } catch (error) {
      console.error('Failed to delete entry:', error)
      alert('Failed to delete entry')
    }
  }

  // Show loading while entries are loading or entry hasn't been found yet 
  if (loading || !entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/journal')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Journal</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit2 size={18} />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <article className="bg-white rounded-xl shadow-md p-8 sm:p-12">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {entry.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <Calendar size={18} />
            <time dateTime={entry.created_at}>
              {formatDate(entry.created_at)}
            </time>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Last updated: {new Date(entry.updated_at).toLocaleString()}</p>
          </div>
        </article>
      </main>
    </div>
  )
}