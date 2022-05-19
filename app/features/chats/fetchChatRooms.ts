import { ActionReducerMapBuilder, createAsyncThunk, } from '@reduxjs/toolkit';
import axios from 'axios';
import { ChatAttributes } from '~/db/models/chats';
import { chatsAdapter, SliceState } from './chatsSlice';

const fetchChatRooms = createAsyncThunk(
  'chats/fetchChatRooms',
  async () => {
    const res = await axios.get<ChatAttributes[]>('/api/chats');
    return res.data;
  }
);

export default fetchChatRooms;

export const fetchChatRoomsReducers = (
  builder: ActionReducerMapBuilder<SliceState>
) => {
  builder
    .addCase(fetchChatRooms.pending, (state, action) => {
      state.loading = 'pending';
    })
    .addCase(fetchChatRooms.fulfilled, (state, action) => {
      chatsAdapter.addMany(state.data, action.payload.map(chat => ({
        chat,
        queue: [],
        sendingStatus: 'idle',
        messages: [],
        messageFetchingStatus: 'idle',
      })));
      state.loading = 'success';
      const topId = state.data.ids[0];
      if (topId != null) {
        const top = state.data.entities[topId];
        state.updates.currentVersion = top?.chat.latestActivityDate ?? 0;
      }
    })
    .addCase(fetchChatRooms.rejected, (state, action) => {
      state.loading = 'error';
    });
};
