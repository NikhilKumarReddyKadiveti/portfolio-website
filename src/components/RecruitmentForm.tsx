'use client'

import { useState } from 'react'
import { sendJobOffer } from '@/app/dashboard/actions'

interface RecruitmentFormProps {
  recipientId: string
  recipientName: string
  projectId?: string
  projectTitle?: string
}

export default function RecruitmentForm({ recipientId, recipientName, projectId, projectTitle }: RecruitmentFormProps) {
  const [show, setShow] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get viewer info from localStorage if available
  const stored = typeof window !== 'undefined' ? localStorage.getItem('viewer_info') : null
  const viewerData = stored ? JSON.parse(stored) : null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await sendJobOffer(formData)
      setSent(true)
      setTimeout(() => setShow(false), 3000)
    } catch {
      alert('Failed to send offer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', color: 'var(--accent)', fontWeight: 700, textAlign: 'center' }}>
        Professional Offer Sent Successfully.
      </div>
    )
  }

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
        Send Job Offer / Invitation
      </button>
    )
  }

  return (
    <div className="glass" style={{ padding: 'clamp(1rem, 4vw, 2rem)', borderRadius: '8px', border: '1px solid var(--accent-glow)', minWidth: 0 }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>
        Professional Inquiry for {recipientName}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <input type="hidden" name="recipient_id" value={recipientId} />
        {projectId && <input type="hidden" name="project_id" value={projectId} />}
        
        <div className="form-grid" style={{ gap: '1rem' }}>
          <div className="form-field">
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Your Name</label>
            <input name="sender_name" required defaultValue={viewerData?.name || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
          <div className="form-field">
            <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Your Email</label>
            <input name="sender_email" type="email" required className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
          </div>
        </div>

        <div className="form-field">
          <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Company</label>
          <input name="sender_company" defaultValue={viewerData?.company || ''} className="btn btn-secondary" style={{ textAlign: 'left', cursor: 'text' }} />
        </div>

        <div className="form-field">
          <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Offer / Opportunity Details</label>
          <textarea 
            name="offer_details" 
            required 
            placeholder={projectTitle ? `I'm interested in your work on "${projectTitle}"...` : "Tell them about the opportunity..."}
            className="btn btn-secondary" 
            style={{ textAlign: 'left', cursor: 'text', minHeight: '120px' }} 
          />
        </div>

        <div className="responsive-actions">
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
            {loading ? 'Transmitting...' : 'Send Professional Offer'}
          </button>
          <button type="button" onClick={() => setShow(false)} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
