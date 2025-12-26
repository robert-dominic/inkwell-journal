"use client"

import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from "../components/Auth/AuthModal"
import JournalHeader from '../components/Layout/JournalHeader'
import { PenLine } from 'lucide-react'

export default function Journal() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()


  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JournalHeader onSignUp={() => setIsAuthModalOpen(true)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Journal</h2>
          <p className="text-gray-600 mt-1">Your thoughts, beautifully organized</p>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
          <p className="text-gray-500">No entries yet. Click the pen icon to start writing!</p>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/editor')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-orange-600 text-white rounded-full shadow-2xl hover:bg-orange-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="New Entry"
      >
        <PenLine size={28} />
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