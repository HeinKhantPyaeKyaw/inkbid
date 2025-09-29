type User = {
  role: 'buyer' | 'seller';
  name?: string;
};

export interface INavBarPrimaryProps {
  user: 'buyer' | 'seller';
  // user: User | null;
  userId?: string;
}
