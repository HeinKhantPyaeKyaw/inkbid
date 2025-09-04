export interface ImageUploadProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}

export interface ArticleUploadProps {
  articleFile: File | null;
  setArticleFile: (file: File | null) => void;
  aiResults: AiResults | null;
  setAiResults: (results: AiResults | null) => void;
}

export interface AiResults {
  ai: number;
  human: number;
  eligible: boolean;
}
