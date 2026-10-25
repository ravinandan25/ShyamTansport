import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {setOnSessionExpired, setSessionToken} from '../../services/api';
import {loginAPI, logoutAPI, meAPI, updateNameAPI} from './store/api';
import {clearSession, loadSession, saveSession} from './store/auth-storage';

const AuthContext = createContext(null);

// The stored session is read synchronously, so the first render already knows
// whether to show the login screen.
const initialSession = loadSession();
setSessionToken(initialSession?.token ?? null);

export function AuthProvider({children}) {
  const [session, setSession] = useState(initialSession);

  const endSession = useCallback(() => {
    clearSession();
    setSessionToken(null);
    setSession(null);
  }, []);

  // Any 401 from the server means this session is no longer valid.
  useEffect(() => {
    setOnSessionExpired(endSession);
  }, [endSession]);

  // Refresh the name/phone (and catch a revoked session) when the app opens.
  useEffect(() => {
    if (!initialSession) {
      return;
    }
    meAPI()
      .then(data => {
        const updated = {token: initialSession.token, user: data.user};
        saveSession(updated);
        setSession(current => (current ? updated : current));
      })
      .catch(() => {}); // offline: keep the cached session; 401 is handled above
  }, []);

  const signIn = useCallback(async ({phone, pin}) => {
    const data = await loginAPI({phone, pin});
    const next = {token: data.token, user: data.user};
    saveSession(next);
    setSessionToken(next.token);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (err) {
      // Signing out locally is what matters; the server session expires unused.
      console.log(err);
    }
    endSession();
  }, [endSession]);

  const updateName = useCallback(
    async name => {
      const data = await updateNameAPI(name);
      const next = {token: session.token, user: data.user};
      saveSession(next);
      setSession(next);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isSignedIn: !!session,
      signIn,
      signOut,
      updateName,
    }),
    [session, signIn, signOut, updateName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
