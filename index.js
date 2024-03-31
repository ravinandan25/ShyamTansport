/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {MMKVLoader} from 'react-native-mmkv-storage';
// Create and initialise the MMKV instance
export const storage =  new MMKVLoader().initialize();

// Start the application

AppRegistry.registerComponent(appName, () => App);
