import {MMKVLoader} from 'react-native-mmkv-storage';

// App preferences kept on the device (appearance, language).
export const settingsStorage = new MMKVLoader()
  .withInstanceID('settings')
  .initialize();
