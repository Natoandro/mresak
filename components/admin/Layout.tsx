import axios from 'axios';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import Button from '../common/Button';

type LayoutProps = PropsWithChildren<{ className?: string; }>;

export default function Layout({ children, className }: LayoutProps) {
  const router = useRouter();

  const onCloseAdminSession = async () => {
    await axios.delete('/api/admin/login');
    await router.push('/admin/login');
  };

  return (
    <div className="h-screen flex flex-col relative">
      <header className="bg-blue-500 text-white px-4 py-2 flex">
        <h1 className="text-4xl italic">M&apos;Resak</h1>
        <h2 className="text-4xl ml-4 opacity-70">Admin</h2>
        <div className="grow" /> {/* spacer */}
        <Button
          onClick={onCloseAdminSession}
          variant="outlined" white={true} className="self-center"
        >
          Close admin session
        </Button>
      </header>
      <main className={clsx('grow max-w-screen-sm w-full mx-auto', className)}>
        {children}
      </main>
    </div>
  );
}
