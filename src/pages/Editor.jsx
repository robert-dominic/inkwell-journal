import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEntries } from "../contexts/EntriesContext";
import EditorHeader from "../components/Editor/EditorHeader";
import TitleInput from "../components/Editor/TitleInput";
import DatePicker from "../components/Editor/DatePicker";
import ContentEditor from "../components/Editor/ContentEditor";

export default function Editor() {
    const navigate = useNavigate()
    const { createEntry } = useEntries()

    const [title, setTitle] = useState('') 
    const [content, setContent] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isSaving, setIsSaving] = useState(false)

    const hasChanges = title.trim() !== '' || content.trim() !== ''

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Please fill in both title and content')
            return
        }

        try {
            setIsSaving(true)
            await createEntry({
                title: title.trim(),
                content: content.trim(),
                created_at: new Date(date).toISOString(),
                updated_at: new Date().toISOString(),
            })
            alert('Entry Saved Successfully!')
            navigate('/journal')
        } catch (error) {
            console.error('Error saving entry:', error)
            alert('Failed to save entry. Please try again.')
        } finally {
            setIsSaving(false)
        }
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
                    <TitleInput value={title} onChange={setTitle} />
                    <DatePicker value={date} onChange={setDate} />
                    <ContentEditor value={content} onChange={setContent} />
                </div>
            </main>
        </div>
    )
}