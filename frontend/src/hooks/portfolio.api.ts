import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api/v1/portfolios';

export const getSellerPortfoliosAPI = async (sellerId: string) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${sellerId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching seller portfolios: ', error);
    throw error;
  }
};
