import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cells, setCells] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameWon, setGameWon] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const playAudio = (audio) => {
    if (pageLoaded) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  useEffect(() => {
    checkWinner();
  }, [cells]);

  const handleCellClick = (cellIndex) => {
    if (!gameWon && cells[cellIndex] === '') {
      const audio = new Audio(`./audio/open_cell/${cellIndex + 1}.mp4`);
      playAudio(audio);
      setSelectedCellIndex(cellIndex);
    }
  };

  const checkWinner = () => {
    for (const [a, b, c] of winningCombos) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        const audio = new Audio(`./audio/winner/${currentPlayer === 'X' ? 'Y' : 'X'}.mp4`);
        playAudio(audio);
        setGameWon(true);
        return;
      }
    }

    if (cells.every(cell => cell !== '')) {
      const audio = new Audio(`./audio/winner/draw.mp4`);
      setGameWon(true);
      setIsDraw(true);
      playAudio(audio);
    } else {
      const audio = new Audio(`./audio/turn/${currentPlayer}.mp4`);
      playAudio(audio);
    }
  };

  const resetGame = () => {
    setCells(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameWon(false);
    setIsDraw(false);
    setSelectedCellIndex(null);
  };

  const handleKeyPress = (event) => {
    const key = event.key.toLowerCase();

    if (key >= '1' && key <= '9') {
      handleCellClick(Number(key) - 1);
    }
    else {
      let audio = new Audio('./audio/open_cell/fail.mp4');
      playAudio(audio);
    }

    if (!gameWon && selectedCellIndex !== null) {
      if (key === 'enter') {
        const newCells = [...cells];
        newCells[selectedCellIndex] = currentPlayer;
        setCells(newCells);
        setSelectedCellIndex(null);
        setCurrentPlayer(currentPlayer === 'X' ? 'Y' : 'X');
        let audio = new Audio(`./audio/open_cell/success.mp4`);
        playAudio(audio);
      }
    }

    if (key === '0') resetGame();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [cells, gameWon, selectedCellIndex]);

  return (
    <div className="App">
      <div className="game">
        <div className="game-board">
          <div className="notification">
            {gameWon && !isDraw
              ? `Player ${currentPlayer === 'X' ? 'Y' : 'X'} wins!`
              : isDraw
              ? "It's a draw!"
              : selectedCellIndex !== null
              ? `Press Enter to confirm`
              : `Player ${currentPlayer}'s Turn`}
          </div>
          <div className="board">
            {cells.map((cell, index) => (
              <div
                key={index}
                className={`cell ${cell} ${index === selectedCellIndex ? 'selected' : ''}`}
                onClick={() => handleCellClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          <button className="reset-button" onClick={resetGame}>Reset Game</button>
        </div>
      </div>
    </div>
  );
}

export default App;
