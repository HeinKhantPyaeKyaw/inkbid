import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg flex justify-between">
      <div className="flex flex-col justify-center mb-4 w-full">
        <p className="text-[#313131] font-Montserrat text-[16px]">{title}</p>
        <div className="text-4xl font-Montserrat font-medium text-[#313131] mt-4 text-center">
          {title === "Total Bids Awaiting Action" ? (
            <span>{value} Bids</span>
          ) : title === "Total Revenue Generated" ? (
            <span>฿{value}</span>
          ) : (
            <span>{value} Articles</span>
          )}
        </div>
      </div>

      <div className="bg-secondary rounded-full p-3 flex items-center justify-center w-[50px] h-[50px]">
        <FontAwesomeIcon icon={icon} className="text-[#313131] text-3xl" />
      </div>
    </div>
  );
};
