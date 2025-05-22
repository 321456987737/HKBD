"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
export default function ImageGalleryModal() {
   const searchParams = useSearchParams();
   const params = useParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(
    Number(searchParams.get("idx")) || 0
  );
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/singalproduct?id=${params.id}&category=${category}`);

        setProduct(res.data);
        setImages([res.data.primaryimage, ...res.data.secondaryimage]);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [params.id, category]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const closeModal = () => {
    router.back();
  };

  if (!product || images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      <div className="relative w-full max-w-4xl h-full max-h-[90vh]">
        {images[currentIndex] && (
          <Image
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        )}

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}