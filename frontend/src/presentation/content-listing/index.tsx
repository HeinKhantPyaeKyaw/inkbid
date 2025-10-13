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
  const [articlesData, setArticlesData] = useState<IContent[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/articles`, {
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
