import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Search, Heart, Play, Sun, Moon, Menu, X,
  Gamepad2, Flame, Crown, Diamond,
  Sparkles, Trophy, Zap, Star,
  ChevronRight, Layers,
  Volume2, VolumeX, TrendingUp, Clock,
  Command, Check, RefreshCw, ChevronLeft,
  Dices, LayoutGrid, List, Sparkle, Award
} from "lucide-react";

/* ─────────── TYPES & DATA ─────────── */

export interface Game {
  id: number;
  title: string;
  provider: string;
  category: "slots" | "roulette" | "blackjack" | "poker" | "live" | "jackpots" | "table";
  badge: "HOT" | "LIVE" | "NEW" | "JACKPOT" | "VIP";
  players: number;
  rtp: number;
  volatility: "Low" | "Medium" | "High" | "Extreme";
  minBet: number;
  maxWin: string;
  jackpotAmount?: number;
  g1: string;
  g2: string;
  g3: string;
  iconSymbol: string;
  imageUrl?: string;
  description: string;
  tags: string[];
}

const NAV_LINKS = ["Casino", "Live Casino", "Sports", "Promotions", "VIP Club"] as const;

const CATEGORIES = [
  { id: "all", label: "All Games", Icon: Star, count: 24, description: "Explore complete casino catalog", color: "#00D1FF" },
  { id: "slots", label: "Slots", Icon: Diamond, count: 12, description: "Video slots & cascading megaways", color: "#FFB800" },
  { id: "live", label: "Live Casino", Icon: Gamepad2, count: 5, description: "Real dealers & 4K streams", color: "#FF4D4D" },
  { id: "jackpots", label: "Jackpots", Icon: Sparkles, count: 3, description: "Multi-million progressive pools", color: "#A855F7" },
  { id: "table", label: "Table Games", Icon: Dices, count: 2, description: "Classic casino table favorites", color: "#10B981" },
  { id: "blackjack", label: "Blackjack", Icon: Crown, count: 3, description: "21 & speed blackjack tables", color: "#F59E0B" },
  { id: "roulette", label: "Roulette", Icon: Zap, count: 3, description: "European, French & quantum roulette", color: "#EF4444" },
  { id: "poker", label: "Poker", Icon: Trophy, count: 2, description: "Texas Hold'em & video poker", color: "#3B82F6" },
];

const DISCOVERY_TAGS = [
  { id: "all", label: "All Features", icon: Sparkle },
  { id: "hot", label: "Hot Hits", icon: Flame },
  { id: "high-rtp", label: "High RTP (>96.5%)", icon: TrendingUp },
  { id: "extreme", label: "Extreme Volatility", icon: Zap },
  { id: "bonus-buy", label: "Bonus Buy", icon: Award },
  { id: "megaways", label: "Megaways / Cluster", icon: Layers },
  { id: "vip", label: "VIP Tables", icon: Crown },
] as const;

const PROVIDERS = [
  { name: "Pragmatic Play", gamesCount: 42, color: "#00D1FF", feature: "Drops & Wins" },
  { name: "Evolution", gamesCount: 38, color: "#7C5FFF", feature: "4K Live Dealers" },
  { name: "NetEnt", gamesCount: 29, color: "#36E6A5", feature: "Cluster Pays" },
  { name: "Play'n GO", gamesCount: 35, color: "#FFC857", feature: "Expanding Wilds" },
  { name: "Microgaming", gamesCount: 48, color: "#FF5A36", feature: "Mega Jackpots" },
  { name: "Hacksaw Gaming", gamesCount: 22, color: "#00B4D8", feature: "High Volatility" },
  { name: "Nolimit City", gamesCount: 19, color: "#9D4EDD", feature: "xWays Mechanics" },
  { name: "Push Gaming", gamesCount: 16, color: "#2EC4B6", feature: "Push Reels" },
];

