import {Button, Text} from '@rneui/themed';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import background_image from '../../../assets/images/img1.png';
import logo_image from '../../../assets/images/logo.png';
import RenderHtml from 'react-native-render-html';
import HTMLView from 'react-native-htmlview';
import {useEffect, useState} from 'react';
import Pdf from 'react-native-pdf';
import * as OpenAnything from 'react-native-openanything';
import moment from 'moment';

function GeneratedPdf({route}) {
  const {table, total, loadingDate, customerName, phone, address} =
    route.params;

  const exampleImageUri = Image.resolveAssetSource(background_image).uri;
  const logoImageUri = Image.resolveAssetSource(logo_image).uri;
  const [url, setUrl] = useState('');

  let options = {
    html: `
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
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

      
              <div class="">
                  <div class="px-5" style="background-image:url('${exampleImageUri}'); background-repeat: no-repeat; background-size: cover;  max-height:350px;">
                      <div class="py-5" style="background-color:transparent;">
                          <div class="d-flex justify-content-between align-items-start " style="background-color:transparent;">
                              <div class="py-5 mt-4" >
                                   <h1>Shaym Transport Company</h1>
                                   <p>Room No. Cen-844 Part III Ganesh Murti Nagar, Near Navy Nagar <br> Colaba, Mumbai -400 005</p>
                                   <p><span class="fw-bold mb-4" style="font-weight: 600;">Mob:</span> +91 9869555680, +91 8108031062 <br><Span class="fw-bold mb-4" style="font-weight: 600;">Email:</span> radeshaym588@gmail.com <p>
                                      <p>(CRDA Recognized, Government Registered <br> Transport Contractor & Commission Agent)</p>
                               </div>
                              <div >
                                  <h5 class="fw-bold">Regd. No. 12612400000003969464</h5>  
                                  <h5 class="fw-bold">GSTIN. 27ALWPD2794B1ZW</h5>                                 
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div class="d-md-flex justify-content-between align-items-center px-5 my-2">
                      <!-- <p class="mb-2">Specialist In: All types of house hold goods and Car/Bike fro Indian Navy, Air Force, Coast Guard, All Defense and Bank officers.</p> -->
                      <div class="">
                          <h2 class="display-6 fw-bold">Invoice</h2>
                          <!-- <p class="m-0"><span class="fw-semibold">Invoice No:</span> 12345</p> -->
                      </div>

                      <div class="mt-5 mt-md-0">
                          <ul class="list-unstyled">
                              <li><span class="fw-semibold">Date of Booking:</span> <span style="font-weight: 600;">${moment().format(
                                'DD MMM, YYYY',
                              )}</span></li>
                              <li><span class="fw-semibold">Date of Loading:</span> <span style="font-weight: 600;">${loadingDate}</span></li>  
                          </ul>
                      </div>
                  </div>


                  <div class="d-md-flex justify-content-between px-5">
                      <div>
                          <p class="fw-bold fs-5">Invoice To</p>
                          <h6>${customerName}</h6>
                          <ul class="list-unstyled">
                              <li>${address}</li>
                              <!-- <li>info@xyzcompany.com</li> -->
                              <!-- <li>123 Main Street</li> -->
                              <li><h6>Phone: +91 ${phone} </h6></li>
                          </ul>
                          
                      </div>
                      <div class="mt-5 mt-md-0">
                          <p class="fw-bold fs-5">Invoice From</p>
                          <h6>William Peter</h6>
                          <ul class="list-unstyled">
                              <li>ABC Company</li>
                              <li>info@abccompany.com</li>
                              <li>456 Main Street</li>
                              <li><h6>Phone: +91 9402167183</h6></li>
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
                          ${table.map(item => {
                            console.log(item);
                            return `<tr>
                                <th>${item.id}</th>
                                <td>${item.item}</td>
                                <td>${item.qty}</td>
                                <td>${item.rate}</td>
                                <td>${item.qty * item.rate}</td>
                              </tr>`;
                          })}
                             
                             
                              
                             
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

                          <div class="col-md-6">
                              <h5 class="fw-bold mb-4">Payment Info</h5>
                              <ul class="list-unstyled">
                                  <li><span class="fw-semibold">Account No: </span> 102 3345 56938</li>
                                  <li><span class="fw-semibold">Account Name: </span> William Peter</li>
                                  <li><span class="fw-semibold">Branch Name: </span> XYZ </li>

                              </ul>
                          </div>

                          <div class="col-md-6 mt-5 mt-md-0">
                              <h5 class="fw-bold mb-4 ">Terms &amp; Conditions</h5>
                              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam reiciendis quasi ullam
                                  delectus
                                  iusto ipsum veritatis accusantium quis, praesentium pariatur molestiae ducimus voluptate
                                  perspiciatis.</p>
                          </div>

                      </div>

                      <div class="text-center mt-5">
                          <p class="text-muted"><span class="fw-semibold">NOTICE: </span> A finance charge of 1.5% will be
                              made on
                              unpaid balances after 30 days.</p>
                      </div>
                  </div>

                  <div class="px-5">
                      <div class="container mt-5 border-top">
                          <!-- <div class="row mt-4">
                              <div class="col-md-6 copyright">
                                  <p>© 2024 Invoice. All Rights Reserved.</p>
                              </div>
                              <div class="col-md-6 text-md-end">
                                  <p>Free HTML Template by: <a href="https://templatesjungle.com/" target="_blank"
                                          class="text-decoration-none text-black-50">
                                          TemplatesJungle</a> </p>
                              </div>
                          </div> -->
                      </div>
                  </div>
              </div>
        
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
          <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>            
          `,
    fileName: 'quote',
    directory: 'Downloads',
  };

  const createPDF = async () => {
    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file);
    setUrl(file.filePath);
    // alert(file.filePath);
  };

  useEffect(() => {
    createPDF();
    // console.log(table);
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
          title="Share"
          color="secondary"
          containerStyle={styles.btn}
          onPress={() => {
            // console.log(tableData);
          }}></Button>
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
