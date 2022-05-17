import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  (req as any).hello = 'hello';
  console.log(req);
  return NextResponse.next();
}