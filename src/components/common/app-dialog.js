import {Button, Icon, Text, useTheme} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from './app-modal';
import {useAppTheme, useStyles} from '../../theme/theme';
import {useTranslation} from 'react-i18next';

const TONE_ICONS = {
  danger: 'error-outline',
  warning: 'warning-amber',
  info: 'info-outline',
};

// Styled replacement for Alert.alert.
// actions: [{label, onPress, variant: 'primary' | 'outline'}]
function AppDialog({visible, tone = 'info', title, message, actions, onClose}) {
  const {t} = useTranslation();
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const {theme} = useTheme();
  const icon = TONE_ICONS[tone];
  const accent =
    tone === 'danger'
      ? ui.danger
      : tone === 'warning'
      ? ui.tertiary
      : theme.colors.primary;
  const buttons = actions ?? [{label: t('common.ok'), onPress: onClose}];

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <View style={styles.dialog} accessibilityRole="alert">
        <View style={[styles.iconCircle, {backgroundColor: accent + '1F'}]}>
          <Icon name={icon} type="material" size={30} color={accent} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {!!message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.actions}>
          {buttons.map(({label, onPress, variant = 'primary'}) => (
            <Button
              key={label}
              title={label}
              raised={false}
              type={variant === 'outline' ? 'outline' : 'solid'}
              color={variant === 'outline' ? undefined : theme.colors.secondary}
              onPress={onPress}
              containerStyle={styles.action}
              buttonStyle={[
                styles.button,
                variant === 'outline' && {borderColor: theme.colors.primary},
              ]}
              titleStyle={
                variant === 'outline'
                  ? [styles.outlineTitle, {color: theme.colors.primary}]
                  : styles.buttonTitle
              }
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

export default AppDialog;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    dialog: {
      backgroundColor: ui.card,
      borderRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 20,
      alignItems: 'center',
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 19,
      fontWeight: '700',
      color: ui.text,
      textAlign: 'center',
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
      color: ui.muted,
      textAlign: 'center',
      marginTop: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      alignSelf: 'stretch',
      marginTop: 24,
    },
    action: {
      flex: 1,
      width: 'auto',
    },
    button: {
      borderRadius: 14,
      paddingVertical: 13,
    },
    buttonTitle: {
      fontWeight: '700',
    },
    outlineTitle: {
      fontWeight: '600',
    },
  });
