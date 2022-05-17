import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { RootState } from '~/app/store';
import { ChatAttributes } from '~/db/models/chats';
import { MessageAttributes, MessageCreationAttributes } from '~/db/models/messages';

export type SendingStatus = 'idle' | 'active' | 'error';

interface ChatState {
  chat: ChatAttributes;
  queue: MessageCreationAttributes[]; // to be sent
  sendingStatus: SendingStatus;
  messages: MessageAttributes[];
  complete: boolean; // list is complete
}

const chatsAdapter = createEntityAdapter<ChatState>({
  selectId: (s) => s.chat.id,
  sortComparer: (a, b) => b.chat.latestActivityDate - a.chat.latestActivityDate,
});

const selectors = chatsAdapter.getSelectors();
const { selectById, selectAll } = selectors;

interface MessagesFetchedPayload {
  chatId: number;
  messages: MessageAttributes[];
}

export interface MessageMeta extends Pick<MessageAttributes, 'id' | 'chatId' | 'createdAt'> { }

interface SetSendingStatusPayload {
  chatId: number;
  status: SendingStatus;
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState: chatsAdapter.getInitialState(),
  reducers: {
    chatsLoaded: (state, action: PayloadAction<ChatAttributes[]>) => {
      chatsAdapter.addMany(state, action.payload.map(chat => ({
        chat,
        queue: [],
        sendingStatus: 'idle',
        messages: [],
        complete: true,
      })));
    },
    chatAdded: (state, action: PayloadAction<ChatAttributes>) => {
      chatsAdapter.addOne(state, {
        chat: action.payload,
        queue: [],
        sendingStatus: 'idle',
        messages: [],
        complete: true,
      });
    },
    messagesFetched: (state, action: PayloadAction<MessagesFetchedPayload>) => {
      const localState = selectById(state, action.payload.chatId);
      localState!.messages.unshift(...action.payload.messages);
    },
    enqueueMessage: (state, action: PayloadAction<MessageCreationAttributes>) => {
      const localState = selectById(state, action.payload.chatId)!;
      chatsAdapter.updateOne(state, {
        id: action.payload.chatId,
        changes: {
          queue: [...localState.queue, action.payload],
        },
      });
    },
    messageSent: (state, action: PayloadAction<MessageMeta>) => {
      const localState = selectById(state, action.payload.chatId)!;
      const [front, ...queue] = localState.queue;
      const messages = [...localState.messages, { ...front, ...action.payload }];
      const chat: ChatAttributes = { ...localState.chat, latestActivityDate: action.payload.createdAt };
      chatsAdapter.updateOne(state, {
        id: action.payload.chatId,
        changes: { queue, messages, chat },
      });
    },
    // TODO: higher level
    setSendingStatus: (state, action: PayloadAction<SetSendingStatusPayload>) => {
      chatsAdapter.updateOne(state, {
        id: action.payload.chatId,
        changes: {
          sendingStatus: action.payload.status,
        },
      });
    }
  },
});

export const {
  chatsLoaded, chatAdded,
  messagesFetched,
  enqueueMessage,
  messageSent,
  setSendingStatus,
} = chatsSlice.actions;

export const selectChatState = (state: RootState, chatId: number) =>
  selectById(state.chats, chatId);

export const selectOtherChatMembers = (state: RootState, chatId: number, selfId: number) =>
  selectById(state.chats, chatId)!.chat.members!.filter(mb => mb.id !== selfId);

export const selectChats = createSelector(
  (s: RootState) => selectAll(s.chats),
  (all) => all.map(cs => cs.chat)
);

export default chatsSlice.reducer;
