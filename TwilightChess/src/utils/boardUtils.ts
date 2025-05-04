import { ChessPiece, PieceColor, Position } from '../types/chessTypes';

// Initialize chess board with pieces in starting positions
export const initializeBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Set up rooks
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };

  // Set up knights
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };

  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };

  // Set up queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };

  // Set up kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };

  return board;
};

// Check if a position is within the board boundaries
export const isPositionValid = (position: Position): boolean => {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
};

// Get the color of the square (light or dark)
export const getSquareColor = (row: number, col: number): 'light' | 'dark' => {
  return (row + col) % 2 === 0 ? 'light' : 'dark';
};

// Convert position to algebraic notation (e.g., {row: 7, col: 0} -> "a1")
export const positionToAlgebraic = (position: Position): string => {
  const file = String.fromCharCode(97 + position.col); // 'a' to 'h'
  const rank = 8 - position.row; // 1 to 8
  return `${file}${rank}`;
};

// Convert algebraic notation to position (e.g., "a1" -> {row: 7, col: 0})
export const algebraicToPosition = (algebraic: string): Position => {
  const file = algebraic.charCodeAt(0) - 97; // 'a' to 'h' -> 0 to 7
  const rank = 8 - parseInt(algebraic[1]); // 1 to 8 -> 7 to 0
  return { row: rank, col: file };
};

// Find the king's position for a given color
export const findKingPosition = (board: (ChessPiece | null)[][], color: PieceColor): Position | null => {
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

// Create a deep copy of the board
export const cloneBoard = (board: (ChessPiece | null)[][]): (ChessPiece | null)[][] => {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
};

// Convert move to algebraic notation
export const moveToAlgebraic = (move: Position, piece: ChessPiece, board: (ChessPiece | null)[][], from: Position, isCapture: boolean, isCheck: boolean, isCheckmate: boolean): string => {
  const toStr = positionToAlgebraic(move);
  let pieceStr = '';
  
  if (piece.type !== 'pawn') {
    pieceStr = piece.type[0].toUpperCase();
  } else if (isCapture) {
    pieceStr = positionToAlgebraic(from)[0];
  }
  
  const captureStr = isCapture ? 'x' : '';
  const checkStr = isCheckmate ? '#' : isCheck ? '+' : '';
  
  return `${pieceStr}${captureStr}${toStr}${checkStr}`;
};