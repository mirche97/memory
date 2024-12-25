import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import clsx from "clsx";
import './App.css'
// import {useTimer} from 'react-timer-hook'
import Timer from "./components/Timer.jsx"
function App() {
    const initMessage = "Reveal the cards to find the pairs";
    const newGameMessage = "Press the new game button to start the game";

    const [pairs, setPairs] = useState([1,2,3,4,5,6]);
    const [turnClick, setTurnClick] = useState(0);
    const [turnStatus, setTurnStatus] = useState({
        status: null,
        label: ' ',
    });
    const [message, setMessage] = useState(initMessage);

    const generateCards = pairs.flatMap((value, index) => [
      { id: `${value}-1`, content: value, isOpen: false, isGuessed: false },
      { id: `${value}-2`, content: value, isOpen: false, isGuessed: false },
    ])

    const [cards, setCards] = useState(() => shuffleCards(generateCards));
    const [gameOver, setGameOver] = useState(false);

    function initGame() {
        setCards(shuffleCards(generateCards));
        setTurnClick(0);
    };

  function shuffleCards(cards) {
      const shuffled = [];
      let remainingCards = cards;

      for (let i= 0; i<= cards.length - 1; i++) {
          const randomIndex = Math.floor(Math.random() * (cards.length - i));
          const randomCard = remainingCards[randomIndex];

          shuffled.push(remainingCards[randomIndex])
          remainingCards = remainingCards.filter((card) => card !== randomCard);
      }

      return shuffled;
  }

  function openCard(cardId) {
      if (turnClick === 0) {
          closeReveladCards();
      }

      setTurnClick(prev => prev + 1);

      setCards(prev => prev.map(card =>
          card.id === cardId ? {...card, isOpen: true} : card)
      )
  }

  useEffect(() => {
          if (turnClick === 2) {
              checkRevealedCards();
              setTurnClick(0);
          }
      }, [turnClick]
  );

  useEffect(() => {
      const allCardsGuessed = cards.every(card => card.isGuessed);
      setGameOver(allCardsGuessed);
  }, [cards]);

    useEffect(() => {
        console.log(`game over: ${gameOver}`);
        if (gameOver)  {
            setTurnStatus({
                status: 'gameover',
                label: "Game over!"
            });
            setMessage(newGameMessage);
        }
    }, [gameOver]);

  function checkRevealedCards() {
      const revealedCards = cards.filter(card => card.isOpen && !card.isGuessed);
      const revealedValue = revealedCards[0].content;

      if (revealedCards.every(card => card.content === revealedValue)) {
          const quessedCards = revealedCards.map(card => ({...card, isGuessed: true }));
          setTurnStatus({
              status: 'guess',
              label: "Guessed!"
          });

          setCards(prev =>
              prev.map(card => quessedCards.find(gc => gc.id === card.id) || card)
          );
      } else {
          setTurnStatus({
              status: 'miss',
              label: "Missed!"
          })
      }
  }

  function closeReveladCards() {
      const revealedCards = cards.filter(card => card.isOpen && !card.isGuessed);
      const missedCards = revealedCards.map(card => ({...card, isOpen: false }));
          setCards(prev =>
              prev.map(card => missedCards.find(gc => gc.id === card.id) || card)
          )
  }

    return (
    <main>
        <header>
            <h1>Memory</h1>
        </header>
        <section className={"game-status"}>
            <h2 className={turnStatus.status}>{turnStatus.label}</h2>
            <p>{message}</p>
        </section>
        <section>
            <Timer timeInSeconds={90}/>
        </section>
        <section className={"cards-container"}>
            {cards.map(card =>
                    <button
                        key={card.id}
                        className={clsx("card", {
                            open: card.isGuessed || card.isOpen,
                            closed: !card.isOpen
                        })}
                        disabled={card.isGuessed || card.isOpen}
                        onClick={() => openCard(card.id)}
                    >{(card.isGuessed || card.isOpen) && card.content}
                    </button>
                )}
        </section>
        <section className={"new-game"} onClick={initGame}>{gameOver && <button className={"new-game-btn"}>New Game</button>}</section>
    </main>
  )
}

export default App
