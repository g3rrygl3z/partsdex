import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';

/**
 * Main Layout shell with consistent spacing and safe area handling for PWA.
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans selection:bg-primary/30">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* pb-32 provides extra room for the bottom navigation bar and mobile home indicators */}
        <Outlet />
      </main>

      <BottomNav />

      {/* Background Decor (Subtle corner glows for depth) */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none -z-10" />
    </div>
  );
}
