import React, { useState, useEffect, Suspense } from 'react';
import Layout from './components/Layout';
import TournamentCard from './components/TournamentCard';
import ProfileView from './components/ProfileView';
import WalletView from './components/WalletView';
import MyTournamentsView from './components/MyTournamentsView';
import AiChat from './components/AiChat';
import AuthView from './components/AuthView';
// Remove direct import of AdminView
// import AdminView from './components/AdminView';
import { Tournament, GameType, Transaction, UserProfile, mapTournamentFromDB } from './types';
import { INITIAL_USER, GAME_ICONS } from './constants';
import { supabase } from './services/supabase';
import { Loader2, LogOut, ShieldX } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

// Lazy Load Admin View
const AdminView = React.lazy(() => import('./components/AdminView'));

// Banner Carousel Component
const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    { id: 1, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', title: 'SEASON 5 BATTLE PASS', subtitle: 'Unlock exclusive skins and rewards now!', color: 'text-yellow-400' },
    { id: 2, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80', title: 'WEEKEND TOURNAMENT', subtitle: '₹10,000 Prize Pool - Squads Only', color: 'text-indigo-400' }
  ];
  useEffect(() => { const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000); return () => clearInterval(timer); }, [banners.length]);
  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-2xl border border-slate-700 group bg-slate-900">
      {banners.map((banner, index) => (
        <div key={banner.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
             <h2 className="text-4xl md:text-6xl font-bold text-white font-rajdhani mb-2">{banner.title}</h2>
             <p className="text-lg text-slate-200">{banner.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Subcomponent for Detail View
const TournamentDetailView: React.FC<{ tournament: Tournament; onBack: () => void; onJoin: () => void; isJoined: boolean; }> = ({ tournament, onBack, onJoin, isJoined }) => {
    return (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
             <button onClick={onBack} className="text-slate-400 hover:text-white mb-4 transition-colors">← Back</button>
             <h1 className="text-3xl font-bold text-white mb-4 font-rajdhani">{tournament.title}</h1>
             <p className="text-slate-400 mb-6">{tournament.description}</p>
             <button onClick={onJoin} disabled={isJoined} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20">
                 {isJoined ? "Registered" : `Join for ₹${tournament.entryFee}`}
             </button>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
  const APP_MODE = process.env.VITE_APP_MODE || 'PLAYER';
  const IS_ADMIN_SITE = APP_MODE === 'ADMIN';

  const [currentView, setCurrentView] = useState(IS_ADMIN_SITE ? 'admin' : 'home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joinedTournaments, setJoinedTournaments] = useState<string[]>([]);
  const [filterGame, setFilterGame] = useState<GameType | 'ALL'>('ALL');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  
  // Auth State
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Initialize User
  const [user, setUser] = useState<UserProfile>({ ...INITIAL_USER, walletBalance: 0, wins: 0, kills: 0, isAdmin: false });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch Data on Load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    fetchTournaments();

    return () => subscription.unsubscribe();
  }, []);

  const fetchTournaments = async () => {
    const { data } = await supabase.from('tournaments').select('*').order('start_time', { ascending: true });
    if (data) setTournaments(data.map(mapTournamentFromDB));
  };

  // Fetch Profile & Transactions
  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (profile) {
        setUser({
          id: profile.id,
          username: profile.username || session.user.email?.split('@')[0],
          avatar: profile.avatar_url,
          walletBalance: Number(profile.wallet_balance) || 0,
          gamesPlayed: profile.games_played || 0,
          wins: profile.wins || 0,
          kills: profile.kills || 0,
          kdRatio: profile.kd_ratio || 0,
          isAdmin: profile.is_admin || false
        });
      }

      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      if (txs) {
        setTransactions(txs.map(t => ({ id: t.id, type: t.type as any, amount: Number(t.amount), date: t.created_at, description: t.description, status: t.status as any })));
      }
    };

    fetchData();

    // Realtime Subs
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` }, (payload: any) => {
           if (payload.new) setUser(prev => ({ ...prev, walletBalance: Number(payload.new.wallet_balance), username: payload.new.username, avatar: payload.new.avatar_url, isAdmin: payload.new.is_admin }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session]);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!session?.user) return;
    setUser(prev => ({ ...prev, ...updates }));
    await supabase.from('profiles').update({ username: updates.username, avatar_url: updates.avatar }).eq('id', user.id);
  };

  const handleJoinTournament = async (id: string, fee: number) => {
    if (user.walletBalance >= fee) {
        setJoinedTournaments([...joinedTournaments, id]);
        const oldBalance = user.walletBalance;
        setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - fee }));
        const tournament = tournaments.find(t => t.id === id);
        const { error } = await supabase.rpc('pay_entry_fee', { amount: fee, tournament_title: tournament?.title || 'Tournament' });
        if (error) {
             alert(`Error: ${error.message}`);
             setUser(prev => ({ ...prev, walletBalance: oldBalance }));
             setJoinedTournaments(prev => prev.filter(tid => tid !== id));
        }
    } else alert("Insufficient Balance!");
  };

  const handleAddFunds = async (amount: number) => {
    const { error } = await supabase.rpc('request_deposit', { amount });
    if (error) alert(error.message); else alert("Deposit requested!");
  };

  const handleWithdraw = async (amount: number) => {
    if (user.walletBalance >= amount) {
      const oldBalance = user.walletBalance;
      setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - amount }));
      const { error } = await supabase.rpc('request_withdrawal', { amount });
      if (error) { alert(error.message); setUser(prev => ({ ...prev, walletBalance: oldBalance })); }
      else alert("Withdrawal requested!");
    } else alert("Insufficient funds.");
  };

  const handleLogout = async () => { if (confirm("Logout?")) await supabase.auth.signOut(); };

  if (authLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></div>;
  if (!session) return <AuthView />;

  // SECURITY CHECK FOR ADMIN SITE
  if (IS_ADMIN_SITE && !user.isAdmin) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
              <ShieldX className="w-24 h-24 text-red-600 mb-6" />
              <h1 className="text-4xl font-bold text-white font-rajdhani mb-2">ACCESS DENIED</h1>
              <p className="text-slate-400 mb-8 max-w-md">Your account does not have administrative privileges. Please log in with an admin account or return to the player portal.</p>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg flex items-center transition-colors">
                  <LogOut className="w-5 h-5 mr-2" /> Sign Out
              </button>
          </div>
      );
  }

  const renderContent = () => {
    // ADMIN SITE VIEW
    if (IS_ADMIN_SITE) {
        return (
            <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-white"/></div>}>
                <AdminView />
            </Suspense>
        );
    }

    // PLAYER SITE VIEWS
    if (currentView === 'profile') return <ProfileView user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;
    if (currentView === 'wallet') return <WalletView user={user} transactions={transactions} onAddFunds={handleAddFunds} onWithdraw={handleWithdraw} />;
    if (currentView === 'my_matches') return <MyTournamentsView tournaments={tournaments} joinedTournamentIds={joinedTournaments} onTournamentClick={(tourney) => { setSelectedTournament(tourney); setCurrentView('tournament_detail'); }} onBrowse={() => setCurrentView('home')} />;
    if (currentView === 'tournament_detail' && selectedTournament) return <TournamentDetailView tournament={selectedTournament} onBack={() => { setSelectedTournament(null); setCurrentView('home'); }} isJoined={joinedTournaments.includes(selectedTournament.id)} onJoin={() => handleJoinTournament(selectedTournament.id, selectedTournament.entryFee)} />;

    // PLAYER HOME
    const filteredTournaments = tournaments.filter(t => filterGame === 'ALL' || t.game === filterGame);
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <BannerCarousel />
        <div id="tournaments-list" className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setFilterGame('ALL')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterGame === 'ALL' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>ALL GAMES</button>
          <button onClick={() => setFilterGame(GameType.PUBG)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center ${filterGame === GameType.PUBG ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}><span className="mr-2">{GAME_ICONS[GameType.PUBG]}</span> PUBG MOBILE</button>
          <button onClick={() => setFilterGame(GameType.FREE_FIRE)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center ${filterGame === GameType.FREE_FIRE ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}><span className="mr-2">{GAME_ICONS[GameType.FREE_FIRE]}</span> FREE FIRE</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(t => <TournamentCard key={t.id} tournament={t} onClick={(tourney) => { setSelectedTournament(tourney); setCurrentView('tournament_detail'); }} />)}
        </div>
      </div>
    );
  };

  return (
    <Layout user={user} currentView={currentView} onNavigate={(view) => { setCurrentView(view); if (view === 'home') setSelectedTournament(null); }}>
      {renderContent()}
      {!IS_ADMIN_SITE && <AiChat context={selectedTournament ? `Viewing tournament: ${selectedTournament.title}` : "Browsing"} />}
    </Layout>
  );
};

export default App;