import { IoWarning } from 'react-icons/io5';
import { MdOutlineInventory2 } from 'react-icons/md';
import { PiGavel } from 'react-icons/pi';
import { SlOptions } from 'react-icons/sl';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import InfoCard from './components/InfoCard';

const BuyerDashboard = () => {
  return (
    <div className="h-dvh bg-secondary">
      <NavbarPrimary />
      <div className=" pt-[36px] px-[48px]">
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
            cardTitle="4 Articles"
            cardDescription="Total Articles Bid In-Progress"
            icon={PiGavel}
          />
          <InfoCard
            cardTitle="14 Articles"
            cardDescription="Total Articles in Inventory"
            icon={MdOutlineInventory2}
          />
          <InfoCard
            cardTitle="1 Bid"
            cardDescription="Total Bids Awaiting Action"
            icon={SlOptions}
          />
          <InfoCard
            cardTitle="1 Contract"
            cardDescription="Total Expired Contracts"
            icon={IoWarning}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
