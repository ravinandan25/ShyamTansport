import {useNavigation} from '@react-navigation/native';
import {Icon, Text, useTheme} from '@rneui/themed';
import React, {useEffect} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {storage} from '../../../../index';
import {useAppTheme, useStyles} from '../../../theme/theme';

function ActionCard({icon, title, subtitle, color, onPress}) {
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{color: `${color}33`}}
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={title}>
      <View style={[styles.iconCircle, {backgroundColor: `${color}26`}]}>
        <Icon name={icon} type="material" color={color} size={26} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" type="material" color={ui.faint} size={26} />
    </Pressable>
  );
}

function Home() {
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const {theme} = useTheme();

  useEffect(() => {
    const initial_count = storage.getInt('invoice_number');
    if (initial_count == null) {
      storage.setInt('invoice_number', 0);
    }
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: ui.screen}}
      contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.logo, {backgroundColor: theme.colors.primary}]}>
          <Icon name="local-shipping" type="material" color="white" size={28} />
        </View>
        <Text style={styles.company}>Shyam Transport</Text>
        <Text style={styles.tagline}>Quotations and invoices on the go</Text>
      </View>

      <Text style={styles.sectionLabel}>CREATE</Text>
      <ActionCard
        icon="request-quote"
        title="Quotation"
        subtitle="Estimate for a new move"
        color={theme.colors.secondary}
        onPress={() => navigation.navigate('quote', {is_billing: false})}
      />
      <ActionCard
        icon="receipt-long"
        title="Billing"
        subtitle="Invoice for a completed move"
        color={theme.colors.primary}
        onPress={() => navigation.navigate('quote', {is_billing: true})}
      />

      <Text style={styles.sectionLabel}>RECORDS</Text>
      <ActionCard
        icon="folder-open"
        title="Documents"
        subtitle="View and share past quotations and invoices"
        color={theme.colors.tertiary}
        onPress={() => navigation.navigate('documents')}
      />

      <Text style={styles.sectionLabel}>MORE</Text>
      <ActionCard
        icon="settings"
        title="Settings"
        subtitle="App preferences"
        color={ui.muted}
        onPress={() => navigation.navigate('settings')}
      />
    </ScrollView>
  );
}

export default Home;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 72,
      paddingBottom: 32,
    },
    header: {
      marginBottom: 36,
    },
    logo: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    company: {
      fontSize: 30,
      fontWeight: '700',
      color: ui.text,
    },
    tagline: {
      fontSize: 15,
      color: ui.muted,
      marginTop: 4,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      color: ui.faint,
      marginTop: 8,
      marginBottom: 10,
      marginLeft: 4,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: ui.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: ui.text,
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 4},
    },
    cardPressed: {
      opacity: 0.85,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    cardText: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: ui.text,
    },
    cardSubtitle: {
      fontSize: 13,
      color: ui.muted,
      marginTop: 2,
    },
  });
