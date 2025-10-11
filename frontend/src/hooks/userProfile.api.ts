import { SellerProfileUpdateData } from '@/interfaces/seller-profile-interface/seller-profile-types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api/v1/seller-profile';

export const getUserProfileAPI = async (userId: string) => {
  const res = await axios.get(`${API_BASE_URL}/${userId}`, {
    withCredentials: true,
  });

  return res.data.profile;
};

export const updateUserProfileAPI = async (
  data: SellerProfileUpdateData | FormData,
) => {
  try {
    let payload: SellerProfileUpdateData | FormData = data;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (
      data instanceof FormData ||
      (data as SellerProfileUpdateData).profileImage
    ) {
      const formData = data instanceof FormData ? data : new FormData();
      // If it's not already FormData, append fields manually
      if (!(data instanceof FormData)) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob);
          }
        });
      }

      payload = formData;
      headers = {};
    }

    const res = await axios.put(`${API_BASE_URL}/update`, payload, {
      withCredentials: true,
      headers,
    });
    return res.data.profile;
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};
