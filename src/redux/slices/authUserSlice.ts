import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthUserState} from '../types/authUserTypes';

const initialState: AuthUserState = {
  status: 'checking',
  token: undefined,
  user: undefined,
};

export const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUserState>) => {
      state.status = action.payload.status;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export default authUserSlice.reducer;
export const {setAuthUser} = authUserSlice.actions;
