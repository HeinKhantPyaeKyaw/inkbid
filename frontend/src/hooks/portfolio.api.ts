import axios from 'axios';

export const getSellerPortfoliosAPI = async (sellerId: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/portfolios/${sellerId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching seller portfolios: ', error);
    throw error;
  }
};
