import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button, Input, Text, useTheme} from '@rneui/themed';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function CustomModal({row, setTableData, isOpen, setIsOpen, tableData}) {
  const [item, setItem] = useState(row.item);
  const [quant, setQuant] = useState(row.qty);
  const [rate, setRate] = useState(row.rate);
  const {theme} = useTheme();
  const toggleModel = () => {
    setIsOpen(!isOpen);
  };
  const handelSave = () => {
    let temp = [...tableData];
    let index = tableData.findIndex(item => item.id == row.id);
    console.log(index);
    if (index != -1) {
      console.log(index);
      console.log(row.qty);
      temp[index].item = item;
      temp[index].qty = quant;
      temp[index].rate = rate;
      console.log(temp[index].qty);
      console.log(temp);
      setTableData(temp);
    }

    toggleModel();
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
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                
                let filtered_date = tableData.filter(
                  item => item.id !== row.id,
                );
                
                filtered_date.map((item, index)=>{
                  item.id= index+1
                })
                console.log(filtered_date);
                setIsOpen(!isOpen)
                setTableData(filtered_date);
              }}>
                <Text>Delete</Text>
              {/* <Icon name="trash" size={25} color="#900" /> */}
            </TouchableOpacity>
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
              margin: 0,
            }}
            defaultValue={row.item}
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
              margin: 0,
            }}
            defaultValue={row.qty}
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
              margin: 0,
            }}
            defaultValue={row.rate}
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

export default CustomModal;
