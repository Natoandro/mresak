import axios from 'axios';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { chatAdded, selectChatState } from '~/app/features/chats/chatsSlice';
import { useAppDispatch, useAppSelector } from '~/app/hooks';
import Layout from '~/app/features/chats/components/Layout';
import Messages from '~/app/features/chats/components/Messages';
import RoomList from '~/app/features/chats/components/RoomList';
import UserSearchDialog from '~/components/users/UserSearchDialog';
import { ChatAttributes } from '~/db/models/chats';
import { UserAttributes } from '~/db/models/users';
import useActiveChatId from '~/app/features/chats/hooks/useActiveChatId';
import useFetchChatRooms from '~/app/features/chats/hooks/useFetchChatRooms';
import useSetSeen from '~/app/features/chats/hooks/useSetSeen';


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

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRecipientSelect = async (user: UserAttributes) => {
    const { data: chat } = await axios.post<ChatAttributes>(`/api/chats`, {
      memberIds: [user.id]
    });
    dispatch(chatAdded(chat));
    router.push(`/chats/${chat.id}`);
  };

  useFetchChatRooms();
  useSetSeen();

  return (
    <Layout actions={<Actions onRecipientSelect={handleRecipientSelect} />} className="flex" >
      <Fragment>
        <RoomList className="grow-0 shrink-0 w-80" />
        <Messages className="grow overflow-y-auto" />
      </Fragment>

    </Layout>
  );
}

