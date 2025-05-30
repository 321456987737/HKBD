"use client";
import React from "react";
import { useState, useEffect } from "react";
import MainSlider from "@/components/sliders/MainSlider";
import InfiniteTicker from "@/components/InfiniteTicker";
import ProductSection from "@/components/productSection/subproduct";
import images from "@/Assets/images";
import ProductSlider from "@/components/sliders/ProductSlider";
import { MessageCircle } from "lucide-react";
import ContactPopup from "@/components/reports/page";
import axios from "axios";
function Home() {
  useEffect(() => {
    const hasLogged = sessionStorage.getItem("visitLogged");
    console.log("hasLogged", hasLogged);
    if (hasLogged) return;

    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    }

    axios
      .post("/api/track-visit", {
        visitorId,
        path: window.location.pathname,
      })
      .then((res) => {
        console.log("Visit logged:", res.data);
      })
      .catch((err) => {
        console.error("Failed to log visit:", err);
      });

    sessionStorage.setItem("visitLogged", "true");
  }, []);

  const [open, setOpen] = useState(false);

  const mens = [
    images.menpolo,
    images.mentshirt,
    images.menjeans,
    images.menshirt,
    images.menaccessories,
  ];
  const women = [
    images.womensAccesories,
    images.womendress,
    images.womenjeans,
    images.womenShirt,
    images.womentshirts,
  ];
  const boys = [
    images.boyaccessories,
    images.boyjeans,
    images.boyshirt,
    images.boypolo,
    images.boytshirt,
  ];
  const girl = [
    images.girlaccessories,
    images.girljeans,
    images.girlshirt,
    images.girldress,
    images.girltshirt,
  ];
  return (
    <>
      <MainSlider />
      <InfiniteTicker />
      <ProductSection title="Mens" images={mens} category="Men" />
      <ProductSection title="Womens" images={women} category="Women" />
      <ProductSection title="boys" images={boys} category="Boys" />
      <ProductSection title="girl" images={girl} category="Girls" />
      <ProductSlider />

      {open && <ContactPopup onClose={() => setOpen(false)} />}
      <div className="fixed bottom-12 right-12 z-50 group">
        <div className="flex items-center space-x-2">
          <span className="bg-red-600 text-white px-3 py-2 rounded-l-full rounded-r-none shadow-lg opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 origin-right">
            Contact us
          </span>
          <button
            onClick={() => setOpen(true)}
            className="bg-red-600 p-4 rounded-full cursor-pointer text-white shadow-lg hover:bg-red-700 transition-all duration-300"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
