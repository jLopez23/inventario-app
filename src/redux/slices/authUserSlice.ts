import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthUserState} from '../types/authUserTypes';

const initialState: AuthUserState = {
  id: 0,
  name: '',
  email: '',
  password: '',
};

export const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});

export default authUserSlice.reducer;
export const {setAuthUser} = authUserSlice.actions;
