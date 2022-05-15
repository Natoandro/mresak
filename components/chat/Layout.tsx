import clsx from 'clsx';
import Image from 'next/image';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { RUserAttributes } from '~/db/models/users';
import Avatar from '../users/Avatar';
import UserListItem from '../users/UserListItem';

export type ChatPageLayoutProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
  actions?: ReactNode;
  currentUser: RUserAttributes;
}>;

export default function ChatPageLayout(
  { actions, currentUser, children, className, ...props }: ChatPageLayoutProps
) {
  return (
    <div className="h-screen flex flex-col relative">
      <header className="px-4 py-2 flex shadow-md border-b h-12 items-center flex">
        <Image src="/logo_32x32.png" width={32} height={32} alt="M&apos;Resak logo" />
        <h1 className="text-2xl text-blue-500 italic ml-2 mr-4">M&apos;Resak</h1>
        <UserListItem user={currentUser} oneLine />
        <div className="grow"></div> {/* spacer */}
        <div className="grow-0">{actions}</div>
      </header>
      <main className={clsx('grow', className)}>
        {children}
      </main>
    </div>
  );
}
