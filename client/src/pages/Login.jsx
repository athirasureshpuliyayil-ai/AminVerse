import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getUser, getToken } from '../utils/authStorage'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    const user = getUser()
    const token = getToken()
    if (user && token) {
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        const rawRole = (user.role || '').toLowerCase()
        const targetRole = ['parent', 'adult', 'author', 'admin'].includes(rawRole) ? rawRole : 'author'
        navigate(targetRole === 'admin' ? '/admin' : `/dashboard/${targetRole}`, { replace: true })
      }
    }
  }, [navigate, redirect])

  const userPortals = [
    {
      id: 'parent',
      title: '👨‍👩‍👧 Parent & Kids Portal',
      tag: 'FAMILY & EDUCATION',
      desc: 'Safe kids bedtime stories, read-aloud audiobooks, screen-time controls, quiz stars & educational arcade games.',
      path: '/login/parent',
      dashPath: '/dashboard/parent',
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
      border: 'rgba(6, 182, 212, 0.4)',
      btnText: 'Enter Parent Portal →'
    },
    {
      id: 'adult',
      title: '🧔 Adult Fiction Lounge',
      tag: 'FICTION & ZEN LOUNGE',
      desc: 'Sci-fi epics, dark mysteries, novel bookmark shelves, ambient focus soundscapes & spatial logic games.',
      path: '/login/adult',
      dashPath: '/dashboard/adult',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      border: 'rgba(139, 92, 246, 0.4)',
      btnText: 'Enter Fiction Lounge →'
    },
    {
      id: 'author',
      title: '✍️ Author Animation Studio',
      tag: 'MANUSCRIPT → ANIMATION',
      desc: 'Publish original manuscripts, track reader views & bookmarks, and convert story scenes into 4K AI video animations.',
      path: '/login/author',
      dashPath: '/dashboard/author',
      gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)',
      border: 'rgba(99, 102, 241, 0.4)',
      btnText: 'Enter Author Studio →'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0B0F17 0%, #0F172A 60%, #1E293B 100%)',
      color: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '50px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
              🎬
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>AnimVerse AI</span>
          </Link>

          {/* DISCREET COMPACT SMALL ADMIN LOGIN BAR AT TOP */}
          <Link to="/admin-login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 8,
            background: 'rgba(245, 158, 11, 0.10)', border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F59E0B', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            <span>🔑</span> System Administrator Access →
          </Link>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818CF8', padding: '6px 16px', borderRadius: 50,
            fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16
          }}>
            🔒 SELECT USER LOGIN PORTAL
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Isolated Role Gateways
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Each portal provides a completely isolated dashboard and specialized features for Parents, Adults, and Authors.
          </p>
        </div>

        {/* 3 USER PORTAL CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 44 }}>
          {userPortals.map(p => (
            <div key={p.id} style={{
              background: 'rgba(30, 41, 59, 0.65)',
              backdropFilter: 'blur(20px)',
              borderRadius: 22,
              border: `1px solid ${p.border}`,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}>
              <div>
                <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 50, background: 'rgba(255,255,255,0.05)', color: '#CBD5E1', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', marginBottom: 18 }}>
                  {p.tag}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 10, color: '#F8FAFC' }}>{p.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: 28 }}>{p.desc}</p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Link to={`${p.path}${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{
                  flex: 1, padding: '13px 20px', borderRadius: 12, background: p.gradient, color: 'white',
                  fontWeight: 800, fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}>
                  {p.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SMALL DISCREET ADMIN BAR */}
        <div style={{
          maxWidth: 680, margin: '0 auto 30px',
          background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 14, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F59E0B' }}>System Administrator Login</div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Restricted content & story/game CRUD access</div>
            </div>
          </div>
          <Link to="/admin-login" style={{
            padding: '7px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: 'white', fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none'
          }}>
            Admin Login →
          </Link>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.86rem' }}>
          Don't have an account yet? <Link to={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: '#818CF8', fontWeight: 700, textDecoration: 'none' }}>Create Free Account</Link>
        </div>
      </div>
    </div>
  )
}
