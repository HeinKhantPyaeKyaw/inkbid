export interface UserProfile {
  uid: string;
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  createdAt: string;
}

export interface AuthContextType {
  user: UserProfile | null; // ? I think we need to type better
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