const GAMES: Game[] = [
  {
    id: 1,
    title: "Cyber Samurai",
    provider: "Pragmatic Play",
    category: "slots",
    badge: "HOT",
    players: 14281,
    rtp: 96.8,
    volatility: "High",
    minBet: 0.20,
    maxWin: "10,000x",
    g1: "#1a0533", g2: "#4c1d95", g3: "#1e1b4b",
    iconSymbol: "⚔️",
    imageUrl: "./game-covers/cyber_samurai.png",
    description: "Enter Neo-Tokyo with expanding wild samurais and multiplier respins up to 100x.",
    tags: ["Bonus Buy", "High RTP", "Megaways"]
  },
  {
    id: 2,
    title: "Neon Roulette Live",
    provider: "Evolution",
    category: "roulette",
    badge: "LIVE",
    players: 8234,
    rtp: 97.3,
    volatility: "Medium",
    minBet: 1.00,
    maxWin: "500x",
    g1: "#052e16", g2: "#14532d", g3: "#0a1f0a",
    iconSymbol: "🎰",
    imageUrl: "./game-covers/neon_roulette.png",
    description: "Immersive 4K live dealer roulette with quantum lightning multipliers every round.",
    tags: ["Live Dealer", "High RTP"]
  },
  {
    id: 3,
    title: "Fortune Nexus",
    provider: "NetEnt",
    category: "slots",
    badge: "NEW",
    players: 5671,
    rtp: 96.5,
    volatility: "Medium",
    minBet: 0.10,
    maxWin: "5,000x",
    g1: "#0c1a3a", g2: "#1e3a5f", g3: "#0f172a",
    iconSymbol: "🔮",
    imageUrl: "./game-covers/fortune_nexus.png",
    description: "Futuristic cluster pays slot featuring portal wild cascades and sticky multiplier symbols.",
    tags: ["Megaways", "High RTP"]
  },
  {
    id: 4,
    title: "Dragon's Vault",
    provider: "Play'n GO",
    category: "slots",
    badge: "HOT",
    players: 9123,
    rtp: 96.2,
    volatility: "High",
    minBet: 0.20,
    maxWin: "20,000x",
    g1: "#1c0a00", g2: "#7c2d12", g3: "#431407",
    iconSymbol: "🐉",
    imageUrl: "./game-covers/dragon_vault.png",
    description: "Unlock ancient dragon treasures with guaranteed scatter re-triggers and fiery free spins.",
    tags: ["Bonus Buy", "Extreme Volatility"]
  },
  {
    id: 5,
    title: "Quantum Blackjack",
    provider: "Evolution",
    category: "blackjack",
    badge: "LIVE",
    players: 3892,
    rtp: 99.4,
    volatility: "Low",
    minBet: 5.00,
    maxWin: "1,000x",
    g1: "#0f0c29", g2: "#2d1b69", g3: "#1e1b4b",
    iconSymbol: "♠️",
    imageUrl: "./game-covers/quantum_blackjack.png",
    description: "High-speed live blackjack with random multiplier cards boosting wins up to 1000x.",
    tags: ["Live Dealer", "High RTP", "VIP Tables"]
  },
  {
    id: 6,
    title: "Stellar Mega Jackpot",
    provider: "Microgaming",
    category: "jackpots",
    badge: "JACKPOT",
    players: 15209,
    rtp: 94.1,
    volatility: "Extreme",
    minBet: 0.50,
    maxWin: "$2,840,950",
    jackpotAmount: 2840950,
    g1: "#0a0a2e", g2: "#1a1a5e", g3: "#0d0d1e",
    iconSymbol: "💎",
    imageUrl: "./game-covers/stellar_jackpot.png",
    description: "Multi-tiered progressive cosmic jackpot wheel with life-changing payout potential.",
    tags: ["Jackpot Drops", "Extreme Volatility"]
  },
  {
    id: 7,
    title: "Void Baccarat VIP",
    provider: "Evolution",
    category: "table",
    badge: "LIVE",
    players: 2441,
    rtp: 98.9,
    volatility: "Low",
    minBet: 2.00,
    maxWin: "88x",
    g1: "#1a001a", g2: "#4a0080", g3: "#1a0033",
    iconSymbol: "🎴",
    imageUrl: "./game-covers/void_baccarat.png",
    description: "Ultra-sleek VIP baccarat table with squeeze camera angles and speed play options.",
    tags: ["VIP Tables", "High RTP", "Live Dealer"]
  },
  {
    id: 8,
    title: "Prism Blaze",
    provider: "Hacksaw Gaming",
    category: "slots",
    badge: "NEW",
    players: 6788,
    rtp: 96.4,
    volatility: "Extreme",
    minBet: 0.10,
    maxWin: "15,000x",
    g1: "#001a33", g2: "#003d66", g3: "#001a4d",
    iconSymbol: "💎",
    imageUrl: "./game-covers/prism_blaze.png",
    description: "High-volatility grid slot with dual spin mechanics and mega multiplier bombs.",
    tags: ["Extreme Volatility", "Bonus Buy"]
  },
  {
    id: 9,
    title: "Eclipse Poker Hold'em",
    provider: "Nolimit City",
    category: "poker",
    badge: "HOT",
    players: 4321,
    rtp: 97.8,
    volatility: "High",
    minBet: 1.00,
    maxWin: "2,500x",
    g1: "#0d1a00", g2: "#2d4a00", g3: "#1a2e00",
    iconSymbol: "🃏",
    imageUrl: "./game-covers/eclipse_poker.png",
    description: "High-stakes Texas Hold'em poker variant with side-bet jackpot bonuses.",
    tags: ["High RTP", "VIP Tables"]
  },
  {
    id: 10,
    title: "Cascade Royale",
    provider: "Push Gaming",
    category: "slots",
    badge: "NEW",
    players: 7654,
    rtp: 96.7,
    volatility: "High",
    minBet: 0.20,
    maxWin: "12,500x",
    g1: "#001a1a", g2: "#006666", g3: "#00264d",
    iconSymbol: "👑",
    imageUrl: "./game-covers/cascade_royale.png",
    description: "Royal gem cascades with growing reels, free spin multiplier paths, and instant bonus buys.",
    tags: ["Bonus Buy", "High RTP", "Megaways"]
  },
  {
    id: 11,
    title: "Omega Mega Jackpot",
    provider: "Microgaming",
    category: "jackpots",
    badge: "JACKPOT",
    players: 21876,
    rtp: 93.8,
    volatility: "Extreme",
    minBet: 1.00,
    maxWin: "$4,120,500",
    jackpotAmount: 4120500,
    g1: "#2d0014", g2: "#8b0038", g3: "#1a000c",
    iconSymbol: "💰",
    imageUrl: "./game-covers/omega_jackpot.png",
    description: "Record-breaking mega jackpot linked across global casino networks with 4 progressive pools.",
    tags: ["Jackpot Drops", "Extreme Volatility"]
  },
  {
    id: 12,
    title: "Ghost Protocol",
    provider: "Play'n GO",
    category: "slots",
    badge: "HOT",
    players: 8942,
    rtp: 96.3,
    volatility: "High",
    minBet: 0.20,
    maxWin: "8,000x",
    g1: "#0d001a", g2: "#3d0080", g3: "#001a1a",
    iconSymbol: "👻",
    imageUrl: "./game-covers/ghost_protocol.png",
    description: "Cyberpunk stealth adventure slot with cloaking wilds and stealth multiplier multipliers.",
    tags: ["Bonus Buy", "High RTP"]
  },
  {
    id: 13,
    title: "Olympus Thunder",
    provider: "Pragmatic Play",
    category: "slots",
    badge: "HOT",
    players: 18410,
    rtp: 96.5,
    volatility: "Extreme",
    minBet: 0.20,
    maxWin: "15,000x",
    g1: "#261300", g2: "#78350f", g3: "#451a03",
    iconSymbol: "⚡",
    imageUrl: "./game-covers/olympus_thunder.png",
    description: "Zeus strikes divine multiplier lightning bolts up to 500x in tumble feature free spins.",
    tags: ["Extreme Volatility", "Bonus Buy", "High RTP"]
  },
  {
    id: 14,
    title: "Vegas Lightning Roulette",
    provider: "Evolution",
    category: "roulette",
    badge: "LIVE",
    players: 6120,
    rtp: 97.3,
    volatility: "Medium",
    minBet: 0.50,
    maxWin: "500x",
    g1: "#1e1b4b", g2: "#312e81", g3: "#0f172a",
    iconSymbol: "🎡",
    imageUrl: "./game-covers/vegas_lightning_roulette.png",
    description: "High-octane live studio roulette with electrifying RNG lucky payout numbers.",
    tags: ["Live Dealer", "High RTP"]
  },
  {
    id: 15,
    title: "Speed Blackjack VIP",
    provider: "Evolution",
    category: "blackjack",
    badge: "VIP",
    players: 4920,
    rtp: 99.5,
    volatility: "Low",
    minBet: 25.00,
    maxWin: "100x",
    g1: "#1e293b", g2: "#0f172a", g3: "#020617",
    iconSymbol: "👑",
    imageUrl: "./game-covers/speed_blackjack_vip.png",
    description: "Ultra-fast VIP blackjack for high rollers with instant card dealing and priority seats.",
    tags: ["VIP Tables", "High RTP", "Live Dealer"]
  },
  {
    id: 16,
    title: "Sugar Burst Mania",
    provider: "Pragmatic Play",
    category: "slots",
    badge: "NEW",
    players: 11300,
    rtp: 96.5,
    volatility: "High",
    minBet: 0.20,
    maxWin: "5,000x",
    g1: "#3b0764", g2: "#7e22ce", g3: "#2e1065",
    iconSymbol: "🍬",
    imageUrl: "./game-covers/sugar_burst_mania.png",
    description: "Cluster pays candy frenzy with multipliers up to 128x on exploding reel positions.",
    tags: ["Megaways", "High RTP"]
  },
  {
    id: 17,
    title: "Gonzo's Gold Quest",
    provider: "NetEnt",
    category: "slots",
    badge: "HOT",
    players: 9420,
    rtp: 96.6,
    volatility: "High",
    minBet: 0.20,
    maxWin: "10,000x",
    g1: "#1a2e05", g2: "#3f6212", g3: "#142303",
    iconSymbol: "🗿",
    imageUrl: "./game-covers/gonzos_gold_quest.png",
    description: "Explore lost temple ruins with golden grid cluster payouts and expanding scatters.",
    tags: ["High RTP", "Bonus Buy"]
  },
  {
    id: 18,
    title: "San Quentin XWays",
    provider: "Nolimit City",
    category: "slots",
    badge: "HOT",
    players: 12540,
    rtp: 96.0,
    volatility: "Extreme",
    minBet: 0.20,
    maxWin: "150,000x",
    g1: "#3f0000", g2: "#7f1d1d", g3: "#290000",
    iconSymbol: "🔒",
    imageUrl: "./game-covers/san_quentin_xways.png",
    description: "Record-breaking volatility slot featuring Razor Split multipliers and Lockdown Spins.",
    tags: ["Extreme Volatility", "Bonus Buy"]
  },
  {
    id: 19,
    title: "Razor Shark Revenge",
    provider: "Push Gaming",
    category: "slots",
    badge: "NEW",
    players: 8910,
    rtp: 96.7,
    volatility: "Extreme",
    minBet: 0.10,
    maxWin: "50,000x",
    g1: "#0284c7", g2: "#0369a1", g3: "#0c4a6e",
    iconSymbol: "🦈",
    imageUrl: "./game-covers/razor_shark_revenge.png",
    description: "Deep sea mystery stacks and razor reveal golden coin instant wins up to 2500x.",
    tags: ["Extreme Volatility", "High RTP"]
  },
  {
    id: 20,
    title: "Infinite Baccarat 3D",
    provider: "Evolution",
    category: "table",
    badge: "LIVE",
    players: 3120,
    rtp: 98.9,
    volatility: "Low",
    minBet: 1.00,
    maxWin: "200x",
    g1: "#4c1d95", g2: "#3b0764", g3: "#2e1065",
    iconSymbol: "🎴",
    imageUrl: "./game-covers/infinite_baccarat_3d.png",
    description: "3D multiplayer table baccarat with instant side-bets and live interaction.",
    tags: ["Live Dealer", "High RTP"]
  },
  {
    id: 21,
    title: "Book of Cyber Dead",
    provider: "Play'n GO",
    category: "slots",
    badge: "HOT",
    players: 16500,
    rtp: 96.2,
    volatility: "High",
    minBet: 0.10,
    maxWin: "5,000x",
    g1: "#78350f", g2: "#451a03", g3: "#1c0a00",
    iconSymbol: "📜",
    imageUrl: "./game-covers/book_of_cyber_dead.png",
    description: "The timeless book slot upgraded with futuristic cyberpunk expanding symbol reels.",
    tags: ["High RTP", "Bonus Buy"]
  },
  {
    id: 22,
    title: "Wanted Dead or Wild",
    provider: "Hacksaw Gaming",
    category: "slots",
    badge: "HOT",
    players: 19800,
    rtp: 96.3,
    volatility: "Extreme",
    minBet: 0.20,
    maxWin: "12,500x",
    g1: "#451a03", g2: "#292524", g3: "#0c0a09",
    iconSymbol: "🤠",
    imageUrl: "./game-covers/wanted_dead_or_wild.png",
    description: "Wild West duel multipliers and VS symbol showdowns in legendary bonus rounds.",
    tags: ["Extreme Volatility", "Bonus Buy"]
  },
  {
    id: 23,
    title: "Crazy Time Quantum",
    provider: "Evolution",
    category: "live",
    badge: "LIVE",
    players: 24500,
    rtp: 96.1,
    volatility: "High",
    minBet: 0.10,
    maxWin: "25,000x",
    g1: "#831843", g2: "#500724", g3: "#280213",
    iconSymbol: "🎪",
    imageUrl: "./game-covers/crazy_time_quantum.png",
    description: "World famous live game show wheel with 4 crazy bonus games and massive multipliers.",
    tags: ["Live Dealer", "Hot Hits"]
  },
  {
    id: 24,
    title: "Sweet Bonanza Deluxe",
    provider: "Pragmatic Play",
    category: "slots",
    badge: "HOT",
    players: 22100,
    rtp: 96.5,
    volatility: "High",
    minBet: 0.20,
    maxWin: "21,100x",
    g1: "#9d174d", g2: "#831843", g3: "#4c0519",
    iconSymbol: "🍭",
    imageUrl: "./game-covers/sweet_bonanza_deluxe.png",
    description: "Tumble reels candy kingdom featuring 100x rainbow bomb multiplier drops.",
    tags: ["High RTP", "Bonus Buy", "Megaways"]
  }
];

