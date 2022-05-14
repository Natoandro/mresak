import Image from 'next/image';
import { PropsWithChildren, ReactNode } from 'react';

export type ChatPageLayoutProps = PropsWithChildren<{
  actions?: ReactNode;
}>;

export default function ChatPageLayout({ actions, children }: ChatPageLayoutProps) {
  return (
    <div className="h-screen flex flex-col relative">
      <header className="px-4 py-2 flex shadow-md border-b h-12 items-center flex">
        <Image src="/logo_32x32.png" width={32} height={32} alt="M&apos;Resak logo" />
        <h1 className="text-2xl text-blue-500 italic grow">M&apos;Resak</h1>
        <div className="grow-0">{actions}</div>
      </header>
      <main className="grow">
        {children}
      </main>
    </div>
  );
}
