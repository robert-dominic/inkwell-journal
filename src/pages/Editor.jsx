import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEntries } from "../contexts/EntriesContext";
import { useModal } from "../contexts/ModalContext";
import EditorHeader from "../components/Editor/EditorHeader";
import TitleInput from "../components/Editor/TitleInput";
import DatePicker from "../components/Editor/DatePicker";
import ContentEditor from "../components/Editor/ContentEditor";

export default function Editor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useModal()
    const { createEntry, updateEntry, entries, loading } = useEntries() // Use entries directly

    const [title, setTitle] = useState('') 
    const [content, setContent] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isSaving, setIsSaving] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    
    // Load entry data if editing
    useEffect(() => {
      // Wait for entries to load before checking
      if (loading) return

      if (id) {
        const entry = entries.find(e => e.id === id)
        if (entry) {
            setTitle(entry.title)
            setContent(entry.content)
            setDate(new Date(entry.created_at).toISOString().split('T')[0])
            setIsEditMode(true)
        } else {
            // show the InfoModal if entry not found after loading completed
            showInfo({
                title: 'Entry Not Found',
                message: 'The entry you are looking for does not exist.',
                onConfirm: () => navigate('/journal')
            })
        }
      }
    }, [id, loading, entries, navigate]) // Add entries to dependencies

    const hasChanges = title.trim() !== '' || content.trim() !== ''

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Please fill in both title and content')
            return
        }

        try {
            setIsSaving(true)

            if (isEditMode) {
                await updateEntry(id, {
                    title: title.trim(),
                    content: content.trim(),
                    created_at: new Date(date).toISOString(),
                })
                navigate('/journal')
                showInfo({
                    title: 'Entry Updated',
                    message: 'Your changes have been successfully saved.',
                })
            } else {
                await createEntry({
                    title: title.trim(),
                    content: content.trim(),
                    created_at: new Date(date).toISOString(),
                    updated_at: new Date().toISOString(),
                })
                navigate('/journal')
                showInfo({
                    title: 'Entry Created',
                    message: 'Your new journal entry has been successfully saved.',
                })
            }
        } catch (error) {
            console.error('Error saving entry:', error)
            alert('Failed to save entry. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    // Show loading state while entries are loading
    if (loading && id) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <EditorHeader
              onSave={handleSave}
              onCancel={() => navigate('/journal')}
              isSaving={isSaving}
              hasChanges={hasChanges}
            />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="mb-4">
                        <span className="text-sm text-gray-500">
                            {isEditMode ? 'Editing Entry' : 'New Entry'}
                        </span>
                    </div>
                    <TitleInput value={title} onChange={setTitle} />
                    <DatePicker value={date} onChange={setDate} />
                    <ContentEditor value={content} onChange={setContent} />
                </div>
            </main>
        </div>
    )
}