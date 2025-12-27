import EntryCard from './EntryCard'

export default function EntryList({ entries, onEntryClick }) {
    if (entries.length === 0) {
        return (
            <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>
                    No entries yet. Click the pen icon to start writing!
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={() => onEntryClick(entry)}
            />
          ))}        
        </div>
    )
}