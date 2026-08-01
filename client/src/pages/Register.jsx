import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const pwStrength = (pw) => {
  if (!pw) return { score:0, label:'', color:'#ddd' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = ['','Weak','Fair','Good','Strong']
  const clr = ['#ddd','#E63946','#FF9F1C','#FFD60A','#22c55e']
  return { score, label:map[score], color:clr[score] }
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ firstName:'', lastName:'', email:'', password:'', confirmPassword:'', role:'user' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState(null)
  const [step, setStep]       = useState(1)

  useEffect(() => {
    if (localStorage.getItem('animverse_token')) navigate('/dashboard', { replace:true })
  }, [navigate])

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const showAlertMsg = (type, msg) => {
    setAlert({ type, msg }); setTimeout(() => setAlert(null), 5000)
  }

  const validateStep1 = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return showAlertMsg('error','Enter your first and last name.'), false
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return showAlertMsg('error','Enter a valid email address.'), false
    return true
  }
  const validateStep2 = () => {
    if (pwStrength(form.password).score < 2) return showAlertMsg('error','Choose a stronger password.'), false
    if (form.password !== form.confirmPassword) return showAlertMsg('error','Passwords do not match.'), false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) { if (validateStep1()) setStep(2); return }
    if (!validateStep2()) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name:`${form.firstName} ${form.lastName}`, email:form.email, password:form.password, role:form.role }) })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('animverse_token', data.token)
        localStorage.setItem('animverse_user', JSON.stringify(data.user))
        showAlertMsg('success','Account created! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1400)
      } else { showAlertMsg('error', data.message || 'Registration failed.') }
    } catch { showAlertMsg('error','Cannot connect to server.') }
    finally { setLoading(false) }
  }

  const pw = pwStrength(form.password)

  const INPUT = {
    width:'100%', padding:'13px 14px 13px 44px', border:'2px solid #FFE0B2', borderRadius:10,
    fontSize:'0.95rem', background:'white', color:'#1A1A2E', boxSizing:'border-box',
    fontFamily:'inherit', outline:'none', transition:'border-color 0.2s',
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'Poppins', -apple-system, sans-serif" }}>

      {/* LEFT VISUAL */}
      <div style={{ background:'linear-gradient(160deg,#1A1A2E 0%,#2D1B69 50%,#E63946 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='24'/%3E%3C/g%3E%3C/svg%3E\")", backgroundRepeat:'repeat', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, color:'white', textAlign:'center', maxWidth:360 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:48, textDecoration:'none' }}>
            <div style={{ width:50, height:50, background:'rgba(255,255,255,0.15)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:'2px solid rgba(255,255,255,0.25)' }}>🎬</div>
            <span style={{ fontSize:'1.5rem', fontWeight:800, color:'white' }}>AnimVerse AI</span>
          </Link>

          <div style={{ fontSize:'5rem', marginBottom:24 }}>🚀</div>
          <h2 style={{ fontSize:'2rem', fontWeight:800, marginBottom:12 }}>Join 25,000+ Creators</h2>
          <p style={{ opacity:0.80, lineHeight:1.7, marginBottom:40, fontSize:'0.9rem' }}>
            Start creating professional animated videos from your stories — completely free.
          </p>

          {[
            ['✅','No credit card required'],
            ['🎨','7 animation styles'],
            ['📖','10,000+ story library'],
            ['📥','MP4 + PDF + SRT export'],
            ['🎮','Built-in relaxation games'],
          ].map(([icon,text],i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12, textAlign:'left' }}>
              <span style={{ fontSize:'1.1rem' }}>{icon}</span>
              <span style={{ fontSize:'0.85rem', fontWeight:500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', background:'#FFFBF0', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#9090A0', fontSize:'0.85rem', fontWeight:500, marginBottom:32, textDecoration:'none' }}>← Back to Home</Link>

          {/* Step indicator */}
          <div style={{ display:'flex', gap:8, marginBottom:28 }}>
            {[1,2].map(s => (
              <div key={s} style={{ flex:1, height:4, borderRadius:4, background: step>=s ? '#E63946' : '#FFE0B2', transition:'background 0.3s' }} />
            ))}
          </div>

          <h1 style={{ fontSize:'1.9rem', fontWeight:800, color:'#1A1A2E', marginBottom:6 }}>
            {step===1 ? 'Create Account' : 'Set Password'}
          </h1>
          <p style={{ fontSize:'0.9rem', color:'#9090A0', marginBottom:28 }}>
            {step===1 ? 'Step 1 of 2 — Your basic info' : 'Step 2 of 2 — Secure your account'}
          </p>

          {alert && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderRadius:10, marginBottom:20, fontSize:'0.88rem', fontWeight:500,
              background: alert.type==='error' ? '#FFEBEE' : '#E8F5E9',
              border: `1px solid ${alert.type==='error' ? '#FFCDD2' : '#A5D6A7'}`,
              color: alert.type==='error' ? '#C1121F' : '#1B5E20',
            }}>
              {alert.type==='error' ? '⚠️' : '✅'} {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 ? (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
                  {[['firstName','👤','First Name'],['lastName','👤','Last Name']].map(([k,ico,lbl]) => (
                    <div key={k}>
                      <label style={{ display:'block', marginBottom:6, fontWeight:600, fontSize:'0.88rem' }}>{lbl}</label>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:'0.95rem', color:'#9090A0' }}>{ico}</span>
                        <input type="text" value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={lbl}
                          style={INPUT} onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor='#FFE0B2'} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>Email Address</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#9090A0' }}>✉️</span>
                    <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com"
                      style={INPUT} onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor='#FFE0B2'} />
                  </div>
                </div>

                <div style={{ marginBottom:28 }}>
                  <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>I am a</label>
                  <div style={{ display:'flex', gap:12 }}>
                    {[['user','🎨 Creator'],['admin','🛡️ Admin']].map(([val,label]) => (
                      <button key={val} type="button" onClick={()=>set('role',val)}
                        style={{ flex:1, padding:'13px', border: form.role===val ? '2px solid #E63946' : '2px solid #FFE0B2', borderRadius:10, background: form.role===val ? '#FFEBEE' : 'white', color: form.role===val ? '#E63946' : '#4A4A6A', fontWeight:700, fontSize:'0.88rem', cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>Create Password</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#9090A0' }}>🔒</span>
                    <input type={showPw?'text':'password'} value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min 8 characters"
                      style={{ ...INPUT, paddingRight:44 }} onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor='#FFE0B2'} />
                    <button type="button" onClick={()=>setShowPw(p=>!p)}
                      style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', color:'#9090A0' }}>
                      {showPw?'🙈':'👁️'}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ marginTop:8 }}>
                      <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                        {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i<=pw.score ? pw.color : '#FFE0B2', transition:'background 0.3s' }} />)}
                      </div>
                      <span style={{ fontSize:'0.78rem', color:pw.color, fontWeight:600 }}>Password Strength: {pw.label}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom:28 }}>
                  <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>Confirm Password</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#9090A0' }}>🔒</span>
                    <input type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} placeholder="Repeat password"
                      style={{ ...INPUT, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#E63946' : '#FFE0B2' }}
                      onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor= form.password!==form.confirmPassword?'#E63946':'#FFE0B2'} />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ fontSize:'0.78rem', color:'#E63946', marginTop:6 }}>⚠️ Passwords don't match</p>
                  )}
                </div>
              </>
            )}

            <div style={{ display:'flex', gap:12 }}>
              {step===2 && (
                <button type="button" onClick={()=>setStep(1)}
                  style={{ flex:1, padding:14, border:'2px solid #FFE0B2', borderRadius:10, background:'white', color:'#4A4A6A', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit' }}>
                  ← Back
                </button>
              )}
              <button type="submit" disabled={loading}
                style={{ flex:2, padding:14, borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit',
                  background: loading ? '#ccc' : 'linear-gradient(135deg,#E63946,#C1121F)',
                  color:'white', fontWeight:700, fontSize:'1rem',
                  boxShadow: loading ? 'none' : '0 8px 30px rgba(230,57,70,0.35)',
                }}>
                {loading ? '⏳ Creating...' : step===1 ? 'Next Step →' : '🚀 Create Account'}
              </button>
            </div>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:'0.88rem', color:'#9090A0' }}>
            Already have an account? <Link to="/login" style={{ color:'#E63946', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
