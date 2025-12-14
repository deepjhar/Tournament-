import React from 'react';
import { UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Target, Skull, Trophy, TrendingUp } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  const killData = [
    { name: 'Headshots', value: 120 },
    { name: 'Body shots', value: 200 },
    { name: 'Vehicle', value: 30 },
    { name: 'Grenade', value: 73 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

  const recentPerformance = [
    { name: 'Match 1', kills: 4, rank: 12 },
    { name: 'Match 2', kills: 8, rank: 2 },
    { name: 'Match 3', kills: 1, rank: 45 },
    { name: 'Match 4', kills: 12, rank: 1 },
    { name: 'Match 5', kills: 6, rank: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 bg-slate-800 p-8 rounded-2xl border border-slate-700">
        <div className="relative">
           <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg shadow-indigo-500/20" />
           <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border border-slate-900">
             LVL 42
           </div>
        </div>
        
        <div className="mt-4 md:mt-0 text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-white font-rajdhani">{user.username}</h1>
          <p className="text-slate-400">Pro Player • India Region</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
             <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase mb-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span>Wins</span>
                </div>
                <div className="text-xl font-mono font-bold">{user.wins}</div>
             </div>
             <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase mb-1">
                    <Skull className="w-3 h-3 text-red-500" />
                    <span>Kills</span>
                </div>
                <div className="text-xl font-mono font-bold">{user.kills}</div>
             </div>
             <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase mb-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>K/D</span>
                </div>
                <div className="text-xl font-mono font-bold">{user.kdRatio}</div>
             </div>
             <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase mb-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span>Win Rate</span>
                </div>
                <div className="text-xl font-mono font-bold">{((user.wins / user.gamesPlayed) * 100).toFixed(1)}%</div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kill Distribution */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold mb-4 font-rajdhani">Kill Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={killData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {killData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold mb-4 font-rajdhani">Recent Matches (Kills)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentPerformance}>
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Bar dataKey="kills" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;