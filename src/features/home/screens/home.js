import {useNavigation} from '@react-navigation/native';
import {Button} from '@rneui/themed';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {storage} from '../../../../index';

function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    const initial_count = storage.getInt('invoice_number');
    if (initial_count == null) {
      storage.setInt('invoice_number', 0);
    }
    console.log('================INITIAL COUNT');
    console.log(initial_count);
    console.log('=============================');
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Quotation"
        color="secondary"
        containerStyle={styles.btn}
        onPress={() => {
          navigation.navigate('quote', {is_billing: false});
        }}
      />
      <Button
        title="Billing"
        color="primary"
        containerStyle={styles.btn}
        onPress={() => {
          navigation.navigate('quote', {is_billing: true});
        }}
      />
      <Button
        title="Settings"
        containerStyle={styles.btn}
        onPress={() => {
          navigation.navigate('settings');
        }}
      />
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
