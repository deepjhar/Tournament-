import React, { useState } from 'react';
import { UserProfile, Transaction } from '../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';

interface WalletViewProps {
  user: UserProfile;
  transactions: Transaction[];
  onAddFunds: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ user, transactions, onAddFunds, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [activeAction, setActiveAction] = useState<'deposit' | 'withdraw' | null>(null);

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (activeAction === 'deposit') onAddFunds(val);
    if (activeAction === 'withdraw') onWithdraw(val);
    setAmount('');
    setActiveAction(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-48 h-48 text-white" />
         </div>
         <div className="relative z-10">
            <h2 className="text-indigo-100 font-medium mb-2">Total Balance</h2>
            <div className="text-5xl font-bold text-white font-mono mb-6">${user.walletBalance.toFixed(2)}</div>
            <div className="flex space-x-4">
               <button 
                 onClick={() => setActiveAction('deposit')}
                 className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold flex items-center hover:bg-indigo-50 transition-colors shadow-lg"
               >
                 <ArrowDownLeft className="w-4 h-4 mr-2" /> Add Funds
               </button>
               <button 
                 onClick={() => setActiveAction('withdraw')}
                 className="bg-indigo-800/50 text-white border border-white/20 px-6 py-2 rounded-lg font-bold flex items-center hover:bg-indigo-800/70 transition-colors"
               >
                 <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw
               </button>
            </div>
         </div>
      </div>

      {/* Action Area */}
      {activeAction && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
           <h3 className="text-xl font-bold mb-4 font-rajdhani">{activeAction === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}</h3>
           <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg transition-colors flex-1 sm:flex-none"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setActiveAction(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg flex-1 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
           <h3 className="text-xl font-bold flex items-center font-rajdhani">
             <History className="w-5 h-5 mr-2 text-slate-400" /> Transaction History
           </h3>
        </div>
        <div className="divide-y divide-slate-700">
           {transactions.length === 0 && (
             <div className="p-8 text-center text-slate-500">No recent transactions</div>
           )}
           {transactions.map(tx => (
             <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center space-x-4">
                   <div className={`p-3 rounded-full ${
                     tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WIN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                   }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WIN' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                   </div>
                   <div>
                      <div className="font-bold text-white">{tx.description}</div>
                      <div className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString()}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className={`font-mono font-bold ${
                      tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WIN' ? 'text-green-400' : 'text-white'
                   }`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'PRIZE_WIN' ? '+' : '-'}${tx.amount}
                   </div>
                   <div className={`text-xs font-bold uppercase ${
                     tx.status === 'COMPLETED' ? 'text-slate-500' : 
                     tx.status === 'PENDING' ? 'text-orange-400' : 'text-red-400'
                   }`}>{tx.status}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default WalletView;