import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';

// Drop-in replacement for react-native-modal, which relies on APIs
// (InteractionManager) that were removed from React Native core.
function AppModal({isVisible, onBackButtonPress, onBackdropPress, children}) {
  return (
    <Modal
      visible={isVisible}
      backdropColor="rgba(0,0,0,0.1)"
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
