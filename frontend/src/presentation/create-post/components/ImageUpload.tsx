'use client';

import { ImageUploadProps } from '@/interfaces/create-post-interface/create-post-types';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

const ImageUpload = ({ imageFile, setImageFile }: ImageUploadProps) => {
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const imgUrl = URL.createObjectURL(imageFile);
      setPreviewImgUrl(imgUrl);

      return () => URL.revokeObjectURL(imgUrl);
    } else {
      setPreviewImgUrl(null);
    }
  }, [imageFile]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) setImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveImg = () => {
    setImageFile(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 items-start">
        <label className="font-Forum text-primary text-2xl">Image</label>

        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.02 }}
          className={`relative w-[250px] h-[180px] rounded-xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
            previewImgUrl
              ? 'border border-transparent bg-transparent'
              : isDragging
              ? 'border-2 border-dashed border-[#7A5AF8] bg-[#f3edff]'
              : 'border-2 border-dashed border-[#ccc] bg-[#F6F6F8] hover:border-[#B39DDB]'
          }`}
        >
          {!previewImgUrl ? (
            <label
              htmlFor="image-upload"
              className="cursor-pointer w-[120px] h-[100px]"
            >
              <Image
                src="/images/gallery-icon.png"
                alt="Upload Image"
                width={80}
                height={80}
                className="object-cover. opacity-70 hover:opacity-100 transition-all"
              />
              <p className="text-sm font-Montserrat text-gray-500">
                Drag & Drop or Click
              </p>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <AnimatePresence>
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full border rounded overflow-hidden"
              >
                <Image
                  src={previewImgUrl}
                  alt="Uploaded Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImg}
                  className="absolute top-1 right-1 bg-black rounded-full p-1 hover:bg-opacity-90 transition"
                >
                  <RxCross2 className="text-white text-sm" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload;
