'use client';

import {
  AiResults,
  ArticleUploadProps,
} from '@/interfaces/create-post-interface/create-post-types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResult(null);
    setError(null);

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    setFileName(file.name);
    setArticleFile(file);
    setLoading(true);
    setAiResults(null);

    //   setTimeout(() => {
    //     const human = Math.floor(Math.random() * 41) + 60;
    //     const ai = 100 - human;

    //     setResult({ human, ai });
    //     setLoading(false);
    //   }, 1500);
    // };

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call AI(Flask) Server
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

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
      console.error('Detection failed', err);
      setError('Failed to analyze article. Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setArticleFile(null);
  };

  // Reset local state if articleFile was cleared externally (from parent)
  useEffect(() => {
    if (!articleFile) {
      setFileName(null);
      setLoading(false);
      setError(null);
    }
  }, [articleFile]);

  return (
    <div>
      <div className="flex flex-col gap-2 items-start">
        <label
          htmlFor="article-upload"
          className="font-Forum text-primary text-2xl mb-4"
        >
          Article (.pdfonly)
        </label>

        <div className="">
          {!fileName ? (
            <label className="cursor-pointer w-[120px] h-[100px]">
              <Image
                src="/images/pdf-file.png"
                alt="Article Upload"
                width={80}
                height={60}
                className="object-cover border rounded"
              />
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex justify-start items-start gap-6">
              <div className="relative p-3 bg-[#D9D9D9] rounded flex items-center justify-between gap-4">
                <span className="font-Montserrat text-sm text-primary truncate max-w-[250px]">
                  {fileName}
                </span>
                <button onClick={handleRemoveFile}>
                  <RxCross2 className="text-lg text-red-500 hover:text-red-700" />
                </button>
              </div>

              {loading && (
                <p className="text-sm text-yellow-400">
                  Waiting for the detection result...{' '}
                </p>
              )}

              {/* FIXME: To implement the logic to accept the result from backend server later */}
              {aiResults && (
                <div>
                  <p>Human: {(aiResults.human * 100).toFixed(1)}%</p>
                  <p>AI: {(aiResults.ai * 100).toFixed(1)}% </p>
                  <div className="bg-primary rounded px-2 py-1">
                    {aiResults.eligible ? (
                      <p className="font-Montserrat text-sm text-accent font-semibold border-t-[1px] border-b-[1px] border-accent px-1">
                        Eligible for upload
                      </p>
                    ) : (
                      <p className="font-Montserrat text-sm text-red-500 font-semibold border-t-[1px] border-b-[1px] border-red-500 px-1">
                        Not eligible for upload
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleUpload;
