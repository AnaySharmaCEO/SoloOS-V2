import { Outlet } from 'react-router';
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
