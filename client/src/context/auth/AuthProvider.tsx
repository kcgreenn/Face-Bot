import React, { useReducer } from 'react';
import { axiosInstance as axios } from '../../App';
// import { authContext } from './authContext';
import authReducer from './authReducer';
import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_USER,
  SET_LOADING,
  SET_ALERT
} from '../types';
import handleJwt from '../../utils/handleJWT';

import { createContext } from 'react';

export interface AuthContext {
  isAuth: boolean;
  user: {
    sub: string;
    handle: string;
    email: string;
    exp: number;
    iat: number;
  };
  loading: boolean;
  alert: any;
  login: any;
  register: any;
  logout: any;
  checkLocalToken: any;
  setAlert: any;
}

export const authContext = createContext<AuthContext>({
  isAuth: false,
  user: {
    sub: '',
    handle: '',
    email: '',
    exp: Date.now(),
    iat: Date.now()
  },
  loading: false,
  alert: null,
  login: async (username: string, password: string): Promise<void> => {},
  register: null,
  checkLocalToken: null,
  setAlert: null,
  logout: null
});

interface Props {}

const AuthProvider: React.FC<Props> = props => {
  const initialState = {
    isAuth: false,
    user: {},
    loading: false,
    alert: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login User
  const login = async (loginData: any): Promise<string | null> => {
    try {
      setLoading();
      const res = await axios.post('/login', loginData);
      const decoded = handleJwt(res.data.access_token);
      // Set current user
      dispatch({ type: SET_CURRENT_USER, payload: decoded });
      return 'Success';
    } catch (err) {
      setAlert(err);
      return null;
    }
  };

  // Register User
  const register = async (registerData: any): Promise<string | null> => {
    try {
      setLoading();
      const res = await axios.post('/register', registerData);
      return 'Success';
    } catch (err) {
      setAlert(err);
      return null;
    }
  };

  // Logout User
  const logout = (): void => {
    handleJwt(null);
    dispatch({ type: CLEAR_CURRENT_USER });
  };

  // Check Local Storage for Token
  const checkLocalToken = (token: any): void => {
    if (token) {
      const decoded = handleJwt(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp > currentTime) {
        dispatch({ type: SET_CURRENT_USER, payload: decoded });
      }
    }
  };

  //   Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Set alert
  const setAlert = (message: string): void => {
    dispatch({ type: SET_ALERT, payload: message });
  };

  return (
    <authContext.Provider
      value={{
        isAuth: state.isAuth,
        user: state.user,
        loading: state.loading,
        alert: state.alert,
        setAlert: setAlert,
        login: login,
        register: register,
        logout: logout,
        checkLocalToken: checkLocalToken
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthProvider;