'use client'

import { useState, useEffect } from 'react'

export default function ViewerPrompt() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')

  useEffect(() => {
    // Check if viewer info already exists
    const stored = localStorage.getItem('viewer_info')
    if (!stored) {
      // Use a small delay or check in next tick to avoid cascading render error in some lint rules
      const timer = setTimeout(() => setShow(true), 0)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && company) {
      localStorage.setItem('viewer_info', JSON.stringify({ name, company }))
      setShow(false)
      window.location.reload()
    }
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', textAlign: 'center' }}>
          Visitor Entry<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Please identify yourself to view this creator&apos;s masterpieces.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Your Name</label>
            <input 
              required
              className="btn btn-secondary" 
              style={{ textAlign: 'left', cursor: 'text' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Company / Organization</label>
            <input 
              required
              className="btn btn-secondary" 
              style={{ textAlign: 'left', cursor: 'text' }}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Design Studio Inc."
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            Enter Portfolio
          </button>
        </form>
      </div>
    </div>
  )
}
