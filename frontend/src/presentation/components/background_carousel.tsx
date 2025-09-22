"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { NavbarTertiary } from "./navbar/navbar_tertiary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

type Slide = {
  image: string;
  heading: string;
};

const SLIDES: Slide[] = [
  {
    image: "/imgs/carousal1.jpg",
    heading: "One-stop platform for Content",
  },
  {
    image: "/imgs/carousal2.jpg",
    heading: "Looking to buy content?",
  },
  {
    image: "/imgs/carousal3.png",
    heading: "Are you a Writer?",
  },
];

export const BackgroundCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      duration: 40,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 10000,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    ]
  );

  return (
    <section className="relative min-h-[calc(75vh-0px)] overflow-hidden text-white">
      <div className="sticky top-0 z-50">
        <div className="">
          <NavbarTertiary />
        </div>
      </div>

      <div
        ref={emblaRef}
        className="embla absolute z-0 h-[calc(75vh-0px)] overflow-hidden top-0"
        aria-roledescription="carousel"
      >
        <div className="embla__container flex h-full touch-pan-y select-none">
          {SLIDES.map((s, idx) => (
            <div
              key={idx}
              className="embla__slide relative h-full flex-[0_0_100%] transform-gpu will-change-transform"
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${SLIDES.length}`}
            >
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${s.image})` }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-black/80" aria-hidden />

              <div className="relative z-10 h-full flex flex-col mt-18 space-y-4 px-12 ">
                <p className="font-bold drop-shadow font-Forum text-[50px]">
                  {s.heading}
                </p>
                {idx === 0 ? (
                  <div className="space-y-4">
                    <p className="font-Montserrat text-[30px] text-center">
                      Welcome to <span className="font-bold">InkBid</span>
                    </p>
                    <p className="font-Forum text-[30px] text-center">
                      The Content Marketplace Where Writers Thrive and
                      Publishers Splurge
                    </p>
                    <p className="font-Montserrat text-[20px]">
                      Inkbid is a bidding platform designed for freelance
                      writers and digital publishers. Writers showcase original
                      articles. Publishers get exclusive, high-quality content
                      tailored to their needs - Writers get paid what their work
                      is truly worth.
                    </p>
                  </div>
                ) : idx === 1 ? (
                  // Buyers
                  <div>
                    <p className="font-Forum text-[40px]">Explore your needs</p>
                    <p className="font-Montserrat text-[25px] mt-4">
                      Bid on a diverse range of articles and find the perfect
                      fit.
                    </p>
                  </div>
                ) : (
                  // Sellers
                  <div>
                    <p className="font-Forum text-[40px]">
                      Unlock Your Potential
                    </p>
                    <p className="font-Montserrat text-[25px] mt-4">
                      Leverage our platform to monetize your skills and
                      expertise
                    </p>
                  </div>
                )}
                <div className="cursor-pointer w-[150px] hover:scale-125">
                  <p className="font-bold font-Forum text-[20px] ">
                    Sign Up Now
                  </p>
                  <div className="flex flex-col items-center justify-content w-[100px]">
                    <div className="bg-white h-0.25 w-[100px]" />
                    <div className="bg-white h-0.25 w-[50px] mt-1" />
                  </div>
                </div>
                <div className="w-full flex flex-col items-center">
                  <div className="flex space-x-6 absolute bottom-20 mb-10 text-xl text-[#3C3C3C] h-[80px] bg-red-0 w-[1300px] rounded-2xl bg-[#D9D9D9]/60 items-center justify-center">
                    <div className="flex flex-col w-full px-2 pl-8">
                      <div className="flex items-center px-2 text-[20px]">
                        <p className="w-full">Genre</p>
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      <div className="w-full h-0.25 bg-[#3C3C3C] mt-1" />
                    </div>
                    <div className="flex flex-col w-full px-2">
                      <div className="flex items-center px-2 text-[20px]">
                        <p className="w-full">Writing Style</p>
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      <div className="w-full h-0.25 bg-[#3C3C3C] mt-1" />
                    </div>
                    <div className="flex flex-col w-full px-2">
                      <div className="flex items-center px-2 text-[20px]">
                        <p className="w-full">Date</p>
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      <div className="w-full h-0.25 bg-[#3C3C3C] mt-1" />
                    </div>
                    <div className="flex flex-col w-full px-2">
                      <div className="flex items-center px-2 text-[20px]">
                        <p className="w-full">Duration</p>
                        <FontAwesomeIcon icon={faCaretDown} />
                      </div>
                      <div className="w-full h-0.25 bg-[#3C3C3C] mt-1" />
                    </div>
                    <div className=" flex items-center justify-between px-4 py-2 pr-8 hover:scale-110 transition-all duration-200">
                      <p className="pr-2 text-2xl font-Montserrat">Browse</p>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="text-3xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
