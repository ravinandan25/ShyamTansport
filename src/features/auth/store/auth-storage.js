import {MMKVLoader} from 'react-native-mmkv-storage';

// Separate, encrypted store for the session (key kept in Android Keystore / iOS Keychain).
const authStorage = new MMKVLoader()
  .withInstanceID('auth')
  .withEncryption()
  .initialize();

const TOKEN_KEY = 'session_token';
const USER_KEY = 'session_user';

export const loadSession = () => {
  const token = authStorage.getString(TOKEN_KEY);
  const user = authStorage.getString(USER_KEY);
  return token ? {token, user: user ? JSON.parse(user) : null} : null;
};

export const saveSession = ({token, user}) => {
  authStorage.setString(TOKEN_KEY, token);
  authStorage.setString(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  authStorage.removeItem(TOKEN_KEY);
  authStorage.removeItem(USER_KEY);
};
