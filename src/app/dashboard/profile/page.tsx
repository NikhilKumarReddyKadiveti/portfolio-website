import { createClient } from '@/utils/supabase/server'
import { updateProfile } from '../actions'

export default async function ProfileDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Professional Identity<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p className="muted">Personalize how the professional world sees you.</p>
      </div>

      <div className="card">
        <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <input type="hidden" name="username" value={profile?.username || ''} />
          
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Profile Picture</label>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '40px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #065f46 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                fontWeight: 900,
                color: '#000',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)'
              }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile?.full_name?.[0] || '?'
                )}
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avatar URL</label>
                <input 
                  name="avatar_url" 
                  defaultValue={profile?.avatar_url || ''} 
                  placeholder="https://your-image-link.com/photo.jpg"
                  className="btn btn-secondary" 
                  style={{ textAlign: 'left', cursor: 'text' }} 
                />
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Provide a direct link to your professional headshot.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</label>
              <input name="full_name" defaultValue={profile?.full_name || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Company / Studio</label>
              <input name="company" defaultValue={profile?.company || ''} placeholder="e.g. Acme Corp" className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Professional Bio</label>
            <textarea name="bio" defaultValue={profile?.bio || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text', minHeight: '120px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Digital Home (URL)</label>
            <input name="website" defaultValue={profile?.website || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', marginTop: '1rem' }}>
            Synchronize Professional Profile
          </button>
        </form>
      </div>
    </div>
  )
}
