import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function DashboardOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id, 
      title, 
      project_views (count)
    `)
    .eq('user_id', user?.id)

  const { data: offers } = await supabase
    .from('job_offers')
    .select('id')
    .eq('recipient_id', user?.id)

  const totalViews = projects?.reduce((acc, p) => acc + (p.project_views?.[0]?.count || 0), 0) || 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Dashboard Overview<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p className="muted">An executive summary of your professional reach.</p>
      </div>

      <div className="grid">
        <div className="card metric-card">
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)' }}>{totalViews}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Total Reach</div>
        </div>
        <div className="card metric-card">
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--foreground)' }}>{projects?.length || 0}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Masterpieces</div>
        </div>
        <div className="card metric-card">
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)' }}>{offers?.length || 0}</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Open Opportunities</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Performance by Project</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects?.map(project => (
            <div key={project.id} className="glass performance-row" style={{ padding: '1.25rem 2rem', borderRadius: '8px' }}>
              <span style={{ fontWeight: 700 }}>{project.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{project.project_views?.[0]?.count || 0} views</span>
                <Link href="/dashboard/projects" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>Manage</Link>
              </div>
            </div>
          ))}
          {projects?.length === 0 && <p className="muted">No projects tracked yet.</p>}
        </div>
      </div>
    </div>
  )
}
