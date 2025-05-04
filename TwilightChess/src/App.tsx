import React from 'react';
import ChessBoard from './components/ChessBoard';
import GameStatus from './components/GameStatus';
import GameControls from './components/GameControls';
import useChessGame from './hooks/useChessGame';
import { PieceType } from './types/chessTypes';

function App() {
  const { 
    boardState, 
    playerColor, 
    isAIThinking, 
    selectPiece, 
    movePiece, 
    promotePawn, 
    initGame 
  } = useChessGame('white');

  const handleSquareClick = (position: { row: number; col: number }) => {
    if (
      boardState.selectedPosition &&
      boardState.validMoves.some(
        move => move.row === position.row && move.col === position.col
      )
    ) {
      movePiece(position);
    } else {
      selectPiece(position);
    }
  };

  const handlePromotion = (pieceType: PieceType) => {
    promotePawn(pieceType);
  };

  const handleNewGame = (newPlayerColor: 'white' | 'black') => {
    initGame(newPlayerColor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 font-serif">Twilight Chess</h1>
      
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
          <ChessBoard 
            boardState={boardState}
            onSquareClick={handleSquareClick}
            onPromote={handlePromotion}
            flipped={playerColor === 'black'}
          />
        </div>
        
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <GameStatus 
            currentTurn={boardState.currentTurn}
            isCheck={boardState.isCheck}
            isCheckmate={boardState.isCheckmate}
            isStalemate={boardState.isStalemate}
            moveHistory={boardState.moveHistory}
            isAIThinking={isAIThinking}
            playerColor={playerColor}
          />
          
          <GameControls 
            onNewGame={handleNewGame}
            isDisabled={isAIThinking || boardState.showPromotionDialog}
          />
        </div>
      </div>
    </div>
  );
}

export default App;