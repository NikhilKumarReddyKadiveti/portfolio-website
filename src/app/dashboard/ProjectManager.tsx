'use client'

import { useState } from 'react'
import { updateProject, deleteProject } from './actions'

interface Project {
  id: string
  title: string
  description: string | null
  live_url: string | null
  github_url: string | null
  image_url: string | null
  views_count?: number
  recent_viewers?: {
    viewer_name: string | null
    viewer_company: string | null
    created_at: string
  }[]
}

export default function ProjectManager({ initialProjects }: { initialProjects: Project[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="card">
      <div className="project-heading-row" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Masterpieces & Analytics</h2>
        <span className="muted" style={{ fontSize: '0.85rem' }}>{initialProjects.length} Projects Total</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {initialProjects?.map((project) => (
          <div key={project.id} className="glass" style={{ padding: 'clamp(1rem, 4vw, 2.5rem)', borderRadius: '8px', border: '1px solid var(--border)', minWidth: 0 }}>
            {editingId === project.id ? (
              <form action={async (formData) => {
                await updateProject(formData)
                setEditingId(null)
              }} encType="multipart/form-data" className="form-grid">
                <input type="hidden" name="id" value={project.id} />
                <div className="form-field">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Title</label>
                  <input name="title" defaultValue={project.title} required className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Thumbnail Image</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input 
                      name="image_file" 
                      type="file" 
                      accept="image/*" 
                      className="btn btn-secondary" 
                      style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }} 
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>or</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>
                    <input 
                      name="image_url" 
                      defaultValue={project.image_url || ''} 
                      placeholder="Paste image link" 
                      className="btn btn-secondary" 
                      style={{ textAlign: 'left', cursor: 'text', fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>
                <div className="form-field span-2">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Description</label>
                  <textarea name="description" defaultValue={project.description || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text', minHeight: '100px', width: '100%' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Experience URL</label>
                  <input name="live_url" defaultValue={project.live_url || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
                </div>
                <div className="form-field">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>GitHub Repository</label>
                  <input name="github_url" defaultValue={project.github_url || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
                </div>
                <div className="responsive-actions span-2">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                  <button type="button" onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <div className="project-row">
                  {project.image_url && (
                    <div className="project-image-thumb">
                      <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="project-heading-row" style={{ marginBottom: '1.5rem' }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--accent)', fontWeight: 900 }}>{project.title}</h3>
                        <p style={{ color: 'var(--foreground)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{project.description || 'No description provided.'}</p>
                        <div className="responsive-actions">
                          <button onClick={() => setEditingId(project.id)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>Edit Project</button>
                          <form action={async () => { if(confirm('Delete this masterpiece?')) await deleteProject(project.id) }}>
                            <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#ef4444' }}>Delete</button>
                          </form>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--accent-glow)' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{project.views_count || 0}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.5rem' }}>Reach</div>
                      </div>
                    </div>
                  </div>
                </div>

                {project.recent_viewers && project.recent_viewers.length > 0 && (
                  <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '0.1em', color: 'var(--accent)' }}>Recent Professional Interest</h4>
                    <div className="table-scroll">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '0.75rem 0' }}>Professional</th>
                          <th style={{ padding: '0.75rem 0' }}>Organization</th>
                          <th style={{ padding: '0.75rem 0', textAlign: 'right' }}>Connection Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.recent_viewers.map((view, i) => (
                          <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem 0', fontWeight: 700 }}>{view.viewer_name || 'Anonymous Creator'}</td>
                            <td style={{ padding: '1rem 0' }}>
                              {view.viewer_company ? (
                                <span style={{ color: 'var(--accent)', fontWeight: 800 }}>{view.viewer_company}</span>
                              ) : (
                                <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>Independent</span>
                              )}
                            </td>
                            <td style={{ padding: '1rem 0', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right' }}>
                              {new Date(view.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
