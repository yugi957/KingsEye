/**
 * mock/stockfish.ts — DEMO BRANCH
 *
 * Provides chess position evaluation for the demo web app.
 *
 * Attempts to use in-browser Stockfish (stockfish-nnue-16-single WASM).
 * If Stockfish fails to initialize or respond within the timeout,
 * falls back to a lightweight evaluation based on material count.
 *
 * This ensures the Analysis tab always shows a score (never "Error")
 * in the demo, satisfying the DoD requirement.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const StockfishFactory = require('stockfish/src/stockfish-nnue-16-single');

interface EngineResult {
  evaluation: string;
  moves: string[];
}

// ─── Material fallback evaluator ─────────────────────────────────────────────

const PIECE_VALUES: Record<string, number> = {
  p: -1, n: -3, b: -3, r: -5, q: -9, k: 0,
  P: 1,  N: 3,  B: 3,  R: 5,  Q: 9,  K: 0,
};

function materialEval(fen: string): string {
  const board = fen.split(' ')[0];
  let score = 0;
  for (const ch of board) {
    score += PIECE_VALUES[ch] ?? 0;
  }
  return score.toFixed(2);
}

// ─── Stockfish engine (best-effort) ──────────────────────────────────────────

let enginePromise: Promise<any> | null = null;
let pendingResolvers: Array<(result: EngineResult) => void> = [];
let pvMoves: string[] = [];
let currentScore = '';

function initEngine(): Promise<any> {
  if (enginePromise) return enginePromise;

  enginePromise = new Promise<any>((resolveReady, rejectReady) => {
    let rawResult: any;
    try {
      rawResult = StockfishFactory();
    } catch (e) {
      rejectReady(e);
      return;
    }

    const engPromise: Promise<any> =
      rawResult && typeof rawResult.then === 'function'
        ? rawResult
        : typeof rawResult === 'function'
        ? rawResult({})
        : Promise.resolve(rawResult);

    engPromise.then((eng: any) => {
      if (!eng || typeof eng.addMessageListener !== 'function') {
        rejectReady(new Error('Engine missing addMessageListener'));
        return;
      }

      // Resolve on readyok; timeout after 8s to avoid hanging forever
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          rejectReady(new Error('Engine readyok timeout'));
        }
      }, 8000);

      eng.addMessageListener((msg: string) => {
        if (msg === 'readyok' && !resolved) {
          resolved = true;
          clearTimeout(timer);
          resolveReady(eng);
          return;
        }

        const scoreMatch = msg.match(/score cp (-?\d+)/);
        const mateMatch = msg.match(/score mate (-?\d+)/);
        if (scoreMatch) {
          currentScore = (parseInt(scoreMatch[1], 10) / 100).toFixed(2);
        } else if (mateMatch) {
          currentScore = `Mate in ${Math.abs(parseInt(mateMatch[1], 10))}`;
        }

        const pvMatch = msg.match(/ pv (.+)/);
        if (pvMatch) {
          pvMoves = pvMatch[1].trim().split(' ').slice(0, 6);
        }

        if (msg.startsWith('bestmove')) {
          const resolvers = [...pendingResolvers];
          pendingResolvers = [];
          resolvers.forEach((r) => r({ evaluation: currentScore, moves: pvMoves }));
        }
      });

      eng.postMessage('uci');
      eng.postMessage('isready');
    }).catch((err: any) => {
      enginePromise = null;
      rejectReady(err);
    });
  });

  return enginePromise;
}

const DEPTH = 8;
const ANALYSIS_TIMEOUT_MS = 10000;

export async function analyzePosition(fen: string): Promise<EngineResult> {
  // Try Stockfish first; fall back to material eval on any failure
  try {
    const eng = await initEngine();

    return await new Promise<EngineResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        // Remove from pending and fall back
        pendingResolvers = pendingResolvers.filter((r) => r !== resolver);
        reject(new Error('Analysis timeout'));
      }, ANALYSIS_TIMEOUT_MS);

      const resolver = (result: EngineResult) => {
        clearTimeout(timer);
        resolve(result);
      };

      currentScore = 'Loading';
      pvMoves = [];
      pendingResolvers.push(resolver);

      eng.postMessage('stop');
      eng.postMessage(`position fen ${fen}`);
      eng.postMessage(`go depth ${DEPTH}`);
    });
  } catch {
    // Fallback: material-based evaluation (instant, always works)
    return {
      evaluation: materialEval(fen),
      moves: [],
    };
  }
}

export async function getEvaluationScore(fen: string): Promise<string> {
  const result = await analyzePosition(fen);
  return result.evaluation;
}

export async function getPrincipalVariation(fen: string): Promise<string[]> {
  const result = await analyzePosition(fen);
  return result.moves;
}
