import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-nordic-dark/10 p-4 sticky top-28">
          <h2 className="text-lg font-semibold text-nordic-dark mb-4 px-2">Admin Dashboard</h2>
          <nav className="space-y-1">
            <Link href="/admin/properties" className="flex items-center gap-3 px-3 py-2 rounded-xl text-nordic-dark/70 hover:text-nordic-dark hover:bg-nordic-dark/5 transition-colors">
              <span className="material-icons">holiday_village</span>
              Properties
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-xl text-nordic-dark/70 hover:text-nordic-dark hover:bg-nordic-dark/5 transition-colors">
              <span className="material-icons">people</span>
              Users
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 bg-white rounded-2xl shadow-sm border border-nordic-dark/10 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
