import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import { getUser, setUser as persistUser, getToken } from '../utils/authStorage'

export default function Profile() {
  // Initialize state directly from stored user for immediate rendering
  const [userObj, setUserObj] = useState(() => getUser() || null)
  const [name, setName] = useState(() => getUser()?.name || '')
  const [email, setEmail] = useState(() => getUser()?.email || '')
  const [role, setRole] = useState(() => getUser()?.role || 'creator')
  const [preferredStyle, setPreferredStyle] = useState(() => getUser()?.preferredStyle || 'Kids Cartoon')
  const [bio, setBio] = useState(() => getUser()?.bio || '')
  
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = getUser()
    if (saved) {
      setUserObj(saved)
      if (saved.name) setName(saved.name)
      if (saved.email) setEmail(saved.email)
      if (saved.role) setRole(saved.role)
      if (saved.preferredStyle) setPreferredStyle(saved.preferredStyle)
      if (saved.bio) setBio(saved.bio)
    }
  }, [])

  // Validation function
  const validateForm = () => {
    const errs = {}
    const trimmedName = name.trim()

    if (!trimmedName) {
      errs.name = 'Full Name is required. Please enter your name.'
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = 'Full Name cannot contain only numbers (e.g. 1233). Please enter a valid name.'
    } else if (trimmedName.length < 2) {
      errs.name = 'Full Name must be at least 2 characters long.'
    } else if (trimmedName.length > 50) {
      errs.name = 'Full Name cannot exceed 50 characters.'
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errs.name = 'Full Name can only contain letters, spaces, dots, and hyphens.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: null }))
    }
    if (successMsg) setSuccessMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')

    if (!validateForm()) {
      return
    }

    setSaving(true)
    const token = getToken()
    const updatedUser = {
      ...(userObj || {}),
      name: name.trim(),
      email: email,
      role: role,
      preferredStyle: preferredStyle,
      bio: bio.trim()
    }

    try {
      if (token) {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name.trim(),
            preferredStyle,
            bio: bio.trim()
          })
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update profile on server')
        }
      }

      // Persist locally
      persistUser(updatedUser)
      setUserObj(updatedUser)
      setSuccessMsg('✅ Profile updated and name saved successfully!')

      // Dispatch event to sync Header and Sidebar immediately
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }))
    } catch (err) {
      // Fallback local save
      persistUser(updatedUser)
      setUserObj(updatedUser)
      setSuccessMsg('✅ Profile updated locally!')
      window.dispatchEvent(new Event('storage'))
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }))
    } finally {
      setSaving(false)
    }
  }

  const currentInitial = (name || userObj?.name || 'U').trim().charAt(0).toUpperCase() || 'U'
  const displayName = name.trim() || userObj?.name || 'Creator'

  return (
    <AppShell title="User Profile">
      <div className="card" style={{ padding: '36px', maxWidth: '640px', margin: '0 auto', background: 'var(--card-bg, #12131A)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Profile Header Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.6rem',
            fontWeight: 800,
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)'
          }}>
            {currentInitial}
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 6px', color: '#F8FAFC' }}>
            {displayName}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>{email || 'user@animverse.ai'}</span>
            <span style={{ color: '#64748B' }}>•</span>
            <span className="badge badge-green" style={{ textTransform: 'uppercase', fontSize: '0.72rem', padding: '2px 10px', borderRadius: '50px' }}>
              {role || 'creator'}
            </span>
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {successMsg}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name (Editable) */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC', margin: 0 }}>
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                ✏️ Editable
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your full name"
              style={{
                borderColor: errors.name ? '#EF4444' : 'rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                fontSize: '1rem',
                padding: '12px 16px'
              }}
              required
            />
            {errors.name ? (
              <div style={{ color: '#EF4444', fontSize: '0.82rem', marginTop: '6px', fontWeight: 600 }}>
                ⚠️ {errors.name}
              </div>
            ) : (
              <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '4px' }}>
                You can change and update your creator name anytime.
              </div>
            )}
          </div>

          {/* Email Address (Read-only/Verified) */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC', margin: 0 }}>
                Email Address
              </label>
              <span style={{ fontSize: '0.75rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Verified 🔒
              </span>
            </div>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
              readOnly
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#94A3B8',
                cursor: 'not-allowed',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '12px 16px'
              }}
            />
            <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '4px' }}>
              Email address is linked to your account authentication.
            </div>
          </div>

          {/* Preferred Animation Style */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px', color: '#F8FAFC' }}>
              Preferred Animation Style
            </label>
            <select
              className="form-control"
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#F8FAFC',
                padding: '12px 16px'
              }}
            >
              <option value="Kids Cartoon">Kids Cartoon</option>
              <option value="Anime">Anime</option>
              <option value="Pixar Style">Pixar Style</option>
              <option value="Cinematic">Cinematic</option>
              <option value="Storybook">Storybook</option>
              <option value="Comic Book">Comic Book</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Realistic 3D">Realistic 3D</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              borderRadius: '12px',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(124, 58, 237, 0.35)'
            }}
          >
            {saving ? '⏳ Saving Changes...' : '💾 Save Profile Changes'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
