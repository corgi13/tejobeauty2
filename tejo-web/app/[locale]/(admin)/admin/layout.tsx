import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const jar = await cookies();
  let cookieHeader = '';
  for (const c of jar.getAll()) {
    cookieHeader += `${c.name}=${encodeURIComponent(c.value)}; `;
  }
  const res = await fetch(`${api}/users/me`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
    credentials: 'include',
  }).catch(() => null);
  const data = await res?.json().catch(() => null);
  const isAdmin = !!data?.user?.isAdmin;
  if (!isAdmin) {
    redirect('./admin/login');
  }
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-3xl">Admin</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}


