import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Disc, Sparkles } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

const RED_NUMS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const RouletteGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [selectedBet, setSelectedBet] = useState<'red' | 'black' | 'even' | 'odd' | number>('red');
  const [betAmount, setBetAmount] = useState<number>(20);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const spinRoulette = () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setIsSpinning(true);
    setLastWin(null);

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 37); // 0 to 36
      setWinningNumber(rolled);

      let won = false;
      let payoutMult = 0;

      if (typeof selectedBet === 'number') {
        if (selectedBet === rolled) {
          won = true;
          payoutMult = 36;
        }
      } else if (rolled !== 0) {
        const isRed = RED_NUMS.includes(rolled);
        const isEven = rolled % 2 === 0;

        if (selectedBet === 'red' && isRed) {
          won = true;
          payoutMult = 2;
        } else if (selectedBet === 'black' && !isRed) {
          won = true;
          payoutMult = 2;
        } else if (selectedBet === 'even' && isEven) {
          won = true;
          payoutMult = 2;
        } else if (selectedBet === 'odd' && !isEven) {
          won = true;
          payoutMult = 2;
        }
      }

      const winAmount = won ? betAmount * payoutMult : 0;
      setLastWin(winAmount);
      if (winAmount > 0) {
        onUpdateBalance(winAmount);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      setIsSpinning(false);
    }, 1500);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-emerald-600 text-white border-emerald-400';
    if (RED_NUMS.includes(num)) return 'bg-rose-600 text-white border-rose-500';
    return 'bg-slate-900 text-white border-slate-700';
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg border border-teal-500/30">
            <Disc className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              European Roulette <span className="bg-teal-500/20 text-teal-400 text-xs px-2 py-0.5 rounded font-mono">36:1 Payout</span>
            </h3>
            <p className="text-xs text-slate-400">Bet on Red, Black, Even, Odd, or Single Lucky Numbers.</p>
          </div>
        </div>
      </div>

      {/* Center Wheel Visual */}
      <div className="my-6 p-6 bg-gradient-to-b from-[#0f1923] to-[#090e17] rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
        <div className="relative w-36 h-36 rounded-full border-4 border-amber-500/50 flex items-center justify-center shadow-xl bg-[#141d2b]">
          <div className={`text-4xl font-black ${isSpinning ? 'animate-spin' : ''}`}>
            {winningNumber !== null ? (
              <span className={`px-4 py-2 rounded-full border-2 ${getNumberColor(winningNumber)}`}>
                {winningNumber}
              </span>
            ) : (
              <Disc className="w-16 h-16 text-amber-400 opacity-60" />
            )}
          </div>
        </div>

        {winningNumber !== null && !isSpinning && (
          <div className="mt-4 font-bold text-sm">
            {lastWin && lastWin > 0 ? (
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Ball landed on {winningNumber}! You Won +{lastWin} ETB
              </span>
            ) : (
              <span className="text-rose-400">Ball landed on {winningNumber}. Better luck next spin!</span>
            )}
          </div>
        )}
      </div>

      {/* Betting Options */}
      <div className="space-y-3 mb-6">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outside Bets (2x payout):</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'red', label: 'RED 🔴', color: 'bg-rose-600/30 text-rose-400 border-rose-500/50' },
            { id: 'black', label: 'BLACK ⚫', color: 'bg-slate-800 text-slate-200 border-slate-600' },
            { id: 'even', label: 'EVEN', color: 'bg-indigo-600/30 text-indigo-400 border-indigo-500/50' },
            { id: 'odd', label: 'ODD', color: 'bg-purple-600/30 text-purple-400 border-purple-500/50' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedBet(opt.id as any)}
              disabled={isSpinning}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition ${
                selectedBet === opt.id
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md ring-2 ring-amber-400'
                  : opt.color
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Quick numbers */}
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Or pick lucky number (36x):</div>
        <div className="flex flex-wrap gap-1.5">
          {[0, 7, 8, 9, 10, 11, 14, 17, 21, 24, 27, 32, 36].map(num => (
            <button
              key={num}
              onClick={() => setSelectedBet(num)}
              disabled={isSpinning}
              className={`w-9 h-9 rounded-lg font-bold text-xs border transition ${
                selectedBet === num
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 ring-2 ring-amber-400'
                  : getNumberColor(num)
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Bet:</label>
          <div className="flex items-center bg-[#151c2a] rounded-lg border border-slate-700/60 p-1">
            {[10, 20, 50, 100].map(val => (
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
          onClick={spinRoulette}
          disabled={isSpinning}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
        >
          {isSpinning ? 'Wheel Spinning...' : `Spin Wheel (${betAmount} ETB)`}
        </button>
      </div>
    </div>
  );
};
