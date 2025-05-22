'use client';
import React, { useState, useRef } from 'react';
import images from '@/Assets/images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProductSlider = () => {
  const [activeChoice, setActiveChoice] = useState('Men');
  const sliderRef = useRef(null);
  const router = useRouter();

  const choices = ['Men', 'Women', 'Boys', 'Girls'];

  const products = {
    Men: [
      { image: images.menImage }, // just category
      { image: images.men1, subcategory: 'tshirt' },
      { image: images.men2, subcategory: 'jean' },
      { image: images.men3, subcategory: 'shirt' },
      { image: images.men4, subcategory: 'accessories' },
      { image: images.men5, subcategory: 'jeans' },
      { image: images.men6, subcategory: 'tshirt' },
      { image: images.men7, subcategory: 'shirt' },
    ],
    Women: [
      { image: images.womenImage },
      { image: images.women1, subcategory: 'tshirt' },
      { image: images.women2, subcategory: 'jean' },
      { image: images.women3, subcategory: 'skirt' },
      { image: images.women4, subcategory: 'accessories' },
      { image: images.women5, subcategory: 'jewelry' },
      { image: images.women6, subcategory: 'blazer' },
      { image: images.women7, subcategory: 'top' },
    ],
    Boys: [
      { image: images.boyImage },
      { image: images.boy1, subcategory: 'shorts' },
      { image: images.boy2, subcategory: 'jean' },
      { image: images.boy3, subcategory: 'jacket' },
      { image: images.boy4, subcategory: 'accessories' },
      { image: images.boy5, subcategory: 'shoes' },
      { image: images.boy6, subcategory: 'hat' },
      { image: images.boy7, subcategory: 'polo' },
    ],
    Girls: [
      { image: images.girlImage },
      { image: images.girl1, subcategory: 'skirt' },
      { image: images.girl2, subcategory: 'top' },
      { image: images.girl3, subcategory: 'tshirt' },
      { image: images.girl4, subcategory: 'jeans' },
      { image: images.girl5, subcategory: 'shoes' },
      { image: images.girl6, subcategory: 'accessories' },
      { image: images.girl7, subcategory: 'jacket' },
    ],
  };

  const handleScroll = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = slider.clientWidth * 0.3;
    slider.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleImageClick = (subcategory) => {
    const base = `/products?category=${activeChoice}`;
    const url = subcategory ? `${base}&subcategory=${subcategory}` : base;
    router.push(url);
  };

  return (
    <div className="w-full relative">
      {/* Title */}
      <div className="flex items-center justify-center h-12 text-2xl font-bold bg-black text-white">
        IT MAY INTEREST YOU
      </div>

      {/* Category Buttons */}
      <div className="flex items-center justify-center h-12 font-bold bg-black pb-10 pt-5 text-white">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => setActiveChoice(choice)}
            className={`link-underline ${
              activeChoice === choice ? 'active underline' : ''
            } cursor-pointer mx-6 text-lg capitalize`}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-2 z-10 hover:bg-black/70"
      >
        <Image
          src={images.Backword}
          alt="left-arrow"
          width={20}
          height={20}
          className="invert"
        />
      </button>

      <button
        onClick={() => handleScroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white rounded-full p-2 z-10 hover:bg-black/70"
      >
        <Image
          src={images.forward}
          alt="right-arrow"
          width={20}
          height={20}
          className="invert"
        />
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <div className="inline-flex w-max leading-none">
          {products[activeChoice].map((item, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(item.subcategory)}
              className="inline-block w-[30vw] align-top overflow-hidden bg-gray-100 cursor-pointer"
            >
              <Image
                src={item.image}
                width={500}
                height={300}
                alt={`img-${index}`}
                className="w-full h-full block object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductSlider;
