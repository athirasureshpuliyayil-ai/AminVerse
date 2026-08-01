import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── Static Data ── */
const storiesData = [
  { id:1, title:"The Brave Little Rabbit", author:"AnimVerse Team", category:"fairy", genre:"Fairy Tale", icon:"🐇", color:"#FFD60A", desc:"A tiny rabbit discovers courage when the forest is threatened by a fearsome dragon.", time:"8 min" },
  { id:2, title:"The Golden Lantern", author:"Folk Tales Press", category:"moral", genre:"Moral Story", icon:"🏮", color:"#FF9F1C", desc:"A poor boy's honesty earns him a magical lantern that can fulfill one wish.", time:"6 min" },
  { id:3, title:"Stars of the Deep Ocean", author:"Marina Blue", category:"adventure", genre:"Adventure", icon:"🐬", color:"#4FC3F7", desc:"An oceanographer dives into unexplored underwater caves and discovers a lost civilization.", time:"15 min" },
  { id:4, title:"The Dragon's Secret Garden", author:"Elara Moonwhisper", category:"fantasy", genre:"Fantasy", icon:"🐉", color:"#CE93D8", desc:"A young mage uncovers a hidden garden guarded by a lonely dragon with a painful past.", time:"12 min" },
  { id:5, title:"Midnight at Blackwood Manor", author:"A.K. Vortex", category:"mystery", genre:"Mystery", icon:"🏚️", color:"#546E7A", desc:"A detective is called to investigate the mysterious disappearance of a billionaire in a cursed mansion.", time:"20 min" },
  { id:6, title:"Echo of the Cosmos", author:"Dr. Nebula", category:"scifi", genre:"Sci-Fi", icon:"🚀", color:"#26C6DA", desc:"Earth's last astronaut discovers an alien message that could save — or end — all civilization.", time:"25 min" },
]

const booksData = [
  { title:"Alice in Wonderland", author:"Lewis Carroll", genre:"Fantasy", icon:"🐰", color:"#E8F5E9" },
  { title:"Treasure Island", author:"R.L. Stevenson", genre:"Adventure", icon:"🏴‍☠️", color:"#FFF3E0" },
  { title:"The Secret Garden", author:"F. Burnett", genre:"Classic", icon:"🌹", color:"#FCE4EC" },
  { title:"Journey to the Moon", author:"Jules Verne", genre:"Sci-Fi", icon:"🌙", color:"#E3F2FD" },
  { title:"Arabian Nights", author:"Anonymous", genre:"Folk Tales", icon:"🕌", color:"#FFF9C4" },
  { title:"Dracula", author:"Bram Stoker", genre:"Horror", icon:"🧛", color:"#F3E5F5" },
  { title:"Sherlock Holmes", author:"Arthur Conan Doyle", genre:"Mystery", icon:"🔍", color:"#E0F2F1" },
  { title:"Little Women", author:"Louisa May Alcott", genre:"Classic", icon:"📖", color:"#FBE9E7" },
]

const templatesData = [
  { name:"Kids Cartoon", icon:"🧒", bg:"linear-gradient(135deg,#FFD60A,#FF9F1C)" },
  { name:"Anime", icon:"🌸", bg:"linear-gradient(135deg,#F48FB1,#CE93D8)" },
  { name:"Comic Book", icon:"💥", bg:"linear-gradient(135deg,#E63946,#C1121F)" },
  { name:"Fantasy", icon:"🧙", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)" },
  { name:"Storybook", icon:"📚", bg:"linear-gradient(135deg,#059669,#34D399)" },
  { name:"Cinematic", icon:"🎬", bg:"linear-gradient(135deg,#1E3A5F,#2196F3)" },
  { name:"Watercolor", icon:"🎨", bg:"linear-gradient(135deg,#FF9800,#FFC107)" },
  { name:"Pixar Style", icon:"✨", bg:"linear-gradient(135deg,#E63946,#FF9F1C)" },
]

