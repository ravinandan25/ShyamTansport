import {useNavigation} from '@react-navigation/native';
import {Button, Text, useTheme} from '@rneui/themed';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {generatePDF} from 'react-native-html-to-pdf';

import {useEffect, useState} from 'react';
import Pdf from 'react-native-pdf';

import moment from 'moment';
import {storage} from '../../../..';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Icon} from '@rneui/themed';
import {
  amountInWords,
  escapeHtml,
  formatNumber,
} from '../../../utils/pdf-format';
import pdfBackground from '../../../assets/images/pdf-background';
import signatureStamp from '../../../assets/images/signature-stamp';
import openSansFont from '../../../assets/fonts/open-sans';
import rupeeFont from '../../../assets/fonts/rupee';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppDialog from '../../../components/common/app-dialog';
import {useStyles} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';

function GeneratedPdf({route}) {
  const {t} = useTranslation();
  const styles = useStyles(makeStyles);
  const {
    table,
    total,
    loadingDate,
    customerName,
    phone,
    address,
    tax,
    date,
    is_billing,
    number,
  } = route.params;
  const navigation = useNavigation();
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const [url, setUrl] = useState('');
  const [shareError, setShareError] = useState(false);

  const totalInWords = amountInWords(total);
  const tableString = table
    .map((item, index) => {
      return `<tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.item)}</td>
          <td class="text-center align-middle" >${formatNumber(item.qty)}</td>
          <td>${formatNumber(item.rate)}</td>
          <td>${formatNumber(item.qty * item.rate)}</td>
        </tr>`;
    })
    .join('');

  let options = {
    html: `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
      /* Fonts */
      :root {
        --body-font: 'Open Sans', sans-serif;
      }
    
      /* Bootstrap Override */
      body {
        --bs-font-sans-serif: 'Open Sans', sans-serif;
        --bs-body-font-family: var(--bs-font-sans-serif);
        --bs-body-font-size: 1rem;
        --bs-body-font-weight: 400;
        --bs-body-line-height: 2;
        --bs-body-color: #303030;
        --bs-border-color: #eeeeee;
      }
    </style>
    <style>
      @font-face {
        font-family: 'Open Sans';
        src: url(${openSansFont}) format('woff2');
        font-weight: 300 800;
      }
      /* Open Sans has no rupee sign; take it from Noto Sans so every PDF draws the same glyph. */
      @font-face {
        font-family: 'Open Sans';
        src: url(${rupeeFont}) format('woff2');
        font-weight: 300 800;
        unicode-range: U+20B9;
      }
      body {
        font-family: 'Open Sans', sans-serif;
      }
    </style>
    
    <div class="px-5 position-relative" style=" overflow: hidden; ">
        <!-- Background image with opacity -->
        <div style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url('${pdfBackground}');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.8;  /* Adjust opacity here */
          z-index: 0;">
        </div>
        <!-- Content layer -->
        <div class="pt-5 position-relative" style="z-index: 1;">
          <div class="d-flex justify-content-between align-items-start">
            <div class="pt-5">
              <h1>Shyam Transport Company</h1>
              <p style="padding:0px; margin:0px;"><span class="fw-bold" style="font-weight: 600;">Mumbai: </span>Room No. Cen-844 Part III Ganesh Murti Nagar, Near Navy Nagar <br> Colaba, Mumbai -400 005</p>
              <p style="padding:0px; margin:0px;"><span class="fw-bold" style="font-weight: 600;">Radheshyam: </span></p>
              <p><span class="fw-bold" style="font-weight: 600;">Mob:</span> +91 9869555680, +91 8108031062 <br><span class="fw-bold">Email:</span> radeshaym588@gmail.com</p>
              <p style="padding:0px; margin:0px;"><span class="fw-bold" style="font-weight: 600;">Delhi: </span>8749/1,ff,db Gupta road Paharganj New Delhi 110055 </p>
              <p style="padding:0px; margin:0px;"><span class="fw-bold" style="font-weight: 600;">Amit Kumar: </span></p>
              <p><span class="fw-bold" style="font-weight: 600;">Mob:</span> +91 9910874881, +91 8076740363 </p>
              <p>(CDA Recognized, Government Registered <br> Transport Contractor & Commission Agent)</p>
            </div>
            <div>
              <h5 class="fw-bold">Regd. No. 12612400000003969464</h5>
              <h5 class="fw-bold">GSTIN. 27ALWPD2794B1ZW</h5>
            </div>
          </div>
        </div>

    </div>

    <div class="d-md-flex justify-content-between align-items-start mt-3">
    <div class=" px-5  pt-0" >
      <div>
        <h4 class="display-6 fw-bold">${
          is_billing ? 'Invoice' : 'Quotation'
        }</h4>
      </div>
      <div class="mt-5 mt-md-0">
        <ul class="list-unstyled">
        <li><span class="fw-semibold">${
          is_billing ? 'Invoice' : 'Quotation'
        } Number</span>: <span  style="font-weight: 600;">${number}</span></li> 
          <li><span class="fw-semibold">Date:</span> <span style="font-weight: 600;">${moment(
            date,
          ).format('DD MMM, YYYY')}</span></li>
          <li><span class="fw-semibold">Date of Loading:</span> <span style="font-weight: 600;">${loadingDate}</span></li>
        </ul>
      </div>
    </div>
    
    <div class="d-md-flex justify-content-between px-5">
      <div>
         <div>
        <h4 class="display-6 fw-bold">${
          is_billing ? 'Invoice' : 'Quotation'
        } To</h4>
      </div>
        <h6>${escapeHtml(customerName)}</h6>
        <ul class="list-unstyled">
          <li style="max-width:200px; ">${escapeHtml(address)}</li>
          ${phone && `<li><h6>Phone: +91 ${escapeHtml(phone)} </h6></li>`}
        </ul>
      </div>
    </div>
    </div>
    
    <div class="px-5">
      <table class="table table-striped border my-5">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Rate</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          ${tableString}
    
          ${
            tax != 0
              ? `<tr>
                <th></th>
                <td></td>
                <td></td>
                <td class="fs-5 fw-bold" style="font-weight: 300;">Tax/GST</td>
                <td class="fs-5 fw-bold" style="font-weight: 300;">&#8377; ${formatNumber(
                  tax,
                )}</td>
              </tr>`
              : ''
          }
    
    
          <tr>
            <th></th>
            <td></td>
            <td></td>
            <td class="fs-5 fw-bold" style="font-weight: 600;">Grand-Total</td>
            <td class="fs-5 fw-bold" style="font-weight: 600;">&#8377; ${formatNumber(
              total,
            )}</td>
          </tr>
          
        </tbody>
      </table>
     
<div style="position:relative">
            
            <p class=" fw-bold" style="font-weight: 600; display:flex; flex-direction:row; justify-content: end; position:absolute; right:0;
            top:-40 ">${totalInWords} only</p>
        </div>
    </div>
    <div class="px-5">
      <div class="row mt-4 mb-3">
          <div class="col-md-6 mt-5 mt-md-0  ">
             <h5 class="fw-bold mb-2">Bank Details:</h5>
             <div>
             <p>
             Shyam Transport Company <br>
             A/c: 6168061094 <br>
             IFSC: IDBI000N123 <br>
             Branch: Navy Nagar Colaba Mumbai - 05
             </p>
             </div>
          </div>
          <div class="col-md-6 mt-5 mt-md-0 d-md-flex  flex-column align-items-end justify-content-center">
            <div class="d-md-flex justify-content-center flex-column align-items-center" >
              <img src="${signatureStamp}" style="height:180px" />
             <div style="height:2px;width:200px; background-color:black"></div>
            
              <p class="mt-2">Authorized Signatory</p>
            </div>
          </div>
      </div>

    </div>
    
    <div class="px-5">
      <div class="row mt-4 mb-3">
        <div class="col-md-12 mt-5 mt-md-0">
          <h5 class="fw-bold mb-3">Terms & Conditions</h5>
          <ol>
            <li>Payment: 95% advance balance on unloading.</li>
            <li>Transit Insurance: 3% per lakh for household goods, 6% for all-risk cover, and 1.5% for cars.</li>
            <li>GST: As applicable.</li>
            <li>Storage: ₹4000 per month in Delhi, Mumbai, or Kochi. Local cartage/loading/unloading charges: ₹8000 extra.</li>
            <li>Electrician/carpenter/labor union charges and unpacking charges are actual if applicable.</li>
            <li>Transit Time: 4 to 5 days for household goods and 6 to 8 days for cars, either by car carrier or driven down. Truck halting charges: ₹3000 per day.</li>
            <li>Please ensure that you have expensive items like gold jewelry and cash with you before starting the packing process.</li>
            <li>Quote applicable for 15 days only.</li>
          </ol>
        </div>
      </div>
    
      <div class="text-center mt-3">
        <p><span class="fw-semibold">OUR ASSOCIATE BRANCHES:</span> DELHI, KOCHI, VIZAG, GOA, KARWAR, CHENNAI, JAMANAGAR</p>
        <p class="text-muted"><span class="fw-semibold"></span> Thank you for allowing us the opportunity to work with you on this relocation</p>
      </div>
    </div>
    
    <div class="px-5">
      <div class="container mt-3 border-top"></div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    `,
    fileName: is_billing ? `${number}` : `${number}`,
    directory: 'Downloads',
  };

  const createPDF = async () => {
    let file = await generatePDF(options);

    console.log(file);
    setUrl(file.filePath);
  };
  const handleShare = async () => {
    try {
      // react-native-share can only hand out files from the cache (or public
      // Download) folder, so share a copy instead of the app-private original.
      const sharePath = `${RNFS.CachesDirectoryPath}/${number}.pdf`;
      if (await RNFS.exists(sharePath)) {
        await RNFS.unlink(sharePath);
      }
      await RNFS.copyFile(url, sharePath);
      await Share.open({
        url: `file://${sharePath}`,
        type: 'application/pdf',
        filename: `${number}.pdf`,
        failOnCancel: false,
      });
    } catch (error) {
      console.log('Error sharing:', error);
      setShareError(true);
    }
  };

  useEffect(() => {
    storage.setInt('invoice_number', storage.getInt('invoice_number') + 1);
    createPDF();
    // Run once on mount: bumps the invoice number and generates the PDF a single time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {url === '' ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
          <Text style={styles.loadingText}>{t('pdf.preparing')}</Text>
        </View>
      ) : (
        <Pdf
          source={{uri: url}}
          onError={error => {
            console.log(error);
          }}
          style={styles.pdf}
        />
      )}
      <View style={[styles.footer, {paddingBottom: 18 + insets.bottom}]}>
        <Button
          title={t('common.done')}
          type="outline"
          raised={false}
          onPress={() => navigation.popToTop()}
          containerStyle={styles.footerButton}
          buttonStyle={[styles.button, {borderColor: theme.colors.primary}]}
          titleStyle={{color: theme.colors.primary}}
        />
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
          disabled={url === ''}
          onPress={handleShare}
          containerStyle={[styles.footerButton, styles.shareButton]}
          buttonStyle={styles.button}
        />
      </View>
      <AppDialog
        visible={shareError}
        tone="danger"
        title={t('pdf.shareFailed')}
        message={t('common.pleaseTryAgain')}
        onClose={() => setShareError(false)}
      />
    </View>
  );
}

export default GeneratedPdf;

const makeStyles = ({ui, cardShadow}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 15,
      color: ui.muted,
    },
    pdf: {
      flex: 1,
      backgroundColor: ui.screen,
    },
    footer: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: ui.card,
      paddingHorizontal: 20,
      paddingTop: 14,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...cardShadow,
      elevation: 12,
    },
    footerButton: {
      flex: 1,
      width: 'auto',
    },
    shareButton: {
      flex: 2,
    },
    button: {
      borderRadius: 14,
      paddingVertical: 14,
    },
    shareIcon: {
      marginRight: 8,
    },
  });
