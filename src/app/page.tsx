import Header from "@/components/Header";
import TypingEffect from "@/components/TypingEffect";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  projects?: { count: number }[];
}

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  profiles: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export default async function Home() {
  let user = null;
  let profiles: Profile[] = [];
  let recentProjects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
    
    // Fetch profiles with project counts
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*, projects(count)')
      .order('updated_at', { ascending: false })
      .limit(8);

    if (profilesData) {
      profiles = profilesData as unknown as Profile[];
    }

    // Fetch recent projects
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*, profiles(id, full_name, username, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(6);

    if (projectsData) {
      recentProjects = projectsData as unknown as Project[];
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Continue rendering with empty arrays if fetching fails
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section style={{ 
          padding: '10rem 0 8rem', 
          textAlign: 'center', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated Background Element */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1000px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: -1
          }} />

          <div className="container">
            <h1 style={{ 
              fontSize: '5rem', 
              marginBottom: '1.5rem', 
              lineHeight: 1.1,
              fontWeight: 900,
              background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Design. Code.<br />
              <span style={{ color: 'var(--accent)', WebkitTextFillColor: 'var(--accent)' }}>
                <TypingEffect words={['Innovate.', 'Architect.', 'Create.', 'Build.']} typingSpeed={60} deletingSpeed={30} />
              </span>
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              maxWidth: '650px', 
              margin: '0 auto 3.5rem',
              color: 'var(--muted)',
              lineHeight: 1.8
            }}>
              A premium showcase for the world&apos;s most talented creators. 
              Join the elite circle of developers and designers.
            </p>
            <div className="hero-actions">
              <Link href={user ? "/dashboard" : "/signup"} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                {user ? "Go to Dashboard" : "Start Your Journey"}
              </Link>
              <a href="#explore" className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                Explore Work
              </a>
            </div>
          </div>
        </section>

        {/* Explore Sections */}
        <section id="explore" style={{ padding: '8rem 0' }}>
          <div className="container">
            {profiles && profiles.length > 0 && (
              <>
                <div className="home-section-heading" style={{ alignItems: 'flex-end', marginBottom: '4rem' }}>
                  <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Elite Creators</h2>
                    <p style={{ color: 'var(--muted)', margin: 0 }}>The minds behind the next generation of digital products.</p>
                  </div>
                </div>

                <div className="grid" style={{ marginBottom: '8rem' }}>
                  {profiles.map((profile: Profile) => {
                    const profileLink = `/profile/${encodeURIComponent(profile.id)}`;
                    return (
                      <Link href={profileLink} key={profile.id} className="card" style={{ gridColumn: 'span 3', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ 
                          width: '72px', 
                          height: '72px', 
                          borderRadius: '24px', 
                          background: 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)',
                          color: '#000', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '1.75rem', 
                          fontWeight: 800, 
                          marginBottom: '1.5rem',
                          boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
                          overflow: 'hidden'
                        }}>
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name || profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            profile.full_name?.[0] || profile.username?.[0] || '?'
                          )}
                        </div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{profile.full_name || profile.username}</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>{profile.bio || 'Architecting the future, one pixel at a time.'}</p>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: 'var(--accent)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          {profile.projects?.[0]?.count || 0} Projects
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            <div className="home-section-heading" style={{ alignItems: 'flex-end', marginBottom: '4rem' }}>
              <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Masterpieces</h2>
                <p style={{ color: 'var(--muted)', margin: 0 }}>Recent highlights from our creative community.</p>
              </div>
            </div>

            <div className="grid">
              {recentProjects && recentProjects.length > 0 ? (
                recentProjects.map((project: Project) => (
                  <div key={project.id} className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>{project.title}</h3>
                    <p style={{ fontSize: '0.95rem', marginBottom: '2rem', flexGrow: 1 }}>{project.description}</p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      paddingTop: '1.5rem',
                      borderTop: '1px solid var(--border)'
                    }}>
                      {project.profiles ? (
                        <Link href={`/profile/${encodeURIComponent(project.profiles.id)}`} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {project.profiles.avatar_url && (
                            <img src={project.profiles.avatar_url} alt="" style={{ width: '20px', height: '20px', borderRadius: '6px', objectFit: 'cover' }} />
                          )}
                          by <span style={{ color: 'var(--accent)' }}>@{project.profiles.username}</span>
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>by anonymous</span>
                      )}
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live</a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Source</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: '4rem', background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <p className="muted">No masterpieces found yet. Be the first to innovate.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1.5rem' }}>PORTFOLIO<span style={{ color: 'var(--accent)' }}>.</span></h2>
          <p style={{ maxWidth: '400px', margin: '0 auto 3rem', fontSize: '0.9rem' }}>
            A curated space for exceptional developers and designers to showcase their craft.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear() }. Sjak&apos;s Digital. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </>
  );
}
