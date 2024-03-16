import {useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';

function Home() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        title="Quotation"
        color="secondary"
        containerStyle={styles.btn}
        onPress={() => {
          navigation.navigate('quote');
        }}></Button>
      <Button
        title="Settings"
        containerStyle={styles.btn}
        onPress={() => {
          navigation.navigate('settings');
        }}></Button>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: '100%',
    alignItems: 'center',
  },
  btn: {
    marginVertical: 10,
  },
});
