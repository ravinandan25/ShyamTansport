import React from 'react';
import {KeyboardAvoidingView, Modal, Pressable, StyleSheet} from 'react-native';
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
      {/* The modal window is edge-to-edge, so Android doesn't resize it for the
          keyboard; pad it ourselves so the dialog moves up above the keyboard. */}
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onBackdropPress} />
        {children}
      </KeyboardAvoidingView>
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
