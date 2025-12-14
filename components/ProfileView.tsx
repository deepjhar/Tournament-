import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Target, Skull, Trophy, TrendingUp, Share2, Mail, Shield, FileText, RefreshCcw, Scale, LogOut, ChevronRight, Edit2, Save, X, Camera } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const [editAvatar, setEditAvatar] = useState(user.avatar);

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

  const menuItems = [
    { icon: Share2, label: 'Refer & Earn', color: 'text-green-400', sub: 'Get ₹100 per friend' },
    { icon: Mail, label: 'Contact Us', color: 'text-blue-400', sub: 'support@battlezone.com' },
    { icon: Shield, label: 'Privacy Policy', color: 'text-slate-400', sub: null },
    { icon: FileText, label: 'Terms & Conditions', color: 'text-slate-400', sub: null },
    { icon: RefreshCcw, label: 'Refund & Cancellation', color: 'text-orange-400', sub: null },
    { icon: Scale, label: 'Fair Play Policy', color: 'text-yellow-400', sub: null },
  ];

  const handleSave = () => {
    onUpdateProfile({
        username: editName,
        avatar: editAvatar
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user.username);
    setEditAvatar(user.avatar);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 bg-slate-800 p-8 rounded-2xl border border-slate-700 relative overflow-hidden">
        {/* Edit Controls */}
        <div className="absolute top-4 right-4 z-30 flex space-x-2">
            {isEditing ? (
                <>
                    <button 
                        onClick={handleSave}
                        className="p-2 bg-green-600 hover:bg-green-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
                        title="Save Changes"
                    >
                        <Save className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleCancel}
                        className="p-2 bg-slate-600 hover:bg-slate-500 rounded-full text-white shadow-lg transition-transform hover:scale-110"
                         title="Cancel"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => {
                        setEditName(user.username);
                        setEditAvatar(user.avatar);
                        setIsEditing(true);
                    }}
                    className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-indigo-500 rounded-full text-slate-300 hover:text-white transition-all"
                    title="Edit Profile"
                >
                    <Edit2 className="w-5 h-5" />
                </button>
            )}
        </div>

        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
           <Target className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative group">
                <img 
                    src={isEditing ? editAvatar : user.avatar} 
                    alt="Profile" 
                    className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-lg shadow-indigo-500/20 bg-slate-900" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'; }}
                />
                <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border border-slate-900">
                    LVL 42
                </div>
            </div>
            
            {isEditing && (
                <div className="mt-4 w-full">
                    <label className="text-xs text-slate-400 mb-1 block">Avatar URL</label>
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-600 focus-within:border-indigo-500 px-3 py-2">
                        <Camera className="w-4 h-4 text-slate-500 mr-2" />
                        <input 
                            type="text" 
                            value={editAvatar}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-xs text-white w-full"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-6 md:mt-0 text-center md:text-left flex-1 relative z-10 w-full md:pl-4">
          {isEditing ? (
              <div className="mb-2">
                  <label className="text-xs text-slate-400 mb-1 block text-left">Username</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full md:w-2/3 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-xl font-bold text-white font-rajdhani focus:outline-none focus:border-indigo-500"
                  />
              </div>
          ) : (
              <h1 className="text-3xl font-bold text-white font-rajdhani">{user.username}</h1>
          )}
          
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

      {/* Account Menu */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
           <h3 className="text-xl font-bold font-rajdhani text-white">Account & Settings</h3>
        </div>
        <div className="divide-y divide-slate-700">
           {menuItems.map((item, idx) => (
             <button 
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors group"
             >
                <div className="flex items-center space-x-4">
                   <div className={`p-2 rounded-lg bg-slate-900 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                   </div>
                   <div className="text-left">
                      <span className="block font-medium text-slate-200 group-hover:text-white transition-colors">{item.label}</span>
                      {item.sub && <span className="text-xs text-slate-500">{item.sub}</span>}
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
             </button>
           ))}
           <button 
              onClick={onLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors group"
           >
              <div className="flex items-center space-x-4">
                 <div className="p-2 rounded-lg bg-slate-900 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <LogOut className="w-5 h-5" />
                 </div>
                 <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">Logout</span>
              </div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;