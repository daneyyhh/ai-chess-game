// Main Application Logic
let game;
let selectedSquare = null;
let validMoves = [];
let gameTimer = null;
let startTime = 0;
let elapsedTime = 0;

// Initialize the game
function initGame() {
    game = new ChessEngine();
    renderBoard();
    updateScores();
    updateTurnIndicator();
    updateStatusMessage('Game started! White moves first.');
        startTimer();

}

// Render the chess board
function renderBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = game.board[row][col];
            if (piece) {
                const pieceSpan = document.createElement('span');
                pieceSpan.className = 'piece';
                pieceSpan.textContent = piece;
                square.appendChild(pieceSpan);
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}

// Handle square click
function handleSquareClick(row, col) {
    const square = game.board[row][col];
    
    // If no piece is selected
    if (!selectedSquare) {
        if (square && game.getPieceColor(square) === game.currentPlayer) {
            selectSquare(row, col);
        }
    } else {
        // Try to make a move
        const [selectedRow, selectedCol] = selectedSquare;
        
        if (row === selectedRow && col === selectedCol) {
            // Deselect if clicking same square
            deselectSquare();
        } else if (game.isValidMove(selectedRow, selectedCol, row, col)) {
            makePlayerMove(selectedRow, selectedCol, row, col);
                        checkWinner();
        } else if (square && game.getPieceColor(square) === game.currentPlayer) {
            // Select different piece
            deselectSquare();
            selectSquare(row, col);
        } else {
            deselectSquare();
        }
    }
}

// Select a square
function selectSquare(row, col) {
    selectedSquare = [row, col];
    const piece = game.board[row][col];
    validMoves = game.getPieceMoves(piece, row, col).filter(([toRow, toCol]) => 
        game.isValidMove(row, col, toRow, toCol)
    );
    
    highlightSquares();
}

// Deselect square
function deselectSquare() {
    selectedSquare = null;
    validMoves = [];
    renderBoard();
}

// Highlight selected square and valid moves
function highlightSquares() {
    renderBoard();
    
    if (selectedSquare) {
        const [row, col] = selectedSquare;
        const squares = document.querySelectorAll('.square');
        const selectedElement = squares[row * 8 + col];
        selectedElement.classList.add('selected');
        
        validMoves.forEach(([moveRow, moveCol]) => {
            const moveElement = squares[moveRow * 8 + moveCol];
            moveElement.classList.add('valid-move');
        });
    }
}

// Make player move
function makePlayerMove(fromRow, fromCol, toRow, toCol) {
    const piece = game.board[fromRow][fromCol];
    const capturedPiece = game.board[toRow][toCol];
    
    // Add moving animation
    const squares = document.querySelectorAll('.square');
    const fromSquare = squares[fromRow * 8 + fromCol];
    const toSquare = squares[toRow * 8 + toCol];
    const pieceElement = fromSquare.querySelector('.piece');
    
    if (pieceElement) {
        pieceElement.classList.add('moving');
    }
    
    if (capturedPiece && toSquare.querySelector('.piece')) {
        toSquare.querySelector('.piece').classList.add('captured');
    }
    
    setTimeout(() => {
        game.makeMove(fromRow, fromCol, toRow, toCol);
        deselectSquare();
        updateScores();
        updateTurnIndicator();
        updateMoveHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
        
        if (game.currentPlayer === 'black') {
            updateStatusMessage('AI is thinking...');
            setTimeout(makeAIMove, 800);
        } else {
            updateStatusMessage('Your turn! Make a move.');
        }
    }, 500);
}

// Make AI move
function makeAIMove() {
    const aiMove = game.getAIMove();
    
    if (aiMove) {
        const [fromRow, fromCol] = aiMove.from;
        const [toRow, toCol] = aiMove.to;
        const piece = game.board[fromRow][fromCol];
        const capturedPiece = game.board[toRow][toCol];
        
        game.makeMove(fromRow, fromCol, toRow, toCol);
        renderBoard();
        updateScores();
        updateTurnIndicator();
        updateMoveHistory(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
        updateStatusMessage('Your turn! Make a move.');
    } else {
        updateStatusMessage('AI has no valid moves!');
    }
}

// Update scores
function updateScores() {
    document.getElementById('playerScore').textContent = `Score: ${game.scores.white}`;
    document.getElementById('aiScore').textContent = `Score: ${game.scores.black}`;
    
    // Update captured pieces
    updateCapturedPieces('playerCaptures', game.capturedPieces.white);
    updateCapturedPieces('aiCaptures', game.capturedPieces.black);
}

// Update captured pieces display
function updateCapturedPieces(elementId, pieces) {
    const element = document.getElementById(elementId);
    element.innerHTML = pieces.join(' ');
}

// Update turn indicator
function updateTurnIndicator() {
    const indicator = document.getElementById('turnIndicator');
    indicator.textContent = game.currentPlayer === 'white' 
        ? "White's Turn (You)" 
        : "Black's Turn (AI)";
}

// Update status message
function updateStatusMessage(message) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
}

