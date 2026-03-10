import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
