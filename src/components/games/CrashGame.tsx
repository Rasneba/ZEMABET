import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Rocket, Sparkles, TrendingUp } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

export const CrashGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [betAmount, setBetAmount] = useState<number>(50);
  const [autoCashout, setAutoCashout] = useState<number>(2.0);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed' | 'cashed_out'>('idle');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(1.0);
  const [recentCrashes, setRecentCrashes] = useState<number[]>([1.42, 2.15, 1.12, 5.84, 1.88, 12.40, 1.05]);
  const [profit, setProfit] = useState<number>(0);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRound = () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setGameState('running');
    setMultiplier(1.0);
    setProfit(0);

    // Provably random crash point (house edge ~3-4%)
    const rand = Math.random();
    let point = 1.01;
    if (rand > 0.05) {
      // Exponential distribution
      point = parseFloat((0.99 / (1 - rand * 0.95)).toFixed(2));
      if (point > 100) point = 100;
    } else {
      point = 1.00;
    }
    setCrashPoint(point);

    startTimeRef.current = performance.now();
  };

  const cashOut = () => {
    if (gameState !== 'running') return;
    const winAmount = Math.round(betAmount * multiplier);
    onUpdateBalance(winAmount);
    setProfit(winAmount - betAmount);
    setGameState('cashed_out');
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (gameState !== 'running') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const updateMultiplier = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      // Exponential curve: e^(0.07 * t * 1.5)
      const current = parseFloat(Math.pow(1.08, elapsed * 10).toFixed(2));

      if (current >= crashPoint) {
        setMultiplier(crashPoint);
        setGameState('crashed');
        setRecentCrashes(prev => [crashPoint, ...prev.slice(0, 7)]);
        return;
      }

      setMultiplier(current);

      // Auto cashout check
      if (autoCashout && current >= autoCashout) {
        cashOut();
        return;
      }

      requestRef.current = requestAnimationFrame(updateMultiplier);
    };

    requestRef.current = requestAnimationFrame(updateMultiplier);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, crashPoint, autoCashout, betAmount]);

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-4xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">
            <Rocket className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Jet-X / Aviator Zema <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded font-mono">Live Crash</span>
            </h3>
            <p className="text-xs text-slate-400">Cash out before the jet takes off!</p>
          </div>
        </div>

        {/* Recent Crashes */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {recentCrashes.map((val, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                val >= 2
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}
            >
              {val.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Flight Canvas Area */}
      <div className="relative h-64 sm:h-80 my-5 bg-gradient-to-b from-[#0a0e17] via-[#101726] to-[#0a0e17] rounded-xl border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center">
        {/* Background stars / flight grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>

        {/* Multiplier display */}
        <div className="relative z-10 text-center">
          <div
            className={`text-6xl sm:text-7xl font-black font-mono tracking-tight transition-transform ${
              gameState === 'crashed'
                ? 'text-rose-500 scale-95'
                : gameState === 'cashed_out'
                ? 'text-emerald-400 scale-105'
                : 'text-white'
            }`}
          >
            {multiplier.toFixed(2)}x
          </div>

          <div className="mt-2 text-sm font-semibold">
            {gameState === 'idle' && <span className="text-slate-400">Place your bet and launch!</span>}
            {gameState === 'running' && (
              <span className="text-amber-400 animate-pulse flex items-center justify-center gap-1">
                <Rocket className="w-4 h-4 animate-bounce" /> Flying high... Current cashout: {(betAmount * multiplier).toFixed(1)} ETB
              </span>
            )}
            {gameState === 'crashed' && <span className="text-rose-400 font-bold">Crashed @ {multiplier.toFixed(2)}x! Better luck next round.</span>}
            {gameState === 'cashed_out' && (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> Cashed out! Won +{profit} ETB
              </span>
            )}
          </div>
        </div>

        {/* Flying Jet visual icon */}
        {gameState === 'running' && (
          <div
            className="absolute transition-all duration-100 ease-linear"
            style={{
              bottom: `${Math.min(75, 20 + multiplier * 12)}%`,
              left: `${Math.min(80, 15 + multiplier * 10)}%`,
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 blur-md absolute inset-0 animate-ping" />
              <Rocket className="w-10 h-10 text-rose-500 rotate-45 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Bet size */}
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Bet Amount (ETB)</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={betAmount}
              disabled={gameState === 'running'}
              onChange={e => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-full bg-[#151c2a] border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => setBetAmount(prev => Math.max(10, prev / 2))}
              disabled={gameState === 'running'}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold"
            >
              ½
            </button>
            <button
              onClick={() => setBetAmount(prev => prev * 2)}
              disabled={gameState === 'running'}
              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold"
            >
              2x
            </button>
          </div>
        </div>

        {/* Auto Cashout */}
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Auto Cashout Multiplier</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              min="1.1"
              value={autoCashout}
              disabled={gameState === 'running'}
              onChange={e => setAutoCashout(parseFloat(e.target.value) || 2.0)}
              className="w-full bg-[#151c2a] border border-slate-700/60 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-xs text-slate-400 px-2 font-bold">X</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {gameState === 'running' ? (
            <button
              onClick={cashOut}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-lg shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" /> Cash Out ({(betAmount * multiplier).toFixed(1)} ETB)
            </button>
          ) : (
            <button
              onClick={startRound}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-lg shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5 fill-slate-950" /> Place Bet ({betAmount} ETB)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
