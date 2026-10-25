import {Text, useTheme} from '@rneui/themed';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import CustomModal from './custom-modal';

function TableRow({row, setTableData,tableData}) {
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const toggleModel = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <TouchableOpacity onPress={toggleModel}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // height: 40,
            minHeight:30,
            marginBottom: 10,
            borderRadius: 8,
            backgroundColor: row.id%2==0?theme.colors.melon:theme.colors.apricot,
          }}>
          <View style={{width: '15%'}}>
            <Text style={{textAlign: 'center'}}>{row.id}</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'center'}}>
            {row.item}
            </Text>
          </View>
          <View style={{width: '10%'}}>
            <Text style={{textAlign: 'center'}}>{row.qty}</Text>
          </View>
          <View style={{width: '25%'}}>
            <Text style={{textAlign: 'center'}}>{row.rate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    
      <CustomModal row={row} setTableData={setTableData} isOpen={isOpen} setIsOpen={setIsOpen} tableData={tableData}></CustomModal>
    </>
  );
}

export default TableRow;
