# AI Chess Game

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Modern-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Animations-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, responsive chess web application featuring player-versus-machine gameplay powered by a custom JavaScript chess engine with recursive Minimax evaluation and heuristic positional scoring.

---

## ✦ Overview

The **AI Chess Game** is a client-side chess application designed to simulate standard FIDE rules with an intelligent AI opponent. Built without heavyweight external dependencies, the game combines an object-oriented rule validation engine with a responsive, animated UI that tracks move histories, captured pieces, and real-time score differentials.

---

## ✨ Features

- **Full Chess Engine & Move Validation**:
  - Enforces standard legal moves for Pawns, Knights, Bishops, Rooks, Queens, and Kings.
  - Check, checkmate, and stalemate condition detection.
  - Pawn promotion, castling, and en passant handling.
- **Intelligent Minimax AI**:
  - Recursive minimax algorithm with dynamic material evaluation.
  - Positional piece-square tables rewarding piece development, center control, and king safety.
  - Automated countermoves with simulated thinking delay for natural gameplay pacing.
- **Interactive UI & Visual Feedback**:
  - Animated board with legal move highlighting (valid destinations and capture indicators).
  - Dynamic score differential tracker reflecting current piece advantages.
  - Captured pieces trays for both White and Black.
  - Move history notation log.
  - One-click Move Undo and Board Reset controls.
- **Responsive & Lightweight**:
  - Zero external npm framework dependencies.
  - Smooth CSS3 grid layout and transition animations.
  - Plays seamlessly across desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Logic & Engine** | Vanilla JavaScript (ES6+) | Game state, move generation, Minimax AI evaluation |
| **Interface** | HTML5 Semantic Elements | Board structure, controls, and game stats panels |
| **Styling** | CSS3 (Flexbox, Grid, Animations) | Smooth transitions, move highlights, responsive layout |
| **Asset Engine** | Native Unicode Chess Glyphs | Crisp, resolution-independent piece rendering |

---

## 🏗️ Architecture & Engine Design

`
┌────────────────────────────────────────────────────────┐
│                   USER INTERFACE (app.js)              │
│   - Board DOM Rendering & Event Listeners              │
│   - Move Highlighting & Animation Transitions          │
│   - Move History Display & Captured Pieces Counter     │
└───────────────────────────┬────────────────────────────┘
                            │ User Clicks & Input
                            ▼
┌────────────────────────────────────────────────────────┐
│               CHESS ENGINE (chess-engine.js)           │
│   - Board Representation (8x8 Array)                   │
│   - Legal Move Generation & Collision Checking         │
│   - Game State Evaluator (Check / Checkmate)           │
└───────────────────────────┬────────────────────────────┘
                            │ Evaluate Board State
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MINIMAX AI ALGORITHM                 │
│   - Recursive Tree Search                              │
│   - Material Value Heuristics (Q:9, R:5, B:3, N:3, P:1)│
│   - Positional Piece-Square Weighting                  │
└────────────────────────────────────────────────────────┘
`

---

## 🚀 Running Locally

### Prerequisites
- Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### Quick Start

1. **Clone the repository**:
   `ash
   git clone https://github.com/daneyyhh/ai-chess-game.git
   cd ai-chess-game
   `

2. **Launch the game**:
   - Double-click index.html to open it directly in your default browser.
   - Alternatively, run a local web server:
     `ash
     npx serve .
     `
   - Navigate to http://localhost:3000.

---

## 📁 Project Structure

`	ext
ai-chess-game/
├── index.html        # Game layout, board container, score panels & controls
├── style.css         # Chessboard grid, piece styling, highlights & animations
├── chess-engine.js   # Core ChessEngine class, move generation & Minimax AI
├── app.js            # DOM controller, sound triggers, event orchestration
└── README.md         # Comprehensive project documentation
`

---

## 🎯 Gameplay Controls

- **Select Piece**: Click on any of your pieces (White) to view highlighted valid moves.
- **Execute Move**: Click on any highlighted square to move or capture.
- **Undo Move**: Click the **Undo** button to revert the previous turn.
- **New Game**: Click the **Reset** button to start a fresh match.

---

## 👤 Author

**Reuben Binu George** (**REUBG DEV**)
- Portfolio: [reubg.in](https://reubg.in) • [reubg.dev](https://reubg.dev)
- GitHub: [@daneyyhh](https://github.com/daneyyhh)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).