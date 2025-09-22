export interface IUser {
  _id: string;
  name: string;
  img_url?: string;
  rating?: number;
}

export interface ITag {
  genre: { code: string, keyword: string }[];
  writing_style: { code: string, keyword: string }[];
}

export interface IContent {
  _id: string;
  title: string;
  date: string;
  author: IUser; // 👈 object instead of string
  synopsis: string; // 👈 backend uses "synopsis"
  highest_bid: number;
  min_bid: number;
  buy_now: number;
  ends_in: string;
  img_url?: string;
  tag: ITag; // 👈 object instead of flat string
}
