'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { createPostAPI } from '@/hooks/create-post.api';
import { AiResults } from '@/interfaces/create-post-interface/create-post-types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import ArticleUpload from './ArticleUpload';
import ImageUpload from './ImageUpload';

const PostingForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState<string | number>(1);
  const [minimumBid, setMinimumBid] = useState<string | number>(''); // ? Should I use number for minimumBid and buyNowPrice
  const [buynowPrice, setBuynowPrice] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [aiResults, setAiResults] = useState<AiResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Conversion for duration, minimumBid, buynowPrice
      const parsedDuration = Number(duration);
      const parsedMinimumBid = Number(minimumBid);

      if (
        !title ||
        !synopsis ||
        !category ||
        !duration ||
        !minimumBid ||
        !articleFile
      ) {
        alert('Please fill out all fields before submitting.');
        setIsSubmitting(false);
        return;
      }

      if (!aiResults?.eligible) {
        alert(
          'Article rejected by AI detection. Please revise before posting.',
        );
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('synopsis', synopsis);
      formData.append('category', category);
      formData.append('duration', parsedDuration.toString());
      formData.append('minimumBid', parsedMinimumBid.toString());
      if (buynowPrice) formData.append('buynowPrice', buynowPrice.toString());
      if (imageFile) formData.append('image', imageFile);
      if (articleFile) formData.append('article', articleFile);

      const result = await createPostAPI(formData);

      toast.success('Article created successfully');

      if (user?.id) {
        router.push(`/profile/seller/${user.id}`);
      } else {
        router.push('/login');
      }
      //Reset Form
      setTitle('');
      setSynopsis('');
      setCategory('');
      setDuration(1);
      setMinimumBid(0);
      setBuynowPrice(null);
      setImageFile(null);
      setArticleFile(null);
      setAiResults(null);
    } catch (error) {
      toast.error('Failed to create article. Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPostButtonDisabled =
    !title ||
    !synopsis ||
    !category ||
    !duration ||
    !minimumBid ||
    !articleFile ||
    !aiResults ||
    !aiResults.eligible;

  return (
    <div className="bg-[#f8f6fc] text-primary px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-[2px] border-accent rounded-xl shadow-md space-y-10 overflow-hidden">
      <form action="" onSubmit={(e) => e.preventDefault()}>
        {/* Title & Synopsis Section */}
        <div className="space-y-4">
          <label
            htmlFor="title"
            className="font-Forum font-semibold text-xl sm:text-2xl lg:text-3xl block"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#ECE7F6] w-full px-3 sm:px-4 py-2 border-transparent rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none block"
          />
          <label
            htmlFor="synopsis"
            className="font-Forum font-semibold text-xl sm:text-2xl lg:text-3xl block"
          >
            Synopsis
          </label>
          <textarea
            name="synopsis"
            rows={5}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="bg-[#ECE7F6] w-full px-3 sm:px-4 py-2 border-transparent rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none block"
          />
        </div>

        {/* Category/Duration/Pricing Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 items-end mt-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="font-Forum font-semibold text-lg sm:text-xl lg:text-2xl mb-1"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#ECE7F6] px-3 py-2 rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none"
            >
              <option value=""></option>
              <option value="business">Business</option>
              <option value="culture">Culture</option>
              <option value="health">Health</option>
              <option value="politics">Politics</option>
              <option value="tech">Tech</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="duration"
              className="font-Forum font-semibold text-lg sm:text-xl lg:text-2xl mb-1"
            >
              Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-[#ECE7F6] w-full px-3 py-2 rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none"
              />
              <p className="font-Montserrat text-lg whitespace-nowrap">Days</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="minimum_bid"
              className="font-Forum font-semibold text-lg sm:text-xl lg:text-2xl mb-1"
            >
              Minimum Bid
            </label>
            <div className="flex items-center gap-2">
              <p className="font-Montserrat text-xl">฿</p>
              <input
                type="number"
                min={0}
                value={minimumBid}
                onChange={(e) => setMinimumBid(e.target.value)}
                className="bg-[#ECE7F6] w-full px-3 py-2 rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="buy_now"
              className="font-Forum font-semibold text-lg sm:text-xl lg:text-2xl mb-1"
            >
              Buy Now
            </label>
            <div className="flex items-center gap-2">
              <p className="font-Montserrat text-xl">฿</p>
              <input
                type="number"
                min={0}
                value={buynowPrice ?? ''}
                onChange={(e) => setBuynowPrice(Number(e.target.value))}
                className="bg-[#ECE7F6] w-full px-3 py-2 rounded-md font-Montserrat text-xl text-[#2E2E48] focus:ring-2 focus:ring-[#7A5AF8] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Upload Items Section */}
        <div className="flex flex-col sm:flex-col md:flex-row justify-around items-stretch gap-8 sm:gap-10 lg:gap-12 mt-6 bg-[#fafafa] border border-[#e0e0e0] rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm font-semibold">
          <div className="flex-1 flex flex-col items-center sm:items-start gap-4">
            <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
          </div>

          <div className="hidden sm:block w-[1px] bg-[#e0e0e0]"></div>

          <div className="flex-1 flex flex-col items-center sm:items-start gap-4">
            <ArticleUpload
              articleFile={articleFile}
              setArticleFile={setArticleFile}
              aiResults={aiResults}
              setAiResults={setAiResults}
            />
          </div>
        </div>

        <div className="flex justify-end sm:justify-end pt-6">
          <button
            type="submit"
            disabled={isPostButtonDisabled || isSubmitting}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-2 px-6 sm:px-10 py-2 sm:py-3 border-2 rounded-md font-Montserrat font-semibold transition-all duration-200 shadow-sm ${
              isPostButtonDisabled || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-[#1b00a3] hover:shadow-md hover:translate-y-0.5'
            } text-white text-base sm:text-lg lg:text-xl w-full sm:w-auto`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin text-lg" />
                <span>Posting...</span>
              </div>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default PostingForm;
