import  { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditorHeader({ onSave, onCancel, isSaving, hasChanges}) {
    const navigate = useNavigate()

    const handleCancel = () => {
        if (hasChanges) {
            const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to discard them?')
            if (!confirmDiscard) return
        }
        onCancel ? onCancel() : navigate('journal')
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Back Button */}
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft size={20} />
                      <span className="sm:inline">Back</span>
                      
                    </button>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={onSave}
                          disabled={isSaving}
                          className="px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}