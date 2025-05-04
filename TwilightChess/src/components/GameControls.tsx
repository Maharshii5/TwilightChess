import React from 'react';
import { PieceColor } from '../types/chessTypes';

interface GameControlsProps {
  onNewGame: (playerColor: PieceColor) => void;
  isDisabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onNewGame, isDisabled }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Game Controls</h2>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => onNewGame('white')}
          disabled={isDisabled}
          className={`py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center shadow-lg ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          New Game as White
        </button>
        
        <button
          onClick={() => onNewGame('black')}
          disabled={isDisabled}
          className={`py-3 px-6 rounded-lg bg-gradient-to-r from-slate-800 to-purple-900 text-white hover:from-slate-900 hover:to-purple-950 transition-all duration-200 font-medium flex items-center justify-center shadow-lg ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          New Game as Black
        </button>
      </div>
      
      <div className="mt-6 text-sm text-purple-200">
        <h3 className="font-semibold mb-2 text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">How to Play:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click on your piece to select it</li>
          <li>Green circles show valid moves</li>
          <li>Click on a valid move to move your piece</li>
          <li>The AI will automatically make its move</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls