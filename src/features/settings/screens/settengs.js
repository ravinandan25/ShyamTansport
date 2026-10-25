import {Icon, Text, useTheme} from '@rneui/themed';
import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {version} from '../../../../package.json';
import AppDialog from '../../../components/common/app-dialog';
import {useAppTheme, useStyles} from '../../../theme/theme';
import {useAuth} from '../../auth/auth-context';
import {useNavigation} from '@react-navigation/native';

function InfoRow({icon, label, value, last, trailingIcon, onPress, hint}) {
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const content = (
    <>
      <Icon name={icon} type="material" size={20} color={ui.muted} />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, styles.rowLabelInText]}>{label}</Text>
        {!!hint && <Text style={styles.rowHint}>{hint}</Text>}
      </View>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
      {trailingIcon && (
        <Icon
          name={trailingIcon}
          type="material"
          size={18}
          color={ui.faint}
          style={styles.trailing}
        />
      )}
    </>
  );
  const rowStyle = [styles.row, !last && styles.rowDivider];

  return onPress ? (
    <Pressable
      onPress={onPress}
      style={rowStyle}
      android_ripple={{color: ui.border}}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}. Tap to edit.`}>
      {content}
    </Pressable>
  ) : (
    <View style={rowStyle}>{content}</View>
  );
}

const APPEARANCE_OPTIONS = [
  {mode: 'system', label: 'System', icon: 'brightness-auto'},
  {mode: 'light', label: 'Light', icon: 'light-mode'},
  {mode: 'dark', label: 'Dark', icon: 'dark-mode'},
];

function AppearancePicker() {
  const {ui, mode, setMode} = useAppTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.segments} accessibilityRole="radiogroup">
      {APPEARANCE_OPTIONS.map(option => {
        const active = option.mode === mode;
        return (
          <Pressable
            key={option.mode}
            onPress={() => setMode(option.mode)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="radio"
            accessibilityState={{selected: active}}
            accessibilityLabel={`${option.label} appearance`}>
            <Icon
              name={option.icon}
              type="material"
              size={18}
              color={active ? ui.primary : ui.muted}
            />
            <Text
              style={[
                styles.segmentText,
                active && [styles.segmentTextActive, {color: ui.primary}],
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Settings() {
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const {theme} = useTheme();
  const {user, signOut} = useAuth();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.brand}>
          <View style={[styles.logo, {backgroundColor: theme.colors.primary}]}>
            <Icon
              name="local-shipping"
              type="material"
              color="white"
              size={26}
            />
          </View>
          <View>
            <Text style={styles.company}>Shyam Transport Company</Text>
            <Text style={styles.muted}>
              Transport Contractor & Commission Agent
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.card}>
        <InfoRow
          icon="person-outline"
          label="Name"
          value={user?.name}
          trailingIcon="edit"
          onPress={() => navigation.navigate('edit_name')}
        />
        <InfoRow
          icon="phone"
          label="Mobile"
          hint="Ask the office to change it"
          value={user?.phone}
          trailingIcon="lock-outline"
        />
        <Pressable
          onPress={() => setConfirmSignOut(true)}
          style={styles.row}
          accessibilityRole="button">
          <Icon name="logout" type="material" size={20} color={ui.danger} />
          <Text style={[styles.rowLabel, styles.signOut]}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>APPEARANCE</Text>
      <View style={[styles.card, styles.appearanceCard]}>
        <AppearancePicker />
        <Text style={styles.appearanceHint}>
          System follows your phone’s light or dark setting.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>ABOUT</Text>
      <View style={styles.card}>
        <InfoRow icon="info-outline" label="App version" value={version} last />
      </View>

      <AppDialog
        visible={confirmSignOut}
        tone="warning"
        title="Sign out?"
        message="You’ll need your mobile number and PIN to sign in again."
        onClose={() => setConfirmSignOut(false)}
        actions={[
          {
            label: 'Cancel',
            variant: 'outline',
            onPress: () => setConfirmSignOut(false),
          },
          {
            label: 'Sign out',
            onPress: () => {
              setConfirmSignOut(false);
              signOut();
            },
          },
        ]}
      />
    </ScrollView>
  );
}

export default Settings;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: ui.card,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 4,
      marginBottom: 16,
      ...cardShadow,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    company: {
      fontSize: 17,
      fontWeight: '700',
      color: ui.text,
    },
    muted: {
      fontSize: 13,
      color: ui.muted,
      marginTop: 2,
    },
    appearanceCard: {
      paddingVertical: 12,
    },
    segments: {
      flexDirection: 'row',
      backgroundColor: ui.input,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: ui.border,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      borderRadius: 9,
    },
    segmentActive: {
      backgroundColor: ui.card,
      ...cardShadow,
      elevation: 1,
    },
    segmentText: {
      fontSize: 14,
      fontWeight: '500',
      color: ui.muted,
      marginLeft: 6,
    },
    segmentTextActive: {
      fontWeight: '700',
    },
    appearanceHint: {
      fontSize: 12,
      color: ui.faint,
      marginTop: 8,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      color: ui.faint,
      marginBottom: 8,
      marginLeft: 4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: ui.border,
    },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      color: ui.text,
      marginLeft: 12,
    },
    signOut: {
      color: ui.danger,
      fontWeight: '600',
    },
    rowText: {
      flex: 1,
      marginLeft: 12,
    },
    rowLabelInText: {
      flex: 0,
      marginLeft: 0,
    },
    rowHint: {
      fontSize: 12,
      color: ui.faint,
      marginTop: 1,
    },
    rowValue: {
      fontSize: 15,
      color: ui.muted,
      flexShrink: 1,
      marginLeft: 8,
    },
    trailing: {
      marginLeft: 8,
    },
  });
