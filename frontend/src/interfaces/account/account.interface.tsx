type User = {
    role: 'buyer' | 'seller' ;
    name?: string;
  }

export interface INavBarPrimaryProps {
  user: "buyer" | "seller";
}