const faqs = [
  { q:"What is AnimVerse AI?", a:"AnimVerse AI is an intelligent prompt-to-animation platform that converts text prompts, stories, books, and novels into fully animated videos using artificial intelligence — including AI-generated images, voices, music, and sound effects." },
  { q:"Do I need any animation or technical skills?", a:"No! AnimVerse AI is designed for everyone. Simply type your story idea or paste any text and the AI handles all the technical work — scene creation, character design, voice generation, and video production." },
  { q:"How long does it take to generate an animation?", a:"A typical 2-5 minute animation takes about 3-8 minutes to generate, depending on the story complexity, number of scenes, and selected animation style." },
  { q:"What formats can I download?", a:"You can download your animation as an MP4 Video, a Storyboard PDF, a Script Document, and a Subtitle file (.srt) for use on various platforms." },
  { q:"Is AnimVerse AI suitable for children?", a:"Absolutely! We have a dedicated Children's Section in our Story Library with Fairy Tales, Moral Stories, Bedtime Stories, and Educational content — all age-appropriate and child-safe." },
  { q:"Can I use AnimVerse for commercial projects?", a:"Yes! Pro and Business plan users get full commercial licensing on all generated animations. Please review our Terms of Service for detailed licensing information." },
]

export default function Home() {
  const navigate = useNavigate()
  const [loaderHidden, setLoaderHidden] = useState(false)
  const [storyFilter, setStoryFilter] = useState('all')
  const [openFaq, setOpenFaq] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [activePromptBtn, setActivePromptBtn] = useState(null)
  const [scrollTop, setScrollTop] = useState(false)
  const [counters, setCounters] = useState({ c1: 0, c2: 0, c3: 0, c4: 0 })
  const statsBannerRef = useRef(null)
  const countedRef = useRef(false)

  /* Page loader */
  useEffect(() => {
    const t = setTimeout(() => setLoaderHidden(true), 800)
    return () => clearTimeout(t)
  }, [])

  /* Scroll-to-top button */
  useEffect(() => {
    const onScroll = () => setScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Counter animation on stats banner */
  useEffect(() => {
    const targets = [50000, 10000, 25000, 98]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !countedRef.current) {
          countedRef.current = true
          targets.forEach((target, i) => {
            const key = `c${i + 1}`
            const duration = 2000, step = target / (duration / 16)
            let current = 0
            const timer = setInterval(() => {
              current += step
              if (current >= target) { current = target; clearInterval(timer) }
              setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
            }, 16)
          })
        }
      })
    }, { threshold: 0.3 })
    if (statsBannerRef.current) observer.observe(statsBannerRef.current)
    return () => observer.disconnect()
  }, [])

  const filteredStories = storyFilter === 'all' ? storiesData : storiesData.filter(s => s.category === storyFilter)

  const setQuickPrompt = (text, i) => { setPrompt(text); setActivePromptBtn(i) }

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const formatCounter = (val, i) => i === 3 ? `${val}%` : `${val.toLocaleString()}+`

  return (
    <>
      {/* Page Loader */}
      <div className={`page-loader${loaderHidden ? ' hidden' : ''}`}>
        <div className="loader-logo">🎬</div>
        <div className="loader-spinner" />
      </div>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {['🎬 AI-Powered Animation\u00A0•', '📖 10,000+ Stories in Library\u00A0•', '🎙️ Smart Voice Generation\u00A0•',
            '🎵 Emotion-Based Music\u00A0•', '🎨 7 Animation Styles\u00A0•', '📥 Download MP4 & PDF Storyboard\u00A0•',
            '🌍 Multilingual Support Coming Soon\u00A0•',
            '🎬 AI-Powered Animation\u00A0•', '📖 10,000+ Stories in Library\u00A0•', '🎙️ Smart Voice Generation\u00A0•',
            '🎵 Emotion-Based Music\u00A0•', '🎨 7 Animation Styles\u00A0•', '📥 Download MP4 & PDF Storyboard\u00A0•',
            '🌍 Multilingual Support Coming Soon\u00A0•'].map((t, i) => (
            <span className="ticker-item" key={i}>{t}</span>
          ))}
        </div>
      </div>

      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge"><div className="dot" />🚀 AI-Powered Animation Platform — Now Live!</div>
              <h1 className="hero-title">
                Turn Any Story Into a<br />
                <span className="highlight">Stunning Animation</span><br />
                in Minutes
              </h1>
              <p className="hero-desc">
                Type your story, paste a book chapter, or pick from our 10,000+ story library.
                AnimVerse AI handles everything — characters, scenes, voices, music, and exports
                your animation as a downloadable MP4 video.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg"><i className="fas fa-magic" /> Start Creating Free</Link>
                <a href="#how-it-works" className="btn btn-secondary btn-lg"><i className="fas fa-play-circle" /> See How It Works</a>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><div className="stat-num">50K+</div><div className="stat-label">Animations Created</div></div>
                <div className="stat-item"><div className="stat-num">10K+</div><div className="stat-label">Stories in Library</div></div>
                <div className="stat-item"><div className="stat-num">7</div><div className="stat-label">Animation Styles</div></div>
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/hero.png" alt="AnimVerse AI Hero"
                onError={e => { e.target.src = 'https://via.placeholder.com/600x450/FFD60A/E63946?text=AnimVerse+AI' }} />
              <div className="floating-card floating-card-1">
                <div className="fc-icon">🤖</div>
                <div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>AI Processing</div><div>Scene Generated!</div></div>
              </div>
              <div className="floating-card floating-card-2">
                <div className="fc-icon">🎬</div>
                <div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Animation Ready</div><div>Download MP4</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK PROMPT ── */}
      <section className="prompt-section section-white">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div className="section-badge"><i className="fas fa-wand-magic-sparkles" /> Try It Now</div>
            <h2 className="section-title">Generate Your First Animation</h2>
            <p className="section-subtitle">Enter a prompt below and experience the magic of AI storytelling</p>
          </div>
          <div className="prompt-box">
            <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'16px',alignItems:'flex-start'}}>
              <div>
                <textarea className="prompt-textarea" id="heroPrompt" value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="✨ Try something like: 'A brave little girl discovers a hidden magical garden where flowers can talk and animals hold secret meetings...'" />
                <div className="prompt-options">
                  <span style={{fontSize:'0.8rem',color:'var(--text-muted)',fontWeight:600,alignSelf:'center'}}>Quick prompts:</span>
                  {[
                    {label:'🐇 Rabbit & Dragon', text:"A brave rabbit saves the forest from an evil dragon 🐇🐉"},
                    {label:'👸 Princess Story', text:"A little princess finds a magic lamp in the old palace 🏰✨"},
                    {label:'🚀 Space Adventure', text:"A young astronaut explores an alien planet with friendly creatures 🚀👾"},
                    {label:'🔍 Mystery', text:"A mystery detective unravels the secret of the haunted mansion 🔍🏚️"},
                  ].map((p, i) => (
                    <button key={i} className={`prompt-option-btn${activePromptBtn === i ? ' active' : ''}`}
                      onClick={() => setQuickPrompt(p.text, i)}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'12px',minWidth:'180px'}}>
                <Link to="/register" className="btn btn-primary" style={{width:'100%'}}>
                  <i className="fas fa-magic" /> Generate Animation
                </Link>
                <select className="form-control" style={{fontSize:'0.82rem'}} disabled>
                  <option>🎨 Cartoon Style</option>
                  <option>🌸 Anime Style</option>
                  <option>🦸 Comic Style</option>
                  <option>🧙 Fantasy Style</option>
                  <option>✨ Pixar Style</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-padding section-alt" id="features" style={{background:'var(--light-bg)'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'56px'}}>
            <div className="section-badge"><i className="fas fa-star" /> Platform Features</div>
            <h2 className="section-title">Everything You Need to Create<br /><span>World-Class Animations</span></h2>
            <p className="section-subtitle">From story generation to final video export — AnimVerse AI handles every step.</p>
          </div>
          <div className="features-grid">
            {[
              {icon:'🤖', title:'AI Story Generator', desc:'Enter any prompt and our AI instantly creates a complete story with characters, dialogues, and scenes.'},
              {icon:'🎨', title:'7 Animation Styles', desc:'Choose from Cartoon, Anime, Comic, Fantasy, Pixar, Cinematic, or Watercolor to match your story\'s mood.'},
              {icon:'🎙️', title:'AI Voice Generation', desc:'Generate narrator & character voices with emotions — Happy, Sad, Angry, Excited — in multiple tones.'},
              {icon:'🎵', title:'Smart Background Music', desc:'AI auto-selects emotion-based background music — Adventure, Horror, Romance, Fantasy — based on your story.'},
              {icon:'🎭', title:'Character Consistency', desc:'AI maintains character appearance, personality, and voice across all scenes throughout your animation.'},
              {icon:'🌩️', title:'Contextual Sound FX', desc:'Rain, thunder, fire, ocean, footsteps — AI automatically adds contextual sound effects based on each scene.'},
              {icon:'📖', title:'Digital Story Library', desc:'Access 10,000+ curated stories — Children\'s Tales, Adult Fiction, Educational Books, Novels, and more.'},
              {icon:'📋', title:'Storyboard PDF Export', desc:'Download your animation as a professional storyboard PDF with scene images, dialogues, and narrations.'},
              {icon:'📥', title:'Multi-Format Download', desc:'Export as MP4 Video, Storyboard PDF, Script Document, or Subtitle SRT file for maximum flexibility.'},
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-padding" id="how-it-works" style={{background:'white'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'56px'}}>
            <div className="section-badge"><i className="fas fa-cogs" /> Simple Process</div>
            <h2 className="section-title">Create an Animation in<br /><span>4 Easy Steps</span></h2>
          </div>
          <div className="steps-grid">
            {[
              {n:'1', icon:'✍️', title:'Enter Your Prompt', desc:'Type your story idea, paste a book passage, upload a text file, or select from our story library.'},
              {n:'2', icon:'🤖', title:'AI Generates Story', desc:'Our AI creates characters, scenes, dialogues, narrations, and identifies emotions for each part of the story.'},
              {n:'3', icon:'🎛️', title:'Customize Everything', desc:'Choose animation style, voice type, music theme, subtitle font, color palette, and transition effects.'},
              {n:'4', icon:'🎬', title:'Download & Share', desc:'Preview your animation, make tweaks, then download your MP4 video, storyboard PDF, and subtitle file.'},
            ].map((s, i) => (
              <div className="step-card card" key={i}>
                <div className="step-number">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < 3 && <i className="fas fa-chevron-right step-connector" />}
              </div>
            ))}
          </div>
          <div className="text-center" style={{marginTop:'48px'}}>
            <Link to="/register" className="btn btn-primary btn-lg"><i className="fas fa-rocket" /> Start Your First Animation Free</Link>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="stats-banner" ref={statsBannerRef}>
        <div className="container">
          <div className="stats-inner">
            {['Animations Created','Stories in Library','Happy Users','% Satisfaction Rate'].map((label, i) => (
              <div key={i}>
                <span className="stat-banner-num">{formatCounter(counters[`c${i+1}`] || 0, i)}</span>
                <span className="stat-banner-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY LIBRARY ── */}
      <section className="section-padding" id="library" style={{background:'var(--light-bg)'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'40px'}}>
            <div className="section-badge"><i className="fas fa-book-open" /> Digital Story Library</div>
            <h2 className="section-title">Explore Our Vast <span>Story Collection</span></h2>
            <p className="section-subtitle">10,000+ curated stories ready to be transformed into animations</p>
          </div>
          <div className="category-tabs">
            {[
              {cat:'all', label:'📚 All Stories'},
              {cat:'fairy', label:'🧚 Fairy Tales'},
              {cat:'moral', label:'💡 Moral Stories'},
              {cat:'adventure', label:'⚔️ Adventure'},
              {cat:'fantasy', label:'🧙 Fantasy'},
              {cat:'mystery', label:'🔍 Mystery'},
              {cat:'scifi', label:'🚀 Sci-Fi'},
              {cat:'romance', label:'❤️ Romance'},
            ].map(({cat, label}) => (
              <button key={cat} className={`cat-tab${storyFilter === cat ? ' active' : ''}`}
                onClick={() => setStoryFilter(cat)}>{label}</button>
            ))}
          </div>
          <div className="story-grid">
            {filteredStories.map(s => (
              <div className="story-card" key={s.id} onClick={() => navigate('/login')}>
                <div className="story-card-cover" style={{background:`linear-gradient(135deg, ${s.color}30, ${s.color}60)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem'}}>{s.icon}</div>
                <div className="story-card-body">
                  <div className="story-card-category">{s.genre}</div>
                  <h3 className="story-card-title">{s.title}</h3>
                  <div className="story-card-author">by {s.author}</div>
                  <p style={{fontSize:'0.82rem',color:'var(--text-secondary)',lineHeight:1.5,marginBottom:'12px'}}>{s.desc}</p>
                  <div className="story-card-meta">
                    <span><i className="fas fa-clock" style={{color:'var(--primary)'}} /> {s.time}</span>
                  </div>
                  <div className="story-card-actions">
                    <Link to="/login" className="btn btn-primary btn-sm" style={{flex:1}}><i className="fas fa-magic" /> Animate</Link>
                    <Link to="/login" className="btn btn-outline btn-sm"><i className="fas fa-book-open" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{marginTop:'48px'}}>
            <Link to="/login" className="btn btn-primary btn-lg"><i className="fas fa-book" /> Browse Full Library</Link>
          </div>
        </div>
      </section>

      {/* ── POPULAR BOOKS ── */}
      <section className="section-padding" style={{background:'white'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'36px',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <div className="section-badge" style={{marginBottom:'8px'}}><i className="fas fa-fire" /> Trending Now</div>
              <h2 className="section-title" style={{marginBottom:0}}>Popular Books & Novels</h2>
            </div>
            <Link to="/login" className="btn btn-outline">View All Books <i className="fas fa-arrow-right" /></Link>
          </div>
          <div className="books-scroll">
            {booksData.map((b, i) => (
              <div className="book-card" key={i} onClick={() => navigate('/login')}>
                <div className="book-cover" style={{background:b.color}}>{b.icon}</div>
                <div className="book-info">
                  <div className="book-title">{b.title}</div>
                  <div className="book-author">{b.author}</div>
                  <div className="book-genre">{b.genre}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="section-padding" id="templates" style={{background:'var(--light-bg)'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'56px'}}>
            <div className="section-badge"><i className="fas fa-palette" /> Animation Templates</div>
            <h2 className="section-title">Choose Your <span>Animation Style</span></h2>
            <p className="section-subtitle">Pick from 7 professionally designed styles to bring your story to life</p>
          </div>
          <div className="templates-grid">
            {templatesData.map((t, i) => (
              <div className="template-card" key={i} onClick={() => navigate('/register')}>
                <div className="template-visual" style={{background:t.bg}}>{t.icon}</div>
                <div className="template-card-label">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding" id="testimonials" style={{background:'white'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'56px'}}>
            <div className="section-badge"><i className="fas fa-heart" /> User Reviews</div>
            <h2 className="section-title">Loved by <span>Creators Worldwide</span></h2>
          </div>
          <div className="testimonials-grid">
            {[
              {stars:'★★★★★', text:'"AnimVerse AI is absolutely incredible! I turned my daughter\'s bedtime story into a beautiful cartoon animation in just 10 minutes. She was so excited to see her story come alive!"', name:'Priya Nair', role:'Parent & Teacher, Kerala', av:'P'},
              {stars:'★★★★★', text:'"As a YouTuber creating animated content, this tool has saved me weeks of work. The AI voice generation and character consistency features are game-changers!"', name:'Arjun Mehta', role:'Content Creator, Mumbai', av:'A'},
              {stars:'★★★★⭐', text:'"The story library is amazing — I found classics I read as a child and converted them into animations for my classroom. Students are more engaged than ever before!"', name:'Sunita Sharma', role:'School Teacher, Delhi', av:'S'},
              {stars:'★★★★★', text:'"I\'m an aspiring novelist. AnimVerse helped me create a promotional animation for my book launch. The cinematic style made it look incredibly professional!"', name:'Rahul Krishnan', role:'Author & Storyteller', av:'R'},
              {stars:'★★★★★', text:'"The emotion-based music selection is brilliant. When my mystery story gets intense, the music automatically shifts to create the perfect atmosphere. Pure magic!"', name:'Maya Patel', role:'Animation Student', av:'M'},
              {stars:'★★★★★', text:'"We used AnimVerse AI to create animated explainer videos for our NGO\'s health education campaigns. The impact on rural communities has been phenomenal!"', name:'Dr. Deepa Menon', role:'NGO Director, Bangalore', av:'D'},
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">{t.stars}</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.av}</div>
                  <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding" id="faq" style={{background:'var(--light-bg)'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom:'48px'}}>
            <div className="section-badge"><i className="fas fa-question-circle" /> FAQ</div>
            <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <div className={`faq-question${openFaq === i ? ' open' : ''}`} onClick={() => toggleFaq(i)}>
                  {f.q} <i className={`fas fa-chevron-down faq-icon`} />
                </div>
                <div className={`faq-answer${openFaq === i ? ' open' : ''}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Bring Your Story to Life?</h2>
          <p>Join 25,000+ creators who are already making amazing animations with AnimVerse AI</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-secondary btn-lg"><i className="fas fa-magic" /> Start Creating Free</Link>
            <Link to="/login" className="btn btn-white btn-lg"><i className="fas fa-sign-in-alt" /> Login to Dashboard</Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to top */}
      <button className={`scroll-top${scrollTop ? ' visible' : ''}`} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
        <i className="fas fa-chevron-up" />
      </button>
    </>
  )
}
