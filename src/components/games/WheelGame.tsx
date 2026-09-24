import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PieChart, Sparkles } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

const SEGMENTS = [
  { label: '0x', mult: 0, color: 'bg-rose-900 border-rose-700' },
  { label: '1.2x', mult: 1.2, color: 'bg-blue-900 border-blue-700' },
  { label: '1.5x', mult: 1.5, color: 'bg-indigo-900 border-indigo-700' },
  { label: '2.0x', mult: 2.0, color: 'bg-emerald-900 border-emerald-700' },
  { label: '0.5x', mult: 0.5, color: 'bg-slate-800 border-slate-600' },
  { label: '3.0x', mult: 3.0, color: 'bg-purple-900 border-purple-700' },
  { label: '5.0x', mult: 5.0, color: 'bg-amber-700 border-amber-500' },
  { label: '10x', mult: 10.0, color: 'bg-yellow-500 text-slate-950 font-black border-yellow-300' },
];

export const WheelGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [betAmount, setBetAmount] = useState<number>(25);
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<typeof SEGMENTS[0] | null>(null);

  const spinWheel = () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setIsSpinning(true);
    setResult(null);

    const winningIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const extraRotations = 360 * 5;
    const finalAngle = extraRotations + (SEGMENTS.length - 1 - winningIndex) * segmentAngle + segmentAngle / 2;

    setRotation(prev => prev + finalAngle);

    setTimeout(() => {
      const selected = SEGMENTS[winningIndex];
      setResult(selected);
      const win = Math.round(betAmount * selected.mult);
      if (win > 0) {
        onUpdateBalance(win);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
            <PieChart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Wheel of Birr <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded font-mono">10x Jackpot</span>
            </h3>
            <p className="text-xs text-slate-400">Spin the Ethiopian fortune wheel to multiply your stake.</p>
          </div>
        </div>
      </div>

      {/* Wheel Representation */}
      <div className="my-8 flex flex-col items-center justify-center relative">
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full border-4 border-amber-500 shadow-2xl overflow-hidden flex items-center justify-center bg-[#131b2c]">
          <div
            className="w-full h-full rounded-full transition-transform duration-[3000ms] ease-out flex items-center justify-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="grid grid-cols-2 grid-rows-4 w-full h-full">
              {SEGMENTS.map((seg, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center text-xs font-bold border border-slate-900/40 ${seg.color}`}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          </div>
          {/* Wheel Pointer */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-8 border-x-transparent border-t-[14px] border-t-amber-400 filter drop-shadow" />
          <div className="absolute w-12 h-12 rounded-full bg-[#0d131f] border-2 border-amber-500 z-10 flex items-center justify-center font-bold text-xs text-amber-400">
            ZEMA
          </div>
        </div>

        {result && !isSpinning && (
          <div className="mt-4 font-bold text-base">
            {result.mult > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-extrabold">
                <Sparkles className="w-5 h-5" /> Hit {result.label}! Won +{Math.round(betAmount * result.mult)} ETB
              </span>
            ) : (
              <span className="text-rose-400">Hit 0x. Try another spin!</span>
            )}
          </div>
        )}
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
          onClick={spinWheel}
          disabled={isSpinning}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
        >
          {isSpinning ? 'Wheel Spinning...' : `Spin Wheel (${betAmount} ETB)`}
        </button>
      </div>
    </div>
  );
};
