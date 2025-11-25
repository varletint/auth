import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu01Icon, MultiplicationSignIcon } from "hugeicons-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function to reset overflow when component unmounts or isMenuOpen changes
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div
      className='header w-[1500px] max-w-[95%] m-auto
      flex justify-between items-center relative z-[100] px-[10px] py-[15px]'>
      <Link to='/' className='font-bold text-[25px] text-nowrap'>
        Lookups
      </Link>

      {/* Desktop Navigation */}
      <ul className='hidden sm:flex gap-[20px] justify-end font-bold'>
        <li>
          <Link to={"/account"}>Account</Link>
        </li>
        <li>
          <Link to={"/profile"}>Profile</Link>
        </li>
        <li>
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/register"}>Register</Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className='flex sm:hidden justify-end z-[100] font-semibold text-[25px]'>
        {isMenuOpen ? <MultiplicationSignIcon /> : <Menu01Icon />}
      </button>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-[99] sm:hidden 
          transition-opacity duration-300 ease-in-out
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`
        }
        onClick={toggleMenu} // Close menu when clicking outside
      >
        <ul
          className={`absolute top-0 right-0 w-2/3 h-full bg-white flex flex-col items-center justify-cente gap-[30px] font-bold text-[20px] shadow-lg
            transform transition-transform duration-300 ease-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}` // Apply transition classes
          }
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
        >
          <li className="mt-20">
            <Link to={"/account"} onClick={toggleMenu}>
              Account
            </Link>
          </li>
          <li>
            <Link to={"/profile"} onClick={toggleMenu}>
              Profile
            </Link>
          </li>
          <li>
            <Link to={"/login"} onClick={toggleMenu}>
              Login
            </Link>
          </li>
          <li>
            <Link to={"/register"} onClick={toggleMenu}>
              Register
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
