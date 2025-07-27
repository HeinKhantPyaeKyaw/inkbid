'use client';
import { useState } from 'react';

import { IoWarning } from 'react-icons/io5';
import { MdOutlineInventory2 } from 'react-icons/md';
import { PiGavel } from 'react-icons/pi';
import { SlOptions } from 'react-icons/sl';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import ArticleTable from './components/ArticlesTable';
import InfoCard from './components/InfoCard';
import InventoryTable from './components/InventoryTable';
import { ArticleTableData, InventoryTableData } from './model';

const BuyerDashboard = () => {
  const [articlesInBid, setArticlesInBid] = useState(4);
  const [articlesInInventory, setArticlesInInventory] = useState(14);
  const [bidForAction, setBidForAction] = useState(1);
  const [contract, setContract] = useState(3);
  const [articlesTableData, setArticlesTableData] = useState(ArticleTableData);
  const [inventoryTableData, setInventoryTableData] =
    useState(InventoryTableData);

  const getPluralizedCardTitle = (
    count: number,
    singular: string,
    plural: string,
  ) => {
    return `${count} ${count === 1 ? singular : plural}`;
  };

  return (
    <div className="h-full bg-secondary">
      <NavbarPrimary />
      <div className=" py-[36px] px-[48px]">
        {/* ----- Page Header ----- */}
        <div className="w-full">
          <h1 className="font-Forum text-primary-font text-5xl">Articles</h1>
          <p className="font-Montserrat text-primary-font text-lg">
            An overview of all biddings, inventory and analysis.
          </p>
        </div>
        {/* ----- Info Card ----- */}
        <div className="mt-5 flex justify-between items-center">
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
              contract,
              'Contract',
              'Contracts',
            )}
            cardDescription="Total Expired Contracts"
            icon={IoWarning}
          />
        </div>
        {/* ---- Article Table ---- */}
        <ArticleTable data={articlesTableData} />
        <hr className="h-[2px] bg-black border-none w-7xl mx-auto my-8" />
        <InventoryTable data={inventoryTableData} />
      </div>
    </div>
  );
};

export default BuyerDashboard;
