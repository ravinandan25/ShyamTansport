import {Button} from '@rneui/themed';
import {View, StyleSheet, Dimensions} from 'react-native';
import {generatePDF} from 'react-native-html-to-pdf';

import {useEffect, useState} from 'react';
import Pdf from 'react-native-pdf';

import moment from 'moment';
import {storage} from '../../../..';

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Icon} from '@rneui/themed';

function GeneratedPdf({route}) {
  const {
    table,
    total,
    loadingDate,
    customerName,
    phone,
    address,
    tax,
    tableString,
  } = route.params;

  // const exampleImageUri = Image.resolveAssetSource(background_image).uri;

  const [url, setUrl] = useState('');

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
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
    
    <div class="px-5 position-relative" style=" overflow: hidden; ">
        <!-- Background image with opacity -->
        <div style="
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url('https://shyamtransportbucket.s3.ap-south-1.amazonaws.com/team/img1.jpg');
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

    
    <div class="d-md-flex justify-content-between align-items-center px-5  pt-4">
      <div>
        <h2 class="display-6 fw-bold">Quotation</h2>
      </div>
      <div class="mt-5 mt-md-0">
        <ul class="list-unstyled">
          <li><span class="fw-semibold">Date:</span> <span style="font-weight: 600;">${moment().format(
            'DD MMM, YYYY',
          )}</span></li>
          <li><span class="fw-semibold">Date of Loading:</span> <span style="font-weight: 600;">${loadingDate}</span></li>
        </ul>
      </div>
    </div>
    
    <div class="d-md-flex justify-content-between px-5">
      <div>
        <p class="fw-bold fs-5">Quotation To</p>
        <h6>${customerName}</h6>
        <ul class="list-unstyled">
          <li style="max-width:200px; ">${address}</li>
          ${phone && `<li><h6>Phone: +91 ${phone} </h6></li>`}
        </ul>
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
                <td class="fs-5 fw-bold" style="font-weight: 300;">&#8377; ${tax}</td>
              </tr>`
              : ''
          }
    
    
          <tr>
            <th></th>
            <td></td>
            <td></td>
            <td class="fs-5 fw-bold" style="font-weight: 600;">Grand-Total</td>
            <td class="fs-5 fw-bold" style="font-weight: 600;">&#8377; ${total}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="px-5">
      <div class="row mt-4 mb-5">
        <div class="col-md-12 mt-5 mt-md-0">
          <h5 class="fw-bold mb-4">Terms & Conditions</h5>
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
    
      <div class="text-center mt-5">
        <p><span class="fw-semibold">OUR ASSOCIATE BRANCHES:</span> DELHI, KOCHI, VIZAG, GOA, KARWAR, CHENNAI, JAMANAGAR</p>
        <p class="text-muted"><span class="fw-semibold"></span> Thank you for allowing us the opportunity to work with you on this relocation</p>
      </div>
    </div>
    
    <div class="px-5">
      <div class="container mt-5 border-top"></div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
    <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
    `,
    fileName: `quotation-${moment().format('DD-MM-YYYY-HH-mm-ss')}`,
    directory: 'Downloads',
  };

  const createPDF = async () => {
    let file = await generatePDF(options);

    console.log(file);
    setUrl(file.filePath);
  };
  const handelShare = async () => {
    try {
      const pdfBase64 = await RNFS.readFile(url, 'base64');

      const shareOptions = {
        url: `data:application/pdf;base64,${pdfBase64}`,
        filename: 'Quotations',
      };

      const result = await Share.open(shareOptions);

      if (result.app) {
        console.log(`Shared via ${result.app}`);
      } else {
        console.log('Shared successfully');
      }
    } catch (error) {
      console.error('Error sharing:', error);
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
      {url !== '' && (
        <Pdf
          source={{
            uri: url,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      )}
      <View style={styles.button_container}>
        <Button
          icon={
            <Icon style={{marginLeft: 5}} name="share" size={25} color="#fff" />
          }
          iconRight
          title="Share"
          color="secondary"
          containerStyle={styles.btn}
          onPress={handelShare}></Button>
      </View>
    </View>
  );
}

export default GeneratedPdf;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',

    height: Dimensions.get('window').height - 50,
  },
  pdf: {
    backgroundColor: 'white',
    flex: 1,
    width: Dimensions.get('window').width,
    paddingTop: 30,
  },
  button_container: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
});
