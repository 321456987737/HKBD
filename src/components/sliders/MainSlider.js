"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import images from "@/Assets/images";
import { useRouter } from "next/navigation";

const sliderImages = [
  images.WomensProduct,
  images.MensProduct,
  images.BiysProduct, // Note: There's a typo here "BiysProduct" - should be "BoysProduct"
  images.GirlsProduct,
];
const categories = ["Women", "Men", "Boys", "Girls"]; // Fixed spelling from "categorys" to "categories"

const ANIMATION_DURATION = 400;
const AUTO_ADVANCE_DELAY = 8000;

const MainSlider = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, AUTO_ADVANCE_DELAY);
    return () => clearInterval(interval);
  }, [current, isAnimating]);

  const goToSlide = (newIndex) => {
    if (isAnimating || newIndex === current) return;
    setIsAnimating(true);
    setCurrent(newIndex);
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  };

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (current + 1) % sliderImages.length;
    goToSlide(nextIndex);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    const prevIndex = (current - 1 + sliderImages.length) % sliderImages.length;
    goToSlide(prevIndex);
  };

  const handleDotClick = (idx, e) => {
    e.stopPropagation();
    goToSlide(idx);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) nextSlide();
      else prevSlide();
    }
  };

  const handleImageClick = (idx) => {
    // Use categories exactly as defined to ensure exact match with database
    const selectedCategory = categories[idx];
    // Don't encode the category name to maintain exact matching with database
    router.push(`/products?category=${selectedCategory}`);
  };

  return (
    <div
      className="w-full h-screen max-w-full relative overflow-hidden touch-pan-y md:h-[86vh] bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides container */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${current * (100 / sliderImages.length)}%)`,
          transition: `transform ${ANIMATION_DURATION}ms ease-in-out`,
          width: `${sliderImages.length * 100}%`,
        }}
      >
        {sliderImages.map((img, idx) => (
          <div
            key={idx}
            className="relative h-full flex-shrink-0 cursor-pointer"
            style={{ width: `${100 / sliderImages.length}%` }}
            onClick={() => handleImageClick(idx)}
            role="button"
            aria-label={`View ${categories[idx]} products`}
          >
            <Image
              src={img}
              alt={`${categories[idx]} category`}
              fill
              className="object-cover"
              priority={idx === current}
              sizes="100vw"
            />
            <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold">{categories[idx]}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        className="absolute top-1/2 left-6 flex items-center justify-center -translate-y-1/2 bg-white/70 border-none rounded-full w-11 h-11 text-2xl cursor-pointer z-30 transition-all hover:bg-white/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={prevSlide}
        aria-label="Previous Slide"
        disabled={isAnimating}
      >
        <Image src={images.Backword} width={24} height={24} alt="backward" />
      </button>
      <button
        className="absolute top-1/2 flex items-center justify-center right-6 -translate-y-1/2 bg-white/70 border-none rounded-full w-11 h-11 text-2xl cursor-pointer z-30 transition-all hover:bg-white/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={nextSlide}
        aria-label="Next Slide"
        disabled={isAnimating}
      >
        <Image src={images.forward} width={24} height={24} alt="forward" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
        {sliderImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={(e) => handleDotClick(idx, e)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainSlider;