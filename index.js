/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import ReduxProvider from './src/context/Redux';

const InvApp = () => {
    return (
        <ReduxProvider>
            <App />
        </ReduxProvider>
    );
};

AppRegistry.registerComponent(appName, () => InvApp);
