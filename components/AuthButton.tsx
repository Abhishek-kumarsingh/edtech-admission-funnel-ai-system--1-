'use client';

import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/FirebaseProvider';
import { LogIn, LogOut } from 'lucide-react';

export const AuthButton = () => {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-full"></div>;

  if (user) {
    return (
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
    >
      <LogIn size={18} />
      <span>Sign In with Google</span>
    </button>
  );
};
