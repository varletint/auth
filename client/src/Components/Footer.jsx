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
                <Link to='/register' className='hover:text-white transition-colors'>
                  Register
                </Link>
              </li>
              <li>
                <Link to='/login' className='hover:text-white transition-colors'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/profile' className='hover:text-white transition-colors'>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Categories</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='hover:text-white transition-colors'>
                  Trending
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition-colors'>
                  Latest Lookups
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition-colors'>
                  Food & Dining
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-white transition-colors'>
                  Technology
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Contact Us</h3>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <Location01Icon size={20} className='mt-1 shrink-0' />
                <span>123 Innovation Drive, Tech City, TC 90210</span>
              </li>
              <li className='flex items-center gap-3'>
                <Call02Icon size={20} className='shrink-0' />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className='flex items-center gap-3'>
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
