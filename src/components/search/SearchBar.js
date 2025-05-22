"use client";
import React from "react";
import Image from "next/image";

function SearchBar({ isVisible, onClose }) {
  return (
    <>
      {isVisible && (
        <div className={`fixed inset-0 z-50 flex flex-col w-full min-h-screen`}>
          {/* Top Bar */}
          <div
            className={`h-16 bg-white fixed top-0 z-50 flex w-full shadow-md  ${
              isVisible ? "animate-slide-down" : "animate-slide-up"
            }`}
          >
            <div className="w-[15%] flex items-center justify-end mr-[10px]">
              <button className="cursor-pointer">
                <Image
                  className="cursor-pointer hover:bg-slate-100 rounded-full transition-transform duration-300 ease-in-out hover:rotate-90"
                  src="/search.png"
                  alt="search"
                  width={24}
                  height={24}
                  title="search"
                />
              </button>
            </div>
            <div className="w-[70%] flex items-center">
              <input
                className="bg-white md:text-lg text-sm w-full h-12 pl-3 outline-none border-2 border-[#E5E5E5] rounded-tl-md rounded-bl-md"
                type="text"
                placeholder="SEARCH HERE"
              />
              <button className="h-12 flex items-center justify-center border-2 px-4 hover:cursor-pointer hover:bg-slate-100  transition  border-[#E5E5E5] rounded-tr-md rounded-br-md">
                Clear
              </button>
            </div>
            <div className="w-[15%] flex items-center justify-start ml-[10px]">
              <Image
                className="cursor-pointer hover:bg-slate-100 rounded-full transition-transform duration-300 ease-in-out hover:rotate-180"
                src="/close.png"
                onClick={onClose}
                alt="close"
                width={24}
                height={24}
                title="close"
              />
            </div>
          </div>

          {/* Overlay */}
          <div
            onClick={onClose}
            className={`absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-40 ${
              isVisible ? "backdrop-blur-sm" : ""
            }`}
          ></div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
