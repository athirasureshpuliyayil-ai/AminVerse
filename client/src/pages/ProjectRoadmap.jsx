import { useState } from 'react'
import AppShell from '../components/AppShell'

// 1. RISK ASSESSMENT REGISTER DATA (Image 1)
const RISK_REGISTER = [
  {
    id: 'R1',
    description: 'AI Video Generation Rate-Limiting & Concurrency Bottlenecks',
    category: 'Technical / API',
    probability: 4,
    impact: 4,
    score: 16,
    level: 'Critical',
    owner: 'Swami',
    mitigation: 'Implement background async dispatch queue, per-user rate-limiting, and request idempotency checks.',
    contingency: 'Fallback to frame caching mode or queue updates with email notification during peak rendering spikes.'
  },
  {
    id: 'R2',
    description: 'LangGraph / LangChain Supervisor Infinite Handoff Loops & Multi-Agent Deadlocks',
    category: 'AI Orchestration',
    probability: 3,
    impact: 5,
    score: 15,
    level: 'Critical',
    owner: 'Fahad',
    mitigation: 'Enforce max-recursion limits in LangGraph, deterministic agent prompts, and strict handoff schemas.',
    contingency: 'Supervisor forcibly interrupts turn and returns structured error response to user after 5 transfers.'
  },
  {
    id: 'R3',
    description: 'Third-Party AI Token Expiration & Quotas (OpenAI / HuggingFace / ElevenLabs)',
    category: 'External Integration',
    probability: 4,
    impact: 3,
    score: 12,
    level: 'Medium',
    owner: 'Arunima',
    mitigation: 'Implement auto-refresh token managers, gateway protocols with exponential backoff and retries.',
    contingency: 'Notify user via dashboard to re-authenticate OAuth token or switch to local TTS voice fallback.'
  },
  {
    id: 'R4',
    description: 'Unintended Outbound Action Execution (Story Publish / Social Sharing)',
    category: 'User Safety',
    probability: 3,
    impact: 4,
    score: 12,
    level: 'Medium',
    owner: 'Anandhakrishnan',
    mitigation: 'Implement mandatory human-in-the-loop interrupt gating before executing write/export actions.',
    contingency: 'Prompt user with confirmation preview modal in app before dispatching final publish payload.'
  },
  {
    id: 'R5',
    description: 'Database Checkpointer Concurrency Locks & State Corruption',
    category: 'Persistence',
    probability: 2,
    impact: 4,
    score: 8,
    level: 'Medium',
    owner: 'Swami & Fahad',
    mitigation: 'Configure MongoDB transaction sessions with write concern and atomic document updates.',
    contingency: 'Restore latest conversation state checkpoint from automated daily database snapshots.'
  }
]

// 2. GANTT CHART SCHEDULE DATA (Image 2)
const WEEKS = ['Jul W3', 'Jul W4', 'Aug W1', 'Aug W2', 'Aug W3', 'Aug W4', 'Sep W1', 'Sep W2', 'Sep W3', 'Sep W4', 'Oct W1 (NOW)', 'Oct W2', 'Oct W3']

