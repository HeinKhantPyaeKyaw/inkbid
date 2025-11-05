'use client';
import { useAuth } from '@/context/auth/AuthContext';
import { useArticles } from '@/hooks/buyer-dashboard-hooks/useArticles';
import { useInventory } from '@/hooks/buyer-dashboard-hooks/useInventory';
import {
  ArticleTableStatus,
  InventoryTableStatus,
} from '@/interfaces/buyer-dashboard-interface/status-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { IoWarning } from 'react-icons/io5';
import { LuFileText, LuInbox } from 'react-icons/lu';
import { MdOutlineInventory2 } from 'react-icons/md';
import { PiGavel } from 'react-icons/pi';
import { SlOptions } from 'react-icons/sl';
import { io } from 'socket.io-client';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import ArticleTable from './components/ArticlesTable';
import InfoCard from './components/InfoCard';
import InventoryTable from './components/InventoryTable';
import SkeletonLoader from './components/SkeletonLoader';

const BuyerDashboard = () => {
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    setArticles,
  } = useArticles();
  const {
    inventory,
    loading: inventoryLoading,
    error: inventoryError,
    setInventory,
  } = useInventory();

  const { user } = useAuth();
  const isLoading = articlesLoading || inventoryLoading;

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE!, {
      withCredentials: true,
    });

    socket.on('connect', () => {});

    socket.on('disconnect', () => {
      console.warn('Disconnected from socket server');
    });

    socket.on('bidUpdate', (update) => {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === update.articleId
            ? { ...article, currentBid: update.amount }
            : article,
        ),
      );

      toast.success(
        `New bid on "${update.title ?? 'an article'}": ฿${update.amount}`,
        { duration: 3000 },
      );
    });

    socket.on('contractStatusUpdate', (data) => {
      setArticles((prev) =>
        prev.map((article) => {
          if (article.id !== data.articleId) return article;

          let newStatus = article.bidStatus;

          if (data.buyerSigned && !data.sellerSigned) {
            newStatus = ArticleTableStatus.WAITING;
          }

          if (data.buyerSigned && data.sellerSigned) {
            newStatus = ArticleTableStatus.PENDING;
          }

          return { ...article, bidStatus: newStatus };
        }),
      );

      if (data.buyerSigned && !data.sellerSigned) {
        toast(`You signed the contract. Waiting for seller's signature`, {
          duration: 4000,
        });
      } else if (data.buyerSigned && data.sellerSigned) {
        toast.success(`Both parties signed! Ready for payment`, {
          duration: 4000,
        });
      }
    });

    return () => {
      socket.off('bidUpdate');
      socket.off('contractStatusUpdate');
      socket.disconnect();
    };
  }, [user, setArticles]);

  /* ------------------------------------------------
            Memoized dashboard summary counts
      ---------------------------------------------- */
  const articlesInBid = useMemo(() => {
    return articles.filter(
      (article) => article.bidStatus === ArticleTableStatus.INPROGRESS,
    ).length;
  }, [articles]);

  const articlesInInventory = useMemo(() => {
    return inventory.length;
  }, [inventory]);

  const bidForAction = useMemo(() => {
    return articles.filter(
      (article) =>
        article.bidStatus === ArticleTableStatus.WON ||
        article.bidStatus === ArticleTableStatus.PENDING,
    ).length;
  }, [articles]);

  const expiredContract = useMemo(() => {
    return inventory.filter(
      (item) => item.contractStatus === InventoryTableStatus.EXPIRED,
    ).length;
  }, [inventory]);

  /* ------------------------------------------------
            Loading & Error Handling
      ---------------------------------------------- */

  if (articlesLoading || inventoryLoading) {
    return (
      <div className="w-full text-center py-10 font-Montserrat text-lg text-gray-500">
        <SkeletonLoader />
      </div>
    );
  }

  if (articlesError || inventoryError) {
    return (
      <div className="w-full text-center py-10 font-Montserrat text-lg text-red-500">
        {articlesError || inventoryError}
      </div>
    );
  }

  const getPluralizedCardTitle = (
    count: number,
    singular: string,
    plural: string,
  ) => {
    return `${count} ${count === 1 ? singular : plural}`;
  };

  /* ------------------------------------------------
            Render Buyer Dashboard
      ---------------------------------------------- */

  return (
    <div className="h-full bg-secondary">
      <NavbarPrimary user={user?.role} userId={user?.id} />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-[36px] px-[48px]"
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className=" py-[36px] px-[48px]"
          >
            {/* ----- Page Header ----- */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-Forum text-primary-font text-5xl">
                Articles
              </h1>
              <p className="font-Montserrat text-primary-font text-lg">
                An overview of all biddings, inventory and analysis.
              </p>
            </motion.div>
            {/* ----- Info Card ----- */}
            <motion.div
              className="mt-5 flex justify-between items-center"
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <InfoCard
                cardTitle={getPluralizedCardTitle(
                  articlesInBid,
                  'Article',
                  'Articles',
                )}
                cardDescription="Total Articles Bid In-Progress"
                icon={PiGavel}
              />
              <InfoCard
                cardTitle={getPluralizedCardTitle(
                  articlesInInventory,
                  'Article',
                  'Articles',
                )}
                cardDescription="Total Articles in Inventory"
                icon={MdOutlineInventory2}
              />
              <InfoCard
                cardTitle={getPluralizedCardTitle(bidForAction, 'Bid', 'Bids')}
                cardDescription="Total Bids Awaiting Action"
                icon={SlOptions}
              />
              <InfoCard
                cardTitle={getPluralizedCardTitle(
                  expiredContract,
                  'Contract',
                  'Contracts',
                )}
                cardDescription="Total Expired Contracts"
                icon={IoWarning}
              />
            </motion.div>
            {/* ---- Article Table ---- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {articles.length > 0 ? (
                <ArticleTable
                  data={articles}
                  setArticlesTableData={setArticles}
                  setInventoryTableData={setInventory}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white mt-4 rounded-2xl pb-6 text-center py-16 flex flex-col items-center justify-center"
                >
                  <LuFileText className="text-6xl text-gray-400 mb-4" />
                  <p className="font-Forum text-2xl text-primary-font mb-1">
                    No Articles Found
                  </p>
                  <p className="font-Montserrat text-gray-500 text-lg max-w-md">
                    You haven’t bid on any articles yet. Start exploring
                    listings to participate in auctions.
                  </p>
                </motion.div>
              )}
            </motion.div>
            <hr className="h-[2px] bg-black border-none w-7xl mx-auto my-8" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {inventory.length > 0 ? (
                <InventoryTable data={inventory} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white mt-4 rounded-2xl pb-6 text-center py-16 flex flex-col items-center justify-center"
                >
                  <LuInbox className="text-6xl text-gray-400 mb-4" />
                  <p className="font-Forum text-2xl text-primary-font mb-1">
                    Your Inventory is Empty
                  </p>
                  <p className="font-Montserrat text-gray-500 text-lg max-w-md">
                    You haven’t purchased any articles yet. Once you win and
                    pay, they’ll appear here.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyerDashboard;
