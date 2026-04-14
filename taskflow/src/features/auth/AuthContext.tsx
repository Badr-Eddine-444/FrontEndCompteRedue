import { useReducer, type ReactNode } from 'react';
import authReducer, { initialState } from './authReducer';
import { AuthContext } from './authenticationContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
}
