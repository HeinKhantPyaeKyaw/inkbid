import { EngagementChart } from "./engagement_chart";

export const EngagementSection = () => {
  return (
    <div className="flex flex-col ">
      <div className="flex bg-tertiary p-4 shadow-lg rounded-lg space-x-4 mt-4 items-center justify-between">
        <div className="flex flex-col w-[500px] ml-12">
          <div className="w-[500px]">
            <p className="font-Forum text-center font-bold text-shadow-xl text-[30px] text-[#313131]">
              Engagement Analysis
            </p>
            <EngagementChart />
          </div>
          <div className="flex ml-10 space-x-4">
            <div className="flex space-x-1 justify-center items-center">
              <div className="w-[20px] h-[20px] bg-muted" />
              <p className="font-Montserrat font-medium"> Bids </p>
            </div>
            <div className="flex space-x-1 justify-center items-center">
              <div className="w-[20px] h-[20px] bg-accent" />
              <p className="font-Montserrat font-medium"> Views </p>
            </div>
            <div className="rounded-full px-2 bg-white font-Montserrat font-bold text-[15px] flex text-center items-center justify-center">
              Weeks
            </div>
            <div className="rounded-full px-2 bg-white font-Montserrat font-bold text-[15px] flex text-center items-center justify-center">
              Months
            </div>
            <div className="rounded-full px-2 bg-white font-Montserrat font-bold text-[15px] flex text-center items-center justify-center">
              Years
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[200px] justify-center">
          <div
            className="border-4 border-white flex text-[#313131] text-center items-center justify-center font-Montserrat rounded-lg font-bold text-[50px] w-[200px] h-[200px]"
            style={{ textShadow: "2px 12px 2px rgba(0, 0, 0, 0.25)" }}
          >
            87
          </div>
          <div className="font-Forum font-bold text-[#313131] text-[30px]">
            Total <br /> Bids Placed
          </div>
        </div>
        <div className="flex flex-col w-[400px] justify-center mr-20">
          <div
            className="border-4 border-white flex text-center text-[#313131] items-center justify-center font-Montserrat rounded-lg font-bold text-[50px] w-[400px] h-[200px]"
            style={{ textShadow: "2px 12px 2px rgba(0, 0, 0, 0.25)" }}
          >
            ฿100,000
          </div>
          <div className="font-Forum font-bold text-[30px] text-[#313131] text-left">
            Total <br />
            Income Generated
          </div>
        </div>
      </div>
    </div>
  );
};
