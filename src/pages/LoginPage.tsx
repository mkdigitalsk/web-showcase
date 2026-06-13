import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '../components'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Mock login - will be replaced with real API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === 'test@test.com' && password === 'password') {
      // TODO: navigate to dashboard
      console.log('Login success')
    } else {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-0">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-neutral-80 mb-8 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
          />

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <Button type="submit" loading={loading} className="mt-4">
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-neutral-60">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
