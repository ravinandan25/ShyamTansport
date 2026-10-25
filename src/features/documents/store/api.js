import {axiosInstance} from '../../../services/api';

// type: 'quotation' | 'invoice' | undefined (both)
export const fetchDocumentsAPI = async ({
  type,
  search,
  offset = 0,
  limit = 20,
}) => {
  const response = await axiosInstance.get('api/mobile/documents/', {
    params: {type, search: search || undefined, offset, limit},
  });
  return response.data;
};