const GANTT_SCHEDULE = [
  { id: '1.0', task: 'Foundation & API Ingress', owner: 'Swami', start: '2026-07-20', end: '2026-08-09', duration: '21d', status: 'Completed', progress: 100, activeWeeks: [0, 1, 2] },
  { id: '1.1', task: 'Pydantic Config & LLM Factory', owner: 'Swami', start: '2026-07-20', end: '2026-07-26', duration: '7d', status: 'Completed', progress: 100, activeWeeks: [0] },
  { id: '1.2', task: 'Express Webhook & Client API', owner: 'Swami', start: '2026-07-27', end: '2026-08-09', duration: '14d', status: 'Completed', progress: 100, activeWeeks: [1, 2] },
  { id: '2.0', task: 'Orchestration & Supervisor', owner: 'Fahad', start: '2026-08-10', end: '2026-08-23', duration: '14d', status: 'Completed', progress: 100, activeWeeks: [3, 4] },
  { id: '2.1', task: 'Story Router & LangChain State', owner: 'Fahad', start: '2026-08-10', end: '2026-08-16', duration: '7d', status: 'Completed', progress: 100, activeWeeks: [3] },
  { id: '2.2', task: 'Worker Hand-off Infrastructure', owner: 'Fahad', start: '2026-08-17', end: '2026-08-23', duration: '7d', status: 'Completed', progress: 100, activeWeeks: [4] },
  { id: '3.0', task: 'Animation & Voice Engine', owner: 'Arunima', start: '2026-08-24', end: '2026-09-20', duration: '28d', status: 'Completed', progress: 100, activeWeeks: [5, 6, 7, 8] },
  { id: '3.1', task: 'Script & Scene Generator Service', owner: 'Arunima', start: '2026-08-24', end: '2026-09-06', duration: '14d', status: 'Completed', progress: 100, activeWeeks: [5, 6] },
  { id: '3.2', task: 'Voice Synthesis & Audio Sync', owner: 'Arunima', start: '2026-09-07', end: '2026-09-20', duration: '14d', status: 'Completed', progress: 100, activeWeeks: [7, 8] },
  { id: '4.0', task: 'Interactive Hub & Game Integration', owner: 'Anandhakrishnan', start: '2026-09-21', end: '2026-10-07', duration: '17d', status: 'In Progress', progress: 80, activeWeeks: [9, 10, 11] },
  { id: '4.1', task: 'Story Quiz & Contest Engine', owner: 'Anandhakrishnan', start: '2026-09-21', end: '2026-09-27', duration: '7d', status: 'Completed', progress: 100, activeWeeks: [9] },
  { id: '4.2', task: 'Game Hub & Relax Canvas', owner: 'Anandhakrishnan', start: '2026-09-28', end: '2026-10-07', duration: '10d', status: 'In Progress', progress: 60, activeWeeks: [10, 11] },
  { id: '5.0', task: 'Hardening & Deployment', owner: 'Swami & Fahad', start: '2026-10-08', end: '2026-10-21', duration: '14d', status: 'In Progress', progress: 30, activeWeeks: [11, 12] },
  { id: '5.1', task: 'Interrupt Gating & Security', owner: 'Arunima', start: '2026-10-08', end: '2026-10-14', duration: '7d', status: 'In Progress', progress: 40, activeWeeks: [11] },
  { id: '5.2', task: 'Setup Scripts & Docker Deploy', owner: 'Swami & Fahad', start: '2026-10-15', end: '2026-10-21', duration: '7d', status: 'Planned', progress: 20, activeWeeks: [12] }
]

