"use client";
export default function InfiniteTicker() {
  const items = [
    "Spring Summer 2025 Collection",
    "Free Shipping on All Orders",
    "New Arrivals Weekly",
    "Limited Edition Pieces",
    "Exclusive Collaborations",
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white text-black h-12 flex items-center">
      {/* Fading edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Ticker wrapper */}
      <div className="w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Group 1 */}
          <div className="flex">
            {items.map((text, i) => (
              <div key={i} className="px-8 flex items-center">
                <span className="font-bold mr-2">•</span> {text}
              </div>
            ))}
          </div>
          {/* Group 2 (duplicate) */}
          <div className="flex">
            {items.map((text, i) => (
              <div key={`dup-${i}`} className="px-8 flex items-center">
                <span className="font-bold mr-2">•</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
