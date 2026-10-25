import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Icon, Text, useTheme} from '@rneui/themed';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import FormField from '../../../components/common/form-field';
import {useAppTheme, useStyles} from '../../../theme/theme';
import {normalizePhone} from '../phone';
import {forgotPinAPI} from '../store/api';
import {useTranslation} from 'react-i18next';
import {serverMessage} from '../../../i18n';

// Without SMS the app can't verify who is asking, so this only sends a request:
// the office sets a new PIN in Django admin and tells the staff member.
function ForgotPin() {
  const {t} = useTranslation();
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const route = useRoute();
  const {theme} = useTheme();
  const [phone, setPhone] = useState(route.params?.phone ?? '');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const normalized = normalizePhone(phone);
    setFormError('');
    if (!normalized) {
      setError(phone.trim() ? t('auth.invalidMobile') : t('auth.enterMobile'));
      return;
    }

    setSubmitting(true);
    try {
      await forgotPinAPI({phone: normalized});
      setSent(true);
    } catch (err) {
      setFormError(
        err?.response?.status === 429
          ? t('auth.tooManyRequests')
          : err?.response
          ? serverMessage(err, 'auth.requestFailed')
          : t('common.serverUnreachable'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.screen, styles.sentScreen]}>
        <View style={[styles.card, styles.sentCard]}>
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: theme.colors.primary + '1F'},
            ]}>
            <Icon
              name="mark-email-read"
              type="material"
              size={32}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.sentTitle}>{t('auth.requestSent')}</Text>
          <Text style={styles.sentText}>{t('auth.requestSentText')}</Text>
          <Button
            title={t('auth.backToSignIn')}
            color="secondary"
            raised={false}
            onPress={() => navigation.goBack()}
            containerStyle={[styles.submit, styles.fullWidth]}
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitTitle}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <Text style={styles.intro}>{t('auth.forgotIntro')}</Text>

        <View style={styles.card}>
          {!!formError && (
            <View style={styles.banner} accessibilityRole="alert">
              <Icon
                name="error-outline"
                type="material"
                size={20}
                color={ui.danger}
              />
              <Text style={styles.bannerText}>{formError}</Text>
            </View>
          )}

          <FormField
            label={t('auth.mobileNumber')}
            placeholder={t('auth.mobilePlaceholder')}
            inputMode="tel"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={16}
            value={phone}
            onChangeText={value => {
              setPhone(value);
              setError('');
            }}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            error={error}
          />

          <Button
            title={t('auth.requestReset')}
            color="secondary"
            raised={false}
            loading={submitting}
            disabled={submitting}
            onPress={handleSubmit}
            containerStyle={styles.submit}
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitTitle}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ForgotPin;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    content: {
      padding: 20,
      paddingTop: 8,
    },
    intro: {
      fontSize: 15,
      lineHeight: 22,
      color: ui.muted,
      marginBottom: 20,
    },
    card: {
      backgroundColor: ui.card,
      borderRadius: 20,
      padding: 20,
      ...cardShadow,
    },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ui.danger + '14',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    bannerText: {
      flex: 1,
      fontSize: 14,
      color: ui.danger,
      marginLeft: 8,
    },
    submit: {
      width: 'auto',
      marginTop: 4,
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    submitButton: {
      borderRadius: 14,
      paddingVertical: 14,
    },
    submitTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    sentScreen: {
      justifyContent: 'center',
      padding: 20,
    },
    sentCard: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    sentTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: ui.text,
    },
    sentText: {
      fontSize: 15,
      lineHeight: 22,
      color: ui.muted,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 24,
    },
  });
