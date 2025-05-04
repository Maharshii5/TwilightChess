import React from 'react';
import { ChessPiece } from '../types/chessTypes';
import { 
  Crown,
  ChevronUp,
  Castle,
  Cross,
  Navigation,
  Church
} from 'lucide-react';

interface ChessPieceProps {
  piece: ChessPiece;
  size?: 'small' | 'medium' | 'large';
}

const ChessPieceComponent: React.FC<ChessPieceProps> = ({ piece, size = 'medium' }) => {
  const { type, color } = piece;
  
  const pieceColor = color === 'white' ? 'text-amber-100' : 'text-stone-800';
  const strokeColor = color === 'white' ? 'stroke-stone-900' : 'stroke-amber-50';
  
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-10 h-10'
  }[size];

  const renderPiece = () => {
    switch (type) {
      case 'pawn':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <ChevronUp className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      case 'knight':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <Navigation className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      case 'bishop':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <Church className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      case 'rook':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <Castle className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      case 'queen':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <Crown className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      case 'king':
        return (
          <div className={`${pieceColor} ${sizeClass} flex items-center justify-center`}>
            <Cross className={`${strokeColor}`} strokeWidth={2} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderPiece()}
    </div>
  );
};

export default ChessPieceComponent;