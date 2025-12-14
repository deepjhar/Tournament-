import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TournamentCard from './components/TournamentCard';
import ProfileView from './components/ProfileView';
import WalletView from './components/WalletView';
import MyTournamentsView from './components/MyTournamentsView';
import AiChat from './components/AiChat';
import AuthView from './components/AuthView';
import { Tournament, TournamentStatus, GameType, Transaction } from './types';
import { MOCK_TOURNAMENTS, INITIAL_USER, GAME_ICONS, PRE_GENERATED_RULES, MOCK_TRANSACTIONS } from './constants';
import { generateTournamentStrategy } from './services/geminiService';
import { supabase } from './services/supabase';
import { Clock, Users, Trophy, ChevronLeft, MapPin, Play, CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

// Banner Carousel Component
const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      title: 'SEASON 5 BATTLE PASS',
      subtitle: 'Unlock exclusive skins and rewards now!',
      color: 'text-yellow-400'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      title: 'WEEKEND TOURNAMENT',
      subtitle: '$10,000 Prize Pool - Squads Only',
      color: 'text-indigo-400'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      title: 'NEW MAP: DESTRUCTION',
      subtitle: 'Explore the ruins and survive the chaos.',
      color: 'text-red-400'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80',
      title: 'PLAY & EARN',
      subtitle: 'Get crypto rewards for every kill.',
      color: 'text-emerald-400'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-2xl border border-slate-700 group bg-slate-900">
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl animate-in slide-in-from-left-10 fade-in duration-700">
             <span className={`inline-block px-3 py-1 rounded bg-slate-900/80 backdrop-blur text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 ${banner.color}`}>
               Featured Event
             </span>
             <h2 className="text-4xl md:text-6xl font-bold text-white font-rajdhani mb-2 leading-tight drop-shadow-lg">
               {banner.title}
             </h2>
             <p className="text-lg md:text-xl text-slate-200 font-medium drop-shadow-md mb-6">
               {banner.subtitle}
             </p>
             <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 flex items-center">
               View Details <ChevronRight className="w-5 h-5 ml-1" />
             </button>
          </div>
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-indigo-500 w-8' : 'bg-white/30 w-2 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Subcomponent for Detail View (defined here for simplicity in this file structure)
const TournamentDetailView: React.FC<{
  tournament: Tournament;
  onBack: () => void;
  onJoin: () => void;
  isJoined: boolean;
}> = ({ tournament, onBack, onJoin, isJoined }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'standings'>('overview');
  const [aiTip, setAiTip] = useState<string | null>(null);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await generateTournamentStrategy(tournament.game, tournament.map, tournament.mode);
      setAiTip(tip);
    };
    fetchTip();
  }, [tournament]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Tournaments
      </button>

      {/* Header Banner */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
        <img src={tournament.image} alt={tournament.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
           <div className="flex items-center space-x-3 mb-2">
             <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">{tournament.game}</span>
             <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded uppercase">{tournament.mode}</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-bold text-white font-rajdhani mb-2">{tournament.title}</h1>
           <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-300">
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-indigo-400"/> {tournament.map}</div>
              <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-indigo-400"/> {new Date(tournament.startTime).toLocaleString()}</div>
              <div className="flex items-center text-yellow-400 font-bold"><Trophy className="w-4 h-4 mr-1"/> Prize: ${tournament.prizePool}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-slate-700 pb-2">
             {['overview', 'rules', 'standings'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`pb-2 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                   activeTab === tab 
                   ? 'border-indigo-500 text-indigo-400' 
                   : 'border-transparent text-slate-500 hover:text-slate-300'
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3">About the Tournament</h3>
                  <p className="text-slate-400 leading-relaxed">{tournament.description || "Prepare for glory in this high-stakes tournament. Gather your team, check your loadout, and drop into the warzone."}</p>
                </div>
                
                {aiTip && (
                  <div className="bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Play className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-300 mb-2 flex items-center">
                      <span className="mr-2">🤖</span> AI Strategy Coach
                    </h3>
                    <div className="text-slate-300 text-sm whitespace-pre-wrap">{aiTip}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <h3 className="text-xl font-bold text-white mb-4">Official Rules</h3>
                 <ul className="space-y-3">
                   {PRE_GENERATED_RULES.map((rule, idx) => (
                     <li key={idx} className="flex items-start text-slate-400">
                       <span className="text-indigo-500 mr-2">•</span>
                       {rule}
                     </li>
                   ))}
                 </ul>
              </div>
            )}

            {activeTab === 'standings' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Player/Team</th>
                      <th className="px-6 py-4">Kills</th>
                      <th className="px-6 py-4">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                     {/* Mock Standings */}
                     {[1, 2, 3, 4, 5].map((rank) => (
                       <tr key={rank} className="hover:bg-slate-700/50 transition-colors">
                         <td className="px-6 py-4 font-mono text-indigo-400">#{rank}</td>
                         <td className="px-6 py-4 font-medium text-white">Team Alpha {rank}</td>
                         <td className="px-6 py-4">{10 - rank}</td>
                         <td className="px-6 py-4 font-bold text-white">{100 - (rank * 10)}</td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 sticky top-24">
             <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400">Entry Fee</span>
                <span className={`text-2xl font-bold font-rajdhani ${tournament.entryFee === 0 ? 'text-green-400' : 'text-white'}`}>
                  {tournament.entryFee === 0 ? 'FREE' : `$${tournament.entryFee}`}
                </span>
             </div>

             <div className="space-y-4 mb-6">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Slots Filled</span>
                 <span className="text-white font-mono">{isJoined ? tournament.filledSlots + 1 : tournament.filledSlots}/{tournament.maxSlots}</span>
               </div>
               <div className="w-full bg-slate-700 rounded-full h-2">
                 <div 
                   className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                   style={{ width: `${((isJoined ? tournament.filledSlots + 1 : tournament.filledSlots) / tournament.maxSlots) * 100}%` }} 
                 />
               </div>
             </div>

             {isJoined ? (
               <button disabled className="w-full bg-green-600/20 text-green-400 border border-green-500/50 font-bold py-3 rounded-lg flex items-center justify-center cursor-default">
                 <CheckCircle className="w-5 h-5 mr-2" />
                 Registered
               </button>
             ) : (
               <button 
                 onClick={onJoin}
                 disabled={tournament.status === TournamentStatus.CLOSED || tournament.status === TournamentStatus.COMPLETED}
                 className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
               >
                 {tournament.status === TournamentStatus.CLOSED ? 'Registration Closed' : 'Join Tournament'}
               </button>
             )}

             <p className="mt-4 text-xs text-center text-slate-500">
               By joining, you agree to the rules and regulations set by BattleZone.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [joinedTournaments, setJoinedTournaments] = useState<string[]>([]);
  const [filterGame, setFilterGame] = useState<GameType | 'ALL'>('ALL');
  
  // Auth State
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Initialize Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(prev => ({
           ...prev,
           id: session.user.id,
           username: session.user.email?.split('@')[0] || prev.username
         }));
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(prev => ({
           ...prev,
           id: session.user.id,
           username: session.user.email?.split('@')[0] || prev.username
         }));
      } else {
        // Reset to initial mock user on logout, though AuthView will take over
        setUser(INITIAL_USER);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleJoinTournament = (id: string, fee: number) => {
    if (user.walletBalance >= fee) {
        setJoinedTournaments([...joinedTournaments, id]);
        setUser({...user, walletBalance: user.walletBalance - fee});
        
        // Record Transaction
        const newTx: Transaction = {
          id: `tx${Date.now()}`,
          type: 'ENTRY_FEE',
          amount: fee,
          date: new Date().toISOString(),
          description: `Entry Fee: Tournament #${id}`,
          status: 'COMPLETED'
        };
        setTransactions([newTx, ...transactions]);

    } else {
        alert("Insufficient Balance! Please go to your wallet to add funds.");
    }
  };

  const handleAddFunds = (amount: number) => {
    setUser({ ...user, walletBalance: user.walletBalance + amount });
    const newTx: Transaction = {
      id: `tx${Date.now()}`,
      type: 'DEPOSIT',
      amount: amount,
      date: new Date().toISOString(),
      description: 'Funds Added',
      status: 'COMPLETED'
    };
    setTransactions([newTx, ...transactions]);
  };

  const handleWithdraw = (amount: number) => {
    if (user.walletBalance >= amount) {
      setUser({ ...user, walletBalance: user.walletBalance - amount });
      const newTx: Transaction = {
        id: `tx${Date.now()}`,
        type: 'WITHDRAWAL',
        amount: amount,
        date: new Date().toISOString(),
        description: 'Withdrawal Request',
        status: 'PENDING'
      };
      setTransactions([newTx, ...transactions]);
    } else {
      alert("Insufficient funds for withdrawal.");
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
        await supabase.auth.signOut();
    }
  };

  const filteredTournaments = MOCK_TOURNAMENTS.filter(t => {
    if (filterGame === 'ALL') return true;
    return t.game === filterGame;
  });

  // Render Logic
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthView />;
  }

  const renderContent = () => {
    if (currentView === 'profile') {
      return <ProfileView user={user} onLogout={handleLogout} />;
    }

    if (currentView === 'wallet') {
      return (
        <WalletView 
          user={user} 
          transactions={transactions} 
          onAddFunds={handleAddFunds}
          onWithdraw={handleWithdraw}
        />
      );
    }

    if (currentView === 'my_matches') {
      return (
        <MyTournamentsView 
          tournaments={MOCK_TOURNAMENTS}
          joinedTournamentIds={joinedTournaments}
          onTournamentClick={(tourney) => {
            setSelectedTournament(tourney);
            setCurrentView('tournament_detail');
          }}
          onBrowse={() => setCurrentView('home')}
        />
      );
    }

    if (currentView === 'tournament_detail' && selectedTournament) {
      return (
        <TournamentDetailView 
          tournament={selectedTournament} 
          onBack={() => {
            setSelectedTournament(null);
            setCurrentView('home');
          }}
          isJoined={joinedTournaments.includes(selectedTournament.id)}
          onJoin={() => handleJoinTournament(selectedTournament.id, selectedTournament.entryFee)}
        />
      );
    }

    // Home View
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Replaced static Hero with BannerCarousel */}
        <BannerCarousel />

        {/* Filters */}
        <div id="tournaments-list" className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilterGame('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterGame === 'ALL' ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            ALL GAMES
          </button>
          <button 
            onClick={() => setFilterGame(GameType.PUBG)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center ${filterGame === GameType.PUBG ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span className="mr-2">{GAME_ICONS[GameType.PUBG]}</span> PUBG MOBILE
          </button>
          <button 
            onClick={() => setFilterGame(GameType.FREE_FIRE)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center ${filterGame === GameType.FREE_FIRE ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span className="mr-2">{GAME_ICONS[GameType.FREE_FIRE]}</span> FREE FIRE
          </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map(t => (
            <TournamentCard 
              key={t.id} 
              tournament={t} 
              onClick={(tourney) => {
                setSelectedTournament(tourney);
                setCurrentView('tournament_detail');
              }} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={(view) => {
        setCurrentView(view);
        if (view === 'home') setSelectedTournament(null);
      }}
    >
      {renderContent()}
      <AiChat context={selectedTournament ? `Viewing tournament: ${selectedTournament.title} (${selectedTournament.game})` : "Browsing tournament list"} />
    </Layout>
  );
};

export default App;