import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadingStatus } from '~/app/commons/types';
import { RootState } from '~/app/store';
import { UserAttributes } from '~/db/models/users';

const initialState = {
  current: null as UserAttributes | null,
  status: 'idle' as LoadingStatus,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserAttributes>) => {
      state.status = 'success';
      state.current = action.payload;
    }
  },
});

export default userSlice;

export const { setUser } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.current;
