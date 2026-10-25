import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import home from '../../features/home/screens/home';
import Quote from '../../features/quote/quote';
import Settings from '../../features/settings/screens/settengs';
import GeneratedPdf from '../../features/generated-pdf/screens/generated-pdf';

function NavigationStack() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="quote"
          component={Quote}
          options={({route}) => ({
            title: route.params?.is_billing ? 'Billing' : 'Quotation',
          })}
        />
        <Stack.Screen
          name="settings"
          component={Settings}
          options={{headerTitle: 'Settings'}}
        />
        <Stack.Screen
          name="generated_pdf"
          component={GeneratedPdf}
          options={{headerTitle: 'Generated PDF'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationStack;
