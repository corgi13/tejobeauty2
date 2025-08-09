import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({} as any));
  const tag: string | undefined = body?.tag;
  if (tag) revalidateTag(tag);
  return NextResponse.json({ ok: true, tag: tag ?? null });
}


