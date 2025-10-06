'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { ArticleTableItems } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { useEffect, useState } from 'react';
import { useBuyerDashboardAPI } from './buyer-dashboard.api';

export const useArticles = () => {
  const [articles, setArticles] = useState<ArticleTableItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchArticlesData } = useBuyerDashboardAPI();

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setArticles([]);
      return;
    }

    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchArticlesData();
        setArticles(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch articles: ', err);
        setError('Failed to fetch articles');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [authLoading, user, fetchArticlesData]);

  return { articles, loading, error, setArticles };
};
