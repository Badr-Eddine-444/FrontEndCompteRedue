export type User = { id: string; name: string; email: string };

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

export default function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, error: null, user: action.payload };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}
