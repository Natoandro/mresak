import { ActionReducerMapBuilder, createAsyncThunk, createSelector, EntityState } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '~/app/store';
import { MessageAttributes } from '~/db/models/messages';
import { ChatState, selectChatState } from './chatsSlice';

const selectOldestMessage = createSelector(
  (s: RootState, chatId: number) => selectChatState(s, chatId)!,
  (cs) => cs.messages[0]?.createdAt,
);

const getUrl = (chatId: number, oldestMessage: number | undefined): string => {
  const base = `/api/chats/${encodeURIComponent(chatId)}/messages`;
  if (oldestMessage == undefined) return base;
  const usp = new URLSearchParams({ priorTo: String(oldestMessage) });
  return `${base}?${usp.toString()}`;
};

const fetchMessages = createAsyncThunk(
  'chats/fetchMessage',
  async (chatId: number, api) => {
    console.log('fetching messages', chatId);
    const oldestMessage = selectOldestMessage(api.getState() as RootState, chatId);
    const res = await axios.get<MessageAttributes[]>(getUrl(chatId, oldestMessage));
    return res.data;
  }
);

//* None of these reducers change the sorting order of the entities,
//* it is therefore safe to make updates outsize of `updateOne`.

export const fetchMessageReducers = (builder: ActionReducerMapBuilder<EntityState<ChatState>>) => {
  builder.addCase(fetchMessages.pending, (state, action) => {
    console.dir(action);
    state.entities[action.meta.arg]!.messageFetchingStatus = 'pending';
  });

  builder.addCase(fetchMessages.fulfilled, (state, action) => {
    console.log('fetchMessages/fulfilled', action);
    const localState = state.entities[action.meta.arg]!;
    localState.messages.unshift(...action.payload);
    localState.messageFetchingStatus = 'success';
  });

  builder.addCase(fetchMessages.rejected, (state, action) => {
    state.entities[action.meta.arg]!.messageFetchingStatus = 'pending';
  });
};

export default fetchMessages;
