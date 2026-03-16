import { NavLink } from 'react-router-dom';
import { Home, Grid, Book, Search, Camera } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/browse', icon: Grid, label: 'Browse' },
    { to: '/identify', icon: Camera, label: 'Identify', isSpecial: true },
    { to: '/glossary', icon: Book, label: 'Glossary' },
    { to: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label, isSpecial }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-full transition-all duration-200 ${
                isSpecial 
                  ? 'relative -top-3' 
                  : 'h-full'
              } ${
                isActive 
                  ? isSpecial ? 'text-white' : 'text-blue-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {isSpecial ? (
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-2xl shadow-lg shadow-blue-900/40 transition-transform active:scale-95 ${
                  // Using a specific blue that matches the industrial theme
                  'bg-[#1B4F8A] border-2 border-slate-900'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-slate-300 uppercase tracking-wider">{label}</span>
              </div>
            ) : (
              <>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
