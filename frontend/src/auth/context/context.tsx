import {axiosClient} from "../../hooks/axiosClient";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { get } from "http";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  getRole: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email)
      throw new Error("No authenticated user");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const getRole = async () => {
    if (!auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axiosClient.get("/portal/get-user-role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data?.role ?? null;
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        changePassword,
        logout,
        getToken,
        getRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
