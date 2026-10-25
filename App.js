/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import NavigationStack from './src/components/navigation/navigation-stack';
import {createTheme, ThemeProvider} from '@rneui/themed';

function App() {
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
    <SafeAreaView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <NavigationStack></NavigationStack>
      </ThemeProvider>
    </SafeAreaView>
  );
}

export default App;
