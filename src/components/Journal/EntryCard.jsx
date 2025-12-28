import { Edit2, Trash2 } from 'lucide-react'

export default function EntryCard({ entry, onClick, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const truncateContent = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const handleEdit = (e) => {
    e.stopPropagation() // Prevent card click
    onEdit(entry)
  }

  const handleDelete = (e) => {
    e.stopPropagation() // Prevent card click
    onDelete(entry)
  }

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-none group relative"
    >
      {/* Action Icons - Show on hover */}
      <div className="absolute top-4 right-4 flex flex-column items-center gap-2 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Edit entry"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-gray-100 text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-start justify-between mb-3 pr-16">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
          {entry.title}
        </h3>
      </div>
      
      <p className="text-sm text-gray-500 mb-3">
        {formatDate(entry.created_at)}
      </p>
      
      <p className="text-gray-600 line-clamp-3">
        {truncateContent(entry.content)}
      </p>
    </div>
  )
}