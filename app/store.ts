import { configureStore } from '@reduxjs/toolkit';
import chatsReducer from './features/chats/chatsSlice';
import userSlice from './features/users/userSlice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    user: userSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
