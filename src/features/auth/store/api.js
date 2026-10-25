import {axiosInstance} from '../../../services/api';

export const loginAPI = async ({phone, pin}) => {
  const response = await axiosInstance.post('api/mobile/auth/login/', {
    phone,
    pin,
  });
  return response.data;
};

export const logoutAPI = async () => {
  await axiosInstance.post('api/mobile/auth/logout/');
};

export const meAPI = async () => {
  const response = await axiosInstance.get('api/mobile/auth/me/');
  return response.data;
};

export const forgotPinAPI = async ({phone}) => {
  const response = await axiosInstance.post('api/mobile/auth/forgot-pin/', {
    phone,
  });
  return response.data;
};

export const updateNameAPI = async name => {
  const response = await axiosInstance.patch('api/mobile/auth/me/', {name});
  return response.data;
};
