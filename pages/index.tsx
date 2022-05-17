import axios from 'axios';
import type { NextPage, GetServerSideProps } from 'next';
import { Fragment, useState } from 'react';
import { chatAdded } from '~/app/features/chats/chatsSlice';
import { useAppDispatch } from '~/app/hooks';
import Layout from '~/components/chats/Layout';
import Messages from '~/components/chats/Messages';
import UserListItem from '~/components/users/UserListItem';
import UserSearchDialog from '~/components/users/UserSearchDialog';
import db from '~/db/models';
import { ChatAttributes } from '~/db/models/chats';
import { UserAttributes } from '~/db/models/users';
import ssrCurrentUser from '~/lib/ssrCurrentUser';


interface HomePageProps {
  currentUser: UserAttributes;
}

const HomePage: NextPage<HomePageProps> = ({ currentUser }) => {
  const [userSearchIsOpen, setUserSearchIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatAttributes | null>(null);

  const dispatch = useAppDispatch();

  const handleRecipientSelect = async (user: UserAttributes) => {
    const res = await axios.post<ChatAttributes>(`/api/chats`, {
      memberIds: [user.id]
    });
    dispatch(chatAdded(res.data));
    setActiveChat(res.data);
    setUserSearchIsOpen(false);
  };

  const renderedActions = (
    <Fragment>
      <button
        className="w-10 h-10 rounded-full hover:bg-blue-50 flex items-center justify-center opacity-80 hover:opacity-100 active:bg-blue-100"
        title="New message"
        onClick={() => setUserSearchIsOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="fill-blue-500">
          <path d="M0,24 h24 v-2 h-24 z M4,18h3l12,-12l-3,-3l-12,12z" />
        </svg>
      </button>
      <UserSearchDialog
        open={userSearchIsOpen} onClose={() => setUserSearchIsOpen(false)}
        title="Select recipient"
        onSelect={handleRecipientSelect}
      />
    </Fragment>
  );

  return (
    <Layout actions={renderedActions} className="flex">
      {activeChat && (
        <Fragment>
          <div className="grow-0 shrink-0 w-60 border-r border-gray-300">
            {activeChat?.id !== 0 && (
              <UserListItem
                user={activeChat.members!.find(user => user.id !== currentUser.id)!}
                className="bg-slate-200 m-1 rounded-md"
              />
            )}

          </div>
          <Messages
            chat={activeChat}
            className="grow"
          />
        </Fragment>
      )}
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const admin = await db.admin.findOne();
  if (admin == null) {
    // first run
    return {
      redirect: {
        destination: '/admin/init',
        permanent: false,
      }
    };
  }

  const currentUser = await ssrCurrentUser(ctx);

  if (currentUser == null) {
    return {
      redirect: { destination: '/login', permanent: false, },
    };
  } else {
    // latest chat
    const chat = await db.chats.findLatestByMember(currentUser.id);
    console.log('latest chat', chat);
    if (chat == null) {
      return { notFound: true }; // TODO: new chat
    } else {
      return {
        redirect: {
          destination: `/chats/${chat.id}`,
          permanent: false
        },
      };
    }
  }
};
