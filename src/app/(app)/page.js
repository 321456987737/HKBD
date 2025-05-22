"use client";
import React from "react";
import MainSlider from "@/components/sliders/MainSlider";
import InfiniteTicker from "@/components/InfiniteTicker";
import ProductSection from "@/components/productSection/subproduct";
import images from "@/Assets/images";
import ProductSlider from "@/components/sliders/ProductSlider";
function Home() {
  
  const mens = [images.menpolo, images.mentshirt, images.menjeans, images.menshirt, images.menaccessories];
  const women =[images.womensAccesories,images.womendress,images.womenjeans,images.womenShirt,images.womentshirts];
  const boys = [images.boyaccessories, images.boyjeans, images.boyshirt, images.boypolo, images.boytshirt];
  const girl =[images.girlaccessories, images.girljeans, images.girlshirt, images.girldress, images.girltshirt];
  return (
    <>
      <MainSlider />
      <InfiniteTicker />
      <ProductSection title="Mens" images={mens} category="Men" />
      <ProductSection title="Womens" images={women} category="Women" />
      <ProductSection title="boys" images={boys} category="Boys" />
      <ProductSection title="girl" images={girl} category="Girls" />
      <ProductSlider/>
    </>
  );
}

export default Home;
