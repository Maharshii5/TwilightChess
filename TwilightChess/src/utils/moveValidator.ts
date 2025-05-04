import { BoardState, ChessPiece, PieceColor, Position } from '../types/chessTypes';
import { cloneBoard, findKingPosition, isPositionValid } from './boardUtils';

// Generate all valid moves for a piece at the given position
export const getValidMoves = (
  boardState: BoardState,
  position: Position,
  checkKingSafety = true
): Position[] => {
  const { board, currentTurn, enPassantTarget } = boardState;
  const piece = board[position.row][position.col];

  if (!piece || piece.color !== currentTurn) {
    return [];
  }

  let potentialMoves: Position[] = [];

  switch (piece.type) {
    case 'pawn':
      potentialMoves = getPawnMoves(board, position, enPassantTarget);
      break;
    case 'knight':
      potentialMoves = getKnightMoves(board, position);
      break;
    case 'bishop':
      potentialMoves = getBishopMoves(board, position);
      break;
    case 'rook':
      potentialMoves = getRookMoves(board, position);
      break;
    case 'queen':
      potentialMoves = getQueenMoves(board, position);
      break;
    case 'king':
      potentialMoves = getKingMoves(board, position, boardState);
      break;
  }

  // Filter out moves that would put the king in check
  if (checkKingSafety) {
    potentialMoves = potentialMoves.filter(move => {
      // Simulate the move and check if the king is safe
      const newBoard = cloneBoard(board);
      newBoard[move.row][move.col] = newBoard[position.row][position.col];
      newBoard[position.row][position.col] = null;
      return !isKingInCheck(newBoard, piece.color);
    });
  }

  return potentialMoves;
};

// Check if the king of the given color is in check
export const isKingInCheck = (board: (ChessPiece | null)[][], color: PieceColor): boolean => {
  const kingPosition = findKingPosition(board, color);
  if (!kingPosition) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';

  // Check each square on the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const position = { row, col };
        const moves = getAttackMoves(board, position, null);
        if (moves.some(move => move.row === kingPosition.row && move.col === kingPosition.col)) {
          return true;
        }
      }
    }
  }

  return false;
};

// Get all attack moves for a piece (used for check detection)
export const getAttackMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  enPassantTarget: Position | null
): Position[] => {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  switch (piece.type) {
    case 'pawn':
      return getPawnAttackMoves(board, position);
    case 'knight':
      return getKnightMoves(board, position);
    case 'bishop':
      return getBishopMoves(board, position);
    case 'rook':
      return getRookMoves(board, position);
    case 'queen':
      return getQueenMoves(board, position);
    case 'king':
      return getKingBasicMoves(board, position);
    default:
      return [];
  }
};

// Get all valid moves for a pawn
export const getPawnMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  enPassantTarget: Position | null
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece || piece.type !== 'pawn') return moves;

  const direction = piece.color === 'white' ? -1 : 1;
  const startingRow = piece.color === 'white' ? 6 : 1;

  // Forward move (1 square)
  const oneForward = { row: position.row + direction, col: position.col };
  if (isPositionValid(oneForward) && !board[oneForward.row][oneForward.col]) {
    moves.push(oneForward);

    // Forward move (2 squares from starting position)
    if (position.row === startingRow) {
      const twoForward = { row: position.row + 2 * direction, col: position.col };
      if (isPositionValid(twoForward) && !board[twoForward.row][twoForward.col]) {
        moves.push(twoForward);
      }
    }
  }

  // Capture moves (diagonally)
  for (const colOffset of [-1, 1]) {
    const captureMove = { row: position.row + direction, col: position.col + colOffset };
    if (isPositionValid(captureMove)) {
      const targetPiece = board[captureMove.row][captureMove.col];
      // Normal capture
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push(captureMove);
      }
      // En passant capture
      else if (
        enPassantTarget &&
        enPassantTarget.row === captureMove.row &&
        enPassantTarget.col === captureMove.col
      ) {
        moves.push(captureMove);
      }
    }
  }

  return moves;
};

// Get pawn attack moves (for check detection)
export const getPawnAttackMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece || piece.type !== 'pawn') return moves;

  const direction = piece.color === 'white' ? -1 : 1;

  // Capture moves (diagonally)
  for (const colOffset of [-1, 1]) {
    const captureMove = { row: position.row + direction, col: position.col + colOffset };
    if (isPositionValid(captureMove)) {
      moves.push(captureMove);
    }
  }

  return moves;
};

// Get all valid moves for a knight
export const getKnightMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece) return moves;

  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 },
  ];

  for (const move of knightMoves) {
    const newPosition = {
      row: position.row + move.row,
      col: position.col + move.col,
    };

    if (isPositionValid(newPosition)) {
      const targetPiece = board[newPosition.row][newPosition.col];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPosition);
      }
    }
  }

  return moves;
};

