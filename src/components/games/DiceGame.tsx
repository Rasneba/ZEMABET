import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, Sparkles } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

export const DiceGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [targetNumber, setTargetNumber] = useState<number>(50);
  const [rollMode, setRollMode] = useState<'over' | 'under'>('over');
  const [betAmount, setBetAmount] = useState<number>(25);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  // Calculate multiplier & win chance
  const winChance = rollMode === 'over' ? 100 - targetNumber : targetNumber;
  const multiplier = parseFloat(((100 / winChance) * 0.98).toFixed(2));

  const rollDice = () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setIsRolling(true);
    setLastWin(null);

    setTimeout(() => {
      const rolled = parseFloat((Math.random() * 100).toFixed(2));
      setLastRoll(rolled);

      const won = rollMode === 'over' ? rolled > targetNumber : rolled < targetNumber;
      const winAmount = won ? Math.round(betAmount * multiplier) : 0;
      setLastWin(winAmount);

      if (winAmount > 0) {
        onUpdateBalance(winAmount);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      setIsRolling(false);
    }, 600);
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
            <Dices className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Classic Dice <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded font-mono">99% RTP</span>
            </h3>
            <p className="text-xs text-slate-400">Roll over or under your target prediction.</p>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <div className="my-6 p-6 bg-gradient-to-b from-[#0f172a] to-[#0a0e1a] rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
        <div
          className={`text-6xl font-black font-mono transition-transform duration-200 ${
            lastRoll !== null
              ? (rollMode === 'over' ? lastRoll > targetNumber : lastRoll < targetNumber)
                ? 'text-emerald-400 scale-110'
                : 'text-rose-500'
              : 'text-slate-300'
          }`}
        >
          {lastRoll !== null ? lastRoll.toFixed(2) : '50.00'}
        </div>

        {lastRoll !== null && (
          <div className="mt-3 font-bold text-sm">
            {lastWin && lastWin > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <Sparkles className="w-4 h-4" /> You won +{lastWin} ETB! ({multiplier}x)
              </span>
            ) : (
              <span className="text-rose-400">Missed! Roll again.</span>
            )}
          </div>
        )}
      </div>

      {/* Target Slider */}
      <div className="space-y-4 mb-6 bg-[#0b1019] p-4 rounded-xl border border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>0</span>
          <span>Target: <strong className="text-amber-400 text-base">{targetNumber}</strong></span>
          <span>100</span>
        </div>

        <input
          type="range"
          min="2"
          max="98"
          value={targetNumber}
          onChange={e => setTargetNumber(parseInt(e.target.value))}
          disabled={isRolling}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
        />

        <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">Multiplier</div>
            <div className="text-sm font-black text-amber-400">{multiplier}x</div>
          </div>
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">Win Chance</div>
            <div className="text-sm font-black text-emerald-400">{winChance.toFixed(1)}%</div>
          </div>
          <div className="bg-[#151c2a] p-2 rounded-lg border border-slate-800">
            <div className="text-slate-400">Mode</div>
            <button
              onClick={() => setRollMode(rollMode === 'over' ? 'under' : 'over')}
              className="text-xs font-extrabold text-blue-400 uppercase underline"
            >
              Roll {rollMode}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Bet:</label>
          <div className="flex items-center bg-[#151c2a] rounded-lg border border-slate-700/60 p-1">
            {[10, 25, 50, 100].map(val => (
              <button
                key={val}
                onClick={() => setBetAmount(val)}
                disabled={isRolling}
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
          onClick={rollDice}
          disabled={isRolling}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
        >
          {isRolling ? 'Rolling...' : `Roll Dice (${betAmount} ETB)`}
        </button>
      </div>
    </div>
  );
};
