import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../theme/theme';

// Drop-in replacement for react-native-modal, which relies on APIs
// (InteractionManager) that were removed from React Native core.
function AppModal({isVisible, onBackButtonPress, onBackdropPress, children}) {
  const {isDark} = useAppTheme();
  return (
    <Modal
      visible={isVisible}
      backdropColor={isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onBackButtonPress}>
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onBackdropPress} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
});

export default AppModal;
