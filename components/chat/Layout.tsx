import clsx from 'clsx';
import Image from 'next/image';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { UserAttributes } from '~/db/models/users';
import Avatar from '../users/Avatar';
import UserListItem from '../users/UserListItem';

export type ChatPageLayoutProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
  actions?: ReactNode;
  currentUser: UserAttributes;
}>;

export default function ChatPageLayout(
  { actions, currentUser, children, className, ...props }: ChatPageLayoutProps
) {
  return (
    <div className="h-screen flex flex-col relative bg-slate-100">
      <header className="shadow-z1 h-12 flex justify-center bg-blue-100 z-10">
        <div className="px-4 py-2 flex items-center w-full max-w-screen-md">
          <Image src="/logo_32x32.png" width={32} height={32} alt="M&apos;Resak logo" />
          <h1 className="text-2xl text-blue-500 italic ml-2 mr-4">M&apos;Resak</h1>
          <UserListItem user={currentUser} oneLine />
          <div className="grow"></div> {/* spacer */}
          <div className="grow-0">{actions}</div>
        </div>
      </header>
      <main className={clsx('grow max-w-screen-md self-center bg-white md:border-x border-gray-300', className)}>
        {children}
      </main>
    </div>
  );
}
