import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { useLocalStorage } from '../hooks/useLocalStorage'

const EntriesContext = createContext({})

// eslint-disable-next-line react-refresh/only-export-components
export const useEntries = () => {
  const context = useContext(EntriesContext)
  if (!context) {
    throw new Error('useEntries must be used within EntriesProvider')
  }
  return context
}

export const EntriesProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [guestEntries, setGuestEntries] = useLocalStorage('guest_entries', [])

  // Fetch entries from Supabase (for authenticated users)
  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Migrate guest entries to Supabase when user signs up/in
  const migrateGuestEntries = useCallback(async () => {
    if (!user || guestEntries.length === 0) {
      return { migrated: 0 }
    }
  
    try {
      // Prepare entries for Supabase (add user_id)
      const entriesToMigrate = guestEntries.map(entry => ({
        title: entry.title,
        content: entry.content,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
        user_id: user.id,
      }))

      // Insert all guest entries into Supabase
      const { data, error } = await supabase
        .from('entries')
        .insert(entriesToMigrate)
        .select()

      if (error) {
        throw error
      }
  
      // Clear guest entries from localStorage
      setGuestEntries([])
      localStorage.removeItem('guest_entries')
    
      // Refresh entries from Supabase
      await fetchEntries()

      return { migrated: data.length }
    } catch (error) {
      console.error('Error migrating guest entries:', error)
      throw error
    }
  }, [user, guestEntries, setGuestEntries, fetchEntries])

  // Fetch entries when user logs in
  useEffect(() => {
    if (authLoading) return

    if (user) {
      if (guestEntries.length > 0) {
        migrateGuestEntries().catch(console.error)
      } else {
        fetchEntries()
      }
    } else {
      // Load guest entries from localStorage
      setEntries(guestEntries)
      setLoading(false)
    }
  }, [user, authLoading, guestEntries, migrateGuestEntries, fetchEntries])

  // Create new entry
  const createEntry = async (entryData) => {
    try {
      if (user) {
        // Save to Supabase
        const { data, error } = await supabase
          .from('entries')
          .insert([{ ...entryData, user_id: user.id }])
          .select()
          .single()

        if (error) throw error
        setEntries([data, ...entries])
        return data
      } else {
        // Save to localStorage
        const newEntry = {
          id: Date.now().toString(),
          ...entryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const updatedEntries = [newEntry, ...guestEntries]
        setGuestEntries(updatedEntries)
        setEntries(updatedEntries)
        return newEntry
      }
    } catch (error) {
      console.error('Error creating entry:', error)
      throw error
    }
  }

  // Update existing entry
  const updateEntry = async (id, entryData) => {
    try {
      if (user) {
        // Update in Supabase
        const { data, error } = await supabase
          .from('entries')
          .update({ ...entryData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        setEntries(entries.map(entry => entry.id === id ? data : entry))
        return data
      } else {
        // Update in localStorage
        const updatedEntry = {
          ...guestEntries.find(e => e.id === id),
          ...entryData,
          updated_at: new Date().toISOString(),
        }
        const updatedEntries = guestEntries.map(entry => 
          entry.id === id ? updatedEntry : entry
        )
        setGuestEntries(updatedEntries)
        setEntries(updatedEntries)
        return updatedEntry
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      throw error
    }
  }

  // Delete entry
  const deleteEntry = async (id) => {
    try {
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('entries')
          .delete()
          .eq('id', id)

        if (error) throw error
        setEntries(entries.filter(entry => entry.id !== id))
      } else {
        // Delete from localStorage
        const updatedEntries = guestEntries.filter(entry => entry.id !== id)
        setGuestEntries(updatedEntries)
        setEntries(updatedEntries)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      throw error
    }
  }

  // Get single entry by ID
  const getEntry = (id) => {
    return entries.find(entry => entry.id === id)
  }

  const value = {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    refetch: fetchEntries,
    migrateGuestEntries,
  }

  return (
    <EntriesContext.Provider value={value}>
      {children}
    </EntriesContext.Provider>
  )
}