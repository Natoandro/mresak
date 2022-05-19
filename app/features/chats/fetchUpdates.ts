import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import produce from 'immer';
import { max } from '~/app/commons/lib/utils/numbers';
import type { RootState } from '~/app/store';
import type { ChatAttributes } from '~/db/models/chats';
import type { MessageAttributes } from '~/db/models/messages';
import { chatsAdapter, selectById, SliceState } from './chatsSlice';

interface Updates {
  messages: MessageAttributes[];
}

const fetchUpdates = createAsyncThunk(
  'chats/fetchUpdates',
  async (i: number, api) => {
    const { currentVersion } = (api.getState() as RootState).chats.updates;
    const usp = new URLSearchParams({ since: String(currentVersion) });
    try {
      const res = await axios.get<Updates>(`/api/updates?${usp.toString()}`);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);

export default fetchUpdates;

export const updateChatWithLatestMessage = produce(
  (state: ChatAttributes, message: MessageAttributes) => {
    state.latestMessage = message;
    state.latestActivityDate = message.createdAt;
    state.unseenMessageCount += 1;
  }
);

export const fetchUpdatesReducers = (
  builder: ActionReducerMapBuilder<SliceState>
) => {
  builder.addCase(fetchUpdates.pending, (state) => {
    state.updates.status = 'pending';
  });
  builder.addCase(fetchUpdates.fulfilled, (state, action) => {
    const { messages } = action.payload;
    let version = state.updates.currentVersion;
    for (const message of messages) {
      version = max(version, message.createdAt);
      const chatState = state.data.entities[message.chatId]!;
      console.log({ chatState, data: state.data, ids: state.data.ids });
      const { chat, messages } = chatState;
      chatsAdapter.updateOne(state.data, {
        id: message.chatId,
        changes: {
          messages: [...messages, message],
          chat: updateChatWithLatestMessage(chat, message)
        }
      });
    }
    state.updates.currentVersion = version;
    state.updates.status = 'success';
  });
  builder.addCase(fetchUpdates.rejected, (state) => {
    console.log('rejected');
    state.updates.status = 'error';
  });
};
