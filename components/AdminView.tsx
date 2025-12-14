import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Tournament, Transaction, GameType, TournamentMode, TournamentStatus, mapTournamentFromDB } from '../types';
import { Loader2, CheckCircle, XCircle, Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'transactions'>('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Tournament Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Tournament>>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'transactions') {
      // Fetch Pending Transactions with profiles to show who is asking
      const { data, error } = await supabase
        .from('transactions')
        .select(`*, profiles(username)`)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });
      
      if (data) {
        setTransactions(data.map((t: any) => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          date: t.created_at,
          description: `${t.description} (User: ${t.profiles?.username || 'Unknown'})`,
          status: t.status,
          user_id: t.user_id
        })));
      }
    } else {
      // Fetch Tournaments
      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_time', { ascending: true });
        
      if (data) {
        setTournaments(data.map(mapTournamentFromDB));
      }
    }
    setLoading(false);
  };

  const handleApproveTx = async (id: string) => {
    const { error } = await supabase.rpc('approve_transaction', { transaction_id: id });
    if (error) alert(error.message);
    else fetchData();
  };

  const handleRejectTx = async (id: string) => {
    const { error } = await supabase.rpc('reject_transaction', { transaction_id: id });
    if (error) alert(error.message);
    else fetchData();
  };

  const handleSaveTournament = async () => {
    if (!editForm.title || !editForm.game) return alert("Title and Game are required");

    const payload = {
      title: editForm.title,
      game: editForm.game,
      map: editForm.map || 'TBD',
      mode: editForm.mode || 'Squad',
      entry_fee: editForm.entryFee || 0,
      prize_pool: editForm.prizePool || 0,
      start_time: editForm.startTime || new Date().toISOString(),
      status: editForm.status || 'Registration Open',
      max_slots: editForm.maxSlots || 100,
      image: editForm.image || 'https://picsum.photos/800/400',
      description: editForm.description || ''
    };

    let error;
    if (editForm.id) {
       // Update
       const res = await supabase.from('tournaments').update(payload).eq('id', editForm.id);
       error = res.error;
    } else {
       // Insert
       const res = await supabase.from('tournaments').insert([payload]);
       error = res.error;
    }

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      setIsEditing(false);
      setEditForm({});
      fetchData();
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if(!confirm("Delete this tournament?")) return;
    await supabase.from('tournaments').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-rajdhani text-white">Admin Dashboard</h1>
        <button onClick={fetchData} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
           <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700">
        <button 
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'transactions' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}
        >
          Approval Requests
        </button>
        <button 
          onClick={() => setActiveTab('tournaments')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 ${activeTab === 'tournaments' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500'}`}
        >
          Manage Tournaments
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 min-h-[400px] p-6">
        
        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center text-slate-500 py-12">No pending requests</div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between border border-slate-700">
                  <div>
                    <div className="flex items-center space-x-2">
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                         {tx.type}
                       </span>
                       <span className="font-mono text-white font-bold">₹{tx.amount}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{tx.description}</p>
                    <p className="text-xs text-slate-600">{new Date(tx.date).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleApproveTx(tx.id)}
                      className="p-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleRejectTx(tx.id)}
                      className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === 'tournaments' && (
          <div>
            {!isEditing ? (
               <div className="space-y-4">
                  <button 
                    onClick={() => { setEditForm({}); setIsEditing(true); }}
                    className="w-full py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 flex items-center justify-center font-bold transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Create New Tournament
                  </button>
                  
                  {tournaments.map(t => (
                    <div key={t.id} className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between border border-slate-700 hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <img src={t.image} className="w-16 h-16 object-cover rounded-lg" />
                            <div>
                                <h3 className="font-bold text-white">{t.title}</h3>
                                <div className="text-sm text-slate-400 flex space-x-3">
                                    <span>{t.game}</span>
                                    <span>•</span>
                                    <span className="text-green-400">Fee: ₹{t.entryFee}</span>
                                    <span>•</span>
                                    <span className="text-yellow-400">Pool: ₹{t.prizePool}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => { setEditForm(t); setIsEditing(true); }}
                                className="p-2 bg-slate-700 hover:bg-indigo-600 text-white rounded-lg"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDeleteTournament(t.id)}
                                className="p-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                  ))}
               </div>
            ) : (
                <div className="bg-slate-900 p-6 rounded-lg animate-in fade-in">
                    <h3 className="text-xl font-bold text-white mb-6">{editForm.id ? 'Edit Tournament' : 'New Tournament'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Title</label>
                            <input className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Game</label>
                            <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.game || GameType.PUBG} onChange={e => setEditForm({...editForm, game: e.target.value as GameType})}>
                                <option value={GameType.PUBG}>{GameType.PUBG}</option>
                                <option value={GameType.FREE_FIRE}>{GameType.FREE_FIRE}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Map</label>
                            <input className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.map || ''} onChange={e => setEditForm({...editForm, map: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Entry Fee (₹)</label>
                            <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.entryFee || 0} onChange={e => setEditForm({...editForm, entryFee: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Prize Pool (₹)</label>
                            <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.prizePool || 0} onChange={e => setEditForm({...editForm, prizePool: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Max Slots</label>
                            <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.maxSlots || 100} onChange={e => setEditForm({...editForm, maxSlots: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Start Time</label>
                            <input type="datetime-local" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" 
                                value={editForm.startTime ? new Date(editForm.startTime).toISOString().slice(0, 16) : ''} 
                                onChange={e => setEditForm({...editForm, startTime: new Date(e.target.value).toISOString()})} 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs text-slate-400">Status</label>
                            <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.status || TournamentStatus.OPEN} onChange={e => setEditForm({...editForm, status: e.target.value as TournamentStatus})}>
                                {Object.values(TournamentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-xs text-slate-400">Image URL</label>
                            <input className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs text-slate-400">Description</label>
                            <textarea className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white h-20" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg">Cancel</button>
                        <button onClick={handleSaveTournament} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center"><Save className="w-4 h-4 mr-2"/> Save Tournament</button>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
