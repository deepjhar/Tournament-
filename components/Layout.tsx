import React from 'react';
import { UserProfile } from '../types';
import { Trophy, User, Wallet, Home, Swords } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold font-rajdhani tracking-wider">BATTLE<span className="text-indigo-500">ZONE</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => onNavigate('home')}
                className={`${currentView === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'} transition-colors font-medium`}
              >
                Tournaments
              </button>
              <button 
                onClick={() => onNavigate('my_matches')}
                className={`${currentView === 'my_matches' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'} transition-colors font-medium`}
              >
                My Matches
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className={`${currentView === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'} transition-colors font-medium`}
              >
                Leaderboards
              </button>
              <button 
                onClick={() => onNavigate('wallet')}
                className={`${currentView === 'wallet' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'} transition-colors font-medium`}
              >
                Wallet
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('wallet')}
                className="hidden sm:flex items-center bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
              >
                <Wallet className="h-4 w-4 text-green-400 mr-2" />
                <span className="font-mono text-sm font-bold text-green-400">₹{user.walletBalance.toFixed(2)}</span>
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 hover:bg-slate-800 p-2 rounded-lg transition-colors"
              >
                <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full border-2 border-indigo-500" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 flex justify-around p-3">
         <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${currentView === 'home' ? 'text-indigo-500' : 'text-slate-500'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
         </button>
         <button onClick={() => onNavigate('my_matches')} className={`flex flex-col items-center ${currentView === 'my_matches' ? 'text-indigo-500' : 'text-slate-500'}`}>
            <Swords className="h-6 w-6" />
            <span className="text-xs mt-1">My Matches</span>
         </button>
         <button onClick={() => onNavigate('wallet')} className={`flex flex-col items-center ${currentView === 'wallet' ? 'text-indigo-500' : 'text-slate-500'}`}>
            <Wallet className="h-6 w-6" />
            <span className="text-xs mt-1">Wallet</span>
         </button>
         <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center ${currentView === 'profile' ? 'text-indigo-500' : 'text-slate-500'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
         </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="hidden md:block bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>© 2024 BattleZone Esports. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;