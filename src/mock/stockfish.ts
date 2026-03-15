/**
 * mock/stockfish.ts — DEMO BRANCH
 *
 * In-browser Stockfish analysis using the `stockfish` npm package.
 * Replaces the two Heroku endpoints:
 *   GET /evaluationScore?fen=...   → getEvaluationScore(fen)
 *   GET /principalVariation?fen=.. → getPrincipalVariation(fen)
 *
 * Uses a shared Worker so the engine is only initialized once.
 */

// The `stockfish` package exposes a factory function that returns a Worker-like object
// compatible with both browser (Web Worker) and Node environments.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stockfish = require('stockfish');

interface EngineResult {
  evaluation: string;
  moves: string[];
}

let engine: any = null;
let engineReady = false;
let pendingResolvers: Array<(result: EngineResult) => void> = [];
let currentFen = '';
let pvMoves: string[] = [];
let currentScore = '';

function getEngine() {
  if (engine) return engine;

  engine = Stockfish();

  engine.onmessage = (event: any) => {
    const msg: string = typeof event === 'string' ? event : event.data;

    if (msg === 'readyok') {
      engineReady = true;
      return;
    }

    // Parse score
    const scoreMatch = msg.match(/score cp (-?\d+)/);
    const mateMatch = msg.match(/score mate (-?\d+)/);
    if (scoreMatch) {
      const cp = parseInt(scoreMatch[1], 10);
      currentScore = (cp / 100).toFixed(2);
    } else if (mateMatch) {
      currentScore = `Mate in ${Math.abs(parseInt(mateMatch[1], 10))}`;
    }

    // Parse principal variation
    const pvMatch = msg.match(/ pv (.+)/);
    if (pvMatch) {
      pvMoves = pvMatch[1].trim().split(' ').slice(0, 6);
    }

    // Bestmove signals analysis complete
    if (msg.startsWith('bestmove')) {
      const resolvers = [...pendingResolvers];
      pendingResolvers = [];
      const result: EngineResult = { evaluation: currentScore, moves: pvMoves };
      resolvers.forEach((r) => r(result));
    }
  };

  engine.postMessage('uci');
  engine.postMessage('isready');

  return engine;
}

const DEPTH = 12;

export async function analyzePosition(fen: string): Promise<EngineResult> {
  return new Promise((resolve) => {
    const eng = getEngine();

    currentFen = fen;
    currentScore = 'Loading';
    pvMoves = [];
    pendingResolvers.push(resolve);

    // Stop any ongoing search first
    eng.postMessage('stop');
    eng.postMessage(`position fen ${fen}`);
    eng.postMessage(`go depth ${DEPTH}`);
  });
}

export async function getEvaluationScore(fen: string): Promise<string> {
  const result = await analyzePosition(fen);
  return result.evaluation;
}

export async function getPrincipalVariation(fen: string): Promise<string[]> {
  const result = await analyzePosition(fen);
  return result.moves;
}
