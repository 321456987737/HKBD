"use client";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProductSection = ({ title, images, category }) => {
  // Map category to subcategory list
  const router = useRouter();
  const categoryMap = {
    Men: ["polo", "tshirt", "jeans", "shirt", "accessories"],
    Women: ["accessories", "dresses", "jeans", "shirt", "tshirt"],
    Boys: ["accessories", "jeans", "shirt", "polo", "tshirt"],
    Girls: ["accessories", "jeans", "shirt", "dress", "tshirt"],
  };

  // Handle image click
  const handleClick = async (index) => {
    const subcategory = categoryMap[category]?.[index];
     if (!subcategory) {
       alert('Invalid subcategory');
       return;
     }
     router.push(`/products?category=${category}&subcategory=${subcategory}`);
     
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center h-12 text-2xl font-bold bg-black text-white">
        {title}
      </div>

      <div className="w-full flex">
        {images?.map((img, index) => (
          <div
            key={index}
            className="w-[20%] hover:cursor-pointer overflow-hidden"
          >
            <Image
              onClick={() => handleClick(index)}
              className="w-full transition-all hover:scale-[1.05]"
              src={img}
              width={200}
              height={200}
              alt={`product-${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
