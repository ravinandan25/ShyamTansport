import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import home from '../../features/home/screens/home';
import Quote from '../../features/quote/quote';
import Settings from '../../features/settings/screens/settengs';
import { Header } from '@rneui/base';
import GeneratedPdf from '../../features/generated-pdf/screens/generated-pdf';

function NavigationStack() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={home}  options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="quote" component={Quote} options={{headerTitle:"Quotation"}}></Stack.Screen>
        <Stack.Screen name='settings' component={Settings} options={{headerTitle:"Settings"}}></Stack.Screen>
        <Stack.Screen name='generated_pdf' component={GeneratedPdf} options={{headerTitle:"Generated PDF"}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationStack;
