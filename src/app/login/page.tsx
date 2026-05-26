import { login } from '@/app/auth/actions'
import Link from 'next/link'

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="container" style={{ maxWidth: '450px', padding: '8rem 1.5rem' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Welcome Back<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Enter your credentials to access your dashboard.</p>
        
        {searchParams.error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {searchParams.error}
          </div>
        )}

        {searchParams.message && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            {searchParams.message}
          </div>
        )}

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                outline: 'none',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                outline: 'none',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.1rem' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create an elite profile</Link>
        </p>
      </div>
    </div>
  )
}
