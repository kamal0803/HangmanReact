import words from "./words";

import { useState } from "react";

export default function GameBoard() {
  const [randomWord] = useState(getRandomWord());
  const [letters, setLetters] = useState(Array(randomWord.length).fill("-"));
  const [chances, setChances] = useState(6);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [clickedLetters, setClickedLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  function handleLetterClick(value) {
    let isMatch = false;
    const nextLetters = letters.slice();
    for (let i = 0; i < randomWord.length; i++) {
      if (randomWord[i] === value) {
        nextLetters[i] = value;
        isMatch = true;
      } else {
        setClickedLetters((prev) => {
          if (!prev.includes(value)) {
            return [...prev, value];
          }
          return prev;
        });
      }
    }

    if (!isMatch && !clickedLetters.includes(value)) {
      setChances((prev) => {
        const newChances = prev - 1;

        if (newChances <= 0) {
          setGameOver(true);
          return 0;
        }

        return newChances;
      });
    }

    isMatch && setCorrectLetters((prev) => [...prev, value]);

    setLetters(nextLetters);

    if (chances > 0 && !nextLetters.includes("-")) {
      setGameWon(true);
    }
  }

  return (
    <>
      <AllLetterBoard
        onLetterClick={handleLetterClick}
        correctLetters={correctLetters}
        clickedLetters={clickedLetters}
      />
      {gameWon ? (
        <GameWon />
      ) : gameOver ? (
        <GameOver word={randomWord} />
      ) : (
        <ChancesHeading chancesLeft={chances} />
      )}

      <ImageDisplay imgSrc={`hangman${6 - chances}`} />
      <div className="flex-container">
        {letters.map((x) => (
          <p>{x}</p>
        ))}
      </div>
    </>
  );
}

function AllLetterBoard({ onLetterClick, correctLetters, clickedLetters }) {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="grid-container">
      {[...alphabets].map((x) => (
        <LetterButton
          key={x}
          value={x}
          onButtonClick={() => onLetterClick(x)}
          className={
            correctLetters.includes(x)
              ? "right-box"
              : clickedLetters.includes(x)
              ? "wrong-box"
              : ""
          }
        />
      ))}
    </div>
  );
}

function GameWon() {
  return <h1>YOU WON!</h1>;
}

function GameOver({ word }) {
  return <h1>GAME OVER! The correct word is {word}</h1>;
}

function ChancesHeading({ chancesLeft }) {
  return <h1>Total Chances: {chancesLeft}</h1>;
}

function ImageDisplay({ imgSrc }) {
  return <img src={`/asset/${imgSrc}.png`} alt="hangman" />;
}

function LetterButton({ value, onButtonClick, className }) {
  return (
    <button onClick={onButtonClick} className={className}>
      {value}
    </button>
  );
}

function getRandomWord() {
  const randomWord =
    words[Math.floor(Math.random() * words.length)].toUpperCase();
  return randomWord;
}
