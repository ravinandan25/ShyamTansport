import {axiosInstance} from '../../../services/api';

export const PAGE_SIZE = 20;

// type: 'quotation' | 'invoice' | undefined (both)
// cursor: next_cursor from the previous page (undefined for the first page)
// signal: AbortSignal to cancel a request that is no longer needed
export const fetchDocumentsAPI = async ({type, search, cursor, signal}) => {
  const response = await axiosInstance.get('api/mobile/documents/', {
    params: {
      type,
      search: search || undefined,
      cursor,
      limit: PAGE_SIZE,
    },
    signal,
  });
  return response.data;
};
