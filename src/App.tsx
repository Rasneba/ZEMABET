import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Grid,
  Rocket,
  Coins,
  Dices,
  Radio,
  Gamepad2,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Wallet,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Menu,
  X,
  Play,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { GAMES, CATEGORIES, FAQ_ITEMS, Game } from './data/games';
import { KenoGame } from './components/games/KenoGame';
import { CrashGame } from './components/games/CrashGame';
import { MinesGame } from './components/games/MinesGame';
import { SlotsGame } from './components/games/SlotsGame';
import { RouletteGame } from './components/games/RouletteGame';
import { DiceGame } from './components/games/DiceGame';
import { WheelGame } from './components/games/WheelGame';
import { WalletModal } from './components/WalletModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // User balance state
  const [balance, setBalance] = useState<number>(1250.0);
  const [user, setUser] = useState<{ username: string } | null>({ username: '0912***456' });

  // Navigation & selection
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Modals
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<'deposit' | 'withdraw'>('deposit');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // FAQ open item
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Countdown timer for 200% bonus
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; ms: number }>({
    hours: 9,
    minutes: 38,
    seconds: 20,
    ms: 9,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.ms > 0) return { ...prev, ms: prev.ms - 1 };
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1, ms: 9 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59, ms: 9 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59, ms: 9 };
        return { hours: 12, minutes: 0, seconds: 0, ms: 0 };
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateBalance = (delta: number) => {
    setBalance(prev => Math.max(0, parseFloat((prev + delta).toFixed(2))));
  };

  const filteredGames = GAMES.filter(g => {
    const matchesCat =
      activeCategory === 'all' ? true : activeCategory === 'hot' ? g.category === 'hot' : g.category === activeCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openDeposit = () => {
    setWalletType('deposit');
    setWalletModalOpen(true);
  };

  const openWithdraw = () => {
    setWalletType('withdraw');
    setWalletModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* TOP TICKER BAR / ANNOUNCEMENT */}
      <div className="bg-[#101726] border-b border-slate-800/80 px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400">Live Payouts:</span>
          <span className="truncate text-slate-300">
            Abebe K. won <strong className="text-amber-400">12,450 ETB</strong> on Fast Keno • Dawit T. won <strong className="text-amber-400">8,200 ETB</strong> on Jet-X • Helen M. won <strong className="text-amber-400">24,000 ETB</strong> on Enkutatash
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-400">
          <a
            href="https://t.me/tolobirrbot/start"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-sky-400 transition"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" /> Play on Telegram Bot
          </a>
          <span>|</span>
          <a
            href="https://t.me/tolobirr_support_bot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-400 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" /> 24/7 Support
          </a>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-[#0d121c]/95 backdrop-blur-md border-b border-slate-800/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedGame(null); setActiveCategory('all'); }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                <span className="text-slate-950 font-black text-xl tracking-tighter">Z</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                    ZEMA BET
                  </span>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30 tracking-wider">
                    ETB
                  </span>
                </div>
                <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                  Ethiopia's Premier Casino
                </p>
              </div>
            </button>
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search games, keno, jet-x, slots..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#141b27] border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Wallet & Auth */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Balance display */}
                <div className="bg-[#141b27] border border-slate-700/70 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Wallet</span>
                    <span className="text-sm font-extrabold text-amber-400 font-mono">
                      {balance.toFixed(2)} <span className="text-xs text-slate-300">ETB</span>
                    </span>
                  </div>
                  <button
                    onClick={openDeposit}
                    className="w-7 h-7 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center font-black transition active:scale-95 shadow-sm"
                    title="Deposit"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={openWithdraw}
                  className="hidden sm:inline-flex px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
                >
                  Withdraw
                </button>

                <button
                  onClick={() => setUser(null)}
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 transition"
                  title="Account"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1420] border-t border-slate-800 p-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#151c2a] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="https://t.me/tolobirrbot/start"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-[#2AABEE]/20 border border-[#2AABEE]/40 text-[#2AABEE] rounded-xl text-xs font-bold"
              >
                <Send className="w-4 h-4" /> Play on Telegram
              </a>
              <a
                href="https://t.me/tolobirr_support_bot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold"
              >
                <HelpCircle className="w-4 h-4" /> Support Bot
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ACTIVE GAME MODAL / VIEW (IF A GAME IS OPENED) */}
      {selectedGame && (
        <section className="bg-[#0b0e16] border-b border-slate-800 py-6 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedGame(null)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition"
              >
                ← Back to Game Lobby
              </button>
              <div className="text-xs text-slate-400 font-semibold">
                Playing: <span className="text-amber-400 font-bold">{selectedGame.title}</span> by {selectedGame.provider}
              </div>
            </div>

            {/* Playable Game Engine */}
            {selectedGame.playableType === 'keno' && (
              <KenoGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {selectedGame.playableType === 'crash' && (
              <CrashGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {selectedGame.playableType === 'mines' && (
              <MinesGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {selectedGame.playableType === 'slots' && (
              <SlotsGame balance={balance} onUpdateBalance={handleUpdateBalance} title={selectedGame.title} />
            )}
            {selectedGame.playableType === 'roulette' && (
              <RouletteGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {selectedGame.playableType === 'dice' && (
              <DiceGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {selectedGame.playableType === 'wheel' && (
              <WheelGame balance={balance} onUpdateBalance={handleUpdateBalance} />
            )}
            {!selectedGame.playableType && (
              <SlotsGame balance={balance} onUpdateBalance={handleUpdateBalance} title={selectedGame.title} />
            )}
          </div>
        </section>
      )}

      {/* HERO BANNER - TOLOBIRR STYLE 200% BONUS & COUNTDOWN */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#121827] via-[#10141f] to-[#0a0d14] border-b border-slate-800/80">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Promo text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Claim Your Free Reward
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                GET <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">200% BONUS</span>
                <span className="block text-2xl sm:text-3xl font-extrabold text-slate-300 mt-2">
                  ON FIRST DEPOSIT IN BIRR (ETB)
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-xl">
                Experience Ethiopia's premier casino clone with instant Telebirr & CBE deposits. Fast Keno draws, Jet-X crash multipliers up to 100x, Enkutatash Ethiopian slots, and real-time cashouts.
              </p>

              {/* Countdown Flip Clocks */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Offer Expires In:
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#182233] border border-amber-500/40 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-lg">
                    <div className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</div>
                  </div>
                  <span className="text-2xl font-black text-amber-400">:</span>
                  <div className="bg-[#182233] border border-amber-500/40 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-lg">
                    <div className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Min</div>
                  </div>
                  <span className="text-2xl font-black text-amber-400">:</span>
                  <div className="bg-[#182233] border border-amber-500/40 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-lg">
                    <div className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Sec</div>
                  </div>
                  <span className="text-2xl font-black text-amber-400">:</span>
                  <div className="bg-[#182233] border border-amber-500/40 rounded-xl px-3 py-2 text-center min-w-[46px] shadow-lg">
                    <div className="text-2xl font-black font-mono text-amber-300 leading-none">
                      {timeLeft.ms}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">MS</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={openDeposit}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-base shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 fill-slate-950" /> Claim 200% Bonus
                </button>
                <a
                  href="https://t.me/tolobirrbot/start"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold rounded-xl text-base shadow-lg shadow-sky-500/20 active:scale-95 transition flex items-center gap-2"
                >
                  <Send className="w-5 h-5 fill-white" /> Play on Telegram
                </a>
              </div>
            </div>

            {/* Right Highlights Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#182235] to-[#121927] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    ⚡ Instant Ethiopian Gateways
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Zero Fees
                  </span>
                </div>

                <div className="space-y-3.5 my-5">
                  <div className="flex items-center gap-3 p-3 bg-[#111724] rounded-2xl border border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">
                      Tele
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">Telebirr Direct Cashout</div>
                      <div className="text-xs text-slate-400">Withdrawals in &lt; 3 minutes</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-mono">Instant</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#111724] rounded-2xl border border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">
                      CBE
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">CBE Birr & Commercial Bank</div>
                      <div className="text-xs text-slate-400">Instant deposits & verified transfers</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 font-mono">24/7</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Provably Fair Gaming
                  </span>
                  <span className="font-semibold text-slate-300">Min. Deposit: 10 ETB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES BAR */}
      <section className="bg-[#0e1420] border-b border-slate-800/80 sticky top-18 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-[#151c2a] text-slate-300 hover:bg-[#1c2638] hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.id === 'all' && <Gamepad2 className="w-4 h-4" />}
                  {cat.id === 'hot' && <Flame className="w-4 h-4 text-rose-500" />}
                  {cat.id === 'keno' && <Grid className="w-4 h-4 text-blue-400" />}
                  {cat.id === 'crash' && <Rocket className="w-4 h-4 text-amber-400" />}
                  {cat.id === 'slots' && <Coins className="w-4 h-4 text-yellow-400" />}
                  {cat.id === 'table' && <Dices className="w-4 h-4 text-emerald-400" />}
                  {cat.id === 'bingo' && <Radio className="w-4 h-4 text-pink-400" />}
                  <span>{cat.label}</span>
                  {cat.count && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* GAMES GRID SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Section title & stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeCategory === 'all' && 'Featured Games'}
              {activeCategory === 'hot' && '🔥 Hot Games'}
              {activeCategory === 'keno' && '🎱 Keno Lottery'}
              {activeCategory === 'crash' && '🚀 Jet-X & Crash Games'}
              {activeCategory === 'slots' && '🎰 Ethiopian & Classic Slots'}
              {activeCategory === 'table' && '🎲 Table & Roulette'}
              {activeCategory === 'bingo' && '📻 Live Bingo'}
            </h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
              {filteredGames.length} games
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Provider:</span>
            <span className="text-amber-400 font-bold">SmartSoft • BC Originals • AtlasV</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => {
                setSelectedGame(game);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="group relative bg-[#131a27] hover:bg-[#182234] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 overflow-hidden"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-2">
                {game.isNew ? (
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                    New
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    RTP {game.rtp}
                  </span>
                )}
                {game.badge && (
                  <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {game.badge}
                  </span>
                )}
              </div>

              {/* Game Card Visual Banner */}
              <div
                className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${game.bgGradient} flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition duration-300`}
              >
                {/* Visual backdrop pattern */}
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    {game.category === 'keno' && <Grid className="w-6 h-6 text-white" />}
                    {game.category === 'crash' && <Rocket className="w-6 h-6 text-white" />}
                    {game.category === 'hot' && <Flame className="w-6 h-6 text-white" />}
                    {game.category === 'slots' && <Coins className="w-6 h-6 text-white" />}
                    {game.category === 'table' && <Dices className="w-6 h-6 text-white" />}
                    {game.category === 'bingo' && <Radio className="w-6 h-6 text-white" />}
                  </div>
                  <span className="text-white font-extrabold text-xs sm:text-sm mt-2 line-clamp-1 drop-shadow-md">
                    {game.title}
                  </span>
                </div>

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-3">
                <div className="font-bold text-sm text-white truncate group-hover:text-amber-400 transition">
                  {game.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center justify-between mt-0.5">
                  <span>{game.provider}</span>
                  <span className="text-amber-400 font-bold">Play →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXCLUSIVE FEATURES SECTION */}
        <div className="my-14 bg-gradient-to-r from-[#111827] via-[#151f32] to-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block mb-1">
              Why Choose ZEMA BET
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Exclusive Features for Ethiopian Players</h3>
            <p className="text-slate-400 text-sm mt-1">
              Engineered with the exact look, feel, and rapid gaming mechanics of Tolobirr with enhanced high-speed local payment integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#0b1019] p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                  <Send className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">Play on Telegram Bot</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Direct sync with Telegram mini-app. Play without VPN, fast loading even on 3G connections across Addis Ababa and regional cities.
                </p>
              </div>
              <a
                href="https://t.me/tolobirrbot/start"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 mt-4"
              >
                Launch Bot <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-[#0b1019] p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Wallet className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">Telebirr & CBE Payouts</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Automatic withdrawal system. Winnings transfer directly to your Telebirr wallet or CBE account in less than 3 minutes.
                </p>
              </div>
              <button
                onClick={openDeposit}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 mt-4 text-left"
              >
                Deposit in Birr <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-[#0b1019] p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">Provably Fair Verification</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Cryptographically verifiable seed hashes ensure zero house manipulation. Every ball drawn in Keno and Jet-X crash is 100% fair.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-4">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified RNG
              </span>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION (DIRECT TOLOBIRR CLONE) */}
        <section className="my-14 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block mb-1">Got Questions?</span>
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about playing on ZEMA BET.</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#121824] border border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-white hover:text-amber-400 transition"
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <a
              href="https://t.me/tolobirr_support_bot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline"
            >
              Have more questions? Contact our 24/7 Telegram Support <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#090d14] border-t border-slate-800/90 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950">
                  Z
                </div>
                <span className="font-black text-xl tracking-tight text-white">ZEMA BET</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The premier online casino platform clone of ToloBirr in Ethiopia. Experience real-time Keno, Jet-X crash, slots, and instant Telebirr cashouts.
              </p>
              <div className="text-xs text-amber-400 font-bold">18+ Only • Play Responsibly</div>
            </div>

            {/* Col 2: Games */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-3">Popular Games</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><button onClick={() => { setActiveCategory('keno'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400">Fast Keno 80</button></li>
                <li><button onClick={() => { setActiveCategory('crash'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400">Jet-X Aviator</button></li>
                <li><button onClick={() => { setActiveCategory('slots'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400">እንቁጣጣሽ (Enkutatash)</button></li>
                <li><button onClick={() => { setActiveCategory('hot'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400">Multi Hot 5</button></li>
                <li><button onClick={() => { setActiveCategory('table'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-amber-400">Mines & Dice</button></li>
              </ul>
            </div>

            {/* Col 3: Features */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><a href="https://t.me/tolobirrbot/start" target="_blank" rel="noreferrer" className="hover:text-sky-400">Play on Telegram</a></li>
                <li><button onClick={openDeposit} className="hover:text-amber-400">Deposit Telebirr</button></li>
                <li><button onClick={openWithdraw} className="hover:text-amber-400">Instant Withdrawal</button></li>
                <li><a href="https://t.me/tolobirr_support_bot" target="_blank" rel="noreferrer" className="hover:text-amber-400">Telegram Support</a></li>
              </ul>
            </div>

            {/* Col 4: Payments Accepted */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-3">Payment Methods</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#121824] p-2 rounded-lg border border-slate-800 text-center text-slate-300 font-bold">
                  Telebirr
                </div>
                <div className="bg-[#121824] p-2 rounded-lg border border-slate-800 text-center text-slate-300 font-bold">
                  CBE Birr
                </div>
                <div className="bg-[#121824] p-2 rounded-lg border border-slate-800 text-center text-slate-300 font-bold">
                  Awash Bank
                </div>
                <div className="bg-[#121824] p-2 rounded-lg border border-slate-800 text-center text-slate-300 font-bold">
                  Commercial Bank
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                All transactions processed in Ethiopian Birr (ETB). Instant automated crediting.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026 ZEMA BET (ToloBirr Clone). All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Fair Play & RNG Certified</span>
              <span>•</span>
              <span>Terms & Conditions</span>
              <span>•</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        type={walletType}
        balance={balance}
        onUpdateBalance={handleUpdateBalance}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={username => setUser({ username })}
      />
    </div>
  );
}
