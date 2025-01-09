import {configureStore} from '@reduxjs/toolkit';
import authUserSlice  from './slices/authUserSlice';

export const store = configureStore({
  reducer: {
    authUser: authUserSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
