import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Square } from "chess.js";

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());

  const handleMove = (sourceSquare: string, targetSquare: string): boolean => {
    let moveSuccessful = false;

    try {
      // TODO: Handle promotion
      const moveResult: Move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (moveResult) {
        setGame(new Chess(game.fen()));
        moveSuccessful = true;
      }
    } catch (error) {
      console.error("Illegal move attempted: ", error);
    }

    return moveSuccessful;
  };

  return (
    <div className="app">
      <Chessboard
        position={game.fen()}
        boardWidth={500} // TODO: Make this responsive
        onPieceDrop={(sourceSquare: Square, targetSquare: Square) => handleMove(sourceSquare, targetSquare)}
      />
    </div>
  );
};

export default App;
