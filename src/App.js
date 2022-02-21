import './App.css'
import { useCallback, useEffect, useState } from 'react'
import SingleCard from './components/SingleCard'
const cardImages = [
  { src: '/images/helmet-1.png' },
  { src: '/images/potion-1.png' },
  { src: '/images/ring-1.png' },
  { src: '/images/scroll-1.png' },
  { src: '/images/shield-1.png' },
  { src: '/images/sword-1.png' }
]
function App() {
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [turns, setTurns] = useState(0)
  const [finish, setFinish] = useState(false)

  const handleNewGame = useCallback(() => {
    setFinish(false)
    setTurns(0)
    // 카드 모두 뒤집기
    resetTurn()
    setCards((cards) => cards.map((card) => ({ ...card, matched: false })))
    // 다 뒤집힌 다음 카드 섞기
    setTimeout(suffleCards, 1000)
  }, [])

  // game start
  useEffect(() => {
    handleNewGame()
  }, [handleNewGame])

  useEffect(() => {
    if (cards.length === 0) return
    if (cards.every((card) => card.matched)) {
      setTimeout(() => {
        setFinish(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 1000)
    }
  }, [cards])

  // match check
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.id === choiceOne.id || card.id === choiceTwo.id) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => {
          resetTurn()
        }, 1000)
      }
      setTurns((prevTurns) => prevTurns + 1)
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setDisabled(false)
  }
  const suffleCards = () => {
    const suffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card, idx) => ({ ...card, id: idx, matched: false }))
    setCards(suffledCards)
  }

  const handleChoice = (card) => {
    if (choiceOne) {
      if (choiceOne.id === card.id) return
      setChoiceTwo(card)
    } else {
      setChoiceOne(card)
    }
  }
  return (
    <div className="App">
      <h1>MEMORY GAME</h1>
      {finish && (
        <>
          <h2>You win!</h2>
          <h3>{turns} truns</h3>
          <button onClick={handleNewGame}>New Game</button>
        </>
      )}

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            card={card}
            key={card.id}
            handleChoice={handleChoice}
            disabled={disabled}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </div>
  )
}

export default App
