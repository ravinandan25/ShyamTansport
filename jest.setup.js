jest.mock('react-native-mmkv-storage', () => {
  const store = new Map();
  const instance = {
    getInt: key => store.get(key),
    setInt: (key, value) => store.set(key, value),
    getString: key => store.get(key),
    setString: (key, value) => store.set(key, value),
    removeItem: key => store.delete(key),
  };
  const loader = {
    withInstanceID: () => loader,
    withEncryption: () => loader,
    initialize: () => instance,
  };
  return {
    MMKVLoader: jest.fn().mockImplementation(() => loader),
  };
});

jest.mock('react-native-html-to-pdf', () => ({
  generatePDF: jest.fn(() => Promise.resolve({filePath: '/tmp/test.pdf'})),
}));

jest.mock('react-native-pdf', () => 'Pdf');

jest.mock('react-native-share', () => ({
  open: jest.fn(() => Promise.resolve({})),
}));

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '/tmp/cache',
  readFile: jest.fn(() => Promise.resolve('')),
  exists: jest.fn(() => Promise.resolve(false)),
  unlink: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  downloadFile: jest.fn(() => ({promise: Promise.resolve({statusCode: 200})})),
}));

jest.mock('react-native-config', () => ({
  APP_BASE_URL: 'https://example.test/',
}));
