import { useAuth } from '@/context/auth/AuthContext';
import {
  ArticleTableItems,
  InventoryTableItems,
  RawArticle,
  RawInventory,
} from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import axios from 'axios';
import { useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5500/api/v1/buyer';

export const useBuyerDashboardAPI = () => {
  const { user } = useAuth();
  const buyerId = user?.id;

  // if (!buyerId) {
  //   console.warn('No buyer logged in - API calls will be skipped.');
  // }

  const fetchArticlesData = useCallback(async (): Promise<
    ArticleTableItems[]
  > => {
    if (!buyerId) return [];
    try {
      const res = await axios.get(`${API_BASE_URL}/${buyerId}/articles`, {
        withCredentials: true,
      });

      const mappedArticles: ArticleTableItems[] = res.data.data.map(
        (item: RawArticle) => ({
          id: String(item._id ?? ''),
          title: String(item.title ?? 'Untitled'),
          yourBid: Number(item.yourBid ?? 0),
          currentBid: Number(item.currentBid ?? 0),
          timeRemaining: item.timeRemaining,
          bidStatus:
            item.status === 'in_progress'
              ? 'In Progress'
              : item.status === 'awaiting_contract'
              ? 'Won'
              : item.status === 'awaiting_payment'
              ? 'Pending'
              : 'Lost',
          author: {
            name: item.author.name,
          },
        }),
      );

      console.log('Articles in ArticleTable: ', res.data.data);
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
      const res = await axios.get(`${API_BASE_URL}/${buyerId}/inventory`, {
        withCredentials: true,
      });

      console.log('Items in Inventory: ', res.data.data);

      const mappedInventory: InventoryTableItems[] = res.data.data.map(
        (item: RawInventory) => ({
          id: String(item._id ?? ''),
          title: String(item.article.title ?? 'Untitled'),
          purchasedDate: item.purchasedDate
            ? new Date(item.purchasedDate).toLocaleDateString()
            : '—',
          contractPeriod: String(item.contractPeriod ?? '30 Days'),
          contractStatus: item.contractStatus
            ? item.contractStatus.charAt(0).toUpperCase() +
              item.contractStatus.slice(1).toLowerCase()
            : 'Active',
        }),
      );

      return mappedInventory;
    } catch (error) {
      console.error('Error fetching inventory data: ', error);
      throw error;
    }
  }, [buyerId]);

  // -------------------------Stub Functions for Action Buttons---------------------------

  //Mark contract as signed for a given article
  const buyerSignContractAPI = async (articleId: string) => {
    try {
      const res = await axios.patch(
        `http://localhost:5500/api/v1/contracts/${articleId}/sign`,
        {},
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error signing buyer contract: ', error);
      throw error;
    }
  };

  // Proceed with payment for a given article
  const proceedPaymentAPI = async (articleId: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/${buyerId}/articles/${articleId}/payment`,
        {},
        { withCredentials: true },
      );
      return res.data;
    } catch (error) {
      console.error('Error processing payment: ', error);
      throw error;
    }
  };

  // Download contract for an inventory item
  const downloadContractAPI = async (inventoryId: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/${buyerId}/inventory/${inventoryId}/contract`,
        { withCredentials: true },
      );

      const fileUrl = res.data.url;
      if (!fileUrl) throw new Error('File URL missing from response');

      window.open(fileUrl, '_blank');

      return res.data;
    } catch (error) {
      console.error('Error downloading contract: ', error);
      throw error;
    }
  };

  // Download article for an inventory item
  const downloadArticleAPI = async (inventoryId: string) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/${buyerId}/inventory/${inventoryId}/article`,
        { withCredentials: true },
      );

      const fileUrl = res.data.url;
      if (!fileUrl) throw new Error('File URL missing from response');

      window.open(fileUrl, '_blank');

      return res.data;
    } catch (error) {
      console.error('Error downloading article: ', error);
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
  };
};

// const signContractAPI = async (articleId: string) => {
//   try {
//     const res = await axios.post(
//       `${API_BASE_URL}/${buyerId}/articles/${articleId}/contract`,
//       {},
//       { withCredentials: true },
//     );
//     return res.data;
//   } catch (error) {
//     console.error('Error signing contract: ', error);
//     throw error;
//   }
// };
