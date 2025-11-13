import { ReviewCardProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const ReviewCard = ({ buyer, comment, rating }: ReviewCardProps) => {
  return (
    <div className="bg-white/10 border border-white/15 rounded-xl p-4 md:p-5 my-4 text-white shadow-sm`">
      <div className="flex flex-col gap-2">
        <h3 className="font-Montserrat text-xl text-secondary">
          {buyer?.name}
        </h3>
        <div className="font-Montserrat flex justify-start items-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) =>
              index < rating ? (
                <AiFillStar key={index} className="text-yellow-300" />
              ) : (
                <AiOutlineStar key={index} className="text-white/40" />
              ),
            )}
          </div>
        </div>
        <p className="font-Montserrat text-base md:text-lg text-secondary mt-3 leading-relaxed">
          {comment}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
