import {Button, Icon, Text, useTheme} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import Modal from '../common/app-modal';
import FormField from '../common/form-field';
import {ui} from '../../theme/ui';
import {formatRupees} from '../../utils/currency';

const NO_ERRORS = {item: '', qty: '', rate: ''};

// Add a new item (item = null) or edit / delete an existing one.
function ItemModal({isOpen, item, onClose, onSave, onDelete}) {
  const {theme} = useTheme();
  const [description, setDescription] = useState('');
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [errors, setErrors] = useState(NO_ERRORS);

  // Start from the item's current values every time the dialog opens.
  useEffect(() => {
    if (isOpen) {
      setDescription(item ? item.item : '');
      setQty(item ? String(item.qty) : '');
      setRate(item ? String(item.rate) : '');
      setErrors(NO_ERRORS);
    }
  }, [isOpen, item]);

  const handleSave = () => {
    const qtyNum = Number(qty);
    const rateNum = Number(rate);
    const newErrors = {
      item: description.trim() === '' ? 'Description is required' : '',
      qty:
        qty === '' || isNaN(qtyNum) || qtyNum <= 0
          ? 'Quantity must be a positive number'
          : '',
      rate:
        rate === '' || isNaN(rateNum) || rateNum < 0
          ? 'Rate must be a non-negative number'
          : '',
    };
    setErrors(newErrors);

    if (!newErrors.item && !newErrors.qty && !newErrors.rate) {
      onSave({item: description.trim(), qty: qtyNum, rate: rateNum});
      onClose();
    }
  };

  const amount = Number(qty) * Number(rate);

  return (
    <Modal
      isVisible={isOpen}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <View style={styles.sheet}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>{item ? 'Edit item' : 'Add item'}</Text>
            {item && (
              <Pressable
                onPress={() => {
                  onDelete();
                  onClose();
                }}
                style={styles.delete}
                accessibilityRole="button"
                accessibilityLabel="Delete item">
                <Icon
                  name="delete-outline"
                  type="material"
                  size={20}
                  color={ui.danger}
                />
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            )}
          </View>

          <FormField
            label="Description"
            placeholder="e.g. Household goods"
            value={description}
            onChangeText={setDescription}
            error={errors.item}
            multiline
          />
          <View style={styles.row}>
            <FormField
              label="Quantity"
              placeholder="0"
              value={qty}
              onChangeText={setQty}
              error={errors.qty}
              inputMode="numeric"
              style={styles.half}
            />
            <FormField
              label="Rate (₹)"
              placeholder="0"
              value={rate}
              onChangeText={setRate}
              error={errors.rate}
              inputMode="decimal"
              style={styles.half}
            />
          </View>

          {amount > 0 && (
            <Text style={styles.amount}>
              Amount:{' '}
              <Text style={styles.amountValue}>{formatRupees(amount)}</Text>
            </Text>
          )}

          <View style={styles.actions}>
            <Button
              title="Cancel"
              type="outline"
              raised={false}
              onPress={onClose}
              containerStyle={styles.actionButton}
              buttonStyle={[styles.button, {borderColor: theme.colors.primary}]}
              titleStyle={{color: theme.colors.primary}}
            />
            <Button
              title={item ? 'Save' : 'Add'}
              raised={false}
              onPress={handleSave}
              color={theme.colors.secondary}
              containerStyle={styles.actionButton}
              buttonStyle={styles.button}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ItemModal;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: ui.card,
    borderRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: ui.text,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: ui.danger,
    fontWeight: '600',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  amount: {
    fontSize: 14,
    color: ui.muted,
    textAlign: 'right',
    marginBottom: 8,
  },
  amountValue: {
    fontWeight: '700',
    color: ui.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    width: 'auto',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
  },
});
