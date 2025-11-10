export interface IUser {
  _id: string;
  name: string;
  email?: string;
  role?: "buyer" | "seller";
  img_url?: string;
  rating?: number;
}

export interface ITag {
  genre: { code: string; keyword: string }[];
  writing_style: { code: string; keyword: string }[];
}

export interface IBid {
  id: string;
  ref_user: IUser;
  amount: number;
  timestamp: string;
}

export interface IContent {
  _id: string;
  title: string;
  date: string;
  author: IUser | null;
  synopsis: string;
  highest_bid: number;
  min_bid: number;
  buy_now: number;
  ends_in: string;
  img_url?: string;
  tag: ITag;
  bids: IBid[];
  status:
    | "in_progress"
    | "awaiting_contract"
    | "awaiting_payment"
    | "completed"
    | "cancelled";
  winner?: IUser | null;
  proprietor?: IUser | null;
}
