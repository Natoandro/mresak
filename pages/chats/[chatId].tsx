import axios from 'axios';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Fragment, useEffect, useState } from 'react';
import { chatAdded, chatsLoaded, selectChats, selectChatState } from '~/app/features/chats/chatsSlice';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import Layout from '~/components/chats/Layout';
import Messages from '~/components/chats/Messages';
import UserListItem from '~/components/users/UserListItem';
import UserSearchDialog from '~/components/users/UserSearchDialog';
import { useCurrentUser } from '~/contexts/currentUser';
import db from '~/db/models';
import { ChatAttributes } from '~/db/models/chats';
import { UserAttributes } from '~/db/models/users';
import ssrCurrentUser from '~/lib/ssrCurrentUser';

interface PageProps {
  chats: ChatAttributes[];
  activeChatId: number;
}


interface ActionsProps {
  onRecipientSelect: (recipient: UserAttributes) => void;
}

function Actions({ onRecipientSelect }: ActionsProps) {
  const [userSearchIsOpen, setUserSearchIsOpen] = useState(false);

  return (
    <Fragment>
      <button
        className="w-10 h-10 rounded-full hover:bg-blue-500/10 flex items-center justify-center opacity-80 hover:opacity-100 active:bg-blue-500/20"
        title="New chat room"
        onClick={() => setUserSearchIsOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-blue-500" >
          <path d="M0,24 h24 v-2 h-24 z M4,18h3l12,-12l-3,-3l-12,12z" />
        </svg>
      </button>
      <UserSearchDialog
        open={userSearchIsOpen} onClose={() => setUserSearchIsOpen(false)}
        title="Select recipient"
        onSelect={(user) => {
          onRecipientSelect(user);
          setUserSearchIsOpen(false);
        }}
      />
    </Fragment>
  );
}

function PageContent({ activeChatId }: { activeChatId: number; }) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { chat } = useAppSelector(state => selectChatState(state, activeChatId)!);
  const chats = useAppSelector(selectChats);

  const handleRecipientSelect = async (user: UserAttributes) => {
    const { data: chat } = await axios.post<ChatAttributes>(`/api/chats`, {
      memberIds: [user.id]
    });
    dispatch(chatAdded(chat));
    router.push(`/chats/${chat.id}`);
  };

  return (
    <Layout actions={<Actions onRecipientSelect={handleRecipientSelect} />} className="flex" >
      <Fragment>
        <div className="grow-0 shrink-0 w-60 p-1 border-r border-gray-300 overflow-y-auto" >
          {chats.map((chat) => (
            <UserListItem
              key={chat.id}
              user={chat.members!.find(user => user.id !== currentUser.id)!}
              className={clsx(
                'hover:bg-slate-100 m-1 rounded-md',
                chat.id === activeChatId && 'bg-violet-200 hover:bg-violet-200',
              )}
            />
          ))}
        </div>
        <Messages chat={chat} className="grow overflow-y-auto" />
      </Fragment>

    </Layout>
  );
}

export default function ChatPage({ chats, activeChatId }: PageProps) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      console.log('INIT');
      dispatch(chatsLoaded(chats));
      setInitialized(true);
    }
  }, [initialized, setInitialized, dispatch, chats]);

  if (initialized) {
    return <PageContent activeChatId={activeChatId} />;
  }
};




interface Params extends ParsedUrlQuery {
  chatId: string;
}

const parseParams = ({ chatId }: { chatId: string; }) => ({
  chatId: parseInt(chatId, 10),
});

export const getServerSideProps: GetServerSideProps<PageProps, Params> = async (ctx) => {
  const currentUser = await ssrCurrentUser(ctx);
  if (currentUser == null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    };
  }

  const { chatId } = parseParams(ctx.params!);

  const chats = await db.chats.findAllByMember(currentUser.id);

  return {
    props: {
      chats: chats.map(chat => chat.toJSON()),
      activeChatId: chatId,
    }
  };
};
