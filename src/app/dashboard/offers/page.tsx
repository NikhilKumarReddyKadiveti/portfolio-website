import { createClient } from '@/utils/supabase/server'

export default async function OffersDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: offers } = await supabase
    .from('job_offers')
    .select('*, projects(title)')
    .eq('recipient_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Opportunities<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p className="muted">Direct professional inquiries from recruiters and elite organizations.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {offers && offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className="card" style={{ padding: '2.5rem', border: '1px solid var(--accent-glow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>{offer.sender_name}</h3>
                  <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {offer.sender_company || 'Independent Organization'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700 }}>
                    Received {new Date(offer.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {offer.projects && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <span className="muted">In reference to:</span> <span style={{ fontWeight: 700 }}>{offer.projects.title}</span>
                </div>
              )}

              <div style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '2rem', 
                borderRadius: '16px', 
                marginBottom: '2rem',
                border: '1px solid var(--border)',
                lineHeight: 1.8,
                color: 'var(--foreground)',
                whiteSpace: 'pre-wrap'
              }}>
                {offer.offer_details}
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <a href={`mailto:${offer.sender_email}`} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                  Accept & Reply via Email
                </a>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Sender: <span style={{ color: 'var(--foreground)' }}>{offer.sender_email}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--surface)', borderRadius: '30px', border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📬</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your inbox is waiting.</h2>
            <p className="muted">Incoming professional offers will appear here once you share your masterpieces.</p>
          </div>
        )}
      </div>
    </div>
  )
}
