import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './features/chats/chatsSlice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