// 3. WORK BREAKDOWN STRUCTURE (WBS) DATA (Image 3)
const WBS_TABLE = [
  { id: '1.0', phase: 'Foundation & Infrastructure', module: '1.1 Environment & Configuration', workPackage: 'Typed Settings', description: 'Configure pydantic-settings, environment variables, and secret handling' },
  { id: '1.0', phase: 'Foundation & Infrastructure', module: '1.2 LLM Abstraction Layer', workPackage: 'LLM Factory', description: 'Build provider-agnostic LLM initialization factory for script & scene generation' },
  { id: '1.0', phase: 'Foundation & Infrastructure', module: '1.3 Persistence & Memory', workPackage: 'Mongo State Saver', description: 'Implement AsyncStateSaver / Mongo checkpointing for story state persistence' },
  { id: '1.0', phase: 'Foundation & Infrastructure', module: '1.4 Observability', workPackage: 'Logging & Tracing', description: 'Setup structured JSON logging correlation IDs and performance tracing' },
  { id: '2.0', phase: 'Ingress Channel & API', module: '2.1 Express Webhook', workPackage: 'Webhook Engine', description: 'Build payload validation rate-limiting and request idempotency checks' },
  { id: '2.0', phase: 'Ingress Channel & API', module: '2.2 Client Gateway', workPackage: 'API Client Gateway', description: 'Async HTTP client for message dispatch and Markdown/video rendering fallback' },
  { id: '3.0', phase: 'Multi-Agent Orchestration', module: '3.1 Supervisor Manager', workPackage: 'Manager Supervisor', description: 'Implement router node for task breakdown handoffs and output verification' },
  { id: '3.0', phase: 'Multi-Agent Orchestration', module: '3.2 Action Approval System', workPackage: 'Interrupt Gating', description: 'Human-in-the-loop gating for outbound story publish actions and state resumption' },
  { id: '4.0', phase: 'Vertical Domain Workers', module: '4.1 Script Engine Worker', workPackage: 'Script Generator Integration', description: 'Script worker agent for character prompt resolution and scene breakdown' },
  { id: '4.0', phase: 'Vertical Domain Workers', module: '4.2 Animation Render Worker', workPackage: 'Keyframe Generator Gateway', description: 'Animation worker agent for image synthesis, frame interpolation, and video export' },
  { id: '4.0', phase: 'Vertical Domain Workers', module: '4.3 Audio & Voice Worker', workPackage: 'TTS & Voice Gateway', description: 'Voice worker agent for text-to-speech voice generation and BGM synchronization' },
  { id: '4.0', phase: 'Vertical Domain Workers', module: '4.4 Game & Contest Worker', workPackage: 'Interactive Hub Gateway', description: 'Mini-game agent, story quiz builder, and contest management tools' },
  { id: '5.0', phase: 'Quality & Deployment', module: '5.1 Verification Suite', workPackage: 'Automated Testing', description: 'Unit and integration testing suite, code linting, and schema validation' },
  { id: '5.0', phase: 'Quality & Deployment', module: '5.2 Setup Scripts', workPackage: 'Setup Automation', description: 'One-time admin account creation script and DB initialization triggers' },
  { id: '5.0', phase: 'Quality & Deployment', module: '5.3 Containerization', workPackage: 'Docker Environment', description: 'Container definition (Dockerfile) and multi-container setup (docker-compose)' }
]

