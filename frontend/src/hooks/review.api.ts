import {
  GetReviewsResponse,
  ReviewCardProps,
} from '@/interfaces/seller-profile-interface/seller-profile-types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Create Review API
export const createReviewAPI = async (reviewData: {
  sellerId: string;
  rating: number;
  comment: string;
}): Promise<ReviewCardProps> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
      withCredentials: true,
    });
    return response.data.review;
  } catch (error) {
    console.error('Error creating review: ', error);
    throw error;
  }
};

// Get All Seller Reviews
export const getSellerReviews = async (
  sellerId: string,
): Promise<GetReviewsResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/${sellerId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews: ', error);
    throw error;
  }
};
