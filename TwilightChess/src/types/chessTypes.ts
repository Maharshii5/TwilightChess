export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean; // Used for castling and pawn first move
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  promotionPiece?: PieceType;
}

export interface BoardState {
  board: (ChessPiece | null)[][];
  currentTurn: PieceColor;
  moveHistory: Move[];
  selectedPosition: Position | null;
  validMoves: Position[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  enPassantTarget: Position | null;
  showPromotionDialog: boolean;
  promotionPosition: Position | null;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';