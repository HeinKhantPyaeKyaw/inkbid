'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { getSellerPortfoliosAPI } from '@/hooks/portfolio.api';
import { getSellerReviews } from '@/hooks/review.api';
import { getUserProfileAPI } from '@/hooks/userProfile.api';
import {
  GetReviewsResponse,
  ReviewCardProps,
  SellerInfo,
  SellerPortfolioCarouselProps,
} from '@/interfaces/seller-profile-interface/seller-profile-types';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import RatingReview from './components/RatingReview';
import SellerProfileCarousel from './components/SellerPortfoliosCarousel';
import WritingReviewSection from './components/WritingReviewSection';
import { CarouselData, ReviewCardData } from './model';

const SellerProfile = () => {
  const { user } = useAuth();
  const params = useParams();

  console.log('User Role: ', user?.role);

  const sellerId = params.id as string;
  console.log('Seller ID: ', sellerId);

  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [
    carouselData,
    {
      /*setCarouselData */
    },
  ] = useState(CarouselData);

  const [portfolios, setPortfolios] = useState<SellerPortfolioCarouselProps[]>(
    [],
  );

  const [reviews, setReviews] = useState<ReviewCardProps[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  //  ------------------ Fetch Seller Profile info --------------------
  useEffect(() => {
    if (!sellerId) return;

    const fetchSellerProfile = async () => {
      try {
        const sellerProfile = await getUserProfileAPI(sellerId);
        console.log('Seller Profile: ', sellerProfile);

        setSellerInfo(sellerProfile);
      } catch (error) {
        console.error('Failed to fetch seller profile: ', error);
      }
    };
    fetchSellerProfile();
  }, [sellerId]);

  //  ------------------ Fetch Seller Portfolios --------------------
  useEffect(() => {
    if (!sellerId) return;

    const fetchPortfolios = async () => {
      try {
        const data = await getSellerPortfoliosAPI(sellerId);
        console.log('Fetch Portfolios: ', data);
        setPortfolios(data);
      } catch (error) {
        console.error('Failed to fetch portfolios: ', error);
        setPortfolios([]);
      }
    };

    fetchPortfolios();
  }, [sellerId]);

  //  ------------------ Fetch Seller Reviews --------------------
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
            src={sellerInfo?.img_url || '/images/images.jpeg'}
            width={250}
            height={300}
            alt="Dummy Seller Profile"
          />
          <div className="py-3 px-4 text-white">
            <div className="">
              <h2 className="font-Forum text-[40px]">{sellerInfo?.name}</h2>
              {/* TODO: To add Ratings according to the mean of all ratings */}
            </div>
            <p className="font-Montserrat text-[16px]">
              <em>
                <b>Specialization: </b>
              </em>
              {sellerInfo?.specialization || 'Not provided yet.'}
            </p>
            <p className="font-Montserrat text-[16px]">
              <em>
                <b>Writing Style: </b>
              </em>
              {sellerInfo?.writingStyle || 'Not provided yet.'}
            </p>
            <p className="font-Montserrat text-[16px]">
              <em>
                <b>Bio: </b>
              </em>
              {sellerInfo?.bio || 'This seller has not added a bio yet.'}
            </p>
          </div>
        </div>
      </section>
      <section>
        {portfolios.length > 0 ? (
          <SellerProfileCarousel data={portfolios} />
        ) : (
          <p className="text-white text-center font-Forum py-10">
            This seller hasn&apos;t uploaded any portfolios yet.
          </p>
        )}
      </section>
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
