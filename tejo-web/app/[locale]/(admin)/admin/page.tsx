import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="grid gap-4">
      <Link className="rounded-xl border p-4" href="./admin/products">Products</Link>
      <Link className="rounded-xl border p-4" href="./admin/blog">Blog</Link>
      <Link className="rounded-xl border p-4" href="./admin/orders">Orders</Link>
    </div>
  );
}


