import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { LIBRARY_STORIES, getStoryById } from './StoryLibrary'
import { aiService } from '../services/aiService'

export default function StoryQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find target story or default to first story
  const story = getStoryById(id)

  // Setup options
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('Medium')

  // Quiz state
  const [phase, setPhase] = useState('setup') // 'setup' | 'loading' | 'playing' | 'completed'
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])

  const handleStartQuiz = async () => {
    setPhase('loading')
    try {
      const generated = await aiService.generateQuiz(story, { count: questionCount, difficulty })
      setQuestions(generated)
      setCurrentIndex(0)
      setSelectedOption(null)
      setShowFeedback(false)
      setScore(0)
      setUserAnswers([])
      setPhase('playing')
    } catch (err) {
      console.error('Quiz generation error:', err)
      setPhase('setup')
    }
  }

  const handleOptionSelect = (optionIdx) => {
    if (showFeedback) return // prevent changing choice after submission

    setSelectedOption(optionIdx)
    setShowFeedback(true)

    const currentQ = questions[currentIndex]
    const isCorrect = optionIdx === currentQ.correctIndex

    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQ.question,
        selected: optionIdx,
        correct: currentQ.correctIndex,
        isCorrect,
        explanation: currentQ.explanation,
        options: currentQ.options
      }
    ])
  }

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      setPhase('completed')
    }
  }

  const handleRetry = () => {
    setPhase('setup')
    setCurrentIndex(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setScore(0)
    setUserAnswers([])
  }

  const currentQ = questions[currentIndex]
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  return (
    <AppShell title={`AI Quiz — ${story.title}`}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button 
          onClick={() => navigate(`/stories/${story.id}`)}
          style={{ padding: '9px 18px', border: '2px solid #FFE0B2', borderRadius: 10, background: 'white', color: '#4A4A6A', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          ← Back to Story
        </button>
        <button 
          onClick={() => navigate('/stories')}
          style={{ padding: '9px 18px', border: 'none', background: '#F3F4F6', borderRadius: 10, color: '#4B5563', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          📚 Story Library
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* PHASE 1: SETUP SCREEN */}
        {phase === 'setup' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: 36 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${story.color}40, ${story.color})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 16px'
              }}>
                {story.icon}
              </div>
              <span className="badge badge-yellow" style={{ marginBottom: 8 }}>{story.genre}</span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0', color: '#1A1A2E' }}>AI Story Comprehension Quiz</h1>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
                Test your understanding of <strong style={{ color: '#1A1A2E' }}>"{story.title}"</strong> by {story.author}.
              </p>
            </div>

            {/* Config Options */}
            <div style={{ background: '#F9FAFB', borderRadius: 16, padding: 24, marginBottom: 28, border: '1px solid #F3F4F6' }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: 10, fontSize: '0.95rem' }}>
                  1. Select Number of Questions:
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[5, 10].map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: '1rem',
                        border: questionCount === count ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                        background: questionCount === count ? '#F5F3FF' : 'white',
                        color: questionCount === count ? '#7C3AED' : '#4B5563',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                      }}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#374151', marginBottom: 10, fontSize: '0.95rem' }}>
                  2. Select Difficulty Level:
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Easy', 'Medium', 'Hard'].map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem',
                        border: difficulty === diff ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                        background: difficulty === diff ? '#F5F3FF' : 'white',
                        color: difficulty === diff ? '#7C3AED' : '#4B5563',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                      }}
                    >
                      {diff === 'Easy' ? '🟢 Easy' : diff === 'Medium' ? '🟡 Medium' : '🔴 Hard'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartQuiz}
              style={{
                width: '100%', padding: '16px', borderRadius: 14,
                background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                color: 'white', fontWeight: 800, fontSize: '1.1rem', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(124,58,237,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              ✨ Generate AI Quiz Now
            </button>
          </div>
        )}

        {/* PHASE 2: LOADING SCREEN */}
        {phase === 'loading' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16, animation: 'spin 2s infinite linear' }}>🧠</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px' }}>AI Reading & Parsing Story Content...</h2>
            <p style={{ color: '#6B7280', margin: 0 }}>Generating {questionCount} custom context questions for "{story.title}"</p>
          </div>
        )}

        {/* PHASE 3: PLAYING SCREEN */}
        {phase === 'playing' && currentQ && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: 32 }}>
            {/* Header progress info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', padding: '4px 12px', borderRadius: 50 }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280' }}>
                Difficulty: <strong style={{ color: '#1A1A2E' }}>{difficulty}</strong>
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 8, background: '#E5E7EB', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
              <div 
                style={{
                  height: '100%',
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>

            {/* Question Text */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 24, lineHeight: 1.5 }}>
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {currentQ.options.map((opt, idx) => {
                let border = '1px solid #E5E7EB'
                let bg = 'white'
                let color = '#374151'
                let badgeIcon = null

                if (showFeedback) {
                  if (idx === currentQ.correctIndex) {
                    border = '2px solid #22c55e'
                    bg = '#F0FDF4'
                    color = '#15803d'
                    badgeIcon = '✅'
                  } else if (selectedOption === idx) {
                    border = '2px solid #ef4444'
                    bg = '#FEF2F2'
                    color = '#b91c1c'
                    badgeIcon = '❌'
                  }
                } else if (selectedOption === idx) {
                  border = '2px solid #7C3AED'
                  bg = '#F5F3FF'
                  color = '#7C3AED'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showFeedback}
                    style={{
                      padding: '16px 20px', borderRadius: 12, border, background: bg, color,
                      textAlign: 'left', fontWeight: 600, fontSize: '0.95rem', cursor: showFeedback ? 'default' : 'pointer',
                      fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>
                      <strong style={{ opacity: 0.7, marginRight: 8 }}>{String.fromCharCode(65 + idx)}.</strong> {opt}
                    </span>
                    {badgeIcon && <span style={{ fontSize: '1.1rem' }}>{badgeIcon}</span>}
                  </button>
                )
              })}
            </div>

            {/* Instant Feedback Explanation Box */}
            {showFeedback && (
              <div 
                style={{
                  padding: 20, borderRadius: 14, marginBottom: 24,
                  background: selectedOption === currentQ.correctIndex ? '#F0FDF4' : '#FEF2F2',
                  border: `1px solid ${selectedOption === currentQ.correctIndex ? '#BBF7D0' : '#FECACA'}`
                }}
              >
                <div style={{ fontWeight: 800, color: selectedOption === currentQ.correctIndex ? '#166534' : '#991B1B', marginBottom: 6 }}>
                  {selectedOption === currentQ.correctIndex ? '🎉 Correct Answer!' : '❌ Incorrect Answer'}
                </div>
                <div style={{ fontSize: '0.9rem', color: selectedOption === currentQ.correctIndex ? '#15803d' : '#991B1B', lineHeight: 1.5 }}>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </div>
              </div>
            )}

            {/* Next Button */}
            {showFeedback && (
              <button
                onClick={handleNextQuestion}
                style={{
                  width: '100%', padding: '16px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {currentIndex + 1 < questions.length ? 'Next Question →' : 'View Final Score 🏆'}
              </button>
            )}
          </div>
        )}

        {/* PHASE 4: COMPLETED SCORE SCREEN */}
        {phase === 'completed' && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: 36 }}>
            {/* Header Score Card */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: '4rem', marginBottom: 12 }}>
                {percentage >= 80 ? '🏆' : percentage >= 50 ? '🌟' : '📖'}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px', color: '#1A1A2E' }}>
                {percentage === 100 ? 'Perfect Score!' : percentage >= 80 ? 'Outstanding Performance!' : percentage >= 50 ? 'Good Effort!' : 'Keep Reading!'}
              </h1>
              <p style={{ color: '#6B7280', margin: '0 0 20px' }}>You completed the quiz for "{story.title}"</p>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: '#F9FAFB', padding: '16px 32px', borderRadius: 20, border: '1px solid #F3F4F6' }}>
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#7C3AED', lineHeight: 1 }}>{score} / {questions.length}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 4 }}>Total Score</div>
                </div>
                <div style={{ width: 1, height: 40, background: '#E5E7EB' }} />
                <div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: percentage >= 70 ? '#16a34a' : '#d97706', lineHeight: 1 }}>{percentage}%</div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 4 }}>Accuracy</div>
                </div>
              </div>
            </div>

            {/* Answer Breakdown */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 16 }}>Detailed Results Review</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {userAnswers.map((ans, i) => (
                <div 
                  key={i} 
                  style={{
                    padding: 16, borderRadius: 12, border: '1px solid #E5E7EB',
                    background: ans.isCorrect ? '#F0FDF4' : '#FEF2F2'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' }}>Q{i+1}: {ans.question}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: ans.isCorrect ? '#166534' : '#991B1B' }}>
                      {ans.isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: 4 }}>
                    <strong>Your Choice:</strong> {ans.options[ans.selected]}
                  </div>
                  {!ans.isCorrect && (
                    <div style={{ fontSize: '0.85rem', color: '#15803d', marginBottom: 4 }}>
                      <strong>Correct Choice:</strong> {ans.options[ans.correct]}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', fontStyle: 'italic', marginTop: 4 }}>
                    💡 {ans.explanation}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleRetry}
                style={{
                  flex: 1, minWidth: '160px', padding: '14px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white',
                  fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                🔄 Retry Quiz
              </button>
              <button
                onClick={() => navigate(`/stories/${story.id}`)}
                style={{
                  flex: 1, minWidth: '160px', padding: '14px 20px', borderRadius: 12,
                  border: '2px solid #FFE0B2', background: 'white', color: '#4A4A6A',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                📖 Back to Story
              </button>
              <button
                onClick={() => navigate('/stories')}
                style={{
                  padding: '14px 20px', borderRadius: 12, border: 'none', background: '#F3F4F6',
                  color: '#4B5563', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                📚 Story Library
              </button>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
