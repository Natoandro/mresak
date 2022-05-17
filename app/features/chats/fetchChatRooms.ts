import { ActionReducerMapBuilder, createAsyncThunk, EntityState } from '@reduxjs/toolkit';
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
    })
    .addCase(fetchChatRooms.rejected, (state, action) => {
      state.loading = 'error';
    });
};
