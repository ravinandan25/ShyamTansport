import {useThemeMode} from '@rneui/themed';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Appearance, useColorScheme} from 'react-native';
import {settingsStorage} from '../utils/settings-storage';
import {palette} from './palettes';

// Appearance chosen in Settings: follow the phone, or force light / dark.
const MODE_KEY = 'appearance';
const MODES = ['system', 'light', 'dark'];

const ThemeContext = createContext(null);

export function AppThemeProvider({children}) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState(() => {
    const saved = settingsStorage.getString(MODE_KEY);
    return MODES.includes(saved) ? saved : 'system';
  });

  const setMode = useCallback(next => {
    settingsStorage.setString(MODE_KEY, next);
    setModeState(next);
  }, []);

  // Native parts (date picker, keyboard, system dialogs) follow the same choice.
  useEffect(() => {
    Appearance.setColorScheme(mode === 'system' ? 'auto' : mode);
  }, [mode]);

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const value = useMemo(() => {
    const ui = isDark ? palette.dark : palette.light;
    return {
      ui,
      isDark,
      mode,
      setMode,
      // Shadows barely show on dark backgrounds; cards get a border there instead.
      cardShadow: isDark
        ? {borderWidth: 1, borderColor: ui.border}
        : {
            elevation: 2,
            shadowColor: ui.primary,
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: {width: 0, height: 4},
          },
    };
  }, [isDark, mode, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      <SyncElementsTheme isDark={isDark} />
      {children}
    </ThemeContext.Provider>
  );
}

// Keeps React Native Elements components (Button, Text, ...) in the same mode.
function SyncElementsTheme({isDark}) {
  const {mode, setMode} = useThemeMode();
  const wanted = isDark ? 'dark' : 'light';
  // setMode is a new function on every render, so only call it when the mode differs
  // (depending on it directly loops forever).
  useEffect(() => {
    if (mode !== wanted) {
      setMode(wanted);
    }
  }, [mode, wanted, setMode]);
  return null;
}

export const useAppTheme = () => useContext(ThemeContext);

// Builds a component's styles from the current theme, rebuilding only when it changes:
//   const makeStyles = ({ui, cardShadow}) => StyleSheet.create({...});
//   const styles = useStyles(makeStyles);
export const useStyles = makeStyles => {
  const theme = useAppTheme();
  return useMemo(() => makeStyles(theme), [makeStyles, theme]);
};
