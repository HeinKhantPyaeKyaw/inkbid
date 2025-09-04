import { ReviewCardProps } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

// FIXME: To add ID for user and Date to be reactive.

const ReviewCard = ({ name, review, rating }: ReviewCardProps) => {
  return (
    <div className="bg-muted py-3 px-4 rounded-xl my-4">
      <h3 className="font-Montserrat text-xl text-secondary">{name}</h3>
      <div className="font-Montserrat flex justify-start items-center gap-3">
        <div className="flex">
          {[
            Array.from({ length: 5 }).map((_, index) =>
              index < rating ? (
                <AiFillStar key={index} className="text-white" />
              ) : (
                <AiOutlineStar key={index} className="text-white" />
              ),
            ),
          ]}
        </div>
        <p className="text-sm">3 Months ago</p>
      </div>
      <p className="font-Montserrat text-xl text-secondary mt-2">{review}</p>
    </div>
  );
};

export default ReviewCard;
