import {Button, Icon, Text, useTheme} from '@rneui/themed';
import moment from 'moment';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppDialog from '../../../components/common/app-dialog';
import {useAppTheme, useStyles} from '../../../theme/theme';
import {BASE_URL} from '../../../utils/constants';
import {formatRupees} from '../../../utils/currency';
import {useTranslation} from 'react-i18next';

// Shows the PDF the server stored for a quotation or invoice.
function DocumentViewer({route}) {
  const {t} = useTranslation();
  const {ui} = useAppTheme();
  const styles = useStyles(makeStyles);
  const {doc} = route.params;
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const pdfUrl = doc.pdf_url ? BASE_URL + doc.pdf_url.replace(/^\//, '') : null;
  // loading | ready | error
  const [status, setStatus] = useState(pdfUrl ? 'loading' : 'error');
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const path = `${RNFS.CachesDirectoryPath}/${doc.number}.pdf`;
      const result = await RNFS.downloadFile({fromUrl: pdfUrl, toFile: path})
        .promise;
      if (result.statusCode !== 200) {
        throw new Error(`Download failed with ${result.statusCode}`);
      }
      await Share.open({
        url: `file://${path}`,
        type: 'application/pdf',
        filename: `${doc.number}.pdf`,
        failOnCancel: false,
      });
    } catch (err) {
      console.log(err);
      setShareError(true);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.customer} numberOfLines={1}>
          {doc.customer_name}
        </Text>
        <Text style={styles.meta}>
          {moment(doc.date).format('DD MMM YYYY')}
          {'  ·  '}
          {formatRupees(doc.total)}
        </Text>
        {!!doc.created_by && (
          <Text style={styles.meta}>
            {t('pdf.createdBy', {name: doc.created_by})}
          </Text>
        )}
      </View>

      <View style={styles.pdfArea}>
        {pdfUrl && (
          <Pdf
            source={{uri: pdfUrl, cache: true}}
            trustAllCerts={false}
            onLoadComplete={() => setStatus('ready')}
            onError={err => {
              console.log(err);
              setStatus('error');
            }}
            style={styles.pdf}
          />
        )}
        {status === 'loading' && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={theme.colors.secondary} />
            <Text style={styles.overlayText}>{t('pdf.loading')}</Text>
          </View>
        )}
        {status === 'error' && (
          <View style={styles.overlay}>
            <Icon name="cloud-off" type="material" size={40} color={ui.faint} />
            <Text style={styles.overlayTitle}>{t('pdf.loadFailed')}</Text>
            <Text style={styles.overlayText}>
              {t('common.checkConnection')}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.footer, {paddingBottom: 18 + insets.bottom}]}>
        <Button
          icon={
            <Icon
              name="share"
              type="material"
              size={20}
              color="#fff"
              style={styles.shareIcon}
            />
          }
          title={t('common.share')}
          color="secondary"
          raised={false}
          loading={sharing}
          disabled={sharing || status !== 'ready'}
          onPress={handleShare}
          containerStyle={styles.shareButton}
          buttonStyle={styles.button}
        />
      </View>

      <AppDialog
        visible={shareError}
        tone="danger"
        title={t('pdf.shareFailed')}
        message={t('common.checkConnection')}
        onClose={() => setShareError(false)}
      />
    </View>
  );
}

export default DocumentViewer;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    summary: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    customer: {
      fontSize: 18,
      fontWeight: '700',
      color: ui.text,
    },
    meta: {
      fontSize: 14,
      color: ui.muted,
      marginTop: 2,
    },
    pdfArea: {
      flex: 1,
    },
    pdf: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: ui.screen,
      paddingHorizontal: 32,
    },
    overlayTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: ui.text,
      marginTop: 12,
    },
    overlayText: {
      fontSize: 14,
      color: ui.muted,
      textAlign: 'center',
      marginTop: 8,
    },
    footer: {
      backgroundColor: ui.card,
      paddingHorizontal: 20,
      paddingTop: 14,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...cardShadow,
      elevation: 12,
    },
    shareButton: {
      width: 'auto',
    },
    button: {
      borderRadius: 14,
      paddingVertical: 14,
    },
    shareIcon: {
      marginRight: 8,
    },
  });
