import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Icon, Text, useTheme} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import AppDialog from '../../components/common/app-dialog';
import FormField from '../../components/common/form-field';
import ItemModal from '../../components/quote/item-modal';
import ItemRow from '../../components/quote/item-row';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme, useStyles} from '../../theme/theme';
import {formatRupees} from '../../utils/currency';
import {createInvoiceAPI, createQuotationAPI} from './store/api';

// Accepts 10-digit Indian mobile numbers, optionally written with +91, 91 or 0.
// Returns the 10 digits, or null when the number is not valid.
const normalizePhone = value => {
  const digits = value
    .replace(/[\s-]/g, '')
    .replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

const validate = ({customerName, phone, address, tableData, tax}) => {
  const errors = {};
  if (!customerName.trim()) {
    errors.customerName = 'Enter the customer’s name';
  }
  if (!phone.trim()) {
    errors.phone = 'Enter the customer’s mobile number';
  } else if (!normalizePhone(phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }
  if (!address.trim()) {
    errors.address = 'Enter the pickup or delivery address';
  }
  if (tableData.length === 0) {
    errors.items = 'Add at least one item';
  }
  const taxNum = Number(tax || 0);
  if (isNaN(taxNum) || taxNum < 0) {
    errors.tax = 'Enter a valid amount';
  }
  return errors;
};

function Section({title, action, children, onLayout}) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.card} onLayout={onLayout}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

function Quote() {
  const {ui, isDark} = useAppTheme();
  const styles = useStyles(makeStyles);
  const route = useRoute();
  const {is_billing} = route.params;
  const navigation = useNavigation();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const [tableData, setTableData] = useState([]);
  const [tax, setTax] = useState('0');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loadingDate, setLoadingDate] = useState(
    moment().format('DD MMM, YYYY'),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  // undefined = closed, null = adding a new item, otherwise the item being edited.
  const [editingItem, setEditingItem] = useState(undefined);
  const nextId = useRef(1);
  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState(null);
  const scrollRef = useRef(null);
  const sectionY = useRef({});

  // Wraps a setter so editing a field clears its error.
  const onChange = (setter, field) => value => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const subtotal = tableData.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0,
  );
  const total = subtotal + (parseFloat(tax) || 0);

  const handleConfirm = date => {
    setLoadingDate(moment(date).format('DD MMM, YYYY'));
    setDatePickerVisibility(false);
  };

  const saveItem = values => {
    if (editingItem) {
      setTableData(rows =>
        rows.map(row =>
          row.id === editingItem.id ? {...row, ...values} : row,
        ),
      );
    } else {
      setTableData(rows => [...rows, {id: nextId.current++, ...values}]);
      setErrors(prev => ({...prev, items: undefined}));
    }
  };

  const deleteItem = () => {
    setTableData(rows => rows.filter(row => row.id !== editingItem.id));
  };

  const generatePayload = async () => {
    const newErrors = validate({customerName, phone, address, tableData, tax});
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstSection =
        newErrors.customerName || newErrors.phone || newErrors.address
          ? 'customer'
          : newErrors.items
          ? 'items'
          : 'summary';
      scrollRef.current?.scrollTo({
        y: Math.max(0, (sectionY.current[firstSection] ?? 0) - 12),
        animated: true,
      });
      return;
    }
    const customerPhone = normalizePhone(phone);

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_address: address.trim(),
        customer_phone: customerPhone,
        loading_date: moment(loadingDate, 'DD MMM, YYYY').format('YYYY-MM-DD'),
        tax: parseFloat(tax || 0),
        items: tableData.map(item => ({
          description: item.item,
          quantity: item.qty,
          rate: item.rate,
        })),
      };

      const res = is_billing
        ? await createInvoiceAPI(payload)
        : await createQuotationAPI(payload);

      navigation.navigate('generated_pdf', {
        table: tableData,
        // Use the server's total and date so this PDF matches the one Django stores.
        total: res.total,
        date: res.date,
        loadingDate: loadingDate,
        customerName: customerName.trim(),
        phone: customerPhone,
        address: address.trim(),
        tax: tax,
        is_billing: is_billing,
        number: is_billing ? res.invoice_number : res?.quotation_number,
      });
    } catch (err) {
      console.log(err);
      setDialog({
        tone: 'danger',
        title: `Couldn’t create the ${is_billing ? 'invoice' : 'quotation'}`,
        message: err?.response
          ? err.response.data?.message ??
            'The server could not process the request. Please try again.'
          : 'Check your internet connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>
          <Section
            title="Customer"
            onLayout={e =>
              (sectionY.current.customer = e.nativeEvent.layout.y)
            }>
            <FormField
              label="Name"
              placeholder="Customer name"
              textContentType="name"
              value={customerName}
              onChangeText={onChange(setCustomerName, 'customerName')}
              error={errors.customerName}
            />
            <FormField
              label="Phone"
              placeholder="10-digit mobile number"
              textContentType="telephoneNumber"
              inputMode="tel"
              maxLength={16}
              value={phone}
              onChangeText={onChange(setPhone, 'phone')}
              error={errors.phone}
            />
            <FormField
              label="Address"
              placeholder="Pickup or delivery address"
              multiline
              value={address}
              onChangeText={onChange(setAddress, 'address')}
              error={errors.address}
            />
            <FormField
              label="Loading date"
              value={loadingDate}
              icon="calendar-today"
              onPress={() => setDatePickerVisibility(true)}
              style={styles.lastField}
            />
          </Section>

          <Section
            title={`Items${tableData.length ? ` (${tableData.length})` : ''}`}
            onLayout={e => (sectionY.current.items = e.nativeEvent.layout.y)}
            action={
              <Pressable
                onPress={() => setEditingItem(null)}
                style={[
                  styles.addButton,
                  {backgroundColor: theme.colors.secondary + '26'},
                ]}
                accessibilityRole="button"
                accessibilityLabel="Add item">
                <Icon
                  name="add"
                  type="material"
                  size={18}
                  color={theme.colors.secondary}
                />
                <Text style={[styles.addText, {color: theme.colors.secondary}]}>
                  Add item
                </Text>
              </Pressable>
            }>
            {tableData.length === 0 ? (
              <>
                <Pressable
                  onPress={() => setEditingItem(null)}
                  style={[styles.empty, errors.items && styles.emptyError]}>
                  <Icon
                    name="inventory-2"
                    type="material"
                    size={32}
                    color={errors.items ? ui.danger : ui.faint}
                  />
                  <Text style={styles.emptyText}>No items yet</Text>
                  <Text style={styles.emptyHint}>
                    Tap “Add item” to add goods or services
                  </Text>
                </Pressable>
                {errors.items && (
                  <Text style={styles.errorText}>{errors.items}</Text>
                )}
              </>
            ) : (
              tableData.map((row, index) => (
                <ItemRow
                  key={row.id}
                  index={index}
                  row={row}
                  onPress={() => setEditingItem(row)}
                />
              ))
            )}
          </Section>

          <Section
            title="Summary"
            onLayout={e => (sectionY.current.summary = e.nativeEvent.layout.y)}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatRupees(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST / Tax (₹)</Text>
              <FormField
                inputMode="decimal"
                value={tax}
                onChangeText={onChange(setTax, 'tax')}
                error={errors.tax}
                onFocus={() => tax === '0' && setTax('')}
                onBlur={() => tax === '' && setTax('0')}
                style={styles.taxField}
              />
            </View>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, {paddingBottom: 18 + insets.bottom}]}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatRupees(total)}</Text>
        </View>
        <Button
          title={is_billing ? 'Generate Bill' : 'Generate Quotation'}
          color="secondary"
          raised={false}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={generatePayload}
          containerStyle={styles.generate}
          buttonStyle={styles.generateButton}
          titleStyle={styles.generateTitle}
        />
      </View>

      <AppDialog
        visible={dialog !== null}
        tone={dialog?.tone}
        title={dialog?.title}
        message={dialog?.message}
        onClose={() => setDialog(null)}
        actions={[
          {
            label: 'Close',
            variant: 'outline',
            onPress: () => setDialog(null),
          },
          {
            label: 'Try again',
            onPress: () => {
              setDialog(null);
              generatePayload();
            },
          },
        ]}
      />
      <ItemModal
        isOpen={editingItem !== undefined}
        item={editingItem}
        onClose={() => setEditingItem(undefined)}
        onSave={saveItem}
        onDelete={deleteItem}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        isDarkModeEnabled={isDark}
        date={moment(loadingDate, 'DD MMM, YYYY').toDate()}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
}

