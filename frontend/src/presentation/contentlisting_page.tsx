"use client";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { CgProfile } from 'react-icons/cg'
import Image from 'next/image' 

type Article = {
  title: string
  date: string
  author: string
  rating: number
  genre: string
  writingStyle: string
  description: string
  bid: number
  buyNow: number
  imageUrl: string
}

const articles: Article[] = Array(6).fill({
  title: 'Oval office or hall of shame',
  date: '22/May/2025',
  author: 'Bill Murry',
  rating: 4,
  genre: 'Genre',
  writingStyle: 'Writing Style',
  description: 'This article explores how escalating global tariff wars are intensifying the economic divide between high-income and low-income... Read More.',
  bid: 100,
  buyNow: 100,
  imageUrl: '/content.jpg' 
})


export default function MarketplacePage() {
  const router = useRouter();
  const [notifications] = useState([
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."'
  ]);
  const [showNoti, setShowNoti] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleBellClick = () => setShowNoti((prev) => !prev);
  const handleMenuClick = () => setShowFilter((prev) => !prev);
  const handleProfileClick = () => setShowProfile((prev) => !prev);

  const genreOptions = [ 'Fiction', 'Non-fiction', 'Sci-Fi', 'Romance'];
  const styleOptions = [ 'Formal', 'Casual', 'Academic', 'Creative'];
  const durationOptions = ['1 Day', '3 Days', '1 Week', '1 Month'];

  return (
    <div className="bg-[#f7f2eb] min-h-screen flex">
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="text-3xl font-bold text-blue-900 tracking-wider">INKBID</div>
            <div className="flex items-center border rounded-full px-4 py-1 bg-white shadow-sm">
              <input
                type="text"
                placeholder="What are you looking for..."
                className="bg-transparent outline-none px-2 text-sm w-60"
              />
              <button className="ml-2 text-white bg-blue-900 px-4 py-1 rounded-full text-sm">
                Search
              </button>
              <div className="relative">
                <button type="button" onClick={handleMenuClick}>
                  <Menu className="ml-3 w-4 h-4 text-gray-500" />
                </button>
                {showFilter && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-8 w-80 bg-white text-black rounded shadow-lg px-6 py-5 text-sm z-50">
                    <p className="font-bold mb-3">Filter Articles</p>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Genre</label>
                      <select className="w-full border rounded px-2 py-1">
                        {genreOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Writing Style</label>
                      <select className="w-full border rounded px-2 py-1">
                        {styleOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Date</label>
                      <input type="date" className="w-full border rounded px-2 py-1" />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Duration</label>
                      <select className="w-full border rounded px-2 py-1">
                        {durationOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowFilter(false)}>Cancel</button>
                      <button className="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-800">Apply</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button onClick={handleBellClick} className="focus:outline-none">
              <Bell className="w-6 h-6 text-blue-900" />
            </button>
            {showNoti && (
              <div className="absolute right-12 top-10 w-80 bg-white text-black rounded shadow-lg px-6 py-5 text-sm z-50">
                <p className="font-bold mb-3">Notifications</p>
                {notifications.map((note, i) => (
                  <div key={i} className="border-b last:border-b-0 pb-2 mb-2 last:mb-0">
                    {note}
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <button onClick={handleProfileClick} className="focus:outline-none">
                <CgProfile className="w-7 h-7 text-blue-900 cursor-pointer" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-10 w-56 bg-white text-black rounded shadow-lg px-4 py-4 text-sm z-50">
                  <button
                    className="w-full text-left py-2 px-2 rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowProfile(false);
                      router.push('/buyersetting');
                    }}
                  >
                    Settings
                  </button>
                  <button className="w-full text-left py-2 px-2 rounded hover:bg-gray-100"> Dashboard & Inventory</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden mb-3">
                <img
                  src={article.imageUrl}
                  alt="Article"
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-lg">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.date}</p>
              <p className="text-sm text-gray-800">By {article.author}</p>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    <FontAwesomeIcon icon={faStar} className={i < article.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap text-xs gap-2 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded-full border">{article.genre}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full border">{article.writingStyle}</span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Ends In: <span className="font-semibold">1 Days 5Hr 14Min</span>
              </p>

              <p className="text-sm text-gray-500 mb-3">
                {article.description}
              </p>

              <div className="flex items-center text-sm">
                <div className="text-center mr-auto">
                  <div className="text-gray-500">Highest Bid</div>
                  <div className="bg-blue-900 text-white px-3 py-1 rounded">${article.bid}</div>
                </div>
                <button className="bg-blue-900 text-white px-4 py-1 rounded ml-auto">Buy Now ${article.buyNow}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  )
}
