import {useNavigation} from '@react-navigation/native';
import {Input} from '@rneui/base';
import {Button, Text, useTheme} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PlusCircleOutlined} from 'react-native-vector-icons/AntDesign';
import TableRow from '../../components/quote/table-row';
import CustomModal from '../../components/quote/custom-modal';
import CustomAddModal from '../../components/quote/custom-add-modaj';

function Quote() {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [tableData, setTableData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let temp_total = 0;
    tableData.map(item => {
      temp_total += item.qty * item.rate;
    });
    setTotal(temp_total);
  }, [tableData]);

  return (
    <View
      style={{
        backgroundColor: 'white',
        position: 'relative',
        height: '100%',
      }}>
      <ScrollView>
        <View style={{padding: 10, paddingBottom: 80}}>
          <Input
            textContentType="name"
            label={'Customer Name:'}
            onChangeText={value => console.log(value)}
            labelStyle={{fontSize: 14, marginVertical: 0, color: 'black'}}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,

              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              height: 40,
              fontSize: 14,
              verticalAlign: 'middle',
            }}
            errorStyle={{
              margin: 0,
            }}
          />

          <Input
            label={'Customer Address:'}
            numberOfLines={3}
            multiline={true}
            onChangeText={value => console.log(value)}
            scrollEnabled={true}
            labelStyle={{fontSize: 14, marginVertical: 0, color: 'black'}}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,
              backgroundColor: 'blue',
              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              fontSize: 14,
              verticalAlign: 'top',
            }}
            errorStyle={{
              margin: 0,
            }}
          />
          <Input
            textContentType="telephoneNumber"
            inputMode="tel"
            label={'Customer Phone:'}
            maxLength={13}
            onChangeText={value => console.log(value)}
            labelStyle={{fontSize: 14, marginVertical: 0, color: 'black'}}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,
              backgroundColor: 'blue',
              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              height: 40,
              fontSize: 14,
              verticalAlign: 'middle',
            }}
            errorStyle={{
              margin: 0,
            }}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              paddingHorizontal: 10,
              marginBottom: 10,
            }}>
            <Button
              buttonStyle={styles.icon_btn}
              containerStyle={styles.icon_btn}
              color={'apricot'}
              onPress={() => setIsVisible(true)}>
              +
            </Button>
          </View>
          <View style={{paddingHorizontal: 10}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                height: 40,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: theme.colors.old_rose,
              }}>
              <View style={{width: '15%'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  S.no
                </Text>
              </View>
              <View style={{width: '50%'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  Item
                </Text>
              </View>
              <View style={{width: '10%'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  Qty
                </Text>
              </View>
              <View style={{width: '25%'}}>
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  Rate
                </Text>
              </View>
            </View>
            {tableData.map((row, index) => {
              return (
                <TableRow
                  key={`row-${index}`}
                  row={row}
                  tableData={tableData}
                  setTableData={setTableData}></TableRow>
              );
            })}
            <Text style={{textAlign:"right",fontSize:14, fontWeight:"bold"}}>Total: {total}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.button_container}>
        <Button
          title="Generate Quotation"
          color="secondary"
          containerStyle={styles.btn}
          onPress={() => {
              navigation.navigate('generated_pdf');
          }}></Button>
      </View>
      <CustomAddModal
        setTableData={setTableData}
        tableData={tableData}
        isOpen={isVisible}
        setIsOpen={setIsVisible}></CustomAddModal>
    </View>
  );
}

export default Quote;

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 20,
    width: 'auto',
  },
  button_container: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
  icon_btn: {
    height: 45,
    width: 45,
    borderRadius: 50,
    padding: 0,
  },
});
