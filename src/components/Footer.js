import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaPinterest,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 mt-[-10px] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About HKBD</h3>
            <p className="text-gray-400 mb-4">
              We provide high-quality fashion products at affordable prices. Our mission is to make 
              fashion accessible to everyone while maintaining exceptional quality and service.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://pinterest.com" className="text-gray-400 hover:text-white transition-colors">
                <FaPinterest size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                <span className="text-gray-400">
                  123 Fashion Street, Design District, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <span className="text-gray-400">support@hkbd.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="text-gray-400 flex items-center">
              <FaCreditCard className="mr-2" /> Credit Card
            </span>
            <span className="text-gray-400 flex items-center">
              <FaPaypal className="mr-2" /> PayPal
            </span>
            <span className="text-gray-400 flex items-center">
              <FaApplePay className="mr-2" /> Apple Pay
            </span>
            <span className="text-gray-400 flex items-center">
              <FaGooglePay className="mr-2" /> Google Pay
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © {currentYear} HKBD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// // Assuming this is your main layout file or page component

// const Layout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Main content */}
//       <main className="flex-grow">{children}</main>

//       {/* Footer */}
//       <footer className="bg-[#2C2C2C] text-white pt-10 pb-5 px-6 mt-[-10px] md:px-20 w-full">
//         <div className="grid md:grid-cols-3 gap-8 text-sm">
//           {/* Social Links */}
//           <div>
//             <h4 className="font-semibold mb-2">Follow Us</h4>
//             <ul className="space-y-1">
//               <li><a href="#" className="link-underline">Instagram</a></li>
//               <li><a href="#" className="link-underline">Facebook</a></li>
//               <li><a href="#" className="link-underline">YouTube</a></li>
//             </ul>
//           </div>

//           {/* About Section */}
//           <div>
//             <h4 className="font-semibold mb-2">We are BREAKOUT</h4>
//             <ul className="space-y-1">
//               <li><a href="#" className="link-underline">About</a></li>
//               <li><a href="#" className="link-underline">Contact us</a></li>
//               <li><a href="#" className="link-underline">Store location</a></li>
//               <li><a href="#" className="link-underline">Terms of Service</a></li>
//               <li><a href="#" className="link-underline">Refund policy</a></li>
//             </ul>
//           </div>

//           {/* Support Section */}
//           <div>
//             <h4 className="font-semibold mb-2">Support</h4>
//             <ul className="space-y-1">
//               <li><a href="#" className="link-underline">Track your order</a></li>
//               <li><a href="#" className="link-underline">FAQ&#39;s</a></li>
//               <li><a href="#" className="link-underline">Privacy policy</a></li>
//               <li><a href="#" className="link-underline">Terms & conditions</a></li>
//               <li><a href="#" className="link-underline">Exchange & Return</a></li>
//               <li><a href="#" className="link-underline">Cancellation policy</a></li>
//             </ul>
//           </div>
//         </div>

//         {/* Help Section */}
//         <div className="grid md:grid-cols-2 gap-6 mt-10 text-sm">
//           <div>
//             <h4 className="font-semibold mb-2">Blogs & News</h4>
//             <a href="#" className="link-underline">Read our latest blogs</a>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-2">Can we help you?</h4>
//             <p>Call us: <a href="tel:+923111100439" className="link-underline">+92 311 1100439</a></p>
//             <p>Mon–Fri: 10:00 AM to 05:00 PM</p>
//             <p>Saturday: 10:00 AM to 3:00 PM</p>
//             <p>Email: <a href="mailto:support@breakout.com.pk" className="link-underline">support@breakout.com.pk</a></p>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="mt-10 text-center text-xs text-gray-400">
//           &copy; {new Date().getFullYear()} Breakout. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;
