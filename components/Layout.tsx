import React from 'react';
import { UserProfile } from '../types';
import { Trophy, User, Wallet, Home, Swords, ShieldAlert, LogOut, Headset } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate }) => {
  const APP_MODE = process.env.VITE_APP_MODE || 'PLAYER';
  const isAdminMode = APP_MODE === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => !isAdminMode && onNavigate('home')}>
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold font-rajdhani tracking-wider">
                BATTLE<span className="text-indigo-500">ZONE</span>
                {isAdminMode && <span className="ml-2 text-xs bg-red-600 px-2 py-0.5 rounded text-white font-sans">ADMIN</span>}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {isAdminMode ? (
                // ADMIN NAVIGATION
                <button 
                    onClick={() => onNavigate('admin')}
                    className={`text-indigo-400 font-bold px-3 py-1 rounded-full text-sm uppercase flex items-center transition-all bg-indigo-900/20`}
                >
                    <ShieldAlert className="w-4 h-4 mr-2" /> Dashboard
                </button>
              ) : (
                // PLAYER NAVIGATION
                <>
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
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Support Icon */}
              <button 
                onClick={() => window.open('mailto:support@battlezone.com')}
                className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors border border-slate-700"
                title="Contact Support"
              >
                <Headset className="h-4 w-4" />
              </button>

              {!isAdminMode && (
                <button 
                  onClick={() => onNavigate('wallet')}
                  className="hidden sm:flex items-center bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 transition-colors cursor-pointer"
                >
                  <Wallet className="h-4 w-4 text-green-400 mr-2" />
                  <span className="font-mono text-sm font-bold text-green-400">₹{user.walletBalance.toFixed(2)}</span>
                </button>
              )}
              <div className="flex items-center space-x-2 p-2 rounded-lg">
                <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full border-2 border-indigo-500" />
                {isAdminMode && <span className="text-sm font-bold text-slate-300 hidden md:block">{user.username}</span>}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav (Only for Players) */}
      {!isAdminMode && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 flex justify-around p-3">
          <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${currentView === 'home' ? 'text-indigo-500' : 'text-slate-500'}`}>
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
          </button>
          <button onClick={() => onNavigate('my_matches')} className={`flex flex-col items-center ${currentView === 'my_matches' ? 'text-indigo-500' : 'text-slate-500'}`}>
              <Swords className="h-6 w-6" />
              <span className="text-xs mt-1">Matches</span>
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
      )}

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="hidden md:block bg-slate-950 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>© 2024 BattleZone Esports. {isAdminMode ? 'Admin Portal' : 'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;