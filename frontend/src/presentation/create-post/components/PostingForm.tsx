'use client';

import { AiResults } from '@/interfaces/create-post-interface/create-post-types';
import { useState } from 'react';
import ArticleUpload from './ArticleUpload';
import ImageUpload from './ImageUpload';

const PostingForm = () => {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [minimumBid, setMinimumBid] = useState(''); // ? Should I use number for minimumBid and buyNowPrice
  const [buynowPrice, setBuynowPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [aiResults, setAiResults] = useState<AiResults | null>(null);

  const handleSubmit = () => {
    if (
      !title ||
      !synopsis ||
      !category ||
      !duration ||
      !minimumBid ||
      !articleFile
    ) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    if (!aiResults?.eligible) {
      alert('Article rejected by AI detection. Please revise before posting.');
      return;
    }

    const formData = {
      title,
      synopsis,
      category,
      duration: Number(duration),
      minimumBid: Number(minimumBid),
      buynowPrice: Number(buynowPrice),
      image: imageFile,
      article: articleFile,
    };
    console.log('Final Form Data: ', formData);

    setTitle('');
    setSynopsis('');
    setCategory('');
    setDuration('');
    setMinimumBid('');
    setBuynowPrice('');
    setImageFile(null);
    setArticleFile(null);
    setAiResults(null);
  };

  // TODO: Send formData to backend using fetch or axios later

  return (
    <div className="text-primary px-4 py-2 border-[2px] border-accent">
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="title" className="font-Forum text-[24px]">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#D9D9D9] w-full px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl text-primary"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="synopsis" className="font-Forum text-[24px]">
            Synopsis
          </label>
          <textarea
            name="synopsis"
            rows={5}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="bg-[#D9D9D9] w-full px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl text-primary"
          />
        </div>
        <div className="flex justify-start items-center gap-[180px] mt-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="font-Forum text-2xl">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#D9D9D9] px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl"
            >
              <option value=""></option>
              <option value="business">Business</option>
              <option value="culture">Culture</option>
              <option value="health">Health</option>
              <option value="politics">Politics</option>
              <option value="tech">Tech</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="duration" className="font-Forum text-2xl">
              Duration
            </label>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-[#D9D9D9] w-[56px] px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl"
              />
              <p className="font-Montserrat text-lg">Days</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="minimum_bid" className="font-Forum text-2xl">
              Minimum Bid
            </label>
            <div className="flex items-end gap-2">
              <p className="font-Montserrat text-xl">฿</p>
              <input
                type="number"
                value={minimumBid}
                onChange={(e) => setMinimumBid(e.target.value)}
                className="bg-[#D9D9D9] w-[120px] px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="buy_now" className="font-Forum text-2xl">
              Buy Now
            </label>
            <div className="flex items-end gap-2">
              <p className="font-Montserrat text-xl">฿</p>
              <input
                type="number"
                value={buynowPrice}
                onChange={(e) => setBuynowPrice(e.target.value)}
                className="bg-[#D9D9D9] w-[120px] px-3 py-2 border-transparent rounded-[4px] font-Montserrat text-xl"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end gap-8 mt-8">
          <div className="flex justify-start items-start gap-8 mt-8">
            <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
            <ArticleUpload
              articleFile={articleFile}
              setArticleFile={setArticleFile}
              aiResults={aiResults}
              setAiResults={setAiResults}
            />
          </div>
          <div className="bg-muted p-1 rounded-[6px] w-[100px] text-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-1 border-2 border-[#FFFFFF] rounded-[4px] font-Montserrat font-bold text-white"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostingForm;
