import clsx from 'clsx';
import Image from 'next/image';
import { HTMLAttributes, PropsWithChildren, ReactNode, useContext } from 'react';
import CurrentUserContext, { useCurrentUser } from '~/contexts/currentUser';
import { UserAttributes } from '~/db/models/users';
import Avatar from '../users/Avatar';
import UserListItem from '../users/UserListItem';

export type ChatPageLayoutProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren<{
  actions?: ReactNode;
}>;

export default function ChatPageLayout(
  { actions, children, className, ...props }: ChatPageLayoutProps
) {
  const user = useCurrentUser();
  return (
    <div className="h-screen flex flex-col relative bg-slate-100">
      <header className="shadow-z1 h-12 flex justify-center bg-blue-100 z-10">
        <div className="px-4 py-2 flex items-center w-full max-w-screen-md">
          <Image src="/logo_32x32.png" width={32} height={32} alt="M&apos;Resak logo" />
          <h1 className="text-2xl text-blue-500 italic ml-2 mr-4">M&apos;Resak</h1>
          <UserListItem user={user} oneLine />
          <div className="grow"></div> {/* spacer */}
          <div className="grow-0">{actions}</div>
        </div>
      </header>
      <main className={clsx('grow max-w-screen-md w-full h-screen overflow-hidden pt-12 absolute self-center bg-white md:border-x border-gray-300', className)}>
        {children}
      </main>
    </div>
  );
}
