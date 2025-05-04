import React from 'react';
import { Position, PieceColor } from '../types/chessTypes';
import { getSquareColor } from '../utils/boardUtils';
import ChessPieceComponent from './ChessPiece';
import PromotionDialog from './PromotionDialog';

interface ChessBoardProps {
  boardState: any;
  onSquareClick: (position: Position) => void;
  onPromote: (pieceType: any) => void;
  flipped?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardState,
  onSquareClick,
  onPromote,
  flipped = false,
}) => {
  const { 
    board, 
    selectedPosition, 
    validMoves, 
    isCheck, 
    showPromotionDialog, 
    currentTurn 
  } = boardState;

  const findKingPosition = (color: PieceColor): Position | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const kingInCheckPosition = isCheck ? findKingPosition(currentTurn) : null;

  const renderBoard = () => {
    const squares = [];
    const rows = flipped ? [0, 1, 2, 3, 4, 5, 6, 7].reverse() : [0, 1, 2, 3, 4, 5, 6, 7];
    const cols = flipped ? [0, 1, 2, 3, 4, 5, 6, 7].reverse() : [0, 1, 2, 3, 4, 5, 6, 7];

    for (const row of rows) {
      for (const col of cols) {
        const position = { row, col };
        const piece = board[row][col];
        const squareColor = getSquareColor(row, col);
        
        const isSelected = selectedPosition && 
                          selectedPosition.row === row && 
                          selectedPosition.col === col;
        
        const isValidMove = validMoves.some(
          (move: Position) => move.row === row && move.col === col
        );

        const isKingInCheck = kingInCheckPosition && 
                             kingInCheckPosition.row === row && 
                             kingInCheckPosition.col === col;

        const squareClasses = [
          'w-full h-full flex items-center justify-center relative transition-all duration-200',
          squareColor === 'light' ? 'bg-purple-200' : 'bg-purple-800',
          isSelected ? 'ring-4 ring-blue-400 ring-opacity-75 z-10' : '',
          isKingInCheck ? 'bg-red-500' : '',
          'hover:brightness-110',
        ].join(' ');

        squares.push(
          <div 
            key={`${row}-${col}`}
            className={squareClasses}
            onClick={() => onSquareClick(position)}
          >
            {col === (flipped ? 7 : 0) && (
              <div className="absolute left-1 top-1 text-xs font-medium opacity-70">
                {8 - row}
              </div>
            )}
            {row === (flipped ? 0 : 7) && (
              <div className="absolute right-1 bottom-1 text-xs font-medium opacity-70">
                {String.fromCharCode(97 + col)}
              </div>
            )}
            
            {piece && <ChessPieceComponent piece={piece} />}
            
            {isValidMove && (
              <div className={`absolute inset-0 flex items-center justify-center ${piece ? 'bg-green-400 bg-opacity-30 rounded-full' : ''}`}>
                {!piece && (
                  <div className="w-3 h-3 rounded-full bg-green-400 bg-opacity-60"></div>
                )}
              </div>
            )}
          </div>
        );
      }
    }

    return squares;
  };

  return (
    <div className="relative">
      <div className="w-full aspect-square grid grid-cols-8 border-2 border-purple-300 shadow-lg rounded-md overflow-hidden shadow-purple-500/20">
        {renderBoard()}
      </div>
      
      {showPromotionDialog && (
        <PromotionDialog 
          color={currentTurn} 
          onSelect={onPromote} 
        />
      )}
    </div>
  );
};

export default ChessBoard