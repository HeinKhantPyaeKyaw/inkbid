import { InfoCardProps } from '@/interfaces/buyer-dashboard-interface/buyer-dashboard-types';
import { motion } from 'framer-motion';

const InfoCard = ({
  cardTitle,
  cardDescription,
  icon: Icon,
}: InfoCardProps) => {
  return (
    <motion.div
      className="font-Montserrat flex justify-between items-start w-[360px] h-[120px] bg-white py-3 px-5 rounded-2xl"
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 250, damping: 15 }}
      role="region"
      aria-label={`${cardDescription}: ${cardTitle}`}
      tabIndex={0}
    >
      <div className="w-full flex flex-col justify-start items-start gap-4">
        <p className="text-lg text-primary-font">{cardDescription}</p>
        <h2 className="text-4xl text-primary-font">{cardTitle}</h2>
      </div>
      <div className="w-[42px] h-full">
        <div className="bg-secondary inline-flex justify-center items-center rounded-full p-2">
          <Icon className="w-7 h-7 text-primary-font" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
};

export default InfoCard;
