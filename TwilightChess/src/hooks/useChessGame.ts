import { useState, useCallback, useEffect } from 'react';
import { BoardState, ChessPiece, PieceColor, PieceType, Position } from '../types/chessTypes';
import { initializeBoard, cloneBoard } from '../utils/boardUtils';
import { getValidMoves, isKingInCheck, isGameOver } from '../utils/moveValidator';
import { getAIMove } from '../utils/aiPlayer';

const useChessGame = (initialPlayerColor: PieceColor = 'white') => {
  const [boardState, setBoardState] = useState<BoardState>({
    board: initializeBoard(),
    currentTurn: 'white',
    moveHistory: [],
    selectedPosition: null,
    validMoves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    enPassantTarget: null,
    showPromotionDialog: false,
    promotionPosition: null,
  });
  
  const [playerColor, setPlayerColor] = useState<PieceColor>(initialPlayerColor);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);

  const initGame = useCallback((newPlayerColor: PieceColor = 'white') => {
    setPlayerColor(newPlayerColor);
    setBoardState({
      board: initializeBoard(),
      currentTurn: 'white',
      moveHistory: [],
      selectedPosition: null,
      validMoves: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      enPassantTarget: null,
      showPromotionDialog: false,
      promotionPosition: null,
    });
  }, []);

  const selectPiece = useCallback((position: Position) => {
    const { board, currentTurn } = boardState;
    const piece = board[position.row][position.col];

    // Only allow selecting pieces during the player's turn
    if (!piece || piece.color !== currentTurn || currentTurn !== playerColor) {
      setBoardState(prev => ({
        ...prev,
        selectedPosition: null,
        validMoves: [],
      }));
      return;
    }

    const validMoves = getValidMoves(boardState, position);

    setBoardState(prev => ({
      ...prev,
      selectedPosition: position,
      validMoves,
    }));
  }, [boardState, playerColor]);

  const movePiece = useCallback((to: Position) => {
    if (!boardState.selectedPosition) return;

    const from = boardState.selectedPosition;
    const { board, currentTurn, moveHistory, enPassantTarget } = boardState;
    
    // Get the piece being moved
    const piece = board[from.row][from.col];
    if (!piece) return;

    // Check if the move is valid
    const isValidMove = boardState.validMoves.some(
      move => move.row === to.row && move.col === to.col
    );

    if (!isValidMove) return;

    // Create a copy of the board
    const newBoard = cloneBoard(board);
    
    // Check if the move is a pawn that needs promotion
    if (
      piece.type === 'pawn' &&
      ((piece.color === 'white' && to.row === 0) || 
       (piece.color === 'black' && to.row === 7))
    ) {
      setBoardState(prev => ({
        ...prev,
        showPromotionDialog: true,
        promotionPosition: to,
      }));
      return;
    }

    // Handle special moves
    let newEnPassantTarget: Position | null = null;
    const capturedPiece = newBoard[to.row][to.col];

    // Handle en passant capture
    if (
      piece.type === 'pawn' &&
      enPassantTarget &&
      to.row === enPassantTarget.row &&
      to.col === enPassantTarget.col
    ) {
      // Remove the captured pawn
      const captureRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
      newBoard[captureRow][to.col] = null;
    }

    // Set en passant target if pawn moves two squares
    if (
      piece.type === 'pawn' &&
      Math.abs(from.row - to.row) === 2
    ) {
      const targetRow = piece.color === 'white' ? from.row - 1 : from.row + 1;
      newEnPassantTarget = { row: targetRow, col: from.col };
    }

    // Handle castling
    if (
      piece.type === 'king' &&
      !piece.hasMoved &&
      Math.abs(from.col - to.col) === 2
    ) {
      // Determine if kingside or queenside castling
      const isKingside = to.col > from.col;
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;

      // Move the rook
      newBoard[from.row][rookToCol] = newBoard[from.row][rookFromCol];
      newBoard[from.row][rookFromCol] = null;

      // Mark the rook as moved
      if (newBoard[from.row][rookToCol]) {
        newBoard[from.row][rookToCol].hasMoved = true;
      }
    }

    // Move the piece and mark it as moved
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    // Switch turns
    const nextTurn = currentTurn === 'white' ? 'black' : 'white';
    
    // Check for check, checkmate, stalemate
    const isCheck = isKingInCheck(newBoard, nextTurn);
    const { isCheckmate, isStalemate } = isGameOver({
      ...boardState,
      board: newBoard,
      currentTurn: nextTurn,
      isCheck,
    });

    // Update move history
    const newMove = {
      from,
      to,
      piece,
      capturedPiece,
      isEnPassant: enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col,
      isCastling: piece.type === 'king' && Math.abs(from.col - to.col) === 2,
    };

    // Update the board state
    setBoardState(prev => ({
      ...prev,
      board: newBoard,
      currentTurn: nextTurn,
      moveHistory: [...moveHistory, newMove],
      selectedPosition: null,
      validMoves: [],
      isCheck,
      isCheckmate,
      isStalemate,
      enPassantTarget: newEnPassantTarget,
    }));
  }, [boardState]);

  const promotePawn = useCallback((promotionPiece: PieceType) => {
    const { board, selectedPosition, promotionPosition, currentTurn, moveHistory } = boardState;
    
    if (!selectedPosition || !promotionPosition) return;
    
    const from = selectedPosition;
    const to = promotionPosition;
    
    // Create a copy of the board
    const newBoard = cloneBoard(board);
    
    // Get the piece being moved
    const piece = newBoard[from.row][from.col];
    if (!piece) return;
    
    // Capture piece if present
    const capturedPiece = newBoard[to.row][to.col];
    
    // Promote the pawn
    newBoard[to.row][to.col] = {
      type: promotionPiece,
      color: piece.color,
      hasMoved: true,
    };
    
    // Remove the original pawn
    newBoard[from.row][from.col] = null;
    
    // Switch turns
    const nextTurn = currentTurn === 'white' ? 'black' : 'white';
    
    // Check for check, checkmate, stalemate
    const isCheck = isKingInCheck(newBoard, nextTurn);
    const { isCheckmate, isStalemate } = isGameOver({
      ...boardState,
      board: newBoard,
      currentTurn: nextTurn,
      isCheck,
    });
    
    // Update move history
    const newMove = {
      from,
      to,
      piece,
      capturedPiece,
      isPromotion: true,
      promotionPiece,
    };
    
    // Update the board state
    setBoardState(prev => ({
      ...prev,
      board: newBoard,
      currentTurn: nextTurn,
      moveHistory: [...moveHistory, newMove],
      selectedPosition: null,
      validMoves: [],
      isCheck,
      isCheckmate,
      isStalemate,
      showPromotionDialog: false,
      promotionPosition: null,
    }));
  }, [boardState]);

  const makeAIMove = useCallback(() => {
    if (boardState.currentTurn !== playerColor && 
        !boardState.isCheckmate && 
        !boardState.isStalemate) {
      setIsAIThinking(true);
      
      // Add a small delay to simulate thinking
      setTimeout(() => {
        const aiMove = getAIMove(boardState);
        
        if (aiMove) {
          // Select the piece first
          setBoardState(prev => {
            const validMoves = getValidMoves(prev, aiMove.from);
            return {
              ...prev,
              selectedPosition: aiMove.from,
              validMoves,
            };
          });
          
          // Then make the move
          setTimeout(() => {
            movePiece(aiMove.to);
            setIsAIThinking(false);
          }, 300);
        } else {
          setIsAIThinking(false);
        }
      }, 500);
    }
  }, [boardState, playerColor, movePiece]);

  useEffect(() => {
    if (boardState.currentTurn !== playerColor && 
        !boardState.isCheckmate && 
        !boardState.isStalemate && 
        !boardState.showPromotionDialog && 
        !isAIThinking) {
      makeAIMove();
    }
  }, [boardState, playerColor, makeAIMove, isAIThinking]);

  return {
    boardState,
    playerColor,
    isAIThinking,
    selectPiece,
    movePiece,
    promotePawn,
    initGame,
  };
};

export default useChessGame;