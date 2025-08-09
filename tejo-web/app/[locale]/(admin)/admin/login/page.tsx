"use client";
import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${api}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include' });
    if (!res.ok) setErr('Invalid credentials');
    else window.location.href = '../admin';
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-8 max-w-sm rounded-xl border p-6">
      <h1 className="font-heading text-2xl">Admin Login</h1>
      <label className="mt-4 block text-sm">Email<input className="mt-1 w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="mt-3 block text-sm">Password<input type="password" className="mt-1 w-full rounded border p-2" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <button className="mt-4 w-full rounded-xl bg-onyx py-2 text-white" type="submit">Sign in</button>
    </form>
  );
}


