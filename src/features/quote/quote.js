import {useNavigation, useRoute} from '@react-navigation/native';
import {Input} from '@rneui/base';
import {Button, Text, useTheme} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {PlusCircleOutlined} from 'react-native-vector-icons/AntDesign';
import TableRow from '../../components/quote/table-row';
import CustomModal from '../../components/quote/custom-modal';
import CustomAddModal from '../../components/quote/custom-add-modaj';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {createInvoiceAPI, createQuotationAPI} from './store/api';


function Quote() {
  const route = useRoute();
  const {is_billing} = route.params;
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [tableData, setTableData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState('0');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tableString, setTableString] = useState('');
  const [loadingDate, setLoadingDate] = useState(
    moment().format('DD MMM, YYYY'),
  );
  const data = [];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setLoadingDate(moment(date).format('DD MMM, YYYY'));
    hideDatePicker();
  };

  useEffect(() => {
    setTableData(data);

    
  }, []);

  const render_table_data = async () => {
    let data = tableData.map(item => {
      return `<tr>
          <td>${item.id}</td>
          <td>${item.item}</td>
          <td class="text-center align-middle" >${item.qty}</td>
          <td>${item.rate}</td>
          <td>${item.qty * item.rate}</td>
        </tr>`;
    });

    tableRowsHTML = data.join('');
    setTableString(tableRowsHTML);
  };

  useEffect(() => {
    render_table_data();
  }, []);

  useEffect(() => {
    let temp_total = 0;
    tableData.map(item => {
      temp_total += item.qty * item.rate;
    });
    if (tax !== '') {
      temp_total += parseFloat(tax);
    }

    setTotal(temp_total);
    render_table_data();
  }, [tableData, tax]);

  const generatePayload = async () => {
    try {
      let payload = {
        customer_name: customerName,
        customer_address: address,
        customer_phone: phone,

        loading_date: moment(loadingDate, 'DD MMM, YYYY').format('YYYY-MM-DD'),

        tax: parseFloat(tax || 0),

        items: tableData.map(item => ({
          description: item.item,
          quantity: item.qty,
          rate: item.rate,
        })),
      };

      console.log('PAYLOAD:', payload);

      const res = is_billing
        ? await createInvoiceAPI(payload)
        : await createQuotationAPI(payload);

      console.log('SUCCESS:', res);

      navigation.navigate('generated_pdf', {
        table: tableData,
        total: total,
        loadingDate: loadingDate,
        customerName: customerName,
        phone: phone,
        address: address,
        tax: tax,
        tableString: tableString,
        is_billing: is_billing,
        number: is_billing ? res.invoice_number : res?.quotation_number,
      });
    } catch (err) {
      console.log(err);
      alert('Failed to create quotation');
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        position: 'relative',
        height: '100%',
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <View style={{padding: 10, marginBottom: 200}}>
            <Input
              textContentType="name"
              label={'Customer Name:'}
              onChangeText={value => setCustomerName(value)}
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
              onChangeText={value => setAddress(value)}
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
              onChangeText={value => setPhone(value)}
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
                flexDirection: 'row',
                backgroundColor: 'RED',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                <Input
                  label={'Loading Date:'}
                  onPressIn={() => setDatePickerVisibility(true)}
                  onChangeText={value => console.log(value)}
                  labelStyle={{fontSize: 14, marginVertical: 0, color: 'black'}}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: 0,
                    width: 100,
                    padding: 0,
                    backgroundColor: 'rgba(255,214,194,.5)',
                    borderRadius: 8,
                    marginVertical: 4,
                  }}
                  inputStyle={{
                    paddingHorizontal: 8,
                    height: 40,
                    fontSize: 14,
                    width: 100,
                    verticalAlign: 'middle',
                  }}
                  errorStyle={{
                    margin: 0,
                  }}
                  value={loadingDate}
                />
              </View>
              <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={{
                  backgroundColor: '#FFCDB2',
                  borderRadius: 50,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  width: 50,
                }}>
                <Icon name="add" size={20} color="#000" />
              </TouchableOpacity>
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
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <View style={{height: 40}}>
                  <Text>GST/Tax : </Text>
                </View>

                <View>
                  <Input
                    inputMode="numeric"
                    onChangeText={value => {
                      setTax(value);
                    }}
                    onBlur={() => {
                      if (tax == '') {
                        setTax('0');
                      }
                    }}
                    onFocus={() => {
                      if (tax == '0') {
                        setTax('');
                      }
                    }}
                    inputContainerStyle={{
                      borderBottomWidth: 0,
                      marginBottom: 0,
                      padding: 0,
                      backgroundColor: 'rgba(255,214,194,.5)',
                      borderRadius: 8,
                      marginVertical: 4,
                      marginHorizontal: -10,
                      width: 80,
                      height: 40,
                    }}
                    value={tax}
                    inputStyle={{
                      paddingHorizontal: 8,
                      fontSize: 14,
                      verticalAlign: 'top',
                    }}
                    defaultValue={tax}
                  />
                </View>
              </View>
              <Text
                style={{textAlign: 'right', fontSize: 14, fontWeight: 'bold'}}>
                Total: {total}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.button_container}>
        <Button
          title={is_billing ? 'Generate Bill' : 'Generate Quotation'}
          color="secondary"
          containerStyle={styles.btn}
          onPress={() => {
            // console.log(tableData);
            generatePayload();
          }}
        />
      </View>
      <CustomAddModal
        setTableData={setTableData}
        tableData={tableData}
        isOpen={isVisible}
        setIsOpen={setIsVisible}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
