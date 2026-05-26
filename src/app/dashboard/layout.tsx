import Header from '@/components/Header'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Professional Identity', href: '/dashboard/profile', icon: '👤' },
    { label: 'Masterpieces', href: '/dashboard/projects', icon: '🎨' },
    { label: 'Arsenal (Skills)', href: '/dashboard/skills', icon: '⚡' },
    { label: 'Opportunities', href: '/dashboard/offers', icon: '✉️' },
  ]

  return (
    <>
      <Header />
      <div className="container" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', gap: '2rem', padding: '2rem' }}>
        {/* Sidebar Nav */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '24px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #065f46 100%)',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                color: '#000',
                overflow: 'hidden',
                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)'
              }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile?.full_name?.[0] || profile?.username?.[0] || '?'
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{profile?.full_name || profile?.username}</h3>
              <p className="muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>@{profile?.username}</p>
              <Link href={`/profile/${profile?.username}`} className="btn btn-secondary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', marginTop: '1rem' }}>
                View Public Profile
              </Link>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.875rem 1.25rem', 
                  borderRadius: '12px', 
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }} className="dashboard-nav-item">
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </>
  )
}
