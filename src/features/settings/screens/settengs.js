import {Icon, Text, useTheme} from '@rneui/themed';
import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {version} from '../../../../package.json';
import AppDialog from '../../../components/common/app-dialog';
import {useAppTheme, useStyles} from '../../../theme/theme';
import {useAuth} from '../../auth/auth-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {LANGUAGES, setLanguage} from '../../../i18n';

function InfoRow({icon, label, value, last, trailingIcon, onPress, hint}) {
  const {t} = useTranslation();
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
      accessibilityLabel={t('settings.editLabel', {label, value})}>
      {content}
    </Pressable>
  ) : (
    <View style={rowStyle}>{content}</View>
  );
}

const APPEARANCE_OPTIONS = [
  {mode: 'system', label: 'settings.system', icon: 'brightness-auto'},
  {mode: 'light', label: 'settings.light', icon: 'light-mode'},
  {mode: 'dark', label: 'settings.dark', icon: 'dark-mode'},
];

function AppearancePicker() {
  const {t} = useTranslation();
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
            accessibilityLabel={t('settings.appearanceLabel', {
              mode: t(option.label),
            })}>
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
              {t(option.label)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function LanguagePicker() {
  const {t, i18n} = useTranslation();
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.segments} accessibilityRole="radiogroup">
      {LANGUAGES.map(language => {
        const active = i18n.language === language.code;
        return (
          <Pressable
            key={language.code}
            onPress={() => setLanguage(language.code)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="radio"
            accessibilityState={{selected: active}}
            accessibilityLabel={t('settings.languageLabel', {
              language: language.name,
            })}>
            <Text
              style={[
                styles.segmentText,
                styles.languageText,
                active && [styles.segmentTextActive, {color: ui.primary}],
              ]}>
              {language.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Settings() {
  const {t} = useTranslation();
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
            <Text style={styles.company}>{t('common.companyName')}</Text>
            <Text style={styles.muted}>{t('common.companyTagline')}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>{t('settings.account')}</Text>
      <View style={styles.card}>
        <InfoRow
          icon="person-outline"
          label={t('settings.name')}
          value={user?.name}
          trailingIcon="edit"
          onPress={() => navigation.navigate('edit_name')}
        />
        <InfoRow
          icon="phone"
          label={t('settings.mobile')}
          hint={t('settings.mobileHint')}
          value={user?.phone}
          trailingIcon="lock-outline"
        />
        <Pressable
          onPress={() => setConfirmSignOut(true)}
          style={styles.row}
          accessibilityRole="button">
          <Icon name="logout" type="material" size={20} color={ui.danger} />
          <Text style={[styles.rowLabel, styles.signOut]}>
            {t('settings.signOut')}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
      <View style={[styles.card, styles.appearanceCard]}>
        <LanguagePicker />
      </View>

      <Text style={styles.sectionLabel}>{t('settings.appearance')}</Text>
      <View style={[styles.card, styles.appearanceCard]}>
        <AppearancePicker />
        <Text style={styles.appearanceHint}>
          {t('settings.appearanceHint')}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>{t('settings.about')}</Text>
      <View style={styles.card}>
        <InfoRow
          icon="info-outline"
          label={t('settings.appVersion')}
          value={version}
          last
        />
      </View>

      <AppDialog
        visible={confirmSignOut}
        tone="warning"
        title={t('settings.signOutTitle')}
        message={t('settings.signOutMessage')}
        onClose={() => setConfirmSignOut(false)}
        actions={[
          {
            label: t('common.cancel'),
            variant: 'outline',
            onPress: () => setConfirmSignOut(false),
          },
          {
            label: t('settings.signOut'),
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
    languageText: {
      marginLeft: 0,
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
