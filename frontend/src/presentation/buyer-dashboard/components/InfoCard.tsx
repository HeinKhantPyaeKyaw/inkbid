import { InfoCardProps } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';

const InfoCard = ({
  cardTitle,
  cardDescription,
  icon: Icon,
}: InfoCardProps) => {
  return (
    <div className="font-Montserrat flex justify-between items-start w-[360px] h-[120px] bg-white py-3 px-5 rounded-2xl">
      <div className="w-full flex flex-col justify-start items-start gap-4">
        <p className="text-lg text-primary-font">{cardDescription}</p>
        <h2 className="text-4xl text-primary-font">{cardTitle}</h2>
      </div>
      <div className="w-[42px] h-full">
        <div className="bg-secondary inline-flex justify-center items-center rounded-full p-2">
          <Icon className="w-7 h-7 text-primary-font" />
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
