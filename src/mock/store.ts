/**
 * mock/store.ts — DEMO BRANCH
 *
 * localStorage-backed game store. Replaces all Heroku API calls for
 * user data and game CRUD. Pre-seeded with a demo user and 3 sample games.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const GAMES_KEY = 'demo_games';
const USER_KEY = 'demo_user';

// ─── Types ───

export interface DemoGame {
  gameID: number;
  title: string;
  status: 'Win' | 'Loss' | 'Draw' | 'Playing' | 'Unknown';
  side: 'White' | 'Black';
  opponentName: string;
  moves: string[];
  date: string;
  starred: boolean;
}

export interface DemoUser {
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

// ─── Seed data ───

const SEED_GAMES: DemoGame[] = [
  {
    gameID: 1,
    title: 'Sicilian Defense',
    status: 'Win',
    side: 'White',
    opponentName: 'Magnus Demo',
    moves: [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
    ],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    starred: true,
  },
  {
    gameID: 2,
    title: "Queen's Gambit",
    status: 'Loss',
    side: 'Black',
    opponentName: 'Fischer Demo',
    moves: [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
      'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
      'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    ],
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    starred: false,
  },
  {
    gameID: 3,
    title: 'Italian Game',
    status: 'Draw',
    side: 'White',
    opponentName: 'Kasparov Demo',
    moves: [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    ],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    starred: false,
  },
];

const SEED_USER: DemoUser = {
  email: 'demo@kingseye.app',
  firstName: 'Demo',
  lastName: 'User',
  profileImage: 'none',
};

// ─── Initialization ───

let _initialized = false;

async function ensureSeeded(): Promise<void> {
  if (_initialized) return;
  _initialized = true;

  const existing = await AsyncStorage.getItem(GAMES_KEY);
  if (!existing) {
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(SEED_GAMES));
  }
  const existingUser = await AsyncStorage.getItem(USER_KEY);
  if (!existingUser) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(SEED_USER));
  }
}

// ─── Game CRUD ───

export async function getGames(_email: string): Promise<DemoGame[]> {
  await ensureSeeded();
  const raw = await AsyncStorage.getItem(GAMES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGame(game: Omit<DemoGame, 'gameID' | 'date' | 'starred'>): Promise<DemoGame> {
  await ensureSeeded();
  const games = await getGames('');
  const newGame: DemoGame = {
    ...game,
    gameID: Date.now(),
    date: new Date().toISOString(),
    starred: false,
  };
  games.unshift(newGame);
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
  return newGame;
}

export async function updateGame(
  _email: string,
  gameID: number,
  updates: Partial<DemoGame>
): Promise<void> {
  await ensureSeeded();
  const games = await getGames('');
  const idx = games.findIndex((g) => g.gameID === gameID);
  if (idx !== -1) {
    games[idx] = { ...games[idx], ...updates };
    await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }
}

export async function deleteGame(_email: string, gameID: number): Promise<void> {
  await ensureSeeded();
  const games = await getGames('');
  const filtered = games.filter((g) => g.gameID !== gameID);
  await AsyncStorage.setItem(GAMES_KEY, JSON.stringify(filtered));
}

// ─── User CRUD ───

export async function getUser(_email: string): Promise<DemoUser> {
  await ensureSeeded();
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : SEED_USER;
}

export async function setUserData(
  _email: string,
  fname: string,
  lname: string,
  photo: string
): Promise<void> {
  await ensureSeeded();
  const user = await getUser('');
  await AsyncStorage.setItem(USER_KEY, JSON.stringify({ ...user, firstName: fname, lastName: lname, profileImage: photo }));
}
