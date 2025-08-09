export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-3xl">Admin</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}


