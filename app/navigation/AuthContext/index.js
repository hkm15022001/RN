// Source code: https://viblo.asia/p/su-dung-context-api-trong-react-hooks-va-classes-4dbZNLba5YM

import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
