import React from 'react';
import { Move, PieceColor } from '../types/chessTypes';
import { positionToAlgebraic } from '../utils/boardUtils';

interface GameStatusProps {
  currentTurn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moveHistory: Move[];
  isAIThinking: boolean;
  playerColor: PieceColor;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  currentTurn, 
  isCheck, 
  isCheckmate, 
  isStalemate, 
  moveHistory,
  isAIThinking,
  playerColor 
}) => {
  const getStatusMessage = (): string => {
    if (isCheckmate) {
      const winner = currentTurn === 'white' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    }
    
    if (isStalemate) {
      return 'Stalemate! Game is drawn.';
    }
    
    if (isCheck) {
      return `${currentTurn === 'white' ? 'White' : 'Black'} is in check!`;
    }
    
    if (isAIThinking) {
      return 'AI is thinking...';
    }
    
    return `${currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
  };

  const formatMove = (move: Move, index: number): string => {
    const from = positionToAlgebraic(move.from);
    const to = positionToAlgebraic(move.to);
    const piece = move.piece.type[0].toUpperCase();
    const pieceSymbol = move.piece.type === 'pawn' ? '' : piece;
    const isCapture = !!move.capturedPiece;
    const captureSymbol = isCapture ? 'x' : '';
    const promotionString = move.isPromotion ? `=${move.promotionPiece?.[0].toUpperCase()}` : '';
    const checkString = isCheckmate ? '#' : isCheck ? '+' : '';
    
    if (move.isCastling) {
      return move.to.col === 6 ? 'O-O' : 'O-O-O';
    }
    
    return `${pieceSymbol}${from}${captureSymbol}${to}${promotionString}${checkString}`;
  };

  const groupedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    const whiteMove = moveHistory[i];
    const blackMove = moveHistory[i + 1];
    
    groupedMoves.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: whiteMove ? formatMove(whiteMove, i) : '',
      black: blackMove ? formatMove(blackMove, i + 1) : '',
    });
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Game Status</h2>
      
      <div className={`mb-4 py-3 px-4 rounded-lg font-semibold ${
        isCheckmate || isStalemate 
          ? 'bg-gray-800 text-gray-200' 
          : currentTurn === 'white' 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
            : 'bg-gradient-to-r from-slate-800 to-purple-900 text-white'
      }`}>
        {getStatusMessage()}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Moves</h3>
      
      <div className="max-h-60 overflow-y-auto rounded-lg bg-black/20">
        <table className="w-full text-sm text-purple-200">
          <thead className="bg-black/30 sticky top-0">
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">White</th>
              <th className="py-2 px-3 text-left">Black</th>
            </tr>
          </thead>
          <tbody>
            {groupedMoves.map((group) => (
              <tr key={group.moveNumber} className="border-b border-purple-900/30">
                <td className="py-2 px-3">{group.moveNumber}.</td>
                <td className="py-2 px-3 font-mono">{group.white}</td>
                <td className="py-2 px-3 font-mono">{group.black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-purple-200">
        <span className="font-semibold">You are playing as: </span>
        <span className={`font-bold ${playerColor === 'white' ? 'text-purple-300' : 'text-slate-300'}`}>
          {playerColor === 'white' ? 'White' : 'Black'}
        </span>
      </div>
    </div>
  );
};

export default GameStatus