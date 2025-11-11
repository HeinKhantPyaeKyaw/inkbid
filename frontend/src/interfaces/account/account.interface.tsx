type User = {
  role: 'buyer' | 'seller';
  name?: string;
};

export interface INavBarPrimaryProps {
<<<<<<< HEAD
  user: "buyer" | "seller";
  isDisableNoti: boolean
}
=======
  user?: 'buyer' | 'seller';
  userId?: string;
  showNotification?: boolean;
}
>>>>>>> 🐽TestMerge
