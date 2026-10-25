/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NavigationStack from './src/components/navigation/navigation-stack';
import SplashScreen from './src/features/splash/splash-screen';
import {AuthProvider} from './src/features/auth/auth-context';
import {createTheme, ThemeProvider} from '@rneui/themed';
import {palette} from './src/theme/palettes';
import {AppThemeProvider, useAppTheme} from './src/theme/theme';

const brand = colors => ({
  primary: colors.primary,
  secondary: colors.secondary,
  tertiary: colors.tertiary,
});

// React Native Elements theme; AppThemeProvider switches its light/dark mode.
const elementsTheme = createTheme({
  // From the active palette in src/theme/palettes.js.
  lightColors: brand(palette.light),
  darkColors: brand(palette.dark),
  components: {
    Button: {
      raised: true,
      containerStyle: {
        width: '100%',
        borderRadius: 4,
      },
      buttonStyle: {
        width: '100%',
        borderRadius: 4,
      },
    },
  },
});

function AppContent() {
  const {ui, isDark} = useAppTheme();
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  return (
    <>
      <StatusBar
        barStyle={showSplash || isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      {/* Covers the native splash colour that stays as the window background. */}
      <View style={[styles.root, {backgroundColor: ui.screen}]}>
        <AuthProvider>
          <NavigationStack />
        </AuthProvider>
        {showSplash && <SplashScreen onFinish={hideSplash} />}
      </View>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={elementsTheme}>
        <AppThemeProvider>
          <AppContent />
        </AppThemeProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
