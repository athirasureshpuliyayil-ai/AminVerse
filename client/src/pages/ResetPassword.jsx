import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setAlert({ type: 'error', msg: 'Invalid or missing password reset token. Please request a new link.' })
    }
  }, [token])

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!token) return showAlert('error', 'Invalid password reset token.')
    if (!newPassword || newPassword.length < 6) return showAlert('error', 'Password must be at least 6 characters long.')
    if (newPassword !== confirmPassword) return showAlert('error', 'Passwords do not match.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })
      const data = await res.json()
      if (data.success) {
        showAlert('success', 'Password reset successfully! Redirecting to sign in...')
        setTimeout(() => navigate('/login'), 1800)
      } else {
        showAlert('error', data.message || 'Failed to reset password.')
      }
    } catch {
      showAlert('error', 'Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rp-page-wrapper">
      <div className="rp-card">
        <div className="rp-icon">🔐</div>
        <h1 className="rp-title">Set New Password</h1>
        <p className="rp-desc">Please enter your new password below to update your account credentials.</p>

        {alert && (
          <div className={`alert alert-${alert.type} show`} style={{ textAlign: 'left', marginBottom: '20px' }}>
            <span>{alert.type === 'error' ? '⚠️ ' : '✅ '}{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.88rem' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter new password (min. 6 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '13px 44px 13px 14px', border: '2px solid #FFE0B2', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#9090A0' }}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.88rem' }}>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{
                width: '100%', padding: '13px 14px', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                border: `2px solid ${confirmPassword && newPassword !== confirmPassword ? '#E63946' : '#FFE0B2'}`
              }}
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p style={{ fontSize: '0.78rem', color: '#E63946', marginTop: '4px' }}>⚠️ Passwords do not match</p>
            )}
          </div>

          <button type="submit" className="btn-rp" disabled={loading || !token}>
            {loading ? '⏳ Updating Password...' : '🔒 Reset Password'}
          </button>
        </form>

        <div className="back-to-login">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>

      <style>{`
        .rp-page-wrapper {
          min-height: 100vh;
          background: #FFFBF0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Poppins', -apple-system, sans-serif;
        }
        .rp-card {
          background: white;
          border-radius: 20px;
          padding: 48px 40px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(230,57,70,0.08);
          border: 1px solid #FFE0B2;
          text-align: center;
        }
        .rp-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #E63946, #FF9F1C);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(230,57,70,0.30);
        }
        .rp-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: #1A1A2E; }
        .rp-desc { font-size: 0.88rem; color: #9090A0; margin-bottom: 32px; line-height: 1.6; }
        .btn-rp {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #E63946, #C1121F);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 30px rgba(230,57,70,0.35);
          transition: transform 0.2s;
        }
        .btn-rp:hover:not(:disabled) { transform: translateY(-2px); }
        .btn-rp:disabled { background: #ccc; cursor: not-allowed; box-shadow: none; }
        .back-to-login { display: block; margin-top: 20px; font-size: 0.85rem; color: #9090A0; }
        .back-to-login a { color: #E63946; font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  )
}
