'use client';

export default function AdminSidebar() {
  return (
    <nav className="p-6 space-y-4">
      <h2 className="font-bold text-lg">Admin Panel</h2>

      <a href="/admin" className="block hover:text-indigo-500">
        Dashboard
      </a>

      <a href="/admin/applications" className="block hover:text-indigo-500">
        Applications
      </a>

      <a href="/admin/stats" className="block hover:text-indigo-500">
        Stats
      </a>
    </nav>
  );
}