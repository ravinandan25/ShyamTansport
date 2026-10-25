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
import {ui} from './src/theme/ui';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  const theme = createTheme({
    lightColors: {
      primary: '#6D6875',
      secondary: '#E5989B',
      old_rose: '#B5838D',
      melon: '#FFB4A2',
      apricot: '#FFCDB2',
    },
    darkColors: {
      primary: '#6D6875',
      secondary: '#E5989B',
      old_rose: '#B5838D',
      melon: '#FFB4A2',
      apricot: '#FFCDB2',
    },
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

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle={showSplash ? 'light-content' : 'dark-content'}
          translucent
          backgroundColor="transparent"
        />
        {/* Covers the native splash colour that stays as the window background. */}
        <View style={styles.root}>
          <AuthProvider>
            <NavigationStack />
          </AuthProvider>
          {showSplash && <SplashScreen onFinish={hideSplash} />}
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ui.screen,
  },
});
