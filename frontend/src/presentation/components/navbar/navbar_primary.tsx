'use client';
import { useAuth } from '@/context/auth/AuthContext';
import {
  faBell,
  faChartLine,
  faCog,
  faPlus,
  faRightFromBracket,
  faScroll,
  faSheetPlastic,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { INavBarPrimaryProps } from '../../../interfaces/account/account.interface';

export const NavbarPrimary = ({
  user,
  userId,
  showNotification = true,
}: INavBarPrimaryProps) => {
  //---------------------
  //   CONST
  //---------------------
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  // Access logout function from AuthContext
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const dropdownItemsBuyer = (() => {
    const base = pathname.startsWith('/content')
      ? [
          {
            label: 'Dashboard',
            icon: faSheetPlastic,
            href: '/dashboard/buyer-dashboard',
            indent: 1,
          },
          { label: 'Settings', icon: faCog, href: '/buyersetting', indent: 2 },
          {
            label: 'Log Out',
            icon: faRightFromBracket,
            // href: '/logout',
            action: handleLogout,
            indent: 3,
          },
        ]
      : pathname.startsWith('/buyersetting')
      ? [
          {
            label: 'Products',
            icon: faScroll,
            href: '/content-listing',
            indent: 1,
          },
          {
            label: 'Dashboard',
            icon: faSheetPlastic,
            href: '/dashboard/buyer-dashboard',
            indent: 2,
          },
          {
            label: 'Log Out',
            icon: faRightFromBracket,
            // href: '/logout',
            action: handleLogout,
            indent: 3,
          },
        ]
      : pathname.startsWith('/dashboard/buyer-dashboard')
      ? [
          {
            label: 'Products',
            icon: faScroll,
            href: '/content-listing',
            indent: 1,
          },
          { label: 'Settings', icon: faCog, href: '/buyersetting', indent: 2 },
          {
            label: 'Log Out',
            icon: faRightFromBracket,
            // href: '/logout',
            action: handleLogout,
            indent: 3,
          },
        ]
      : [
          {
            label: 'Product',
            icon: faScroll,
            href: '/content-listing',
            indent: 1,
          },
          {
            label: 'Dashboard',
            icon: faSheetPlastic,
            href: '/dashboard/buyer-dashboard',
            indent: 2,
          },
          { label: 'Settings', icon: faCog, href: '/buyersetting', indent: 3 },
          {
            label: 'Log Out',
            icon: faRightFromBracket,
            // href: '/logout',
            action: handleLogout,
            indent: 4,
          },
        ];

    return base;
  })();

  const dropdownItemsSeller = (() => {
    if (pathname.startsWith('/dashboard/seller')) {
      return [
        {
          label: 'Create Post',
          icon: faPlus,
          href: '/create-post',
          indent: 1,
        },
        {
          label: 'Profile',
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        { label: 'Settings', icon: faCog, href: '/sellersetting', indent: 3 },
        {
          label: 'Log Out',
          icon: faRightFromBracket,
          href: '/logout',
          action: handleLogout,
          indent: 4,
        },
      ];
    } else if (pathname.startsWith('/sellersetting')) {
      return [
        {
          label: 'Create Post',
          icon: faPlus,
          href: '/create-post',
          indent: 1,
        },
        {
          label: 'Profile',
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        {
          label: 'Dashboard',
          icon: faChartLine,
          href: '/dashboard/seller',
          indent: 3,
        },
        {
          label: 'Log Out',
          icon: faRightFromBracket,
          href: '/logout',
          action: handleLogout,
          indent: 4,
        },
      ];
    } else if (pathname.startsWith('/profile/seller')) {
      return [
        {
          label: 'Create Post',
          icon: faPlus,
          href: '/create-post',
          indent: 1,
        },
        {
          label: 'Dashboard',
          icon: faChartLine,
          href: '/dashboard/seller',
          indent: 2,
        },
        { label: 'Settings', icon: faCog, href: '/sellersetting', indent: 3 },
        {
          label: 'Log Out',
          icon: faRightFromBracket,
          href: '/logout',
          action: handleLogout,
          indent: 4,
        },
      ];
    } else {
      return [
        {
          label: 'Dashboard',
          icon: faChartLine,
          href: '/dashboard/seller',
          indent: 1,
        },
        {
          label: 'Profile',
          icon: faUser,
          href: `/profile/seller/${userId}`,
          indent: 2,
        },
        { label: 'Settings', icon: faCog, href: '/sellersetting', indent: 3 },
        {
          label: 'Log Out',
          icon: faRightFromBracket,
          href: '/logout',
          action: handleLogout,
          indent: 4,
        },
      ];
    }
  })();

  return (
    <nav className="flex items-center justify-between px-6 bg-primary">
      <div className="w-32" />
      <div className="text-[64px] tracking-wide font-Forum text-accent">
        INKBID
      </div>

      <div className="flex items-center gap-8">
        {showNotification && (
          <button>
            <FontAwesomeIcon
              icon={faBell}
              className="text-accent text-[32px]"
            />
          </button>
        )}
        <div className="relative">
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-accent text-[32px]"
            />
          </button>

          {/* {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 rounded-lg z-50 py-2">
              {user === 'buyer'
                ? dropdownItemsBuyer.map((item, index) =>
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`flex items-center gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                          item.indent === 1
                            ? 'mr-2 ml-4'
                            : item.indent === 2
                            ? 'mr-8'
                            : item.indent === 3
                            ? 'mr-10 ml-2'
                            : 'mr-0 ml-12'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href || index} // fallback key to avoid duplicate warning
                        href={item.href!} // '!' tells TS it’s not undefined here
                        className={`flex items-center gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                          item.indent === 1
                            ? 'mr-2 ml-4'
                            : item.indent === 2
                            ? 'mr-8'
                            : item.indent === 3
                            ? 'mr-10 ml-2'
                            : 'mr-0 ml-12'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    ),
                  )
                : dropdownItemsSeller.map((item) =>
                    item.action ? (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`flex items-center gap-3 w-full text-left pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                          item.indent === 1
                            ? 'mr-2 ml-4'
                            : item.indent === 2
                            ? 'mr-8'
                            : 'mr-0 ml-8'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
                          item.indent === 1
                            ? 'mr-2 ml-4'
                            : item.indent === 2
                            ? 'mr-8'
                            : 'mr-0 ml-8'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    ),
                  )}
            </div>
          )} */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-lg z-50 py-2">
              {user === 'buyer'
                ? dropdownItemsBuyer.map((item, index) =>
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? 'ml-14'
                              : item.indent === 2
                              ? 'ml-10 mr-2'
                              : item.indent === 3
                              ? 'ml-6 mr-6'
                              : 'mr-10 ml-2'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href || index}
                        href={item.href!}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? 'ml-14'
                              : item.indent === 2
                              ? 'ml-10 mr-2'
                              : item.indent === 3
                              ? 'ml-6 mr-6'
                              : 'mr-10 ml-2'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    ),
                  )
                : dropdownItemsSeller.map((item, index) =>
                    item.action ? (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? 'ml-14'
                              : item.indent === 2
                              ? 'ml-10 mr-2'
                              : item.indent === 3
                              ? 'ml-6 mr-6'
                              : 'mr-10 ml-2'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition
                          ${
                            item.indent === 1
                              ? 'ml-14'
                              : item.indent === 2
                              ? 'ml-10 mr-2'
                              : item.indent === 3
                              ? 'ml-6 mr-6'
                              : 'mr-10 ml-2'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="text-gray-600"
                        />
                        <span className="text-gray-800">{item.label}</span>
                      </Link>
                    ),
                  )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// const base = pathname.startsWith('/dashboard')
//   ? [
//       {
//         label: 'Profile',
//         icon: faUser,
//         href: '/profile',
//         indent: 1,
//       },
//       { label: 'Settings', icon: faCog, href: '/settings', indent: 2 },
//     ]
//   : pathname.startsWith('/settings')
//   ? [
//       {
//         label: 'Profile',
//         icon: faUser,
//         href: '/profile',
//         indent: 1,
//       },
//       {
//         label: 'Dashboard',
//         icon: faChartLine,
//         href: '/dashboard',
//         indent: 2,
//       },
//     ]
//   : pathname.startsWith('/profile')
//   ? [
//       {
//         label: 'Dashboard',
//         icon: faChartLine,
//         href: '/dashboard',
//         indent: 1,
//       },
//       { label: 'Settings', icon: faCog, href: '/settings', indent: 2 },
//     ]
//   : [
//       {
//         label: 'Dashboard',
//         icon: faChartLine,
//         href: '/dashboard',
//         indent: 1,
//       },
//       {
//         label: 'Log Out',
//         icon: faRightFromBracket,
//         href: '/logout',
//         action: handleLogout,
//         indent: 2,
//       },
//     ];
// return base;
