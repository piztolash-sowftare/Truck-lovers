import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck, Bell } from 'lucide-react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getNotifications } from '@/app/actions';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let user = null;
  let notifications: any[] = [];

  if (session) {
    try {
      user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
      });
      notifications = await getNotifications();
    } catch (e) {
      console.error('MainLayout data fetch failed:', e);
    }
  }

  if (!user) {
    return <AuthInterface />;
  }

  return (
    <div className="max-w-md mx-auto h-screen relative bg-white flex flex-col overflow-hidden shadow-2xl">
      <header className="flex-none bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <div className="bg-violet-600 p-1.5 rounded-lg shadow-sm">
              <Truck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Truck<span className="text-violet-600">Lovers</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell initialNotifications={notifications} />
          <Link href="/profile" className="relative active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 relative">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
