import {axiosInstance} from '../../../services/api';

export const createQuotationAPI = async data => {
  try {
    console.log('FROM API', data);

    const response = await axiosInstance.post(
      'api/mobile/create-quotation/',
      data,
    );

    return response.data;
  } catch (error) {
    console.log('API ERROR:', error?.response?.data || error.message);
    throw error;
  }
};

export const createInvoiceAPI = async data => {
  try {
    console.log('FROM API', data);

    const response = await axiosInstance.post(
      'api/mobile/create-invoice/',
      data,
    );

    return response.data;
  } catch (error) {
    console.log('API ERROR:', error?.response?.data || error.message);
    throw error;
  }
};
