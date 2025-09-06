'use client';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaRegBell } from 'react-icons/fa6';
import { MdMenu } from 'react-icons/md';
import Link from "next/link";
import { NavbarSecondary } from '../components/navbar/narbar_secondary';
import { ProductCard } from '../components/product_card';
import { IContent } from "@/interfaces/content/content.domain";

export default function MarketplacePage() {
  const router = useRouter();
  const [notifications] = useState([
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."',
    'Your recent bid on the article "The Haunting of..."',
  ]);
  const [showNoti, setShowNoti] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [articlesData, setArticlesData] = useState<IContent[]>([]);

  const handleBellClick = () => setShowNoti((prev) => !prev);
  const handleMenuClick = () => setShowFilter((prev) => !prev);
  const handleProfileClick = () => setShowProfile((prev) => !prev);

  const genreOptions = ['Fiction', 'Non-fiction', 'Sci-Fi', 'Romance'];
  const styleOptions = ['Formal', 'Casual', 'Academic', 'Creative'];
  const durationOptions = ['1 Day', '3 Days', '1 Week', '1 Month'];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    fetch('http://localhost:5500/api/v1/articles', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setArticlesData(data);
      })
      .catch((error) => {
        console.error('Error fetching articles:', error);
      });
  };

  return (
    <div className="bg-[#f7f2eb] min-h-screen flex-col">
      <NavbarSecondary />
      <ProductCard props={articlesData} />
    </div>
  );
}
