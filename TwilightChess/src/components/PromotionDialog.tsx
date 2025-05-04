import React from 'react';
import { PieceColor, PieceType } from '../types/chessTypes';
import ChessPieceComponent from './ChessPiece';

interface PromotionDialogProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect }) => {
  const promotionPieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-bold text-center mb-4">Promote Pawn</h3>
        <div className="grid grid-cols-4 gap-2">
          {promotionPieces.map((pieceType) => (
            <button
              key={pieceType}
              className="flex flex-col items-center justify-center bg-amber-50 hover:bg-amber-100 p-2 rounded-md transition-colors duration-200"
              onClick={() => onSelect(pieceType)}
            >
              <ChessPieceComponent piece={{ type: pieceType, color }} size="large" />
              <span className="text-xs capitalize mt-1">{pieceType}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog;