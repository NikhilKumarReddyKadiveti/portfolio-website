import { signup } from '@/app/auth/actions'
import Link from 'next/link'

export default async function SignupPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="container" style={{ maxWidth: '500px', padding: '6rem 1.5rem' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem' }}>Join the Elite<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Create your professional profile and showcase your masterpieces.</p>
        
        {searchParams.error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {searchParams.error}
          </div>
        )}

        <form action={signup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="full_name" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase' }}>Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="John Doe"
                style={{
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="username" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase' }}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="johndoe"
                style={{
                  padding: '0.875rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase' }}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{
                padding: '0.875rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                outline: 'none',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground)', textTransform: 'uppercase' }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              style={{
                padding: '0.875rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                outline: 'none',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.1rem' }}>
            Create Account
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          Already a member? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
