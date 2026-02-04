// Chess Engine with AI
class ChessEngine {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.scores = { white: 0, black: 0 };
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Black pieces
        board[0] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
        board[1] = Array(8).fill('♟');
        
        // White pieces
        board[6] = Array(8).fill('♙');
        board[7] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
        
        return board;
    }

    getPieceColor(piece) {
        if (!piece) return null;
        const whitePieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
        return whitePieces.includes(piece) ? 'white' : 'black';
    }

    getPieceValue(piece) {
        const values = {
            '♙': 1, '♟': 1,
            '♘': 3, '♞': 3,
            '♗': 3, '♝': 3,
            '♖': 5, '♜': 5,
            '♕': 9, '♛': 9,
            '♔': 0, '♚': 0
        };
        return values[piece] || 0;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        const pieceColor = this.getPieceColor(piece);
        if (pieceColor !== this.currentPlayer) return false;
        
        const targetPiece = this.board[toRow][toCol];
        if (targetPiece && this.getPieceColor(targetPiece) === pieceColor) {
            return false;
        }
        
        return this.getPieceMoves(piece, fromRow, fromCol).some(
            move => move[0] === toRow && move[1] === toCol
        );
    }

    getPieceMoves(piece, row, col) {
        const moves = [];
        const color = this.getPieceColor(piece);
        const pieceType = piece.toLowerCase();
        
        // Pawn moves
        if (pieceType === '♙' || pieceType === '♟') {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? 6 : 1;
            
            // Forward move
            if (this.isWithinBoard(row + direction, col) && !this.board[row + direction][col]) {
                moves.push([row + direction, col]);
                
                // Double move from start
                if (row === startRow && !this.board[row + 2 * direction][col]) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            
            // Diagonal capture
            for (const dcol of [-1, 1]) {
                const newRow = row + direction;
                const newCol = col + dcol;
                if (this.isWithinBoard(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (target && this.getPieceColor(target) !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            }
        }
        
        // Rook moves
        if (pieceType === '♖' || pieceType === '♜') {
            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            this.addLinearMoves(moves, row, col, directions, color);
        }
        
        // Bishop moves
        if (pieceType === '♗' || pieceType === '♝') {
            const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            this.addLinearMoves(moves, row, col, directions, color);
        }
        
        // Queen moves
        if (pieceType === '♕' || pieceType === '♛') {
            const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
            this.addLinearMoves(moves, row, col, directions, color);
        }
        
        // Knight moves
        if (pieceType === '♘' || pieceType === '♞') {
            const knightMoves = [
                [2, 1], [2, -1], [-2, 1], [-2, -1],
                [1, 2], [1, -2], [-1, 2], [-1, -2]
            ];
            for (const [dr, dc] of knightMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isWithinBoard(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (!target || this.getPieceColor(target) !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            }
        }
        
        // King moves
        if (pieceType === '♔' || pieceType === '♚') {
            const kingMoves = [
                [0, 1], [0, -1], [1, 0], [-1, 0],
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ];
            for (const [dr, dc] of kingMoves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isWithinBoard(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (!target || this.getPieceColor(target) !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            }
        }
        
        return moves;
    }

    addLinearMoves(moves, row, col, directions, color) {
        for (const [dr, dc] of directions) {
            let newRow = row + dr;
            let newCol = col + dc;
            
            while (this.isWithinBoard(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else {
                    if (this.getPieceColor(target) !== color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
                newRow += dr;
                newCol += dc;
            }
        }
    }

    isWithinBoard(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        if (capturedPiece) {
            const capturedColor = this.getPieceColor(capturedPiece);
            this.capturedPieces[this.currentPlayer].push(capturedPiece);
            this.scores[this.currentPlayer] += this.getPieceValue(capturedPiece);
        }
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        this.moveHistory.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: capturedPiece,
            player: this.currentPlayer
        });
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        return true;
    }

    undoLastMove() {
        if (this.moveHistory.length === 0) return false;
        
        const lastMove = this.moveHistory.pop();
        const [fromRow, fromCol] = lastMove.from;
        const [toRow, toCol] = lastMove.to;
        
        this.board[fromRow][fromCol] = lastMove.piece;
        this.board[toRow][toCol] = lastMove.captured;
        
        if (lastMove.captured) {
            this.capturedPieces[lastMove.player].pop();
            this.scores[lastMove.player] -= this.getPieceValue(lastMove.captured);
        }
        
        this.currentPlayer = lastMove.player;
        return true;
    }

    evaluateBoard() {
        let score = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const value = this.getPieceValue(piece);
                    if (this.getPieceColor(piece) === 'black') {
                        score += value;
                    } else {
                        score -= value;
                    }
                }
            }
        }
        return score;
    }

    getAIMove() {
        const allMoves = [];
        
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.getPieceColor(piece) === 'black') {
                    const moves = this.getPieceMoves(piece, fromRow, fromCol);
                    for (const [toRow, toCol] of moves) {
                        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                            const capturedValue = this.board[toRow][toCol] 
                                ? this.getPieceValue(this.board[toRow][toCol]) 
                                : 0;
                            allMoves.push({
                                from: [fromRow, fromCol],
                                to: [toRow, toCol],
                                score: capturedValue + Math.random() * 0.5
                            });
                        }
                    }
                }
            }
        }
        
        if (allMoves.length === 0) return null;
        
        allMoves.sort((a, b) => b.score - a.score);
        return allMoves[0];
    }

    isCheckmate() {
        // Simplified checkmate detection        return false;    isCheckmate() {
        // Check if current player has any valid moves
        const hasValidMoves = this.hasAnyValidMoves(this.currentPlayer);
        
        if (!hasValidMoves) {
            // Check if king is in check
            const kingInCheck = this.isKingInCheck(this.currentPlayer);
            return kingInCheck;
        }
        return false;
    }

    hasAnyValidMoves(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && this.getPieceColor(piece) === color) {
                    const moves = this.getPieceMoves(piece, fromRow, fromCol);
                    for (const [toRow, toCol] of moves) {
                        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                            // Test if move would leave king in check
                            const tempBoard = this.copyBoard();
                            const tempPiece = this.board[toRow][toCol];
                            this.board[toRow][toCol] = piece;
                            this.board[fromRow][fromCol] = null;
                            
                            const kingInCheck = this.isKingInCheck(color);
                            
                            // Restore board
                            this.board[fromRow][fromCol] = piece;
                            this.board[toRow][toCol] = tempPiece;
                            
                            if (!kingInCheck) return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    isKingInCheck(color) {
        // Find king position
        let kingRow = -1, kingCol = -1;
        const kingPiece = color === 'white' ? '♔' : '♚';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingPiece) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }
        
        if (kingRow === -1) return false; // King not found
        
        // Check if any opponent piece can attack the king
        const opponentColor = color === 'white' ? 'black' : 'white';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && this.getPieceColor(piece) === opponentColor) {
                    const moves = this.getPieceMoves(piece, row, col);
                    if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    isStalemate() {
        // Stalemate: Player has no valid moves but king is not in check
        const hasValidMoves = this.hasAnyValidMoves(this.currentPlayer);
        const kingInCheck = this.isKingInCheck(this.currentPlayer);
        return !hasValidMoves && !kingInCheck;
    }
    copyBoard() {
        return this.board.map(row => [...row]);
    }    }

    isStalemate() {
        return false;
    }
}
