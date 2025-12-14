import React, { useState } from 'react';
import { Tournament, GameType, TournamentStatus } from '../types';
import { GAME_ICONS } from '../constants';
import { Users, Calendar, MapPin, Trophy } from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: (t: Tournament) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  const isPubg = tournament.game === GameType.PUBG;
  
  const statusColors = {
    [TournamentStatus.OPEN]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    [TournamentStatus.FILLING_FAST]: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    [TournamentStatus.CLOSED]: 'bg-red-500/20 text-red-400 border-red-500/50',
    [TournamentStatus.LIVE]: 'bg-rose-600 text-white animate-pulse',
    [TournamentStatus.COMPLETED]: 'bg-slate-600 text-slate-300',
  };

  return (
    <div 
      onClick={() => onClick(tournament)}
      className="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
    >
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 z-20 flex space-x-2">
           <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${statusColors[tournament.status]}`}>
             {tournament.status}
           </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className={`h-8 w-8 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur border ${isPubg ? 'border-yellow-500' : 'border-orange-500'} text-lg`}>
            {GAME_ICONS[tournament.game]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold font-rajdhani text-white truncate pr-2">{tournament.title}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-slate-400">
          <div className="flex items-center">
             <MapPin className="w-4 h-4 mr-1.5 text-indigo-400" />
             {tournament.map}
          </div>
          <div className="flex items-center">
             <Users className="w-4 h-4 mr-1.5 text-indigo-400" />
             {tournament.mode}
          </div>
          <div className="flex items-center">
             <Calendar className="w-4 h-4 mr-1.5 text-indigo-400" />
             {new Date(tournament.startTime).toLocaleDateString()}
          </div>
          <div className="flex items-center text-slate-300">
             <span className="font-mono">{tournament.filledSlots}/{tournament.maxSlots} Slots</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold">Prize Pool</span>
            <div className="flex items-center text-yellow-400 font-bold font-mono">
              <Trophy className="w-4 h-4 mr-1" />
              ₹{tournament.prizePool}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase font-semibold">Entry</span>
            <span className={`font-bold ${tournament.entryFee === 0 ? 'text-green-400' : 'text-white'}`}>
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Join Overlay (Hover) */}
      <div className="absolute inset-0 bg-indigo-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <span className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          View Details
        </span>
      </div>
    </div>
  );
};

export default TournamentCard;