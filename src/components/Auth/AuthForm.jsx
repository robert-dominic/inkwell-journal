import { useState } from "react"
import { useAuth } from '../../contexts/AuthContext'
import { useEntries } from '../../contexts/EntriesContext'

export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const { migrateGuestEntries } = useEntries()

  const isSignIn = mode === "signin"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isSignIn) {
        await signIn(email, password)
        
        const result = await migrateGuestEntries()
        
        if (result.migrated > 0) {
          alert(`Success! ${result.migrated} guest ${result.migrated === 1 ? 'entry' : 'entries'} synced to your account.`)
        }
      } else {
        if (!username.trim()) {
          setError("Username is required")
          setLoading(false)
          return
        }
        await signUp(email, password, username)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGuestAccess = () => {
    onSuccess()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username input*/}
        {!isSignIn && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isSignIn}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="johndoe"
            />
          </div>
        )}

        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            placeholder="johndoe@example.com"
          />
        </div>

        {/* Password input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
        </button>
      </form>

      {/* Toggle mode */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(isSignIn ? "signup" : "signin")}
          className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
        >
          {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Guest access button */}
      <button
        type="button"
        onClick={handleGuestAccess}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors active:scale-95"
      >
        Continue as guest
      </button>
    </div>
  )
}