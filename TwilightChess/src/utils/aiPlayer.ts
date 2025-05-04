import { BoardState, ChessPiece, Position } from '../types/chessTypes';
import { getValidMoves } from './moveValidator';

// This is a simple AI that randomly selects from available legal moves
export const getAIMove = (boardState: BoardState): { from: Position; to: Position } | null => {
  const { board, currentTurn } = boardState;
  const availableMoves: { from: Position; to: Position }[] = [];

  // Collect all possible moves for AI pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentTurn) {
        const from = { row, col };
        const validMoves = getValidMoves(boardState, from);
        
        for (const to of validMoves) {
          availableMoves.push({ from, to });
        }
      }
    }
  }

  if (availableMoves.length === 0) {
    return null;
  }

  // Randomly select a move
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};