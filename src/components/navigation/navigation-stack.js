import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import home from '../../features/home/screens/home';
import Quote from '../../features/quote/quote';
import Settings from '../../features/settings/screens/settengs';
import EditName from '../../features/settings/screens/edit-name';
import GeneratedPdf from '../../features/generated-pdf/screens/generated-pdf';
import Documents from '../../features/documents/screens/documents';
import DocumentViewer from '../../features/documents/screens/document-viewer';
import Login from '../../features/auth/screens/login';
import ForgotPin from '../../features/auth/screens/forgot-pin';
import {useAuth} from '../../features/auth/auth-context';
import {ui} from '../../theme/ui';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {backgroundColor: ui.screen},
  headerShadowVisible: false,
  headerTintColor: ui.text,
  headerTitleStyle: {fontWeight: '700', fontSize: 20},
  contentStyle: {backgroundColor: ui.screen},
};

function NavigationStack() {
  const {isSignedIn} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {isSignedIn ? (
          <>
            <Stack.Screen
              name="home"
              component={home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="quote"
              component={Quote}
              options={({route}) => ({
                title: route.params?.is_billing
                  ? 'New Invoice'
                  : 'New Quotation',
              })}
            />
            <Stack.Screen
              name="settings"
              component={Settings}
              options={{headerTitle: 'Settings'}}
            />
            <Stack.Screen
              name="edit_name"
              component={EditName}
              options={{title: 'Edit name'}}
            />
            <Stack.Screen
              name="generated_pdf"
              component={GeneratedPdf}
              options={({route}) => ({
                title: route.params?.number ?? 'Document',
              })}
            />
            <Stack.Screen
              name="documents"
              component={Documents}
              options={{title: 'Documents'}}
            />
            <Stack.Screen
              name="document_viewer"
              component={DocumentViewer}
              options={({route}) => ({title: route.params.doc.number})}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={Login}
              options={{headerShown: false, animationTypeForReplace: 'pop'}}
            />
            <Stack.Screen
              name="forgot_pin"
              component={ForgotPin}
              options={{title: 'Forgot PIN'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationStack;