// Update move history
function updateMoveHistory(piece, fromRow, fromCol, toRow, toCol, captured) {
    const moveList = document.getElementById('moveList');
    const moveItem = document.createElement('div');
    moveItem.className = 'move-item';
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fromSquare = files[fromCol] + (8 - fromRow);
    const toSquare = files[toCol] + (8 - toRow);
    
    moveItem.textContent = `${piece} ${fromSquare} → ${toSquare}${captured ? ' ✕' + captured : ''}`;
    moveList.appendChild(moveItem);
    moveList.scrollTop = moveList.scrollHeight;
}

// Button event listeners
document.getElementById('newGameBtn').addEventListener('click', () => {
    if (confirm('Start a new game? Current progress will be lost.')) {
        initGame();
        document.getElementById('moveList').innerHTML = '';
    }
});

document.getElementById('undoBtn').addEventListener('click', () => {
    if (game.undoLastMove()) {
        // Undo twice to go back to player's turn
        if (game.currentPlayer === 'black') {
            game.undoLastMove();
        }
        renderBoard();
        updateScores();
        updateTurnIndicator();
        updateStatusMessage('Move undone. Make your move.');
        
        // Remove last two moves from history
        const moveList = document.getElementById('moveList');
        if (moveList.lastChild) moveList.removeChild(moveList.lastChild);
        if (moveList.lastChild) moveList.removeChild(moveList.lastChild);
    } else {
        updateStatusMessage('No moves to undo!');
    }
});

document.getElementById('hintBtn').addEventListener('click', () => {
    if (game.currentPlayer === 'white' && !selectedSquare) {
        // Find a good move for the player
        const allMoves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = game.board[row][col];
                if (piece && game.getPieceColor(piece) === 'white') {
                    const moves = game.getPieceMoves(piece, row, col);
                    moves.forEach(([toRow, toCol]) => {
                        if (game.isValidMove(row, col, toRow, toCol)) {
                            const value = game.board[toRow][toCol] 
                                ? game.getPieceValue(game.board[toRow][toCol]) 
                                : 0;
                            allMoves.push({ from: [row, col], to: [toRow, toCol], value });
                        }
                    });
                }
            }
        }
        
        if (allMoves.length > 0) {
            allMoves.sort((a, b) => b.value - a.value);
            const hint = allMoves[0];
            selectSquare(hint.from[0], hint.from[1]);
            updateStatusMessage('Hint: Consider this piece and highlighted moves!');
        }
    }
});

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);

// Timer functions
function startTimer() {
    startTime = Date.now() - elapsedTime;
    gameTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    document.getElementById('timer').textContent = `⏱ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    document.getElementById('timer').textContent = '⏱ 00:00';
}

// Winner detection
function checkWinner() {
    const whiteKing = game.board.flat().find(p => p && p.type === 'king' && p.color === 'white');
    const blackKing = game.board.flat().find(p => p && p.type === 'king' && p.color === 'black');
    
    if (!whiteKing) {
        showWinnerModal('AI (Black) Wins!', '🤖');
        return true;
    }
    if (!blackKing) {
        showWinnerModal('You Win!', '🎉');
        return true;
    }
    
    if (game.isCheckmate()
        const winner = game.currentPlayer === 'white' ? 'AI (Black) Wins!' : 'You Win!';
        const emoji = game.currentPlayer === 'white' ? '🤖' : '🎉';
        showWinnerModal(winner, emoji);
        return true;
    }
    
    return false;
}

function showWinnerModal(winnerText, emoji) {
    stopTimer();
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    
    document.getElementById('winnerTitle').textContent = emoji;
    document.getElementById('winnerText').textContent = winnerText;
    document.getElementById('finalTime').textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('winnerModal').classList.add('show');
}

document.getElementById('playAgainBtn').addEventListener('click', () => {
    document.getElementById('winnerModal').classList.remove('show');
    resetTimer();
    initGame();
});