// Get all valid moves for a bishop
export const getBishopMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  const directions = [
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 },   // down-right
  ];
  return getSlidingMoves(board, position, directions);
};

// Get all valid moves for a rook
export const getRookMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];
  return getSlidingMoves(board, position, directions);
};

// Get all valid moves for a queen
export const getQueenMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  return [
    ...getBishopMoves(board, position),
    ...getRookMoves(board, position),
  ];
};

// Get all valid moves for sliding pieces (bishop, rook, queen)
export const getSlidingMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  directions: Position[]
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece) return moves;

  for (const direction of directions) {
    let currentPosition = { ...position };
    while (true) {
      currentPosition = {
        row: currentPosition.row + direction.row,
        col: currentPosition.col + direction.col,
      };

      if (!isPositionValid(currentPosition)) {
        break;
      }

      const targetPiece = board[currentPosition.row][currentPosition.col];
      if (!targetPiece) {
        // Empty square, valid move
        moves.push({ ...currentPosition });
      } else if (targetPiece.color !== piece.color) {
        // Enemy piece, valid capture and end of direction
        moves.push({ ...currentPosition });
        break;
      } else {
        // Friendly piece, end of direction
        break;
      }
    }
  }

  return moves;
};

// Get all valid moves for a king (basic moves without castling)
export const getKingBasicMoves = (
  board: (ChessPiece | null)[][],
  position: Position
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece) return moves;

  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                        { row: 0, col: 1 },
    { row: 1, col: -1 },  { row: 1, col: 0 },  { row: 1, col: 1 },
  ];

  for (const move of kingMoves) {
    const newPosition = {
      row: position.row + move.row,
      col: position.col + move.col,
    };

    if (isPositionValid(newPosition)) {
      const targetPiece = board[newPosition.row][newPosition.col];
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push(newPosition);
      }
    }
  }

  return moves;
};

// Get all valid moves for a king (including castling)
export const getKingMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  boardState: BoardState
): Position[] => {
  let moves = getKingBasicMoves(board, position);
  
  // Add castling moves
  const castlingMoves = getCastlingMoves(board, position, boardState);
  moves = [...moves, ...castlingMoves];
  
  return moves;
};

// Get castling moves for a king
export const getCastlingMoves = (
  board: (ChessPiece | null)[][],
  position: Position,
  boardState: BoardState
): Position[] => {
  const moves: Position[] = [];
  const piece = board[position.row][position.col];
  if (!piece || piece.type !== 'king' || piece.hasMoved) return moves;

  const { row } = position;
  const isWhite = piece.color === 'white';

  // Check if the king is in check
  if (isKingInCheck(board, piece.color)) {
    return moves;
  }

  // Kingside castling
  const kingsideRook = board[row][7];
  if (
    kingsideRook &&
    kingsideRook.type === 'rook' &&
    kingsideRook.color === piece.color &&
    !kingsideRook.hasMoved &&
    !board[row][5] &&
    !board[row][6]
  ) {
    // Check if squares between king and rook are not under attack
    const tempBoard = cloneBoard(board);
    tempBoard[row][5] = piece; // Simulate king moving one square towards rook
    tempBoard[row][4] = null;
    
    if (!isKingInCheck(tempBoard, piece.color)) {
      moves.push({ row, col: 6 }); // Castling move
    }
  }

  // Queenside castling
  const queensideRook = board[row][0];
  if (
    queensideRook &&
    queensideRook.type === 'rook' &&
    queensideRook.color === piece.color &&
    !queensideRook.hasMoved &&
    !board[row][1] &&
    !board[row][2] &&
    !board[row][3]
  ) {
    // Check if squares between king and rook are not under attack
    const tempBoard = cloneBoard(board);
    tempBoard[row][3] = piece; // Simulate king moving one square towards rook
    tempBoard[row][4] = null;
    
    if (!isKingInCheck(tempBoard, piece.color)) {
      moves.push({ row, col: 2 }); // Castling move
    }
  }

  return moves;
};

// Check if the game is over (checkmate or stalemate)
export const isGameOver = (boardState: BoardState): { 
  isCheckmate: boolean;
  isStalemate: boolean;
} => {
  const { board, currentTurn } = boardState;
  const isCheck = isKingInCheck(board, currentTurn);
  
  // Check if there are any legal moves available
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentTurn) {
        const position = { row, col };
        const moves = getValidMoves({ ...boardState, isCheck }, position);
        if (moves.length > 0) {
          return { isCheckmate: false, isStalemate: false };
        }
      }
    }
  }
  
  // No legal moves available
  return {
    isCheckmate: isCheck,
    isStalemate: !isCheck,
  };
};