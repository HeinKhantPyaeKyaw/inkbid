'use client';

import { ImageUploadProps } from '@/interfaces/create-post-interface/create-post-types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImImage } from 'react-icons/im';
import { RxCross2 } from 'react-icons/rx';

const ImageUpload = ({ imageFile, setImageFile }: ImageUploadProps) => {
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const imgUrl = URL.createObjectURL(imageFile);
      setPreviewImgUrl(imgUrl);

      return () => URL.revokeObjectURL(imgUrl);
    } else {
      setPreviewImgUrl(null);
    }
  }, [imageFile]);

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

        <div className="relative w-[250px] h-[180px]">
          {!previewImgUrl ? (
            <label
              htmlFor="image-upload"
              className="cursor-pointer block w-full h-full"
            >
              <Image
                src="/images/gallery-icon.png"
                alt="Upload Image"
                width={120}
                height={100}
                className="object-cover border rounded"
              />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="relative w-full h-full border rounded overflow-hidden">
              <Image
                src={previewImgUrl}
                alt="Uploaded Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImg}
                className="absolute top-1 right-1 bg-black rounded-full p-1"
              >
                <RxCross2 className="text-white text-sm" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
