import { useState, useEffect } from 'react'

const TOTAL_QUESTIONS = 10
const MAX_HEARTS = 5

function App() {
  const [mode, setMode] = useState(null) // 'addition', 'subtraction', 'multiplication', 'division'
  const [problem, setProblem] = useState({ question: '', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const generateProblem = () => {
    let num1, num2, answer, question

    switch (mode) {
      case 'addition':
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
        break
      case 'subtraction':
        num1 = Math.floor(Math.random() * 20) + 5
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
        break
      case 'multiplication':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
        break
      case 'division':
        num2 = Math.floor(Math.random() * 9) + 2
        answer = Math.floor(Math.random() * 10) + 1
        num1 = num2 * answer
        question = `${num1} ÷ ${num2} = ?`
        break
      default:
        return
    }

    setProblem({ question, answer })
    setUserAnswer('')
    setFeedback(null)
  }

  useEffect(() => {
    if (mode && questionCount < TOTAL_QUESTIONS) {
      generateProblem()
    }
  }, [mode, questionCount])

  const handleSubmit = () => {
    const parsedAnswer = parseInt(userAnswer)
    
    if (isNaN(parsedAnswer)) {
      return
    }

    if (parsedAnswer === problem.answer) {
      setFeedback({ type: 'correct', message: getRandomPraise() })
      setScore(score + 1)
      setStreak(streak + 1)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
      
      if (questionCount < TOTAL_QUESTIONS - 1) {
        setTimeout(() => {
          setQuestionCount(questionCount + 1)
        }, 1500)
      } else {
        setTimeout(() => {
          setMode(null)
          setScore(0)
          setHearts(MAX_HEARTS)
          setStreak(0)
          setQuestionCount(0)
        }, 2000)
      }
    } else {
      setFeedback({ type: 'incorrect', message: `Правильный ответ: ${problem.answer}` })
      setHearts(Math.max(0, hearts - 1))
      setStreak(0)
      
      if (hearts - 1 <= 0) {
        setTimeout(() => {
          setMode(null)
          setScore(0)
          setHearts(MAX_HEARTS)
          setStreak(0)
          setQuestionCount(0)
        }, 2000)
      }
    }

    setUserAnswer('')
  }

  const getRandomPraise = () => {
    const praises = ['Молодец! 🌟', 'Отлично! 🎉', 'Супер! 💪', 'Правильно! ✨', 'Так держать! 🚀']
    return praises[Math.floor(Math.random() * praises.length)]
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const renderHearts = () => {
    return Array(MAX_HEARTS).fill(0).map((_, i) => (
      <span key={i}>{i < hearts ? '❤️' : '🖤'}</span>
    ))
  }

  const progress = ((questionCount + (feedback?.type === 'correct' ? 1 : 0)) / TOTAL_QUESTIONS) * 100

  if (!mode) {
    return (
      <div className="app">
        <div className="character">🦉</div>
        <h1 className="title">Math Duo!</h1>
        <p className="subtitle">Выбери режим и начни учиться!</p>
        
        <div className="mode-selection">
          <button className="mode-btn addition" onClick={() => setMode('addition')}>
            ➕ Сложение
          </button>
          <button className="mode-btn subtraction" onClick={() => setMode('subtraction')}>
            ➖ Вычитание
          </button>
          <button className="mode-btn multiplication" onClick={() => setMode('multiplication')}>
            ✖️ Умножение
          </button>
          <button className="mode-btn division" onClick={() => setMode('division')}>
            ➗ Деление
          </button>
        </div>
      </div>
    )
  }

  if (questionCount >= TOTAL_QUESTIONS || hearts === 0) {
    return (
      <div className="app">
        <div className="character">{hearts > 0 ? '🏆' : '💪'}</div>
        <h1 className="title">
          {hearts > 0 ? 'Победа!' : 'Попробуй ещё!'}
        </h1>
        <p className="subtitle">
          {hearts > 0 
            ? `Ты решил ${score} из ${TOTAL_QUESTIONS} примеров!`
            : 'Не расстраивайся, попробуй ещё раз!'}
        </p>
        
        <div style={{ fontSize: '48px', margin: '20px 0' }}>
          {hearts > 0 ? '🎉⭐🎉' : '📚✏️📚'}
        </div>

        <button className="submit-btn" onClick={() => {
          setMode(null)
          setScore(0)
          setHearts(MAX_HEARTS)
          setStreak(0)
          setQuestionCount(0)
        }}>
          Играть снова
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      {showCelebration && (
        <div className="celebration">
          {Array(50).fill(0).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="header">
        <div className="hearts">{renderHearts()}</div>
        <div className="streak">🔥 {streak}</div>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        >
          {questionCount + 1}/{TOTAL_QUESTIONS}
        </div>
      </div>

      <div className="problem-container">
        <div className="problem">{problem.question}</div>
        <input
          type="number"
          className="answer-input"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          placeholder="?"
        />
        <br />
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={!userAnswer}
        >
          Ответить
        </button>
      </div>

      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <button 
        className="back-btn" 
        onClick={() => {
          setMode(null)
          setScore(0)
          setHearts(MAX_HEARTS)
          setStreak(0)
          setQuestionCount(0)
        }}
      >
        ← Назад
      </button>
    </div>
  )
}

export default App
