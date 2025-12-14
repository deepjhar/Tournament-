import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';
import TournamentCard from './TournamentCard';
import { Gamepad2, Swords, ChevronRight } from 'lucide-react';

// Ad Banner Component
const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const ads = [
    {
      id: 1,
      title: "DOUBLE UC EVENT",
      subtitle: "Get 2x UC on your first top-up today!",
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      color: "from-yellow-600 to-yellow-900"
    },
    {
      id: 2,
      title: "STREAMER SHOWDOWN",
      subtitle: "Watch the pros clash this Saturday.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      color: "from-purple-600 to-indigo-900"
    },
    {
      id: 3,
      title: "ELITE PASS DISCOUNT",
      subtitle: "50% OFF for BattleZone Premium members.",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80",
      color: "from-red-600 to-red-900"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl mb-8 group border border-slate-700">
      {ads.map((ad, index) => (
        <div 
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Background Image */}
          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${ad.color} mix-blend-multiply opacity-90`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
            <span className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 border border-white/20 self-start px-2 py-1 rounded">Sponsored</span>
            <h3 className="text-3xl md:text-5xl font-black italic text-white mb-2 font-rajdhani">{ad.title}</h3>
            <p className="text-white/90 text-sm md:text-lg font-medium mb-4 max-w-md">{ad.subtitle}</p>
            <button className="bg-white text-slate-900 font-bold py-2 px-6 rounded-lg self-start flex items-center hover:bg-slate-100 transition-colors">
              Check Now <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      ))}
      
      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {ads.map((_, idx) => (
            <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} 
            />
        ))}
      </div>
    </div>
  );
};

interface MyTournamentsViewProps {
  tournaments: Tournament[];
  joinedTournamentIds: string[];
  onTournamentClick: (t: Tournament) => void;
  onBrowse: () => void;
}

const MyTournamentsView: React.FC<MyTournamentsViewProps> = ({ 
  tournaments, 
  joinedTournamentIds, 
  onTournamentClick,
  onBrowse
}) => {
  const myTournaments = tournaments.filter(t => joinedTournamentIds.includes(t.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Advertisement Banner (Replaces the old stats header card) */}
      <AdBanner />

      {myTournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
          <div className="bg-slate-800 p-6 rounded-full border border-slate-700 shadow-xl">
             <Swords className="w-12 h-12 text-slate-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-rajdhani mb-2 text-white">No Active Matches</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Join a tournament to see it listed here.</p>
          </div>
          <button 
            onClick={onBrowse}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-indigo-600/20 text-sm"
          >
            Find Tournaments
          </button>
        </div>
      ) : (
        <>
            <div className="flex items-center space-x-2 mb-4">
                <Swords className="text-indigo-500 w-5 h-5" />
                <h2 className="text-xl font-bold text-white font-rajdhani">Your Joined Tournaments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTournaments.map(t => (
                <TournamentCard 
                    key={t.id} 
                    tournament={t} 
                    onClick={onTournamentClick} 
                />
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default MyTournamentsView;