export default function ProjectRoadmap() {
  const [activeTab, setActiveTab] = useState('risk') // 'risk' | 'gantt' | 'wbs'
  const [searchQuery, setSearchQuery] = useState('')

  // Level Badge Colors for Risk Table
  const getRiskBadgeStyle = (level) => {
    if (level === 'Critical') return { background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5' }
    if (level === 'High') return { background: '#FFEDD5', color: '#EA580C', border: '1px solid #FDBA74' }
    return { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }
  }

  // Status Badge for Gantt Chart
  const getStatusBadgeStyle = (status) => {
    if (status === 'Completed') return { background: '#DCFCE7', color: '#16A34A' }
    if (status === 'In Progress') return { background: '#DBEAFE', color: '#2563EB' }
    return { background: '#F3F4F6', color: '#4B5563' }
  }

  // Filtered lists based on search query
  const filteredRisks = RISK_REGISTER.filter(r =>
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGantt = GANTT_SCHEDULE.filter(g =>
    g.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.id.includes(searchQuery)
  )

  const filteredWbs = WBS_TABLE.filter(w =>
    w.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.workPackage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell title="Project Governance Forms">

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px', color: '#1A1A2E' }}>
              📊 AnimVerse AI — Project Governance & Execution Suite
            </h1>
            <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem' }}>
              Comprehensive Risk Matrix, Implementation Schedule Gantt Chart, and Work Breakdown Structure (WBS) for Capstone Project 2025.
            </p>
          </div>

          {/* Search bar */}
          <input
            type="text"
            placeholder="🔍 Search tasks, risks, packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px', borderRadius: 10, border: '1.5px solid #CBD5E1',
              fontSize: '0.88rem', width: 280, outline: 'none', background: 'white'
            }}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '2px solid #E2E8F0', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('risk')}
          style={{
            padding: '12px 24px', borderRadius: 10, fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', border: 'none',
            background: activeTab === 'risk' ? 'linear-gradient(135deg,#E63946,#C1121F)' : '#F1F5F9',
            color: activeTab === 'risk' ? 'white' : '#475569',
            boxShadow: activeTab === 'risk' ? '0 4px 14px rgba(230,57,70,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          ⚠️ 1. Risk Assessment Register
        </button>

        <button
          onClick={() => setActiveTab('gantt')}
          style={{
            padding: '12px 24px', borderRadius: 10, fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', border: 'none',
            background: activeTab === 'gantt' ? 'linear-gradient(135deg,#1E3A8A,#2563EB)' : '#F1F5F9',
            color: activeTab === 'gantt' ? 'white' : '#475569',
            boxShadow: activeTab === 'gantt' ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          📅 2. Gantt Schedule & Timeline
        </button>

        <button
          onClick={() => setActiveTab('wbs')}
          style={{
            padding: '12px 24px', borderRadius: 10, fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', border: 'none',
            background: activeTab === 'wbs' ? 'linear-gradient(135deg,#0F766E,#0D9488)' : '#F1F5F9',
            color: activeTab === 'wbs' ? 'white' : '#475569',
            boxShadow: activeTab === 'wbs' ? '0 4px 14px rgba(13,148,136,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
        >
          🧩 3. Work Breakdown Structure (WBS)
        </button>
      </div>

      {/* TAB 1: RISK ASSESSMENT REGISTER */}
      {activeTab === 'risk' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 24px', background: '#0F172A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
              🛡️ Risk Assessment Register — AnimVerse AI Platform
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#1E293B', padding: '4px 12px', borderRadius: 20, color: '#94A3B8' }}>
              Risk Score = Probability (1-5) × Impact (1-5)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: 'white', borderBottom: '2px solid #334155' }}>
                  <th style={{ padding: '12px 14px', width: 70, textAlign: 'center' }}>Risk ID</th>
                  <th style={{ padding: '12px 14px', width: 220 }}>Risk Description</th>
                  <th style={{ padding: '12px 14px', width: 140 }}>Category</th>
                  <th style={{ padding: '12px 14px', width: 90, textAlign: 'center' }}>Probability (1-5)</th>
                  <th style={{ padding: '12px 14px', width: 90, textAlign: 'center' }}>Impact (1-5)</th>
                  <th style={{ padding: '12px 14px', width: 90, textAlign: 'center' }}>Risk Score</th>
                  <th style={{ padding: '12px 14px', width: 100, textAlign: 'center' }}>Risk Level</th>
                  <th style={{ padding: '12px 14px', width: 110 }}>Risk Owner</th>
                  <th style={{ padding: '12px 14px' }}>Mitigation Plan</th>
                  <th style={{ padding: '12px 14px' }}>Contingency Plan</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center', color: '#1E293B' }}>{r.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{r.description}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{r.category}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{r.probability}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>{r.impact}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 900, color: r.score >= 15 ? '#DC2626' : '#D97706', fontSize: '0.98rem' }}>
                      {r.score}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 12, fontWeight: 800, fontSize: '0.75rem', ...getRiskBadgeStyle(r.level) }}>
                        {r.level}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>{r.owner}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontSize: '0.82rem', lineHeight: 1.4 }}>{r.mitigation}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontSize: '0.82rem', lineHeight: 1.4 }}>{r.contingency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GANTT CHART SCHEDULE */}
      {activeTab === 'gantt' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 24px', background: '#0F172A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
              📅 Project Implementation Schedule & Gantt Chart
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#1E293B', padding: '4px 12px', borderRadius: 20, color: '#94A3B8' }}>
              Timeline Range: July 2026 – October 2026
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left', minWidth: 1200 }}>
              <thead>
                <tr style={{ background: '#1E293B', color: 'white', borderBottom: '2px solid #334155' }}>
                  <th style={{ padding: '10px 12px', width: 60, textAlign: 'center' }}>WBS ID</th>
                  <th style={{ padding: '10px 12px', width: 220 }}>Task / Deliverable</th>
                  <th style={{ padding: '10px 12px', width: 110 }}>Owner</th>
                  <th style={{ padding: '10px 12px', width: 85 }}>Start Date</th>
                  <th style={{ padding: '10px 12px', width: 85 }}>End Date</th>
                  <th style={{ padding: '10px 12px', width: 65, textAlign: 'center' }}>Duration</th>
                  <th style={{ padding: '10px 12px', width: 95, textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '10px 12px', width: 70, textAlign: 'center' }}>Progress</th>
                  {/* Timeline columns */}
                  {WEEKS.map((w, idx) => (
                    <th key={w} style={{
                      padding: '8px 4px', width: 55, textAlign: 'center', fontSize: '0.72rem',
                      background: idx === 10 ? '#C2410C' : '#1E293B', color: idx === 10 ? '#FFEDD5' : 'white',
                      fontWeight: idx === 10 ? 900 : 700
                    }}>
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGantt.map((g, i) => (
                  <tr key={g.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center', color: '#1E293B' }}>{g.id}</td>
                    <td style={{ padding: '10px 12px', fontWeight: g.id.endsWith('.0') ? 800 : 600, color: g.id.endsWith('.0') ? '#0F172A' : '#334155' }}>
                      {g.task}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{g.owner}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#64748B' }}>{g.start}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: '#64748B' }}>{g.end}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{g.duration}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 10, fontSize: '0.73rem', fontWeight: 800, ...getStatusBadgeStyle(g.status) }}>
                        {g.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: g.progress === 100 ? '#16A34A' : '#2563EB' }}>
                      {g.progress}%
                    </td>
                    {/* Gantt Bar Visualization */}
                    {WEEKS.map((_, idx) => {
                      const isActive = g.activeWeeks.includes(idx)
                      const isNow = idx === 10
                      let barBg = '#2563EB' // default blue
                      if (g.status === 'Completed') barBg = '#2563EB'
                      else if (g.status === 'In Progress') barBg = '#EA580C'
                      else barBg = '#94A3B8'

                      return (
                        <td key={idx} style={{ padding: 2, textAlign: 'center', background: isNow ? 'rgba(234,88,12,0.06)' : 'transparent', borderLeft: '1px solid #F1F5F9' }}>
                          {isActive && (
                            <div style={{
                              height: 18, borderRadius: 4, background: barBg,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                            }} />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WORK BREAKDOWN STRUCTURE (WBS) */}
      {activeTab === 'wbs' && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #CBD5E1', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 24px', background: '#0F172A', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
              🧩 Work Breakdown Structure (WBS Matrix)
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#1E293B', padding: '4px 12px', borderRadius: 20, color: '#94A3B8' }}>
              5 Core Phases & 15 Work Packages
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#1E293B', color: 'white', borderBottom: '2px solid #334155' }}>
                  <th style={{ padding: '12px 14px', width: 70, textAlign: 'center' }}>WBS ID</th>
                  <th style={{ padding: '12px 14px', width: 200 }}>Phase</th>
                  <th style={{ padding: '12px 14px', width: 220 }}>Module</th>
                  <th style={{ padding: '12px 14px', width: 220 }}>Work Package</th>
                  <th style={{ padding: '12px 14px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredWbs.map((w, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center', color: '#1E293B' }}>{w.id}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{w.phase}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1E293B' }}>{w.module}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F766E' }}>{w.workPackage}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontSize: '0.84rem', lineHeight: 1.4 }}>{w.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </AppShell>
  )
}
