import { createClient } from '@/utils/supabase/server'
import { addProject } from '../actions'
import ProjectManager from '../ProjectManager'

export default async function ProjectsDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch projects with detailed analytics
  const { data: projectsData } = await supabase
    .from('projects')
    .select(`
      *,
      project_views (
        viewer_name,
        viewer_company,
        created_at
      )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  const projects = projectsData?.map(project => ({
    ...project,
    views_count: project.project_views?.length || 0,
    recent_viewers: project.project_views?.sort((a: { created_at: string }, b: { created_at: string }) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 10)
  })) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Portfolio Management<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p className="muted">Showcase your masterpieces to the world elite.</p>
      </div>

      {/* Add New Project */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>New Masterpiece</h2>
        <form action={addProject} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Project Title</label>
            <input name="title" required className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Thumbnail URL</label>
            <input name="image_url" placeholder="https://..." className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Description</label>
            <textarea name="description" className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text', minHeight: '80px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Demo URL</label>
            <input name="live_url" placeholder="https://..." className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Repository (GitHub)</label>
            <input name="github_url" placeholder="https://github.com/..." className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: 'span 2' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem' }}>Deploy to Profile</button>
          </div>
        </form>
      </div>

      {/* Project List with Analytics */}
      <ProjectManager initialProjects={projects} />
    </div>
  )
}