export default Quote;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    flex: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      backgroundColor: ui.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      ...cardShadow,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: ui.text,
    },
    lastField: {
      marginBottom: 0,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    addText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: 24,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: ui.border,
      borderRadius: 14,
    },
    emptyError: {
      borderColor: ui.danger,
    },
    errorText: {
      fontSize: 12,
      color: ui.danger,
      marginTop: 6,
    },
    emptyText: {
      fontSize: 15,
      fontWeight: '600',
      color: ui.muted,
      marginTop: 8,
    },
    emptyHint: {
      fontSize: 13,
      color: ui.faint,
      marginTop: 2,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
    },
    summaryLabel: {
      fontSize: 15,
      color: ui.muted,
    },
    summaryValue: {
      fontSize: 15,
      fontWeight: '600',
      color: ui.text,
    },
    taxField: {
      width: 120,
      marginBottom: 0,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ui.card,
      paddingHorizontal: 20,
      paddingTop: 14,

      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...cardShadow,
      elevation: 12,
    },
    totalLabel: {
      fontSize: 13,
      color: ui.muted,
    },
    totalValue: {
      fontSize: 22,
      fontWeight: '700',
      color: ui.text,
    },
    generate: {
      flex: 1,
      width: 'auto',
      marginLeft: 16,
    },
    generateButton: {
      borderRadius: 14,
      paddingVertical: 14,
    },
    generateTitle: {
      fontSize: 15,
      fontWeight: '700',
    },
  });
