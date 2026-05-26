import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import ViewerPrompt from '@/components/ViewerPrompt'
import RecruitmentForm from '@/components/RecruitmentForm'
import { notFound } from 'next/navigation'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function decodeProfileKey(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const profileKey = decodeProfileKey(params.id)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null

  if (UUID_PATTERN.test(profileKey)) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileKey)
      .maybeSingle()

    profile = data
  }

  if (!profile) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', profileKey)
      .maybeSingle()

    profile = data
  }

  if (!profile) {
    notFound()
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', profile.id)

  return (
    <>
      {!user && <ViewerPrompt />}
      <Header />
      <main style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
        {/* Premium Profile Header */}
        <section style={{ 
          padding: '8rem 0', 
          position: 'relative',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '50%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 80%)',
            zIndex: 0
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
              <div style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '60px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #065f46 100%)',
                color: '#000', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '4rem', 
                fontWeight: 900,
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.3)',
                transform: 'rotate(-5deg)',
                overflow: 'hidden'
              }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name || profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.full_name?.[0] || profile.username?.[0] || '?'
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <h1 style={{ fontSize: '4rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>{profile.full_name || profile.username || 'Elite Creator'}</h1>
                  {profile.company && (
                    <span className="glass" style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '100px', 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-glow)',
                      textTransform: 'uppercase'
                    }}>
                      {profile.company}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '1.5rem', marginBottom: '2.5rem', maxWidth: '800px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {profile.bio || 'Architecting digital experiences through code and design.'}
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  {profile.website && (
                    <a href={profile.website} target="_blank" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                      Official Portfolio
                    </a>
                  )}
                  {user?.id !== profile.id && (
                    <RecruitmentForm recipientId={profile.id} recipientName={profile.full_name || profile.username} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Masterpieces Section */}
        <section style={{ padding: '8rem 0' }}>
          <div className="container">
            <div className="grid">
              <div style={{ gridColumn: 'span 8' }}>
                <div style={{ marginBottom: '4rem' }}>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Masterpieces<span style={{ color: 'var(--accent)' }}>.</span></h2>
                  <p className="muted">A curated selection of works and innovations.</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {projects?.map((project) => (
                    <div key={project.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      <AnalyticsTracker projectId={project.id} />
                      {project.image_url && (
                        <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
                          <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{project.title}</h3>
                          <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {project.live_url && <a href={project.live_url} target="_blank" style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Experience</a>}
                            {project.github_url && <a href={project.github_url} target="_blank" style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Technical Source</a>}
                          </div>
                        </div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>{project.description}</p>
                        {user?.id !== profile.id && (
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            <RecruitmentForm 
                              recipientId={profile.id} 
                              recipientName={profile.full_name || profile.username} 
                              projectId={project.id}
                              projectTitle={project.title}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects?.length === 0 && (
                    <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: '30px' }}>
                      <p className="muted">No masterpieces have been shared yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ gridColumn: 'span 4' }}>
                <div style={{ position: 'sticky', top: '120px' }}>
                  <div style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Arsenal<span style={{ color: 'var(--accent)' }}>.</span></h2>
                    <p className="muted">Core competencies and specializations.</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {skills?.map((skill) => (
                      <span key={skill.id} className="glass" style={{ 
                        padding: '0.8rem 1.5rem', 
                        borderRadius: '15px', 
                        fontSize: '0.95rem', 
                        fontWeight: 700,
                        border: '1px solid var(--border)'
                      }}>
                        {skill.name}
                      </span>
                    ))}
                    {skills?.length === 0 && <p className="muted">Specializations pending.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
