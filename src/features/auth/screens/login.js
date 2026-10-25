import {useNavigation} from '@react-navigation/native';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FormField from '../../../components/common/form-field';
import {cardShadow, ui} from '../../../theme/ui';
import {useAuth} from '../auth-context';
import {normalizePhone} from '../phone';

function Login() {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {signIn} = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const pinRef = useRef(null);

  const handleSubmit = async () => {
    const normalized = normalizePhone(phone);
    const newErrors = {
      phone: !phone.trim()
        ? 'Enter your mobile number'
        : !normalized
        ? 'Enter a valid 10-digit mobile number'
        : undefined,
      pin: !/^\d{4,6}$/.test(pin) ? 'Enter your 4 to 6 digit PIN' : undefined,
    };
    setErrors(newErrors);
    setFormError('');
    if (newErrors.phone || newErrors.pin) {
      return;
    }

    setSubmitting(true);
    try {
      await signIn({phone: normalized, pin});
    } catch (err) {
      setPin('');
      setFormError(
        err?.response
          ? err.response.data?.message ?? 'Could not sign in. Please try again.'
          : 'Could not reach the server. Check your internet connection.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24},
        ]}>
        <View style={[styles.logo, {backgroundColor: theme.colors.primary}]}>
          <Icon name="local-shipping" type="material" color="white" size={30} />
        </View>
        <Text style={styles.title}>Shyam Transport</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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
            label="Mobile number"
            placeholder="10-digit mobile number"
            inputMode="tel"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={16}
            value={phone}
            onChangeText={value => {
              setPhone(value);
              setErrors(prev => ({...prev, phone: undefined}));
            }}
            returnKeyType="next"
            onSubmitEditing={() => pinRef.current?.focus()}
            error={errors.phone}
          />
          <FormField
            ref={pinRef}
            label="PIN"
            placeholder="4 to 6 digits"
            inputMode="numeric"
            secureTextEntry
            maxLength={6}
            value={pin}
            onChangeText={value => {
              setPin(value.replace(/\D/g, ''));
              setErrors(prev => ({...prev, pin: undefined}));
            }}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            error={errors.pin}
          />

          <Pressable
            onPress={() => navigation.navigate('forgot_pin', {phone})}
            style={styles.forgot}
            hitSlop={8}
            accessibilityRole="button">
            <Text style={[styles.forgotText, {color: theme.colors.secondary}]}>
              Forgot PIN?
            </Text>
          </Pressable>

          <Button
            title="Sign in"
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

        <Text style={styles.help}>
          Don’t have a PIN? Ask the office to add your mobile number.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ui.screen,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: ui.text,
  },
  subtitle: {
    fontSize: 15,
    color: ui.muted,
    marginTop: 4,
    marginBottom: 28,
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
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 12,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submit: {
    width: 'auto',
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 14,
  },
  submitTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  help: {
    fontSize: 13,
    color: ui.faint,
    textAlign: 'center',
    marginTop: 20,
  },
});
