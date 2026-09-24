import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

export const KenoGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([7, 14, 21, 33, 50]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState<number>(20);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const toggleNumber = (num: number) => {
    if (isPlaying) return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < 10) {
        setSelectedNumbers([...selectedNumbers, num]);
      }
    }
  };

  const autoPick = () => {
    if (isPlaying) return;
    const randoms: number[] = [];
    while (randoms.length < 5) {
      const n = Math.floor(Math.random() * 80) + 1;
      if (!randoms.includes(n)) randoms.push(n);
    }
    setSelectedNumbers(randoms);
  };

  const clearSelection = () => {
    if (isPlaying) return;
    setSelectedNumbers([]);
  };

  const playRound = async () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }
    if (selectedNumbers.length === 0) {
      alert('Please pick at least 1 number!');
      return;
    }

    onUpdateBalance(-betAmount);
    setIsPlaying(true);
    setDrawnNumbers([]);
    setLastWin(null);

    const draws: number[] = [];
    while (draws.length < 20) {
      const n = Math.floor(Math.random() * 80) + 1;
      if (!draws.includes(n)) draws.push(n);
    }

    // Reveal one by one
    for (let i = 0; i < draws.length; i++) {
      await new Promise(r => setTimeout(r, 80));
      setDrawnNumbers(prev => [...prev, draws[i]]);
    }

    // Calculate matches
    const hits = draws.filter(d => selectedNumbers.includes(d)).length;
    let multiplier = 0;
    if (selectedNumbers.length === 5) {
      if (hits === 5) multiplier = 50;
      else if (hits === 4) multiplier = 12;
      else if (hits === 3) multiplier = 3;
      else if (hits === 2) multiplier = 1;
    } else {
      const ratio = hits / selectedNumbers.length;
      if (ratio === 1) multiplier = 30;
      else if (ratio >= 0.75) multiplier = 8;
      else if (ratio >= 0.5) multiplier = 2.5;
    }

    const winAmount = Math.round(betAmount * multiplier);
    setLastWin(winAmount);
    if (winAmount > 0) {
      onUpdateBalance(winAmount);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setIsPlaying(false);
  };

  const matchesCount = drawnNumbers.filter(d => selectedNumbers.includes(d)).length;

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-4xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
            K
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Fast Keno 80 <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded font-mono">Live RNG</span>
            </h3>
            <p className="text-xs text-slate-400">Select up to 10 numbers. 20 numbers drawn per round.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={autoPick}
            disabled={isPlaying}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            Auto Pick 5
          </button>
          <button
            onClick={clearSelection}
            disabled={isPlaying}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg transition disabled:opacity-50 text-slate-400"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 80 Number Grid */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2 my-5">
        {Array.from({ length: 80 }, (_, i) => i + 1).map(num => {
          const isSelected = selectedNumbers.includes(num);
          const isDrawn = drawnNumbers.includes(num);
          const isHit = isSelected && isDrawn;

          let bgClass = "bg-[#182234] text-slate-300 hover:bg-[#202c42] border-slate-700/60";
          if (isHit) {
            bgClass = "bg-emerald-500 text-slate-950 font-black border-emerald-400 scale-105 shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300";
          } else if (isDrawn) {
            bgClass = "bg-amber-500/20 text-amber-300 font-bold border-amber-500/40";
          } else if (isSelected) {
            bgClass = "bg-amber-500 text-slate-950 font-black border-amber-400 scale-105 shadow-md shadow-amber-500/30";
          }

          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isPlaying}
              className={`h-9 sm:h-11 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center border transition-all ${bgClass}`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bet (ETB):</span>
          <div className="flex items-center bg-[#151c2a] rounded-lg border border-slate-700/60 p-1">
            {[10, 20, 50, 100, 200].map(val => (
              <button
                key={val}
                onClick={() => setBetAmount(val)}
                disabled={isPlaying}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  betAmount === val ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {drawnNumbers.length > 0 && (
          <div className="text-sm font-bold flex items-center gap-3">
            <span>Hits: <strong className="text-emerald-400 text-base">{matchesCount}</strong>/{selectedNumbers.length}</span>
            {lastWin !== null && (
              <span className={lastWin > 0 ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>
                {lastWin > 0 ? `Won: +${lastWin} ETB!` : 'No Win'}
              </span>
            )}
          </div>
        )}

        <button
          onClick={playRound}
          disabled={isPlaying || selectedNumbers.length === 0}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-base shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>
              <RotateCcw className="w-5 h-5 animate-spin" /> Drawing Balls...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-slate-950" /> Play Fast Keno ({betAmount} ETB)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
