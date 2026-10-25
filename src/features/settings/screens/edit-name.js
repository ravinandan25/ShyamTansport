import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import FormField from '../../../components/common/form-field';
import {useStyles} from '../../../theme/theme';
import {useAuth} from '../../auth/auth-context';
import {useTranslation} from 'react-i18next';
import {serverMessage} from '../../../i18n';

const MAX_LENGTH = 100; // StaffMember.name max_length on the server

function EditName() {
  const {t} = useTranslation();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const {user, updateName} = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = name.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      setError(t('editName.enterName'));
      return;
    }
    if (trimmed === user?.name) {
      navigation.goBack();
      return;
    }

    setSaving(true);
    try {
      await updateName(trimmed);
      navigation.goBack();
    } catch (err) {
      setError(
        err?.response
          ? serverMessage(err, 'editName.saveFailed')
          : t('common.serverUnreachable'),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <FormField
            label={t('settings.name')}
            placeholder={t('editName.namePlaceholder')}
            textContentType="name"
            autoCapitalize="words"
            maxLength={MAX_LENGTH}
            value={name}
            onChangeText={value => {
              setName(value);
              setError('');
            }}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            error={error}
          />
          <Text style={styles.hint}>{t('editName.hint')}</Text>

          <Button
            title={t('common.save')}
            color="secondary"
            raised={false}
            loading={saving}
            disabled={saving}
            onPress={handleSave}
            containerStyle={styles.save}
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveTitle}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditName;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    content: {
      padding: 16,
    },
    card: {
      backgroundColor: ui.card,
      borderRadius: 18,
      padding: 16,
      ...cardShadow,
    },
    hint: {
      fontSize: 13,
      lineHeight: 19,
      color: ui.muted,
      marginTop: -4,
      marginBottom: 16,
    },
    save: {
      width: 'auto',
    },
    saveButton: {
      borderRadius: 14,
      paddingVertical: 14,
    },
    saveTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
