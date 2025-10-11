export interface UserProfile {
  uid: string;
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  profileImage?: string;
  img_url?: string;
  organization?: string;
  bio?: string;
  paypalEmail?: string;
  createdAt: string;
  specialization?: string;
  writingStyle?: string;
}

export interface AuthContextType {
  user: UserProfile | null; // ? I think we need to type better
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}
