jest.mock('react-native-mmkv-storage', () => {
  const store = new Map();
  const instance = {
    getInt: key => store.get(key),
    setInt: (key, value) => store.set(key, value),
    getString: key => store.get(key),
    setString: (key, value) => store.set(key, value),
  };
  return {
    MMKVLoader: jest.fn().mockImplementation(() => ({
      initialize: () => instance,
    })),
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
  readFile: jest.fn(() => Promise.resolve('')),
}));
