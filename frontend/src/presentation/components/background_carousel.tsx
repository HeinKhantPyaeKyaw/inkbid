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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
