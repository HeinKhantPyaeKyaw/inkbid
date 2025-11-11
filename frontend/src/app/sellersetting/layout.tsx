<<<<<<< HEAD
"use client";
import { Bell, UserCircle, LockKeyhole, BookOpen } from 'lucide-react'

import { NavbarPrimary } from '@/presentation/components/navbar/navbar_primary';
import { useRouter, usePathname } from 'next/navigation';

export default function Layout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname)

=======
'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { NavbarPrimary } from '@/presentation/components/navbar/navbar_primary';
import { usePathname, useRouter } from 'next/navigation';
import { FaRegBell, FaRegUserCircle } from 'react-icons/fa';
import { LuBookOpen, LuLockKeyhole } from 'react-icons/lu';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();
>>>>>>> 🐽TestMerge
  const isActive = (path: string) => pathname === path;

  return (
    <>
<<<<<<< HEAD
      <NavbarPrimary isDisableNoti={true} />
      <div className="min-h-screen bg-[#f3eee6] flex text-black">
        
        <aside className="w-64 p-6 bg-white rounded-r-xl shadow">
=======
      <NavbarPrimary
        user={user?.role}
        userId={user?.id}
        showNotification={false}
      />
      <div className="min-h-screen bg-[#f3eee6] flex text-black">
        <aside className="w-76 p-6 bg-white rounded-r-xl shadow">
>>>>>>> 🐽TestMerge
          <h2 className="text-xl font-semibold mb-6">Settings</h2>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => router.push('/sellersetting')}
<<<<<<< HEAD
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${isActive('/sellersetting') ?  'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              aria-current={isActive('/sellersetting') ? 'page' : undefined}
            >
              <UserCircle className="w-5 h-5" />
=======
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${
                isActive('/sellersetting')
                  ? 'text-black font-semibold'
                  : 'text-gray-500 hover:text-black'
              }`}
              aria-current={isActive('/sellersetting') ? 'page' : undefined}
            >
              <FaRegUserCircle className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Account Preferences</span>
            </button>

            <button
              type="button"
<<<<<<< HEAD
              onClick={() => router.push('/sellersetting/sellersettingNotification')}
              className={`flex items-center gap-2 w-full text-left ${isActive('/sellersetting/sellersettingNotification') ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              aria-current={isActive('/sellersetting/sellersettingNotification') ? 'page' : undefined}
            >
              <Bell className="w-5 h-5" />
=======
              onClick={() =>
                router.push('/sellersetting/sellersettingNotification')
              }
              className={`flex items-center gap-2 w-full text-left ${
                isActive('/sellersetting/sellersettingNotification')
                  ? 'text-black font-semibold'
                  : 'text-gray-500 hover:text-black'
              }`}
              aria-current={
                isActive('/sellersetting/sellersettingNotification')
                  ? 'page'
                  : undefined
              }
            >
              <FaRegBell className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Notification</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/sellersetting/sellersettingPayment')}
<<<<<<< HEAD
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${isActive('/sellersetting/sellersettingPayment') ?  'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              aria-current={isActive('/sellersetting/sellersettingPayment') ? 'page' : undefined}
            >
              <LockKeyhole className="w-5 h-5" />
=======
              className={`flex items-center gap-2 text-black font-medium w-full text-left ${
                isActive('/sellersetting/sellersettingPayment')
                  ? 'text-black font-semibold'
                  : 'text-gray-500 hover:text-black'
              }`}
              aria-current={
                isActive('/sellersetting/sellersettingPayment')
                  ? 'page'
                  : undefined
              }
            >
              <LuLockKeyhole className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Payment & Security</span>
            </button>

            <button
              type="button"
<<<<<<< HEAD
              onClick={() => router.push('/sellersetting/sellersettingPortfolio')}
              className={`flex items-center gap-2 w-full text-left ${isActive('/sellersetting/sellersettingPortfolio') ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              aria-current={isActive('/sellersetting/sellersettingPortfolio') ? 'page' : undefined}
            >
              <BookOpen className="w-5 h-5" />
=======
              onClick={() =>
                router.push('/sellersetting/sellersettingPortfolio')
              }
              className={`flex items-center gap-2 w-full text-left ${
                isActive('/sellersetting/sellersettingPortfolio')
                  ? 'text-black font-semibold'
                  : 'text-gray-500 hover:text-black'
              }`}
              aria-current={
                isActive('/sellersetting/sellersettingPortfolio')
                  ? 'page'
                  : undefined
              }
            >
              <LuBookOpen className="w-5 h-5" />
>>>>>>> 🐽TestMerge
              <span>Portfolio</span>
            </button>
          </div>
        </aside>

<<<<<<< HEAD
        

        {children}
      </div>
    </>
  )
}
=======
        {children}
      </div>
    </>
  );
}
>>>>>>> 🐽TestMerge
