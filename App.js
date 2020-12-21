/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import MainAppNavigation from './app/navigation/MainAppNavigation';
import AppStateStore from './app/store/state';

const App: () => React$Node = () => {
  return (
    <>
      <AppStateStore.Provider>
        <MainAppNavigation />
      </AppStateStore.Provider>
    </>
  );
};

export default App;
