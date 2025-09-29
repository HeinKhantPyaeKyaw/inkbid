'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { getSellerReviews } from '@/hooks/review.api';
import {
  GetReviewsResponse,
  ReviewCardProps,
  SellerInfo,
} from '@/interfaces/seller-profile-interface/seller-profile-types';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import RatingReview from './components/RatingReview';
import SellerProfileCarousel from './components/SellerProfileCarousel';
import WritingReviewSection from './components/WritingReviewSection';
import { CarouselData, ReviewCardData } from './model';

// FIXME: To fix seller info as user login. To implement setSellerInfo and setCarouselData.

const SellerProfile = () => {
  const { user } = useAuth();
  const params = useParams();

  console.log('User Role: ', user?.role);

  const sellerId = params.id as string;
  console.log('Seller ID: ', sellerId);

  const [
    sellerInfo,
    {
      /*setSellerInfo*/
    },
  ] = useState<SellerInfo>({
    name: 'Arthur Bills',
    specialization: 'Politics, Macroeconomics, Policy Analysis',
    writingStyle: 'Academical, Data-driven, Clear and Concise',
    bio: `I’m a freelance economic analyst and writer with a Ph.D. in Economics from the University of Chicago. Over the past decade, I’ve focused on macroeconomic trends, income inequality, and international trade policy. My work aims to translate complex data into accessible narratives, combining academic rigor with a clear, grounded voice. I’ve written extensively for both policy think tanks and business publications, with bylines in Bloomberg Economics and MarketWatch. I specialize in data-driven essays and long-form commentary on fiscal policy, labor markets, and global trade dynamics.`,
    imageUrl: '/images/images.jpeg',
  });
  const [
    carouselData,
    {
      /*setCarouselData */
    },
  ] = useState(CarouselData);

  const [reviews, setReviews] = useState<ReviewCardProps[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  // TODO: To implement to load data from backend for Carousel Data with useEffect
  useEffect(() => {
    if (!sellerId) return;

    const fetchReviews = async () => {
      try {
        const data: GetReviewsResponse = await getSellerReviews(sellerId);
        console.log('Fetched Data: ', data);
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      } catch (error) {
        console.error('Failed to fetch reviews: ', error);
      }
    };

    fetchReviews();
  }, [sellerId]);

  return (
    <div className="bg-primary h-full">
      <NavbarPrimary user={user?.role || 'buyer'} userId={sellerId} />{' '}
      {/* ? To fix user here with role or just string */}
      <section>
        <div className="flex items-start">
          <Image
            src={sellerInfo.imageUrl}
            width={250}
            height={300}
            alt="Dummy Seller Profile"
          />
          <div className="py-3 px-4 text-white">
            <div className="">
              <h2 className="font-Forum text-[40px]">{sellerInfo.name}</h2>
              {/* TODO: To add Ratings according to the mean of all ratings */}
            </div>
            <p className="font-Montserrat text-[16px]">
              <em>
                <b>Specialization: </b>
              </em>
              {sellerInfo.specialization}
            </p>
            <p className="font-Montserrat text-[16px]">
              <em>
                <b>Writing Style: </b>
              </em>
              {sellerInfo.writingStyle}
            </p>
            <p className="font-Montserrat text-[16px]">{sellerInfo.bio}</p>
          </div>
        </div>
      </section>
      <SellerProfileCarousel data={carouselData} />
      <RatingReview
        ratings={reviews.map((r) => r.rating)}
        avgRating={avgRating}
        totalReviews={totalReviews}
      />
      <div className="px-5 text-white">
        <hr />
      </div>
      <WritingReviewSection
        userRole={user?.role}
        sellerId={sellerId}
        reviews={reviews}
        setReviews={setReviews}
        setAvgRating={setAvgRating}
        setTotalReviews={setTotalReviews}
      />
    </div>
  );
};

export default SellerProfile;
