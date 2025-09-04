import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api/v1';

export const createPostAPI = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/articles`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: Error | unknown) {
    console.error(
      'Error creating article:',
      axios.isAxiosError(error)
        ? error.response?.data
        : (error as Error).message,
    );
    throw error;
  }
};
