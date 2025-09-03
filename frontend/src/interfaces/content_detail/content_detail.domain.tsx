// --- User Type ---
export interface IUser {
  _id: string;
  name: string;
  email?: string;
  role?: "buyer" | "seller";
  img_url?: string;
  rating?: number;
}

// --- Tag Type ---
export interface ITag {
  genre: { code: string; keyword: string }[];
  writing_style: { code: string; keyword: string }[];
}

// --- Bid Type ---
export interface IBid {
  id: string;
  ref_user: IUser;
  amount: number;
  timestamp: string;
}

// --- Article/Content Type ---
export interface IContent {
  _id: string;
  title: string;
  date: string; // ISO string (backend sends Date)
  author: IUser | null; // null if author deleted
  synopsis: string;
  highest_bid: number; // converted from Decimal128 in backend
  min_bid: number;
  buy_now: number;
  ends_in: string; // ISO string
  img_url?: string;
  tag: ITag;
  bids: IBid[];
}
