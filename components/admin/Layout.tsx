import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="h-screen flex flex-col relative">
      <header className="bg-blue-500 text-white px-4 py-2 flex">
        <h1 className="text-4xl italic">M&apos;Resak</h1>
        <h2 className="text-4xl ml-4 opacity-70">Admin</h2>
      </header>
      <main className="grow max-w-screen-sm w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
