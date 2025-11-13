'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { InventoryTableItems } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { useEffect, useState } from 'react';
import { useBuyerDashboardAPI } from './buyer-dashboard.api';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryTableItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchInventoryData } = useBuyerDashboardAPI();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setInventory([]);
      return;
    }

    const loadInventory = async () => {
      try {
        setLoading(true);
        const data = await fetchInventoryData();
        setInventory(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch inventory data: ', err);
        setError('Failed to fetch inventory data');
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [authLoading, user, fetchInventoryData]);

  return { inventory, loading, error, setInventory };
};
