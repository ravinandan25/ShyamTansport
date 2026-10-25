import {Icon, Text, useTheme} from '@rneui/themed';
import React, {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {ui} from '../../theme/ui';

// Labelled text input. Pass onPress instead of onChangeText to make it a
// read-only field that opens a picker (e.g. a date).
function FormField({
  label,
  error,
  icon,
  onPress,
  multiline,
  style,
  ref,
  ...inputProps
}) {
  const {theme} = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? ui.danger
    : focused
    ? theme.colors.secondary
    : ui.border;

  const box = (
    <View style={[styles.box, {borderColor}, multiline && styles.boxMultiline]}>
      <TextInput
        {...inputProps}
        ref={ref}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor={ui.faint}
        multiline={multiline}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        onFocus={e => {
          setFocused(true);
          inputProps.onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          inputProps.onBlur?.(e);
        }}
      />
      {icon && <Icon name={icon} type="material" size={20} color={ui.muted} />}
    </View>
  );

  return (
    <View style={[styles.field, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}>
          {box}
        </Pressable>
      ) : (
        box
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export default FormField;

const styles = StyleSheet.create({
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: ui.muted,
    marginBottom: 6,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ui.input,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  boxMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: ui.text,
    paddingVertical: 10,
  },
  inputMultiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 12,
    color: ui.danger,
    marginTop: 4,
  },
});
