import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook01Icon,
  InstagramIcon,
  TwitterIcon,
  Linkedin01Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
} from "hugeicons-react";

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300 py-12 mt-20'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Brand Section */}
          <div>
            <Link to='/' className='text-2xl font-bold text-white mb-4 block'>
              Lookups
            </Link>
            <p className='text-gray-400 mb-6'>
              Discover the best products and trends in one place. Your ultimate destination for smart shopping.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='hover:text-white transition-colors'>
                <Facebook01Icon size={24} />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <InstagramIcon size={24} />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <TwitterIcon size={24} />
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                <Linkedin01Icon size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Quick Links</h3>
            <ul className='space-y-3'>
              <li>
                <Link to='/' className='hover:text-white transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/categories' className='hover:text-white transition-colors'>
                  Categories
                </Link>
              </li>
              <li>
                <Link to='/search' className='hover:text-white transition-colors'>
                  Search
                </Link>
              </li>
              <li>
                <Link to='/about' className='hover:text-white transition-colors'>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Account</h3>
            <ul className='space-y-3'>
              <li>
                <Link to='/profile' className='hover:text-white transition-colors'>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to='/my-products' className='hover:text-white transition-colors'>
                  My Products
                </Link>
              </li>
              <li>
                <Link to='/wishlist' className='hover:text-white transition-colors'>
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to='/orders' className='hover:text-white transition-colors'>
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Support</h3>
            <ul className='space-y-3'>
              <li>
                <Link to='/contact' className='hover:text-white transition-colors'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to='/terms' className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to='/privacy' className='hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li className='flex items-center gap-3 pt-4'>
                <Mail01Icon size={20} className='shrink-0' />
                <span>support@lookups.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 pt-8 text-center text-sm text-gray-500'>
          <p>&copy; {new Date().getFullYear()} Lookups. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
