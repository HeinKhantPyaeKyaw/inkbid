import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api/v1';

export const createPostAPI = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/articles`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Error creating article:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};
