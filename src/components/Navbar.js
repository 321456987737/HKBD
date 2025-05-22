"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CartPanel from "@/components/cart/CartPanel";
import SearchBar from "@/components/search/SearchBar";
import UseCartStore from "@/store/CartStore";
function Navbar() {
  const cartItems = UseCartStore((state) => state.cartItems);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Set to true if scrolled more than 10px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCart = () => setIsCartVisible(!isCartVisible);
  const toggleSearchBar = () => setIsSearchBarVisible(!isSearchBarVisible);

  const handleMouseEnter = (category) => {
    setActiveCategory(category);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
    setTimeout(() => {
      setActiveCategory(null);
    }, 300); // match animation duration
  };

  const menuData = {
    men: {
      title: "MEN",
      sections: [
        {
          title: "ACCESSORIES",
          items: ["Shoes", "Jewellery", "Sunglasses", "Belts", "Bags"],
        },
        {
          title: "BEST PRICES",
          items: ["Flat 50% Tees", "Buy 1 Get 1 Shorts", "Winter Clearance"],
        },
        {
          title: "NEW ARRIVALS",
          items: ["SS'2025 Collection", "Graphic Tees", "Cargo Joggers"],
        },
        {
          title: "THE BOXY",
          items: ["Oversized Tees", "Loose Fit Jeans", "Boxy Co-ords"],
        },
        {
          title: "CLOTHING",
          items: ["Tees", "Polos", "Shirts", "Chinos", "Joggers", "Co-ords"],
        },
      ],
    },
    women: {
      title: "WOMEN",
      sections: [
        {
          title: "ACCESSORIES",
          items: ["Shoes", "Jewellery", "Scrunchies", "Sunglasses", "Bags"],
        },
        {
          title: "BEST PRICES",
          items: ["Dress Discounts", "2 for 1 Tops", "Clearance Deals"],
        },
        {
          title: "NEW ARRIVALS",
          items: ["Sublime Capsule", "Feels Like Holidays", "SS'2025"],
        },
        {
          title: "THE BOXY",
          items: ["Boxy Shirts", "Boxy Tees", "Boxy Co-ords"],
        },
        {
          title: "CLOTHING",
          items: [
            "Knit Tops",
            "Shirts",
            "Dresses",
            "Denims",
            "Trousers",
            "Co-ords",
          ],
        },
      ],
    },
    boy: {
      title: "BOY",
      sections: [
        {
          title: "ACCESSORIES",
          items: ["Hats", "Sunglasses", "Bags", "Socks"],
        },
        { title: "BEST PRICES", items: ["Combo Packs", "Sale Picks"] },
        { title: "NEW ARRIVALS", items: ["Feels Like Holidays", "SS'2025"] },
        { title: "THE BOXY", items: ["Boxy Tees", "Short Sets"] },
        { title: "CLOTHING", items: ["Tees", "Shirts", "Bottoms", "Co-ords"] },
      ],
    },
    girl: {
      title: "GIRL",
      sections: [
        {
          title: "ACCESSORIES",
          items: ["Hair Accessories", "Bags", "Shoes", "Jewelry"],
        },
        {
          title: "BEST PRICES",
          items: ["Dress Sale", "Combo Offers", "Clearance"],
        },
        {
          title: "NEW ARRIVALS",
          items: ["Summer Collection", "Prints & Patterns", "SS'2025"],
        },
        { title: "THE BOXY", items: ["Loose Tops", "Playful Sets"] },
        {
          title: "CLOTHING",
          items: ["Dresses", "Tops", "Bottoms", "Sets", "Skirts"],
        },
      ],
    },
  };

  // const profile = () => {
  //   if (!session) {
  //     Router.push("/signin");
  //   } else {
  //     Router.push("/u");
  //   }
  // };

  // ... existing code ...
  // ... existing code ...
  // ... existing code ...
  return (
    // <div className="fixed top-0 left-0 right-0">
    <div
      className={`fixed z-50 top-0 left-0 right-0 transition-colors duration-300 ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => showDropdown && setShowDropdown(true)}
    >
      <div className="navbar-bg sticky top-0 z-50 ">
        <SearchBar isVisible={isSearchBarVisible} onClose={toggleSearchBar} />
        <CartPanel isVisible={isCartVisible} onClose={toggleCart} />

        <div className="flex items-center justify-between px-8 py-3 h-14 w-full relative">
          {/* Left: Menu */}
          <div className="flex-1 min-w-0">
            <div className="mega-menu-container relative">
              <ul className="flex justify-start space-x-10 text-base font-semibold tracking-wide uppercase">
                {Object.keys(menuData).map((category) => (
                  <li key={category} className="py-2 relative">
                    <a
                      href={`/${category}`}
                      className={`transition-colors duration-300 px-3 py-2 rounded-md relative hover:bg-[#f5f5f5]/50 ${
                        activeCategory === category
                          ? "font-bold text-black"
                          : "text-gray-700"
                      }`}
                      onMouseEnter={() => handleMouseEnter(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      {activeCategory === category && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black animate-expand"></span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center items-center">
            <Link href="/">
              <Image
                className="cursor-pointer hover:scale-110 transition-transform duration-300 "
                src="/logo.png"
                alt="Logo"
                width={90}
                height={90}
              />
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex-1 flex items-center justify-end">
            <ul className="flex items-center space-x-8 mr-2.5">
              <li>
                <Link
                  href="/profile"
                  className="cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    width={28}
                    height={28}
                    className="filter grayscale brightness-0"
                  />
                </Link>
              </li>

              <li>
                <Image
                  className="cursor-pointer hover:scale-110 transition-transform duration-300 filter grayscale brightness-0"
                  src="/search.png"
                  alt="Search"
                  width={28}
                  height={28}
                  onClick={toggleSearchBar}
                />
              </li>
              <li className="relative">
                <div className="absolute top-[-10px] h-4 w-4 flex items-center justify-center  right-[-10px] bg-red-500 text-white rounded-full">
                  {cartItems.length}
                </div>
                <Image
                  className="cursor-pointer hover:scale-110 transition-transform duration-300 filter grayscale brightness-0"
                  src="/cart.png"
                  alt="Cart"
                  width={28}
                  height={28}
                  onClick={toggleCart}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dropdown Mega Menu - OUTSIDE the nav bar, centered and 92% width */}
      {activeCategory && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 w-[92%]  overflow-x-hidden h-72 bg-[#FDFAF6] shadow-2xl rounded-b-xl z-50 menu-dropdown border-t border-gray-200 ${
            showDropdown ? "fade-in" : "fade-out"
          }`}
          style={{ top: "100%" }}
        >
          <div className="w-full px-10 py-8 h-full">
            <div className="flex flex-row justify-between space-x-8">
              {menuData[activeCategory].sections.map((section, index) => (
                <div key={index} className="flex-1 menu-section">
                  <h3 className="font-semibold text-gray-900 mb-4 tracking-wider text-sm">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="hover:translate-x-2 hover:font-semibold cursor-pointer transition-all duration-200 menu-item text-gray-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar-bg {
          background: transparent;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-16px) scaleY(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          to {
            opacity: 0;
            transform: translateY(-16px) scaleY(0.98);
          }
        }
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .fade-out {
          animation: fadeOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .menu-section {
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .menu-item {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-expand {
          animation: expandWidth 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
    // </div>
  );
}
export default Navbar;
