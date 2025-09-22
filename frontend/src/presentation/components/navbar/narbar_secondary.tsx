'use client';
import {
  faArrowDownWideShort,
  faBars,
  faBell,
  faCog,
  faRightFromBracket,
  faScroll,
  faSearch,
  faSheetPlastic,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';

export const NavbarSecondary = () => {
  //---------------------
  //   CONST
  //---------------------
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    date: '',
    rating: '',
    genre: '',
  });

  const { logout } = useAuth();
  const router = useRouter();

  // Access logout from AuthContext
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const dropdownItemsBuyer = [
    {
      label: 'Product',
      icon: faScroll,
      href: '/content',
      indent: 1,
    },
    {
      label: 'Dashboard',
      icon: faSheetPlastic,
      href: '/dashboard',
      indent: 2,
    },
    { label: 'Settings', icon: faCog, href: '/settings', indent: 3 },
    {
      label: 'Log Out',
      icon: faRightFromBracket,
      href: '/logout',
      action: handleLogout,
      indent: 4,
    },
  ];

  const filterOptions = {
    date: ['Newest', 'Oldest', 'This Week', 'This Month'],
    rating: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    genre: [
      'Politics',
      'Health & Science',
      'Economics',
      'Technology',
      'Entertainment',
    ],
  };

  //---------------------
  //   HANDLE
  //---------------------
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setShowFilterDropdown(false);
  };

  //---------------------
  //   RENDER
  //---------------------
  return (
    <nav className="flex items-center justify-between px-6 bg-white/25 shadow-md py-3">
      {/* Logo */}
      <div className="text-[32px] tracking-[12px] font-Forum text-accent bg-primary rounded-full px-6 py-2">
        INKBID
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8 bg-primary p-4 rounded-full">
        <form onSubmit={handleSearch} className="flex items-center ">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What are you looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-primary ml-2 px-4 py-2 rounded-l-full flex items-center gap-2 hover:bg-accent hover:scale-110 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSearch} />
            Search
          </button>

          {/* Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="ml-0.5 px-4 bg-white text-primary p-2 rounded-r-full hover:bg-accent hover:scale-110 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faArrowDownWideShort} />
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4">
                {/* Date Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Date</h3>
                  <div className="space-y-1">
                    {filterOptions.date.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect('date', option)}
                        className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-100 transition ${
                          selectedFilters.date === option
                            ? 'bg-primary text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Rating</h3>
                  <div className="space-y-1">
                    {filterOptions.rating.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect('rating', option)}
                        className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-100 transition ${
                          selectedFilters.rating === option
                            ? 'bg-primary text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Genre</h3>
                  <div className="space-y-1">
                    {filterOptions.genre.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterSelect('genre', option)}
                        className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-100 transition ${
                          selectedFilters.genre === option
                            ? 'bg-primary text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() =>
                    setSelectedFilters({ date: '', rating: '', genre: '' })
                  }
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6">
        <button>
          <FontAwesomeIcon icon={faBell} className="text-primary text-[24px]" />
        </button>
        <div className="relative">
          <button onClick={() => setShowDropdown((prev) => !prev)}>
            <FontAwesomeIcon
              icon={faUser}
              className="text-primary text-[24px]"
            />
          </button>

          {showDropdown && (
            <motion.div
              className="absolute right-0 mt-3 w-48 rounded-lg z-50 py-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15, // delay between each child
                  },
                },
              }}
            >
              {dropdownItemsBuyer.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                >
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
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
                      className={`flex items-center justify-start gap-3 pl-8 px-4 mb-4 rounded-full border-2 border-primary bg-white py-2 hover:bg-gray-100 transition ${
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
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};
