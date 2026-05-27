import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOut } from '@/app/auth/actions';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="glass" style={{ 
      padding: '1.25rem 0', 
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container site-header-row">
        <Link href="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          color: 'var(--foreground)',
          textDecoration: 'none',
          letterSpacing: '-0.03em'
        }}>
          PORTFOLIO<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>
        <nav className="site-nav">
          <Link href="/#explore" style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>Explore</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>Dashboard</Link>
              <form action={signOut}>
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>Login</Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