const PROMOTIONS = [
  {
    id: 1,
    title: "Exclusive Welcome Package",
    sub: "Up to $5,000 Bonus + 200 Free Spins on Cyber Samurai across your first 4 deposits",
    badge: "WELCOME BONUS",
    cta: "Claim $5,000 Now",
    timer: "03d : 14h : 22m",
    color: "#00D1FF",
    bg: "#001a33",
    tag: "100% Match"
  },
  {
    id: 2,
    title: "$50,000 Weekend Slot Blitz",
    sub: "Compete against thousands of players for cash prizes. Top 100 players win instantly.",
    badge: "LIVE TOURNAMENT",
    cta: "Join Tournament",
    timer: "18h : 45m : 10s",
    color: "#36E6A5",
    bg: "#001a0f",
    tag: "$10K First Prize"
  },
  {
    id: 3,
    title: "VIP 20% Weekly Cashback",
    sub: "No wagering requirements! Automatic cashback paid into your real money wallet every Monday.",
    badge: "VIP EXCLUSIVE",
    cta: "Unlock VIP Access",
    timer: "Every Monday",
    color: "#FFC857",
    bg: "#1a0f00",
    tag: "0x Wagering"
  },
  {
    id: 4,
    title: "Daily Reload & Free Spins",
    sub: "50% reload bonus up to $500 plus 50 free spins on every single deposit today.",
    badge: "DAILY PROMO",
    cta: "Get Reload",
    timer: "Resets at Midnight",
    color: "#7C5FFF",
    bg: "#0d0033",
    tag: "50% Match"
  }
];

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  HOT: { bg: "#FF5A36", color: "#fff" },
  LIVE: { bg: "#36E6A5", color: "#07090D" },
  NEW: { bg: "#00D1FF", color: "#07090D" },
  JACKPOT: { bg: "#FFC857", color: "#07090D" },
  VIP: { bg: "#9D4EDD", color: "#fff" },
};

/* Audio Synthesizer for Interactive Game Simulator */
function playSound(type: "spin" | "win" | "click") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "spin") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "win") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Ignore audio context errors
  }
}

/* ─────────── HEADER BRAND LOGO ─────────── */

function Logo() {
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer select-none group">
      <div className="relative w-8 h-8">
        <div
          className="absolute inset-0 rounded-lg transition-transform duration-300 group-hover:rotate-45"
          style={{ background: "linear-gradient(135deg, #00D1FF, #7C5FFF)", transform: "rotate(12deg)" }}
        />
        <div
          className="absolute inset-[2px] rounded-md bg-[#07090D] transition-transform duration-300 group-hover:rotate-45"
          style={{ transform: "rotate(12deg)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={15} style={{ color: "#00D1FF" }} />
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className="font-black text-xl tracking-wide leading-none"
          style={{ fontFamily: "'Exo 2', sans-serif", color: "#F5F7FA" }}
        >
          CASINO <span style={{ color: "#00D1FF" }}>LOBBY</span>
        </span>
        <span className="text-[9px] font-bold tracking-widest uppercase opacity-60" style={{ color: "#7C5FFF" }}>
          GAME HUB & LOBBY
        </span>
      </div>
    </div>
  );
}

/* ─────────── LIVE JACKPOT & WINNERS TICKER ─────────── */

function JackpotWinnersTicker({ onPlayGame }: { onPlayGame: (g: Game) => void }) {
  const [jackpot, setJackpot] = useState(14892410.50);
  const [recentWinIndex, setRecentWinIndex] = useState(0);

  const WINS = [
    { user: "Alex***89", amount: "$1,450.00", gameId: 1, title: "Cyber Samurai" },
    { user: "Elena***21", amount: "$4,200.00", gameId: 6, title: "Stellar Mega Jackpot" },
    { user: "Marcus***04", amount: "$890.50", gameId: 2, title: "Neon Roulette Live" },
    { user: "VIP_David", amount: "$12,900.00", gameId: 11, title: "Omega Mega Jackpot" },
    { user: "Sarah***55", amount: "$2,100.00", gameId: 4, title: "Dragon's Vault" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setJackpot(j => j + (Math.random() * 1.85 + 0.15));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const winTimer = setInterval(() => {
      setRecentWinIndex(i => (i + 1) % WINS.length);
    }, 4500);
    return () => clearInterval(winTimer);
  }, [WINS.length]);

  const currentWin = WINS[recentWinIndex];
  const targetGame = GAMES.find(g => g.id === currentWin.gameId) || GAMES[0];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-9 px-4 flex items-center justify-between text-xs overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #05070a 0%, #0d121f 50%, #05070a 100%)",
        borderBottom: "1px solid rgba(0,209,255,0.15)"
      }}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 hidden sm:inline">
          Live Game Hub Ticker
        </span>
      </div>

      {/* Global Progressive Jackpot Counter */}
      <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
        <Sparkles size={12} className="text-amber-400 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Mega Jackpot:</span>
        <span className="font-black text-amber-400 font-mono text-sm tracking-tight">
          ${jackpot.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Live Winners Marquee Ticker */}
      <div className="hidden md:flex items-center gap-2 text-[11px]">
        <Trophy size={13} className="text-cyan-400" />
        <span className="text-slate-400">Latest Win:</span>
        <span className="font-semibold text-slate-200">{currentWin.user}</span>
        <span className="font-bold text-emerald-400">{currentWin.amount}</span>
        <button
          onClick={() => onPlayGame(targetGame)}
          className="text-[10px] underline font-medium text-cyan-400 hover:text-white transition-colors cursor-pointer"
        >
          on {currentWin.title}
        </button>
      </div>
    </div>
  );
}

