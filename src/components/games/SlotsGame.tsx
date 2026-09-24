import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCw, Sparkles, Trophy } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
  title?: string;
}

const SYMBOLS = ['🌸', '👑', '💎', '7️⃣', '🔔', '🍇', '🍋', '🍒'];

export const SlotsGame: React.FC<Props> = ({ balance, onUpdateBalance, title = "Multi Hot 5 : Wild Ways" }) => {
  const [betAmount, setBetAmount] = useState<number>(20);
  const [reels, setReels] = useState<string[]>(['👑', '💎', '7️⃣']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const spin = async () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setIsSpinning(true);
    setLastWin(null);

    // Animation interval
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 90);

    setTimeout(() => {
      clearInterval(spinInterval);

      // Generate final result with weighted chance of winning
      const rand = Math.random();
      let finalReels: string[] = [];

      if (rand < 0.20) {
        // 3 of a kind jackpot
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        finalReels = [sym, sym, sym];
      } else if (rand < 0.55) {
        // 2 match
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const symOther = SYMBOLS.filter(s => s !== sym)[0];
        finalReels = [sym, sym, symOther];
      } else {
        // no match
        finalReels = [
          SYMBOLS[Math.floor(Math.random() * 3)],
          SYMBOLS[3 + Math.floor(Math.random() * 2)],
          SYMBOLS[5 + Math.floor(Math.random() * 3)],
        ];
      }

      setReels(finalReels);

      // Calculate win
      let win = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        // Triple
        const mult = finalReels[0] === '👑' || finalReels[0] === '7️⃣' ? 50 : 25;
        win = betAmount * mult;
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
        // Double
        win = Math.round(betAmount * 2.5);
      }

      setLastWin(win);
      if (win > 0) {
        onUpdateBalance(win);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setIsSpinning(false);
    }, 1200);
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
            🎰
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              {title} <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded font-mono">5000x Max</span>
            </h3>
            <p className="text-xs text-slate-400">Match 2 or 3 symbols along the payline to win big.</p>
          </div>
        </div>
      </div>

      {/* Slots Machine Display */}
      <div className="my-6 p-6 bg-gradient-to-b from-[#1d1630] via-[#101726] to-[#0a0e17] rounded-2xl border-2 border-amber-500/40 shadow-inner flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-6 w-full max-w-md py-6 bg-[#070b12] rounded-xl border border-slate-800 shadow-2xl">
          {reels.map((sym, idx) => (
            <div
              key={idx}
              className={`w-20 h-28 sm:w-24 sm:h-32 bg-gradient-to-b from-[#1b2537] to-[#111724] border-2 border-slate-700/80 rounded-xl flex items-center justify-center text-5xl sm:text-6xl shadow-md transition-all select-none ${
                isSpinning ? 'blur-[1px] animate-pulse' : ''
              }`}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Win Alert */}
        <div className="mt-4 min-h-[32px] flex items-center justify-center">
          {lastWin !== null && (
            <div
              className={`text-base font-extrabold flex items-center gap-2 ${
                lastWin > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-400'
              }`}
            >
              {lastWin > 0 ? (
                <>
                  <Trophy className="w-5 h-5 text-amber-400" /> BIG WIN! +{lastWin} ETB
                </>
              ) : (
                'Try again!'
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Bet:</label>
          <div className="flex items-center bg-[#151c2a] rounded-lg border border-slate-700/60 p-1">
            {[10, 20, 50, 100, 250].map(val => (
              <button
                key={val}
                onClick={() => setBetAmount(val)}
                disabled={isSpinning}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  betAmount === val ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={isSpinning}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-lg shadow-lg shadow-amber-500/30 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Spinning...' : `SPIN (${betAmount} ETB)`}
        </button>
      </div>
    </div>
  );
};
