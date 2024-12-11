import React, { useState, useEffect } from 'react'
import clsx from "clsx";
import './App.css'

function App() {
  const [pairs, setPairs] = useState([1,2,3,4,5,6]);
  const [turnClick, setTurnClick] = useState(0);

  const generateCards = pairs.flatMap((value, index) => [
      { id: `${value}-1`, content: value, isOpen: false, isGuessed: false },
      { id: `${value}-2`, content: value, isOpen: false, isGuessed: false },
    ])

  const [cards, setCards] = useState(() => shuffleCards(generateCards));

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
      setTurnClick(prev => prev + 1);
      setCards(prev => prev.map(card =>
          card.id === cardId ? {...card, isOpen: true} : card)
      )
  }

  useEffect(() => {
      console.log("Turn Click Updated:", turnClick);
      if (turnClick === 2) {
          checkRevealedCards();
          setTurnClick(0);
      }
      }, [turnClick]
  );

  function checkRevealedCards() {
      console.log("check revealed cards");
      const revealedCards = cards.filter(card => card.isOpen && !card.isGuessed);
      const revealedValue = revealedCards[0].content;
      console.log(revealedValue);
      if (revealedCards.every(card => card.content === revealedValue)) {
          const quessedCards = revealedCards.map(card => ({...card, isGuessed: true }));
          setCards(prev =>
              prev.map(card => quessedCards.find(gc => gc.id === card.id) || card)
          );
      } else {
          const missedCards = revealedCards.map(card => ({...card, isOpen: false }));
          setCards(prev =>
              prev.map(card => missedCards.find(gc => gc.id === card.id) || card)
          );
      }
  }

  return (
    <main>
        <header>
            <h1>Memory</h1>
        </header>
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
                    >{card.content} {card.isOpen && "open"} {card.isGuessed && "guessed" }
                    </button>
                )}
        </section>
    </main>
  )
}

export default App
