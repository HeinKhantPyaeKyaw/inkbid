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

  const sellerId = params.id as string;

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
    <div className="bg-primary min-h-screen flex flex-col">
      <NavbarPrimary user={user?.role || 'buyer'} userId={sellerId} />{' '}
      <main className="flex-1">
        <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
          {/* ============= Profile Header ============= */}
          <section className="py-6 md:py-8">
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4 md:p-6">
              <div className="grid grid-cols1 md:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
                <Image
                  src={sellerInfo?.img_url || '/images/images.jpeg'}
                  width={250}
                  height={300}
                  alt="Dummy Seller Profile"
                  className="rounded-lg object-cover w-full h-[200px] md:h-[260px] shadow-lg"
                />
                <div className="text-white">
                  <h1 className="font-Forum text-3xl md:text-4xl leading-tight">
                    {sellerInfo?.name}
                  </h1>
                  {/* TODO: To add Ratings according to the mean of all ratings */}
                  <div className="mt-3 space-y-2 text-[16px] md:text-base leading-relaxed font-Montserrat">
                    <p>
                      <em className="italic font-semibold">Specialization: </em>
                      {sellerInfo?.specialization || 'Not provided yet.'}
                    </p>
                    <p>
                      <em className="italic font-semibold">Writing Style: </em>
                      {sellerInfo?.writingStyle || 'Not provided yet.'}
                    </p>
                    <p>
                      <em className="italic font-semibold">Bio: </em>
                      {sellerInfo?.bio ||
                        'This seller has not added a bio yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* ========== Portfolio Carousel ========= */}
          <section className="py-6 md:py-8">
            {portfolios.length > 0 ? (
              <SellerProfileCarousel data={portfolios} />
            ) : (
              <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-8">
                <p className="text-white text-center font-Forum py-10">
                  This seller hasn&apos;t uploaded any portfolios yet.
                </p>
              </div>
            )}
          </section>
          {/* ========== Rating Summary ========= */}
          <section className="py-6 md:py-8">
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4 md:p-6">
              <RatingReview
                ratings={reviews.map((r) => r.rating)}
                avgRating={avgRating}
                totalReviews={totalReviews}
              />
            </div>
          </section>

          <div className="py-2">
            <hr className="border-white/30" />
          </div>

          {/* ========== Reviews + Write Review ========== */}
          <section className="py-6 md:py-8">
            <div className="rounded-xl ring-1 ring-white/10 bg-white/5 p-4 md:p-6">
              <WritingReviewSection
                userRole={user?.role}
                sellerId={sellerId}
                reviews={reviews}
                setReviews={setReviews}
                setAvgRating={setAvgRating}
                setTotalReviews={setTotalReviews}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;
