import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api/v1/seller-profile';

export const getSellerProfileAPI = async (sellerId: string) => {
  const res = await axios.get(`${API_BASE_URL}/${sellerId}`, {
    withCredentials: true,
  });

  return res.data.profile;
};

export const updateSellerProfileAPI = async (data: {
  bio?: string;
  specialization?: string;
  writingStyle?: string;
  img_url?: string;
}) => {
  const res = await axios.put(`${API_BASE_URL}/update`, data, {
    withCredentials: true,
  });
  return res.data.profile;
};
