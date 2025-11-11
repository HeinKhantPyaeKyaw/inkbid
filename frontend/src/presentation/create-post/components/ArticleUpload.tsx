'use client';

import {
  AiResults,
  ArticleUploadProps,
} from '@/interfaces/create-post-interface/create-post-types';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';

const ArticleUpload = ({
  articleFile,
  setArticleFile,
  aiResults,
  setAiResults,
}: ArticleUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ human: number; ai: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setArticleFile(file);
    } else {
      setError('Only PDF files are allowed');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const uploadFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    setArticleFile(file);
    setLoading(true);
    setAiResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AI_BASE}/predict`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('AI server error');
      }

      const data = await response.json();

      const result: AiResults = {
        ai: data.scores.ai,
        human: data.scores.human,
        eligible: data.eligible,
      };

      setAiResults(result);
    } catch (err) {
      setError('Failed to analyze article. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResult(null);
    if (file) uploadFile(file);
  };

  const handleRemoveFile = () => {
    setArticleFile(null);
    setFileName(null);
    setAiResults(null);
  };

  useEffect(() => {
    if (!articleFile) {
      setFileName(null);
      setLoading(false);
      setError(null);
    }
  }, [articleFile]);

  return (
    <div>
      <div className="w-full flex flex-col gap-2 items-start">
        <label
          htmlFor="article-upload"
          className="font-Forum text-primary text-xl sm:text-2xl"
        >
          Article (.pdfonly)
        </label>

        <motion.div
          className={`relative w-full sm:w-[280px] lg:w-[300px] aspect-[4/3] rounded-xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden text-center ${
            fileName
              ? 'border border-transparent'
              : isDragging
              ? 'border-2 border-dashed border-[#7A5AF8] bg-[#f3edff]'
              : 'border-2 border-dashed border-[#ccc] bg-[#F6F6F8] hover:border-[#B39DDB'
          }`}
        >
          {!fileName ? (
            <label className="cursor-pointer w-[120px] h-[100px]">
              <Image
                src="/images/pdf-file.png"
                alt="Article Upload"
                width={80}
                height={60}
                className="object-cover opacity-90 hover:opacity-100 transition-all"
              />
              <p className="text-xs sm:text-sm font-Montserrat text-gray-500">
                Drag & Drop or Click
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <AnimatePresence>
              <motion.div
                key="file-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative p-3 bg-[#D9D9D9] rounded flex items-center justify-between gap-4">
                  <span className="font-Montserrat text-sm text-primary truncate max-w-[250px]">
                    {fileName}
                  </span>
                  <button onClick={handleRemoveFile}>
                    <RxCross2 className="text-lg text-red-500 hover:text-red-700" />
                  </button>
                </div>

                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-yellow-500 font-Montserrat text-sm"
                  >
                    <FaSpinner className="animate-spin text-lg" />
                    <span>Analyzing article...</span>
                  </motion.div>
                )}

                {!loading && aiResults && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <p className="text-sm font-Montserrat text-gray-700">
                      Human: {(aiResults.human * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm font-Montserrat text-gray-700">
                      AI: {(aiResults.ai * 100).toFixed(1)}%{' '}
                    </p>
                    <div
                      className={`mt-1 px-3 py-1 rounded font-Montserrat text-sm font-semibold border-t border-b ${
                        aiResults.eligible
                          ? 'text-green-600 border-green-600 bg-green-50'
                          : 'text-red-600 border-red-600 bg-red-50'
                      }`}
                    >
                      {aiResults.eligible
                        ? 'Eligible for upload'
                        : 'Not eligible for upload'}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <p className="text-red-500 text-sm font-Montserrat">
                    {error}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleUpload;
