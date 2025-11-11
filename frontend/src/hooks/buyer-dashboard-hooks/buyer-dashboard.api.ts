import { useAuth } from '@/context/auth/AuthContext';
import {
  ArticleTableItems,
  InventoryTableItems,
  RawArticle,
  RawInventory,
} from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { ArticleTableStatus } from '@/interfaces/buyer-dashboard-interface/status-types';
import axios from 'axios';
import { useCallback } from 'react';

const STRIPE_API_URL = 'http://localhost:5500/api/v1/payment';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export async function createStripeCheckoutSession(articleId: string) {
  const { data } = await axios.post(
    `${BASE_URL}/payment/create-session`,
    { articleId },
    { withCredentials: true },
  );
  return data as { url: string };
}

const PAYPAL_API_BASE_URL = 'http://localhost:5500/api/v1/paypal';

export const useBuyerDashboardAPI = () => {
  const { user } = useAuth();
  const buyerId = user?.id;

  const fetchArticlesData = useCallback(async (): Promise<
    ArticleTableItems[]
  > => {
    if (!buyerId) return [];
    try {
      const res = await axios.get(`${BASE_URL}/buyer/${buyerId}/articles`, {
        withCredentials: true,
      });

      const mappedArticles: ArticleTableItems[] = res.data.data.map(
        (item: RawArticle) => ({
          id: String(item._id ?? ''),
          title: String(item.title ?? 'Untitled'),
          yourBid: Number(item.yourBid ?? 0),
          currentBid: Number(item.currentBid ?? 0),
          timeRemaining: item.timeRemaining,
          buyerSigned: item.buyerSigned ?? false,
          sellerSigned: item.sellerSigned ?? false,
          bidStatus:
            item.status === 'in_progress'
              ? ArticleTableStatus.INPROGRESS
              : item.status === 'awaiting_contract'
              ? item.buyerSigned && !item.sellerSigned
                ? ArticleTableStatus.WAITING
                : ArticleTableStatus.WON
              : item.status === 'awaiting_payment'
              ? ArticleTableStatus.PENDING
              : ArticleTableStatus.LOST,
          author: {
            name: item.author.name,
          },
        }),
      );

      return mappedArticles;
    } catch (error) {
      console.error('Error fetching articles data: ', error);
      throw error;
    }
  }, [buyerId]);

  const fetchInventoryData = useCallback(async (): Promise<
    InventoryTableItems[]
  > => {
    if (!buyerId) return [];
    try {
      const res = await axios.get(
        `${BASE_URL}/buyer/${buyerId}/completed-articles`,
        { withCredentials: true },
      );

      const mappedInventory: InventoryTableItems[] = res.data.data.map(
        (item: any) => ({
          id: String(item._id ?? ''),
          title: String(item.title ?? 'Untitled'),
          purchasedDate: item.purchasedDate
            ? new Date(item.purchasedDate).toLocaleDateString()
            : '—',
          contractPeriod: String(item.contractPeriod ?? '30 Days'),
          contractStatus: item.contractStatus
            ? item.contractStatus.charAt(0).toUpperCase() +
              item.contractStatus.slice(1).toLowerCase()
            : 'Active',
          contractUrl: item.contractUrl || null,
          articleUrl: item.articleUrl || null,
        }),
      );

      return mappedInventory;
    } catch (error) {
      console.error('Error fetching completed articles: ', error);
      throw error;
    }
  }, [buyerId]);

  // -------------------------Stub Functions for Action Buttons---------------------------

  const buyerSignContractAPI = async (articleId: string) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/contracts/${articleId}/sign`,
        {},
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error signing buyer contract: ', error);
      throw error;
    }
  };

  const proceedPaymentAPI = async (articleId: string) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/buyer/${buyerId}/articles/${articleId}/payment`,
        {},
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error processing payment: ', error);
      throw error;
    }
  };

  // ------------------------- PayPal Sandbox API ---------------------------
  const createPayPalOrderAPI = async (amount: number, currency = 'USD') => {
    try {
      const res = await axios.post(
        `${BASE_URL}/paypal/create-order`,
        { amount, currency },
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  };

  const capturePayPalOrderAPI = async (orderId: string, articleId: string) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/paypal/capture-order/${orderId}`,
        { articleId },
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  };

  const downloadContractAPI = async (fileUrl?: string) => {
    try {
      if (!fileUrl) throw new Error('No contract URL provided');
      window.open(fileUrl, '_blank');
      return { success: true };
    } catch (error) {
      console.error('Error opening contract file:', error);
      throw error;
    }
  };

  const downloadArticleAPI = async (fileUrl?: string) => {
    try {
      if (!fileUrl) throw new Error('No article URL provided');
      window.open(fileUrl, '_blank');
      return { success: true };
    } catch (error) {
      console.error('Error opening article file:', error);
      throw error;
    }
  };

  return {
    fetchArticlesData,
    fetchInventoryData,
    buyerSignContractAPI,
    proceedPaymentAPI,
    downloadContractAPI,
    downloadArticleAPI,
    createPayPalOrderAPI,
    capturePayPalOrderAPI,
  };
};
