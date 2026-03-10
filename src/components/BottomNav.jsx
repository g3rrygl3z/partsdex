import { NavLink } from 'react-router-dom';
import { Home, Grid3X3, BookOpen, Search } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/browse', icon: Grid3X3, label: 'Browse' },
  { to: '/glossary', icon: BookOpen, label: 'Glossary' },
  { to: '/search', icon: Search, label: 'Search' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[64px] min-h-[44px] rounded-xl transition-colors ${
                isActive
                  ? 'text-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
