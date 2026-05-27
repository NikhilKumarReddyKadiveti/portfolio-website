import { createClient } from '@/utils/supabase/server'
import { addSkill, deleteSkill } from '../actions'

export default async function SkillsDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user?.id)

  return (
    <div className="dashboard-narrow">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Core Arsenal<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p className="muted">Define the technical and creative weapons in your professional stack.</p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Acquire New Skill</h2>
        <form action={addSkill} className="responsive-actions" style={{ marginBottom: '3rem' }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Expertise (e.g. Next.js)</label>
            <input name="name" required placeholder="Expertise Name" className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Sphere (e.g. Engineering)</label>
            <input name="category" placeholder="Creative Sphere" className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '1.1rem 2rem' }}>Add to Arsenal</button>
        </form>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Specializations</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {skills?.map((skill) => (
            <div key={skill.id} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700 }}>{skill.name}</span>
              <form action={async () => { 'use server'; await deleteSkill(skill.id); }}>
                <button type="submit" style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
              </form>
            </div>
          ))}
          {skills?.length === 0 && <p className="muted">Your arsenal is currently empty.</p>}
        </div>
      </div>
    </div>
  )
}
