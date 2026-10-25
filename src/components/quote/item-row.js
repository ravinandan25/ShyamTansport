import {Icon, Text} from '@rneui/themed';
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {ui} from '../../theme/ui';
import {formatRupees} from '../../utils/currency';

function ItemRow({index, row, onPress}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: ui.border}}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${row.item}`}>
      <View style={styles.index}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{row.item}</Text>
        <Text style={styles.meta}>
          {row.qty} × {formatRupees(row.rate)}
        </Text>
      </View>
      <Text style={styles.amount}>{formatRupees(row.qty * row.rate)}</Text>
      <Icon name="chevron-right" type="material" size={20} color={ui.faint} />
    </Pressable>
  );
}

export default ItemRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: ui.border,
  },
  index: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ui.screen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  indexText: {
    fontSize: 13,
    fontWeight: '600',
    color: ui.muted,
  },
  details: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: ui.text,
  },
  meta: {
    fontSize: 13,
    color: ui.muted,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: ui.text,
    marginRight: 2,
  },
});
