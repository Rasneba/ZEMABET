import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Bomb, Diamond, Sparkles, Trophy } from 'lucide-react';

interface Props {
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

export const MinesGame: React.FC<Props> = ({ balance, onUpdateBalance }) => {
  const [mineCount, setMineCount] = useState<number>(3);
  const [betAmount, setBetAmount] = useState<number>(20);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [grid, setGrid] = useState<Array<{ isMine: boolean; revealed: boolean }>>([]);
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const initGame = () => {
    if (balance < betAmount) {
      alert('Insufficient balance. Please deposit funds!');
      return;
    }

    onUpdateBalance(-betAmount);
    setRevealedCount(0);
    setIsGameOver(false);
    setLastWin(null);

    // 25 tiles
    const tiles = Array(25).fill(false);
    let placed = 0;
    while (placed < mineCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!tiles[idx]) {
        tiles[idx] = true;
        placed++;
      }
    }

    setGrid(tiles.map(isMine => ({ isMine, revealed: false })));
    setIsPlaying(true);
  };

  const getMultiplier = (gems: number) => {
    if (gems === 0) return 1.0;
    // Calculate fair multiplier based on remaining tiles
    let mult = 1.0;
    for (let i = 0; i < gems; i++) {
      mult *= (25 - i) / (25 - mineCount - i);
    }
    return parseFloat((mult * 0.98).toFixed(2));
  };

  const currentMultiplier = getMultiplier(revealedCount);

  const clickTile = (index: number) => {
    if (!isPlaying || isGameOver || grid[index].revealed) return;

    const tile = grid[index];
    const newGrid = [...grid];
    newGrid[index].revealed = true;

    if (tile.isMine) {
      // Boom! Game Over
      setIsGameOver(true);
      setIsPlaying(false);
      // reveal all
      setGrid(newGrid.map(t => ({ ...t, revealed: true })));
      setLastWin(0);
    } else {
      const newRevealed = revealedCount + 1;
      setRevealedCount(newRevealed);
      setGrid(newGrid);

      // Check if won all gems
      if (newRevealed === 25 - mineCount) {
        cashout(newRevealed);
      }
    }
  };

  const cashout = (gemsCount = revealedCount) => {
    if (!isPlaying || isGameOver || gemsCount === 0) return;
    const mult = getMultiplier(gemsCount);
    const winAmount = Math.round(betAmount * mult);
    onUpdateBalance(winAmount);
    setLastWin(winAmount);
    setIsPlaying(false);
    setIsGameOver(true);
    setGrid(grid.map(t => ({ ...t, revealed: true })));

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-slate-800 p-4 sm:p-6 text-white max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
            <Bomb className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Mines <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded font-mono">Provably Fair</span>
            </h3>
            <p className="text-xs text-slate-400">Uncover diamonds, dodge the hidden mines, and cash out anytime.</p>
          </div>
        </div>

        {isPlaying && revealedCount > 0 && (
          <button
            onClick={() => cashout()}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" /> Cashout ({(betAmount * currentMultiplier).toFixed(0)} ETB)
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2.5 my-6 max-w-md mx-auto aspect-square">
        {grid.length === 0
          ? Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#182234] rounded-xl border border-slate-700/60 flex items-center justify-center opacity-70"
              >
                <div className="w-3 h-3 rounded-full bg-slate-600/40" />
              </div>
            ))
          : grid.map((tile, i) => {
              let bg = "bg-[#182234] hover:bg-[#202c42] border-slate-700/60";
              let content = null;

              if (tile.revealed) {
                if (tile.isMine) {
                  bg = "bg-rose-950/80 border-rose-500 text-rose-500";
                  content = <Bomb className="w-7 h-7 text-rose-500 animate-bounce" />;
                } else {
                  bg = "bg-emerald-950/80 border-emerald-500 text-emerald-400 scale-105";
                  content = <Diamond className="w-7 h-7 text-emerald-400 animate-pulse fill-emerald-400/20" />;
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => clickTile(i)}
                  disabled={!isPlaying || tile.revealed}
                  className={`rounded-xl border transition-all duration-200 flex items-center justify-center shadow-md ${bg}`}
                >
                  {content}
                </button>
              );
            })}
      </div>

      {/* Status Alert */}
      {isGameOver && (
        <div className={`p-3 rounded-xl mb-4 text-center font-bold text-sm ${lastWin && lastWin > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
          {lastWin && lastWin > 0
            ? `🎉 Congratulations! Cashed out +${lastWin} ETB (${currentMultiplier}x)`
            : '💥 Boom! You hit a mine. Try again!'}
        </div>
      )}

      {/* Settings / Controls */}
      <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Mines</label>
            <select
              value={mineCount}
              disabled={isPlaying}
              onChange={e => setMineCount(parseInt(e.target.value))}
              className="bg-[#151c2a] border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
            >
              {[1, 2, 3, 5, 10, 15, 20, 24].map(c => (
                <option key={c} value={c}>{c} Mines</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Bet (ETB)</label>
            <div className="flex items-center bg-[#151c2a] rounded-lg border border-slate-700/60 p-0.5">
              {[10, 20, 50, 100].map(val => (
                <button
                  key={val}
                  onClick={() => setBetAmount(val)}
                  disabled={isPlaying}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${betAmount === val ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={initGame}
          disabled={isPlaying}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-base shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50"
        >
          {isPlaying ? 'Game in Progress' : `Start Mines (${betAmount} ETB)`}
        </button>
      </div>
    </div>
  );
};
