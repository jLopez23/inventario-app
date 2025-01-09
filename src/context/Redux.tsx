import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const ReduxProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;
