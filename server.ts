import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Veggie Game Server-Side State
interface GameState {
  timeLeft: number;
  gameState: 'betting' | 'spinning' | 'result';
  winnerIdx: number | null;
  history: string[];
}

const items = [
  { name: 'corn', emoji: '🌽', weight: 18 },
  { name: 'tomato', emoji: '🍅', weight: 18 },
  { name: 'broccoli', emoji: '🥦', weight: 18 },
  { name: 'pepper', emoji: '🌶️', weight: 18 },
  { name: 'fish', emoji: '🐟', weight: 5 },
  { name: 'carrot', emoji: '🥕', weight: 18 },
  { name: 'shrimp', emoji: '🍤', weight: 10 },
  { name: 'chicken', emoji: '🐔', weight: 2 },
];

let globalGameState: GameState = {
  timeLeft: 19,
  gameState: 'betting',
  winnerIdx: null,
  history: ['🌽', '🍅', '🥦', '🌶️', '🥕', '🍤', '🐔', '🌽']
};

// Start the server game loop tick
setInterval(() => {
  if (globalGameState.gameState === 'betting') {
    if (globalGameState.timeLeft <= 1) {
      // Transition to spinning
      globalGameState.gameState = 'spinning';
      globalGameState.timeLeft = 8; // 8 seconds total spinner and result view

      // Determine winner based on weights
      const random = Math.random() * 100;
      let sum = 0;
      let selectedIdx = 0;
      for (let i = 0; i < items.length; i++) {
        sum += items[i].weight;
        if (random <= sum) {
          selectedIdx = i;
          break;
        }
      }
      globalGameState.winnerIdx = selectedIdx;
      
      // Update history (add to front, limit to 16)
      const winningEmoji = items[selectedIdx].emoji;
      globalGameState.history = [winningEmoji, ...globalGameState.history].slice(0, 16);
    } else {
      globalGameState.timeLeft -= 1;
    }
  } else if (globalGameState.gameState === 'spinning') {
    if (globalGameState.timeLeft <= 1) {
      // Return to betting
      globalGameState.gameState = 'betting';
      globalGameState.timeLeft = 19;
      globalGameState.winnerIdx = null;
    } else {
      globalGameState.timeLeft -= 1;
    }
  }
}, 1000);

// API Endpoint to get the global game state
app.get("/api/veggie-game/state", (req, res) => {
  res.json(globalGameState);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
