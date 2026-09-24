import React, { useState } from 'react';
import { X, CheckCircle2, Phone, CreditCard, ArrowDownRight, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  balance: number;
  onUpdateBalance: (amount: number) => void;
}

export const WalletModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type: initialType,
  balance,
  onUpdateBalance,
}) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>(initialType);
  const [method, setMethod] = useState<'telebirr' | 'cbe' | 'awash'>('telebirr');
  const [amount, setAmount] = useState<number>(100);
  const [phone, setPhone] = useState<string>('0912345678');
  const [accountNumber, setAccountNumber] = useState<string>('1000123456789');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!isOpen) return null;

  const handleAction = () => {
    if (tab === 'deposit') {
      if (amount < 10) {
        alert('Minimum deposit is 10 ETB');
        return;
      }
      setStatus('processing');
      setTimeout(() => {
        onUpdateBalance(amount);
        setStatus('success');
      }, 1000);
    } else {
      if (amount < 50) {
        alert('Minimum withdrawal is 50 ETB');
        return;
      }
      if (amount > balance) {
        alert('Insufficient balance for withdrawal');
        return;
      }
      setStatus('processing');
      setTimeout(() => {
        onUpdateBalance(-amount);
        setStatus('success');
      }, 1000);
    }
  };

  const resetAndClose = () => {
    setStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121824] border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ETB
            </div>
            <h2 className="text-lg font-extrabold text-white">ZEMA Wallet</h2>
          </div>
          <button
            onClick={resetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-3 bg-[#0d121c] border-b border-slate-800/80 gap-2">
          <button
            onClick={() => { setTab('deposit'); setStatus('idle'); }}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
              tab === 'deposit'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" /> Deposit
          </button>
          <button
            onClick={() => { setTab('withdraw'); setStatus('idle'); }}
            className={`py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
              tab === 'withdraw'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {status === 'success' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">
                {tab === 'deposit' ? 'Deposit Completed!' : 'Withdrawal Initiated!'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {tab === 'deposit'
                  ? `Successfully added ${amount} ETB to your balance via ${method.toUpperCase()}.`
                  : `Transferred ${amount} ETB to your ${method.toUpperCase()} account. Expected within 3 minutes.`}
              </p>
              <div className="bg-[#182234] p-3 rounded-xl border border-slate-700/60 text-xs">
                <span className="text-slate-400">Current Balance:</span>{' '}
                <strong className="text-amber-400 text-sm font-mono">{balance.toFixed(2)} ETB</strong>
              </div>
              <button
                onClick={resetAndClose}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg"
              >
                Back to Games
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('telebirr')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      method === 'telebirr'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500'
                        : 'border-slate-800 bg-[#161e2e] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      T
                    </div>
                    <span className="text-xs font-extrabold">Telebirr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('cbe')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      method === 'cbe'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500'
                        : 'border-slate-800 bg-[#161e2e] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      CBE
                    </div>
                    <span className="text-xs font-extrabold">CBE Birr</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('awash')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                      method === 'awash'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500'
                        : 'border-slate-800 bg-[#161e2e] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <span className="text-xs font-extrabold">Awash Bank</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-400">Amount (ETB)</label>
                  <span className="text-xs text-slate-500">
                    {tab === 'deposit' ? 'Min: 10 ETB' : `Available: ${balance.toFixed(2)} ETB`}
                  </span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#161e2e] border border-slate-700/80 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-amber-500"
                />

                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500, 1000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition ${
                        amount === val
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                          : 'border-slate-800 bg-[#161e2e] text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone or Account */}
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  {method === 'telebirr' ? 'Telebirr Mobile Number' : 'Account / Phone Number'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={method === 'telebirr' ? phone : accountNumber}
                    onChange={e =>
                      method === 'telebirr' ? setPhone(e.target.value) : setAccountNumber(e.target.value)
                    }
                    className="w-full bg-[#161e2e] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bonus notice for deposit */}
              {tab === 'deposit' && (
                <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Get <strong>+200% Bonus</strong> on this deposit! ({amount * 2} ETB Bonus added to bonus balance)
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleAction}
                disabled={status === 'processing'}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-base shadow-lg shadow-amber-500/25 active:scale-95 transition disabled:opacity-50"
              >
                {status === 'processing'
                  ? 'Connecting Gateway...'
                  : tab === 'deposit'
                  ? `Deposit ${amount} ETB Instantly`
                  : `Withdraw ${amount} ETB`}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted & Automated Telebirr Direct API</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