/* ─────────── NAVBAR ─────────── */

function Navbar({
  isDark,
  onToggleDark,
  onOpenSearch,
  activeNav,
  onSelectNav,
  onOpenSurprise
}: {
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSearch: () => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenSurprise: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="fixed top-9 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,9,13,0.96)" : "rgba(7,9,13,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(0,209,255,0.12)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Logo />

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {["Home", ...NAV_LINKS].map((link) => {
            const isActive = activeNav === link;
            return (
              <button
                key={link}
                onClick={() => { playSound("click"); onSelectNav(link); }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 cursor-pointer"
                style={{
                  color: isActive ? "#00D1FF" : "#8B95A5",
                  background: isActive ? "rgba(0,209,255,0.1)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(0,209,255,0.25)" : "transparent"}`
                }}
              >
                {link}
              </button>
            );
          })}
        </div>

        {/* Fast Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Surprise Me Game Discoverer button */}
          <button
            onClick={() => { playSound("click"); onOpenSurprise(); }}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 cursor-pointer border shadow-md"
            style={{
              background: "linear-gradient(135deg, rgba(255,200,87,0.15), rgba(124,95,255,0.15))",
              borderColor: "rgba(255,200,87,0.4)",
              color: "#FFC857"
            }}
          >
            <Dices size={15} className="animate-spin-slow" />
            <span className="hidden sm:inline">Surprise Me</span>
          </button>

          {/* Quick Search trigger button */}
          <button
            onClick={() => { playSound("click"); onOpenSearch(); }}
            className="flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-medium transition-all duration-200 hover:bg-white/10 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8B95A5"
            }}
          >
            <Search size={15} style={{ color: "#00D1FF" }} />
            <span className="hidden sm:inline">Search Games & Providers...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-slate-300 font-mono">
              <Command size={10} /> K
            </kbd>
          </button>

          <button
            onClick={onToggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/5 cursor-pointer"
            style={{ color: "#8B95A5", border: "1px solid rgba(255,255,255,0.06)" }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>

          <button
            className="hidden sm:flex h-9 px-4 items-center rounded-xl text-xs font-semibold transition-all duration-200 hover:bg-white/5 cursor-pointer"
            style={{ color: "#F5F7FA", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Log In
          </button>

          <button
            className="h-9 px-4 rounded-xl text-xs font-bold relative overflow-hidden group transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #00D1FF, #7C5FFF)", color: "#07090D" }}
          >
            <span className="relative z-10">Sign Up</span>
          </button>

          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/5 cursor-pointer"
            style={{ color: "#8B95A5" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ background: "rgba(7,9,13,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {["Home", ...NAV_LINKS].map((link) => (
              <button
                key={link}
                onClick={() => { onSelectNav(link); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  color: activeNav === link ? "#00D1FF" : "#8B95A5",
                  background: activeNav === link ? "rgba(0,209,255,0.08)" : "transparent"
                }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────── HERO PROMOTION SLIDER ─────────── */

function HeroSlider({ onPlayGame, onOpenSurprise }: { onPlayGame: (g: Game) => void; onOpenSurprise: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % PROMOTIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const promo = PROMOTIONS[currentSlide];

  return (
    <section className="relative overflow-hidden pt-28 pb-6 lg:pt-32 lg:pb-8 min-h-[460px] flex items-center">
      {/* Background glow graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{ background: promo.color }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
          style={{ background: "#7C5FFF" }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 w-full">
        <div
          className="relative rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-700 border"
          style={{
            background: `linear-gradient(135deg, ${promo.bg} 0%, rgba(13,17,23,0.95) 70%, #07090D 100%)`,
            borderColor: `${promo.color}33`,
            boxShadow: `0 20px 60px -15px ${promo.color}1a`
          }}
        >
          {/* Grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase flex items-center gap-1.5"
                  style={{ background: `${promo.color}22`, color: promo.color, border: `1px solid ${promo.color}55` }}
                >
                  <Flame size={12} /> {promo.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-300">
                  {promo.tag}
                </span>
              </div>

              <h1
                className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-none mb-4"
                style={{ fontFamily: "'Exo 2', sans-serif", color: "#F5F7FA" }}
              >
                {promo.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                {promo.sub}
              </p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => { playSound("click"); onPlayGame(GAMES[0]); }}
                  className="px-8 py-4 rounded-2xl text-sm font-extrabold flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${promo.color}, #7C5FFF)`,
                    color: "#07090D",
                    boxShadow: `0 0 30px ${promo.color}40`
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  {promo.cta}
                </button>

                <button
                  onClick={onOpenSurprise}
                  className="px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Dices size={18} className="text-amber-400" />
                  <span>Discover Game</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
                  <Clock size={15} className="text-amber-400" />
                  <span className="text-slate-400">Ends in:</span>
                  <span className="font-mono font-bold text-white">{promo.timer}</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Feature Game Cover Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => onPlayGame(GAMES[0])}
                className="group relative w-full max-w-sm rounded-2xl p-5 cursor-pointer border transition-all duration-300 hover:scale-105 bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Featured Game</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    RTP 96.8%
                  </span>
                </div>

                <div className="h-48 rounded-xl relative overflow-hidden flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                  {GAMES[0].imageUrl && (
                    <img
                      src={GAMES[0].imageUrl}
                      alt="Cyber Samurai"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play size={24} fill="black" className="ml-1" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">Cyber Samurai</h3>
                    <p className="text-xs text-slate-400">Pragmatic Play · 14.2k active</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl font-bold text-xs bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    1-Click Play
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {PROMOTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: currentSlide === idx ? "32px" : "10px",
                    background: currentSlide === idx ? promo.color : "rgba(255,255,255,0.2)"
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(s => (s - 1 + PROMOTIONS.length) % PROMOTIONS.length)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentSlide(s => (s + 1) % PROMOTIONS.length)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── RECENTLY PLAYED & FAVORITES QUICK ACCESS STRIP ─────────── */

function QuickAccessBar({
  recentGames,
  favorites,
  onPlayGame,
  onClearRecent
}: {
  recentGames: Game[];
  favorites: Set<number>;
  onPlayGame: (g: Game) => void;
  onClearRecent: () => void;
}) {
  const favoriteGames = GAMES.filter(g => favorites.has(g.id));

  if (recentGames.length === 0 && favoriteGames.length === 0) return null;

  return (
    <section className="mt-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-cyan-400" />
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Quick Re-Entry Hub</h3>
          <span className="text-xs text-slate-400">(Instant Resume)</span>
        </div>
        {recentGames.length > 0 && (
          <button
            onClick={onClearRecent}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {favoriteGames.map(game => (
          <button
            key={`fav-${game.id}`}
            onClick={() => { playSound("click"); onPlayGame(game); }}
            className="flex-shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:border-pink-400 transition-all duration-200 group cursor-pointer"
          >
            {game.imageUrl ? (
              <img src={game.imageUrl} alt={game.title} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <Heart size={14} className="text-pink-400 fill-pink-400" />
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{game.title}</p>
              <p className="text-[10px] text-slate-400">{game.provider}</p>
            </div>
            <Play size={12} className="text-pink-400 opacity-60 group-hover:opacity-100 ml-1" />
          </button>
        ))}

        {recentGames.map(game => (
          <button
            key={`rec-${game.id}`}
            onClick={() => { playSound("click"); onPlayGame(game); }}
            className="flex-shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
          >
            {game.imageUrl ? (
              <img src={game.imageUrl} alt={game.title} className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <span className="text-base">{game.iconSymbol}</span>
            )}
            <div className="text-left">
              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{game.title}</p>
              <p className="text-[10px] text-slate-400">RTP {game.rtp}%</p>
            </div>
            <Play size={12} className="text-cyan-400 opacity-60 group-hover:opacity-100 ml-1" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─────────── VISUAL CATEGORY BROWSER GRID ─────────── */

function VisualCategoryBrowser({
  activeCategory,
  onSelectCategory
}: {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}) {
  return (
    <section className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-xl text-white flex items-center gap-2.5" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers size={18} />
            </div>
            Browse Game Categories
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explore by game type, live streaming suites, or jackpot pools</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map(({ id, label, Icon, count, description, color }) => {
          const isActive = activeCategory === id;
          return (
            <div
              key={`cat-card-${id}`}
              onClick={() => { playSound("click"); onSelectCategory(id); }}
              className={`group relative p-3.5 sm:p-4 rounded-2xl cursor-pointer select-none transition-all duration-300 border flex flex-col justify-between h-[134px] ${isActive
                  ? "bg-[#0b1622] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,209,255,0.25)] scale-[1.03]"
                  : "bg-[#0e131f]/90 border-white/10 hover:border-cyan-400/40 hover:bg-[#131928] hover:scale-[1.02]"
                }`}
            >
              {/* Top Row: Circular Icon Badge & Count Pill */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                      ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/50"
                      : "bg-white/10 text-slate-200 group-hover:bg-white/15"
                    }`}
                  style={{
                    color: isActive ? "#07090d" : color,
                    backgroundColor: isActive ? "#00D1FF" : undefined,
                    boxShadow: isActive ? "0 0 15px rgba(0,209,255,0.6)" : undefined
                  }}
                >
                  <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </div>

                <span
                  className={`min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActive
                      ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
                      : "bg-white/10 text-slate-400 group-hover:bg-white/15 group-hover:text-slate-200"
                    }`}
                >
                  {count}
                </span>
              </div>

              {/* Bottom Row: Title & Subtitle */}
              <div className="mt-2">
                <h4
                  className={`font-bold text-sm leading-snug transition-colors ${isActive ? "text-cyan-300" : "text-white group-hover:text-cyan-200"
                    }`}
                >
                  {label}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────── CURATED SHELVES (HORIZONALLY SCROLLABLE REELS) ─────────── */

function CuratedShelf({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  games,
  favorites,
  onToggleFavorite,
  onPlayGame
}: {
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  games: Game[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onPlayGame: (g: Game) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const amount = direction === "left" ? -400 : 400;
      containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              {title}
            </h3>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors cursor-pointer border border-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition-colors cursor-pointer border border-white/10"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth"
      >
        {games.map(game => (
          <div key={`shelf-${game.id}`} className="flex-shrink-0 w-[200px] sm:w-[220px]">
            <GameCard
              game={game}
              isFavorite={favorites.has(game.id)}
              onToggleFavorite={onToggleFavorite}
              onPlayGame={onPlayGame}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────── STICKY CATEGORIES & FILTER TOOLBAR ─────────── */

function FilterToolbar({
  activeCategory,
  onSelectCategory,
  activeTag,
  onSelectTag,
  searchQuery,
  onSearchChange,
  selectedProvider,
  onSelectProvider,
  viewMode,
  onChangeViewMode,
  sortBy,
  onSelectSort,
  onOpenSurprise
}: {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  activeTag: string;
  onSelectTag: (tag: string) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedProvider: string;
  onSelectProvider: (p: string) => void;
  viewMode: "grid" | "list";
  onChangeViewMode: (v: "grid" | "list") => void;
  sortBy: string;
  onSelectSort: (s: string) => void;
  onOpenSurprise: () => void;
}) {
  return (
    <div className="sticky top-[100px] z-30 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-[#07090D]/95 backdrop-blur-xl border border-white/10 shadow-2xl transition-all my-3 sm:my-6" style={{ WebkitBackdropFilter: "blur(20px)" }}>
      {/* Top Pills Bar (Categories) */}
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pr-1">
          {CATEGORIES.map(({ id, label, Icon, count }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => { playSound("click"); onSelectCategory(id); }}
                className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive ? "rgba(0,209,255,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? "rgba(0,209,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? "#00D1FF" : "#8B95A5",
                  boxShadow: isActive ? "0 0 15px rgba(0,209,255,0.15)" : "none"
                }}
              >
                <Icon size={14} />
                <span className="whitespace-nowrap">{label}</span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: isActive ? "rgba(0,209,255,0.2)" : "rgba(255,255,255,0.08)",
                    color: isActive ? "#00D1FF" : "#8B95A5"
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Discovery Surprise Button - Pinned Right */}
        <button
          onClick={onOpenSurprise}
          className="flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:scale-105 transition-all shadow-md cursor-pointer"
        >
          <Dices size={14} />
          <span className="hidden xs:inline">Surprise Me</span>
          <span className="xs:hidden">Surprise</span>
        </button>
      </div>

      {/* Discovery Tag Chips Row */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none border-b border-white/5">
        <span className="hidden sm:inline-block text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0 mr-1">
          Discovery Tags:
        </span>
        <span className="sm:hidden text-[9px] font-extrabold text-cyan-400/90 bg-cyan-950/80 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 mr-0.5">
          TAGS
        </span>
        {DISCOVERY_TAGS.map(t => {
          const isActive = activeTag === t.id;
          const TagIcon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { playSound("click"); onSelectTag(t.id); }}
              className={`flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${isActive
                ? "bg-cyan-400 text-black shadow-md shadow-cyan-400/20"
                : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
            >
              <TagIcon size={12} />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Responsive Sub-Filters, Provider Selector & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2.5">
        {/* Mobile Sub-row 1 / Desktop Left: Search Input + View Mode Switcher */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Quick Search Bar */}
          <div className="relative flex-1 md:w-64 lg:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Quick search title or provider..."
              className="w-full h-8 pl-8 pr-8 rounded-lg text-xs bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* View Mode Switcher (Grid vs List) */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
            <button
              onClick={() => onChangeViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-cyan-400 text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => onChangeViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-cyan-400 text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
              title="Detailed List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Mobile Sub-row 2 / Desktop Right: Dropdowns side-by-side */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Provider Filter Dropdown */}
          <select
            value={selectedProvider}
            onChange={e => onSelectProvider(e.target.value)}
            className="flex-1 md:flex-none h-8 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-medium bg-white/5 text-slate-300 border border-white/10 focus:outline-none hover:bg-white/10 cursor-pointer truncate max-w-full"
          >
            <option value="all" className="bg-[#07090D] text-slate-300">All Game Providers</option>
            {PROVIDERS.map(p => (
              <option key={p.name} value={p.name} className="bg-[#07090D] text-slate-300">
                {p.name} ({p.gamesCount} Games)
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={e => onSelectSort(e.target.value)}
            className="flex-1 md:flex-none h-8 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-medium bg-white/5 text-slate-300 border border-white/10 focus:outline-none hover:bg-white/10 cursor-pointer truncate max-w-full"
          >
            <option value="popular" className="bg-[#07090D] text-slate-300">Sort: Most Popular</option>
            <option value="rtp" className="bg-[#07090D] text-slate-300">Sort: Highest RTP</option>
            <option value="win" className="bg-[#07090D] text-slate-300">Sort: Highest Max Win</option>
            <option value="title" className="bg-[#07090D] text-slate-300">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ─────────── 1-CLICK GAME CARD WITH COVER IMAGE ─────────── */

function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame
}: {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onPlayGame: (g: Game, demo?: boolean) => void;
}) {
  const b = BADGE_STYLE[game.badge] || { bg: "#00D1FF", color: "#07090D" };

  return (
    <div
      onClick={() => { playSound("click"); onPlayGame(game); }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-300 hover:scale-[1.04] border border-white/10 hover:border-cyan-400/50 shadow-xl bg-[#0d121c]"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Background Gradient Fallback */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: `linear-gradient(145deg, ${game.g1} 0%, ${game.g2} 50%, ${game.g3} 100%)` }}
      />

      {/* Game Cover Image */}
      {game.imageUrl ? (
        <img
          src={game.imageUrl}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <span className="text-7xl">{game.iconSymbol}</span>
        </div>
      )}

      {/* Dark Gradient Vignette for Legibility */}
      <div
        className="absolute inset-0 z-0 opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(7,9,13,0.95) 0%, rgba(7,9,13,0.4) 50%, rgba(7,9,13,0.15) 100%)"
        }}
      />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <span
          className="text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase shadow-md backdrop-blur-md pointer-events-auto"
          style={{ background: b.bg, color: b.color }}
        >
          {game.badge}
        </span>

        <button
          onClick={e => { e.stopPropagation(); playSound("click"); onToggleFavorite(game.id); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md border border-white/15 hover:scale-110 transition-transform cursor-pointer pointer-events-auto"
        >
          <Heart
            size={13}
            style={{ color: isFavorite ? "#fb7185" : "rgba(255,255,255,0.8)", fill: isFavorite ? "#fb7185" : "none" }}
          />
        </button>
      </div>

      {/* Default Bottom Card Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 group-hover:opacity-0 transition-opacity duration-300">
        <p className="font-bold text-sm text-white truncate leading-tight font-heading drop-shadow-md">{game.title}</p>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-300">
          <span className="opacity-90 font-medium">{game.provider}</span>
          <span className="text-emerald-400 font-bold drop-shadow">{game.rtp}% RTP</span>
        </div>
      </div>

      {/* Hover Card Action Overlay (1-CLICK DIRECT PLAY) */}
      <div className="absolute inset-0 z-20 bg-black/88 backdrop-blur-md p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div>
          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">{game.provider}</span>
          <h4 className="font-bold text-base text-white leading-snug mt-0.5">{game.title}</h4>
          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{game.description}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {game.tags.map(t => (
              <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 my-2 text-[11px]">
          <div className="flex justify-between text-slate-300">
            <span>Volatility:</span>
            <span className="font-bold text-amber-400">{game.volatility}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Max Win:</span>
            <span className="font-bold text-emerald-400">{game.maxWin}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Active Players:</span>
            <span className="font-mono text-cyan-300">{game.players.toLocaleString()}</span>
          </div>
        </div>

        {/* 1-Click Play Buttons */}
        <div className="space-y-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); playSound("click"); onPlayGame(game, false); }}
            className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <Play size={14} fill="black" /> PLAY NOW
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); playSound("click"); onPlayGame(game, true); }}
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            Play Demo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── DETAILED HUB LIST ROW CARD ─────────── */

function DetailedGameRow({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame
}: {
  game: Game;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onPlayGame: (g: Game, demo?: boolean) => void;
}) {
  const b = BADGE_STYLE[game.badge] || { bg: "#00D1FF", color: "#07090D" };

  return (
    <div
      onClick={() => { playSound("click"); onPlayGame(game); }}
      className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-[220px]">
        {game.imageUrl ? (
          <img src={game.imageUrl} alt={game.title} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
            {game.iconSymbol}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">{game.title}</h4>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase" style={{ background: b.bg, color: b.color }}>
              {game.badge}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{game.provider} · <span className="text-slate-300 uppercase font-medium">{game.category}</span></p>
          <div className="flex items-center gap-1.5 mt-1">
            {game.tags.map(t => (
              <span key={t} className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-white/5 text-slate-300 border border-white/10">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-300">
        <div className="hidden md:block text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">RTP</span>
          <span className="font-bold text-emerald-400">{game.rtp}%</span>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">VOLATILITY</span>
          <span className="font-bold text-amber-400">{game.volatility}</span>
        </div>
        <div className="hidden lg:block text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">MAX WIN</span>
          <span className="font-bold text-cyan-300">{game.maxWin}</span>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">PLAYERS</span>
          <span className="font-mono text-slate-200">{game.players.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onToggleFavorite(game.id); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 cursor-pointer"
          >
            <Heart size={16} className={isFavorite ? "fill-pink-400" : ""} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPlayGame(game, false); }}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            <Play size={14} fill="black" /> Play
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── "SURPRISE ME" / RANDOM GAME PICKER DISCOVERY MODAL ─────────── */

function SurpriseMeModal({
  isOpen,
  onClose,
  onPlayGame
}: {
  isOpen: boolean;
  onClose: () => void;
  onPlayGame: (g: Game) => void;
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filterType, setFilterType] = useState<"all" | "slots" | "high-rtp" | "extreme">("all");

  useEffect(() => {
    if (isOpen) {
      handleSpin();
    }
  }, [isOpen]);

  const handleSpin = () => {
    setIsSpinning(true);
    playSound("spin");

    let pool = GAMES;
    if (filterType === "slots") pool = GAMES.filter(g => g.category === "slots");
    if (filterType === "high-rtp") pool = GAMES.filter(g => g.rtp >= 96.5);
    if (filterType === "extreme") pool = GAMES.filter(g => g.volatility === "Extreme");

    if (pool.length === 0) pool = GAMES;

    let count = 0;
    const interval = setInterval(() => {
      const randomPicked = pool[Math.floor(Math.random() * pool.length)];
      setSelectedGame(randomPicked);
      count++;
      if (count >= 10) {
        clearInterval(interval);
        setIsSpinning(false);
        playSound("win");
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
    }, 80);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0d121c] border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Dices size={22} className="text-amber-400" />
            <h3 className="font-bold text-lg text-white font-heading">Game Discovery Wheel</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Filter Mood Selection */}
        <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
          {[
            { id: "all", label: "🎲 Random Pick" },
            { id: "slots", label: "💎 Top Slots" },
            { id: "high-rtp", label: "📈 High RTP" },
            { id: "extreme", label: "⚡ Extreme Volatility" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilterType(f.id as any); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterType === f.id ? "bg-amber-400 text-black" : "bg-white/5 text-slate-400 hover:text-white"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Display Picked Game Card */}
        {selectedGame && (
          <div className={`relative p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-amber-400/50 mb-6 flex flex-col items-center text-center transition-all ${isSpinning ? "scale-95 opacity-80" : "scale-100"}`}>
            {selectedGame.imageUrl ? (
              <img src={selectedGame.imageUrl} alt={selectedGame.title} className="w-24 h-24 rounded-2xl object-cover mb-3 shadow-lg border border-white/15" />
            ) : (
              <span className="text-5xl mb-3">{selectedGame.iconSymbol}</span>
            )}

            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase mb-1">
              {selectedGame.badge} · {selectedGame.provider}
            </span>

            <h4 className="font-extrabold text-xl text-white mb-1">{selectedGame.title}</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-3">{selectedGame.description}</p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300 mb-2">
              <span>RTP: <strong className="text-emerald-400">{selectedGame.rtp}%</strong></span>
              <span>Max Win: <strong className="text-cyan-300">{selectedGame.maxWin}</strong></span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="flex-1 py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw size={16} className={isSpinning ? "animate-spin" : ""} />
            Spin Again
          </button>

          {selectedGame && (
            <button
              onClick={() => { onClose(); onPlayGame(selectedGame); }}
              disabled={isSpinning}
              className="flex-1 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Play size={16} fill="black" /> PLAY NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── INSTANT SEARCH MODAL (CMD+K) ─────────── */

function InstantSearchModal({
  isOpen,
  onClose,
  onPlayGame
}: {
  isOpen: boolean;
  onClose: () => void;
  onPlayGame: (g: Game) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matches = GAMES.filter(
    g =>
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.provider.toLowerCase().includes(query.toLowerCase()) ||
      g.category.toLowerCase().includes(query.toLowerCase()) ||
      g.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-[#0d1117] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-black/40">
          <Search size={18} className="text-cyan-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a game title, provider, or tag (e.g. Cyber Samurai, Pragmatic, High RTP, Megaways)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {matches.length > 0 ? (
            matches.map(game => (
              <div
                key={`search-${game.id}`}
                onClick={() => { onClose(); onPlayGame(game); }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.title} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white/5 border border-white/10">
                      {game.iconSymbol}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">{game.title}</h5>
                    <p className="text-xs text-slate-400">{game.provider} · <span className="text-emerald-400">RTP {game.rtp}%</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 uppercase font-bold text-[10px]">
                    {game.badge}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-bold text-xs flex items-center gap-1 opacity-90 group-hover:opacity-100 cursor-pointer">
                    <Play size={12} fill="black" /> 1-Click Play
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No games found matching "{query}"
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-black/60 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-500">
          <span>Press <strong>ESC</strong> to close</span>
          <span>Instant 1-Click Direct Launch</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── INTERACTIVE GAME LAUNCHER MODAL / SIMULATOR ─────────── */

function GameLauncherModal({
  game,
  initialDemo,
  onClose,
  onToggleFavorite,
  isFavorite
}: {
  game: Game | null;
  initialDemo?: boolean;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
}) {
  if (!game) return null;

  const [mode, setMode] = useState<"real" | "demo">(initialDemo ? "demo" : "real");
  const [balance, setBalance] = useState(mode === "real" ? 1250.00 : 10000.00);
  const [bet, setBet] = useState(game.minBet);
  const [reels, setReels] = useState(["⚡", "💎", "7️⃣"]);
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const SYMBOLS = ["⚔️", "💎", "⚡", "7️⃣", "👑", "🔮", "🍒"];

  const handleSpin = () => {
    if (spinning || balance < bet) return;
    setSpinning(true);
    setWinMessage(null);
    setBalance(b => b - bet);

    if (soundEnabled) playSound("spin");

    let count = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setSpinning(false);

        // Calculate win probability based on game RTP
        const winRoll = Math.random();
        if (winRoll < 0.45) {
          const matchSym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          const isBigWin = winRoll < 0.12;
          const finalReels = isBigWin ? [matchSym, matchSym, matchSym] : [matchSym, matchSym, SYMBOLS[0]];
          setReels(finalReels);

          const winMult = isBigWin ? 25 : 3;
          const winAmt = bet * winMult;
          setBalance(b => b + winAmt);
          setWinMessage(`🎉 WINNER! +$${winAmt.toFixed(2)} (${winMult}x)`);

          if (soundEnabled) playSound("win");

          if (isBigWin) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          }
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-4xl bg-[#0a0d14] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Game Title Bar Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-white/10">
          <div className="flex items-center gap-3">
            {game.imageUrl ? (
              <img src={game.imageUrl} alt={game.title} className="w-10 h-10 rounded-lg object-cover border border-white/15" />
            ) : (
              <span className="text-2xl">{game.iconSymbol}</span>
            )}
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                {game.title}
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-400/20 text-cyan-300">
                  RTP {game.rtp}%
                </span>
              </h3>
              <p className="text-xs text-slate-400">{game.provider} · {game.category.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold">
              <button
                onClick={() => { setMode("real"); setBalance(1250); }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${mode === "real" ? "bg-cyan-400 text-black" : "text-slate-400 hover:text-white"}`}
              >
                REAL PLAY
              </button>
              <button
                onClick={() => { setMode("demo"); setBalance(10000); }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${mode === "demo" ? "bg-amber-400 text-black" : "text-slate-400 hover:text-white"}`}
              >
                DEMO
              </button>
            </div>

            <button
              onClick={() => setSoundEnabled(s => !s)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => onToggleFavorite(game.id)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-400 cursor-pointer"
            >
              <Heart size={18} className={isFavorite ? "fill-pink-400" : ""} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Interactive Game Canvas Engine Frame */}
        <div className="relative flex-1 min-h-[340px] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#0c1220] via-[#080a0f] to-[#040608] overflow-hidden">
          {game.imageUrl && (
            <img src={game.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none blur-sm" />
          )}

          {/* Win Announcement Banner */}
          {winMessage && (
            <div className="absolute top-6 px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-black text-lg animate-bounce z-10">
              {winMessage}
            </div>
          )}

          {/* Interactive Reel Visualizer */}
          <div className="flex items-center gap-4 sm:gap-6 my-8 z-10">
            {reels.map((sym, idx) => (
              <div
                key={idx}
                className="w-24 h-28 sm:w-32 sm:h-36 rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-cyan-500/50 flex items-center justify-center shadow-inner"
              >
                <span className={`text-5xl sm:text-6xl ${spinning ? "animate-pulse scale-90" : "scale-100"} transition-all`}>
                  {sym}
                </span>
              </div>
            ))}
          </div>

          {/* Spin Control Button */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-cyan-500/30 cursor-pointer z-10"
          >
            <RefreshCw size={24} className={spinning ? "animate-spin" : ""} />
            {spinning ? "SPINNING..." : "SPIN NOW"}
          </button>
        </div>

        {/* Game Footer Controls & Stats */}
        <div className="px-6 py-4 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold block">BALANCE</span>
              <span className="font-mono text-base font-black text-emerald-400">
                ${balance.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold block">BET AMOUNT</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {[0.20, 1.00, 5.00, 20.00].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setBet(amt)}
                    className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs cursor-pointer ${bet === amt ? "bg-cyan-400 text-black" : "bg-white/5 text-slate-300"}`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Volatility: <strong className="text-amber-400">{game.volatility}</strong></span>
            <span>Max Win: <strong className="text-emerald-400">{game.maxWin}</strong></span>
            <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-slate-300">100% Provably Fair</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── GAME PROVIDERS HUB ─────────── */

function ProvidersSection({
  selectedProvider,
  onSelectProvider
}: {
  selectedProvider: string;
  onSelectProvider: (p: string) => void;
}) {
  return (
    <section className="mt-14 mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-xl text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
            <Layers size={20} className="text-emerald-400" />
            Official Game Providers Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Browse certified casino game studios and their signature titles</p>
        </div>

        {selectedProvider !== "all" && (
          <button
            onClick={() => onSelectProvider("all")}
            className="text-xs text-cyan-400 underline font-semibold cursor-pointer"
          >
            Show All Providers ({PROVIDERS.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {PROVIDERS.map(p => {
          const isSelected = selectedProvider === p.name;
          return (
            <button
              key={p.name}
              onClick={() => { playSound("click"); onSelectProvider(isSelected ? "all" : p.name); }}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative overflow-hidden border ${isSelected
                ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                }`}
            >
              <span className="font-black text-sm text-white">{p.name.split(" ")[0]}</span>
              <span className="text-[10px] font-semibold text-slate-400">{p.gamesCount} Games</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-cyan-300 mt-1">
                {p.feature}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────── PARTICLES BACKGROUND ─────────── */

function Particles() {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (i * 137.5) % 100,
    y: (i * 73.1) % 100,
    size: (i % 3) + 1,
    dur: 12 + (i % 6) * 2,
    color: i % 3 === 0 ? "#00D1FF" : i % 3 === 1 ? "#7C5FFF" : "#36E6A5",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      {pts.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `nexus-float ${p.dur}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  );
}

/* ─────────── MAIN APP COMPONENT ─────────── */

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeNav, setActiveNav] = useState("Casino");

  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 6, 13]));
  const [recentGames, setRecentGames] = useState<Game[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [activeGameModal, setActiveGameModal] = useState<Game | null>(null);
  const [modalDemoMode, setModalDemoMode] = useState(false);

  // Keyboard CMD+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsSurpriseOpen(false);
        setActiveGameModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handlePlayGame = (game: Game, demo = false) => {
    setModalDemoMode(demo);
    setActiveGameModal(game);

    // Track recently played
    setRecentGames(prev => {
      const filtered = prev.filter(g => g.id !== game.id);
      return [game, ...filtered].slice(0, 5);
    });
  };

  // Filter & Sort Games
  const filteredGames = GAMES.filter(g => {
    const categoryMatch = activeCategory === "all" || g.category === activeCategory;
    const providerMatch = selectedProvider === "all" || g.provider === selectedProvider;
    const searchMatch = !searchQuery ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    let tagMatch = true;
    if (activeTag === "hot") tagMatch = g.badge === "HOT";
    if (activeTag === "high-rtp") tagMatch = g.rtp >= 96.5;
    if (activeTag === "extreme") tagMatch = g.volatility === "Extreme";
    if (activeTag === "bonus-buy") tagMatch = g.tags.includes("Bonus Buy");
    if (activeTag === "megaways") tagMatch = g.tags.includes("Megaways");
    if (activeTag === "vip") tagMatch = g.category === "blackjack" || g.category === "table" || g.badge === "VIP" || g.tags.includes("VIP Tables");

    return categoryMatch && providerMatch && searchMatch && tagMatch;
  }).sort((a, b) => {
    if (sortBy === "rtp") return b.rtp - a.rtp;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "win") return parseFloat(b.maxWin.replace(/[^0-9.]/g, '') || '0') - parseFloat(a.maxWin.replace(/[^0-9.]/g, '') || '0');
    return b.players - a.players;
  });

  // Curated Lists
  const trendingGames = GAMES.filter(g => g.badge === "HOT").slice(0, 8);

  return (
    <>
      <style>{`
        @keyframes nexus-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, -24px); }
        }
        * { scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <Particles />

        {/* Live Jackpot & Winners Header Ticker */}
        <JackpotWinnersTicker onPlayGame={handlePlayGame} />

        {/* Main Navbar */}
        <Navbar
          isDark={isDark}
          onToggleDark={() => setIsDark(d => !d)}
          onOpenSearch={() => setIsSearchOpen(true)}
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          onOpenSurprise={() => setIsSurpriseOpen(true)}
        />

        {/* Hero Slider Section */}
        <HeroSlider onPlayGame={handlePlayGame} onOpenSurprise={() => setIsSurpriseOpen(true)} />

        {/* Lobby Content Container */}
        <main className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 pb-20">
          {/* Quick Access Re-Entry Strip */}
          <QuickAccessBar
            recentGames={recentGames}
            favorites={favorites}
            onPlayGame={handlePlayGame}
            onClearRecent={() => setRecentGames([])}
          />

          {/* Visual Category Browser */}
          <VisualCategoryBrowser
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Curated Shelf: Hot & Trending Hits */}
          <CuratedShelf
            title="🔥 Hot & Trending Hits"
            subtitle="Most played casino titles in real time"
            icon={Flame}
            iconColor="#FF5A36"
            games={trendingGames}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPlayGame={handlePlayGame}
          />

          {/* Sticky Controls & Filter Toolbar */}
          <FilterToolbar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            onOpenSurprise={() => setIsSurpriseOpen(true)}
          />

          {/* Main Games Catalog Section */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-xl text-white flex items-center gap-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  <Star className="text-cyan-400" size={20} />
                  {activeCategory === "all" ? "Complete Game Hub Catalog" : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  {selectedProvider !== "all" && <span className="text-sm font-semibold text-cyan-300">({selectedProvider})</span>}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Showing {filteredGames.length} available games</p>
              </div>
            </div>

            {filteredGames.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.has(game.id)}
                      onToggleFavorite={toggleFavorite}
                      onPlayGame={handlePlayGame}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredGames.map(game => (
                    <DetailedGameRow
                      key={game.id}
                      game={game}
                      isFavorite={favorites.has(game.id)}
                      onToggleFavorite={toggleFavorite}
                      onPlayGame={handlePlayGame}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-white/5">
                <Search size={40} className="mb-3 opacity-30" />
                <p className="text-base font-bold text-slate-300">No games match your active filters</p>
                <p className="text-xs mt-1 text-slate-400">Try adjusting your provider, discovery tags, or search query.</p>
                <button
                  onClick={() => { setActiveCategory("all"); setActiveTag("all"); setSelectedProvider("all"); setSearchQuery(""); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs cursor-pointer hover:bg-cyan-300 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>



          {/* Game Providers Hub */}
          <ProvidersSection
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
          />
        </main>

        {/* Instant Search Modal (CMD+K) */}
        <InstantSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onPlayGame={handlePlayGame}
        />

        {/* Surprise Me Game Discovery Wheel Modal */}
        <SurpriseMeModal
          isOpen={isSurpriseOpen}
          onClose={() => setIsSurpriseOpen(false)}
          onPlayGame={handlePlayGame}
        />

        {/* Interactive Game Launcher Modal / Simulator Frame */}
        <GameLauncherModal
          game={activeGameModal}
          initialDemo={modalDemoMode}
          onClose={() => setActiveGameModal(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={activeGameModal ? favorites.has(activeGameModal.id) : false}
        />
      </div>
    </>
  );
}
