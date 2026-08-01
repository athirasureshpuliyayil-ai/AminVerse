import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Templates() {
  const navigate = useNavigate()

  const templatesList = [
    { name: "Kids Cartoon", icon: "🧒", bg: "linear-gradient(135deg,#FFD60A,#FF9F1C)", desc: "Vivid, friendly, child-safe style with energetic voiceovers." },
    { name: "Anime", icon: "🌸", bg: "linear-gradient(135deg,#F48FB1,#CE93D8)", desc: "Japanese anime aesthetic with cinematic lighting and dramatic music." },
    { name: "Comic Book", icon: "💥", bg: "linear-gradient(135deg,#E63946,#C1121F)", desc: "Bold line-art, halftones, and action sound effect graphics." },
    { name: "Fantasy", icon: "🧙", bg: "linear-gradient(135deg,#7C3AED,#A78BFA)", desc: "Enchanted glowing atmospheres, mystical soundscapes, and spell FX." },
    { name: "Storybook", icon: "📚", bg: "linear-gradient(135deg,#059669,#34D399)", desc: "Warm paper texture illustrations ideal for bedtime tales." },
    { name: "Cinematic", icon: "🎬", bg: "linear-gradient(135deg,#1E3A5F,#2196F3)", desc: "Photorealistic camera movement, widescreen framing, and orchestral score." },
    { name: "Watercolor", icon: "🎨", bg: "linear-gradient(135deg,#FF9800,#FFC107)", desc: "Soft painted washes and artistic impressionist backgrounds." },
    { name: "Pixar Style", icon: "✨", bg: "linear-gradient(135deg,#E63946,#FF9F1C)", desc: "3D stylized characters with rich lighting and high emotional depth." },
    { name: "Realistic 3D", icon: "🎮", bg: "linear-gradient(135deg,#15803d,#22c55e)", desc: "Unreal Engine-quality environments and realistic character rendering." },
    { name: "Educational Explainer", icon: "🎓", bg: "linear-gradient(135deg,#0284c7,#38bdf8)", desc: "Clear diagrams, engaging narration, and infographic visuals." },
    { name: "Horror & Suspense", icon: "🦇", bg: "linear-gradient(135deg,#312e81,#4338ca)", desc: "Moody shadows, ominous soundscapes, and spine-chilling narration." }
  ]

  return (
    <AppShell title="Animation Style Templates">
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>11+ Professional Style Presets</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Choose a pre-configured template to set the aesthetic tone of your animated video.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {templatesList.map((t, i) => (
              <div key={i} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '140px', background: t.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', marginBottom: '16px' }}>
                    {t.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>{t.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={() => navigate(`/generate?style=${encodeURIComponent(t.name)}`)}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </AppShell>
  )
}


