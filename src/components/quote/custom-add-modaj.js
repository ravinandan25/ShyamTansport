import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button, Input, Text, useTheme} from '@rneui/themed';
import {ScrollView, View} from 'react-native';
import FontAwesome, { SolidIcons } from 'react-native-fontawesome';
import moment from 'moment';


function CustomAddModal({setTableData, isOpen, setIsOpen, tableData}) {
  const [item, setItem] = useState('');
  const [quant, setQuant] = useState('');
  const [rate, setRate] = useState('');
  const {theme} = useTheme();
  const toggleModel = () => {
    setIsOpen(!isOpen);
  };
  const [errors, setErrors] = useState({
    item: '',
    quantity: '',
    rate: '',
  });
  const handelSave = () => {
    const qtyNum = Number(quant);
    const rateNum = Number(rate);

    let formIsValid = true;
    let newErrors = { item: '', quantity: '', rate: '' };

    // Validation
    if (item.trim() === '') {
      newErrors.item = 'Description is required';
      formIsValid = false;
    }

    if (isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
      formIsValid = false;
    }

    if (isNaN(rateNum) || rateNum < 0) {
      newErrors.rate = 'Rate must be a non-negative number';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      let temp = [
        ...tableData,
        {
          id: tableData?.length + 1,
          item: item.trim(),
          qty: qtyNum,
          rate: rateNum,
        },
      ];
      setTableData(temp);
      toggleModel();
      setItem('');
      setRate('');
      setQuant('');
    }
  };
  
  return (
    <Modal
      isVisible={isOpen}
      onBackButtonPress={toggleModel}
      onBackdropPress={toggleModel}>
      <View
        style={{
          backgroundColor: 'white',

          borderRadius: 8,
          padding: 10,
        }}>
        <ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 20}}>
              Item
            </Text>
            

          </View>

          <Input
            label={'Description:'}
            numberOfLines={3}
            multiline={true}
            onChangeText={value => setItem(value)}
            scrollEnabled={true}
            labelStyle={{
              fontSize: 14,
              marginVertical: 0,
              color: 'black',
              marginHorizontal: -10,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,
              backgroundColor: 'blue',
              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
              marginHorizontal: -10,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              fontSize: 14,
              verticalAlign: 'top',
            }}
            errorStyle={{
              
              marginVertical:5
            }}
            errorMessage={errors.item} 
          />
          <Input
            label={'Quantity:'}
            onChangeText={value => setQuant(value)}
            labelStyle={{
              fontSize: 14,
              marginVertical: 0,
              color: 'black',
              marginHorizontal: -10,
            }}
            inputMode="numeric"
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,
              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
              marginHorizontal: -10,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              height: 40,
              fontSize: 14,
              verticalAlign: 'middle',
            }}
            errorStyle={{
              marginVertical:5
            }}
            errorMessage={errors.quantity} 
          />
          <Input
            label={'Rate:'}
            onChangeText={value => setRate(value)}
            labelStyle={{
              fontSize: 14,
              marginVertical: 0,
              color: 'black',
              marginHorizontal: -10,
            }}
            inputMode="numeric"
            inputContainerStyle={{
              borderBottomWidth: 0,
              marginBottom: 0,
              padding: 0,
              backgroundColor: 'rgba(255,214,194,.5)',
              borderRadius: 8,
              marginVertical: 4,
              marginHorizontal: -10,
            }}
            inputStyle={{
              paddingHorizontal: 8,
              height: 40,
              fontSize: 14,
              verticalAlign: 'middle',
            }}
            errorStyle={{
              marginVertical:5,
              marginBottom:10
            }}
            errorMessage={errors.rate}
          />
          <View
            style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{marginRight: 10, width: '48%'}}>
              <Button
                onPress={toggleModel}
                color={theme.colors.primary}
                title={'Cancel'}></Button>
            </View>
            <View style={{marginRight: 10, width: '48%'}}>
              <Button
                onPress={handelSave}
                color={theme.colors.secondary}
                title={'Save'}></Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default CustomAddModal;
