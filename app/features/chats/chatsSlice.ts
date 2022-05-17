import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { ChatAttributes } from '~/db/models/chats';
import { MessageAttributes, MessageCreationAttributes } from '~/db/models/messages';
import { fetchChatRoomsReducers } from './fetchChatRooms';
import { fetchMessagesReducers } from './fetchMessages';

export type SendingStatus = 'idle' | 'active' | 'error';

export type LoadingState = 'idle' | 'pending' | 'success' | 'error';

export interface ChatState {
  chat: ChatAttributes;
  queue: MessageCreationAttributes[]; // to be sent
  sendingStatus: SendingStatus;
  messages: MessageAttributes[];
  // in the current version, all messages are fetched once
  messageFetchingStatus: LoadingState;
}

export const chatsAdapter = createEntityAdapter<ChatState>({
  selectId: (s) => s.chat.id,
  sortComparer: (a, b) => b.chat.latestActivityDate - a.chat.latestActivityDate,
});

const selectors = chatsAdapter.getSelectors();
export const { selectById, selectAll } = selectors;

export interface MessageMeta extends Pick<MessageAttributes, 'id' | 'chatId' | 'createdAt'> { }

interface SetSendingStatusPayload {
  chatId: number;
  status: SendingStatus;
}


const initialState = {
  data: chatsAdapter.getInitialState(),
  loading: 'idle' as LoadingState,
};

export type SliceState = typeof initialState;

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    chatAdded: (state, action: PayloadAction<ChatAttributes>) => {
      chatsAdapter.addOne(state.data, {
        chat: action.payload,
        queue: [],
        sendingStatus: 'idle',
        messages: [],
        messageFetchingStatus: 'idle',
      });
    },
    enqueueMessage: (state, action: PayloadAction<MessageCreationAttributes>) => {
      const localState = selectById(state.data, action.payload.chatId)!;
      chatsAdapter.updateOne(state.data, {
        id: action.payload.chatId,
        changes: {
          queue: [...localState.queue, action.payload],
        },
      });
    },
    messageSent: (state, action: PayloadAction<MessageMeta>) => {
      const localState = selectById(state.data, action.payload.chatId)!;
      const [front, ...queue] = localState.queue;
      const messages = [...localState.messages, { ...front, ...action.payload }];
      const chat: ChatAttributes = { ...localState.chat, latestActivityDate: action.payload.createdAt };
      chatsAdapter.updateOne(state.data, {
        id: action.payload.chatId,
        changes: { queue, messages, chat },
      });
    },
    // TODO: higher level
    setSendingStatus: (state, action: PayloadAction<SetSendingStatusPayload>) => {
      chatsAdapter.updateOne(state.data, {
        id: action.payload.chatId,
        changes: {
          sendingStatus: action.payload.status,
        },
      });
    }
  },

  extraReducers: (builder) => {
    fetchChatRoomsReducers(builder);
    fetchMessagesReducers(builder);
  }
});

export const {
  chatAdded,
  enqueueMessage, messageSent,
  setSendingStatus,
} = chatsSlice.actions;

export const selectChatState = (state: RootState, chatId: number) => (
  selectById(state.chats.data, chatId)
);

export const selectOtherChatMembers = (state: RootState, chatId: number, selfId: number) =>
  selectById(state.chats.data, chatId)!.chat.members!.filter(mb => mb.id !== selfId);

export const selectIsReady = (state: RootState) => state.chats.loading === 'success';

export const selectChats = createSelector(
  (s: RootState) => selectAll(s.chats.data),
  (all) => all.map(cs => cs.chat)
);

export const selectChat = (state: RootState, chatId: number) => (
  selectById(state.chats.data, chatId)
);

export const selectMessageLoadingStatus = createSelector(
  (s: RootState, chatId: number) => selectChatState(s, chatId),
  (cs) => cs?.messageFetchingStatus,
);

// TODO
export const selectAllMessages = createSelector(
  (s: RootState, chatId: number) => selectChatState(s, chatId),
  (cs) => cs && [
    ...cs.messages,
    ...cs.queue.map((msg, i, arr) => ({
      ...msg, id: i - arr.length, createdAt: Date.now(),
    } as MessageAttributes))
  ]
);

export default chatsSlice.reducer;
