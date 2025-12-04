import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu01Icon, MultiplicationSignIcon, Logout01Icon } from "hugeicons-react";
import useAuthStore from "../store/useAuthStore";
import lookups from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <div
        className='header sticky top-0 w-[1500px] max-w-[95%] m-auto border-b border-gray-200 
      flex justify-between items-center z-[100] px-[0px] py-[0px] bg-white'>
        <Link to='/' className='font-bold  text-nowrap
      flex items-center gap-[0px] text-emerald-600 '>
          <img src={lookups} alt="Lookups" className="h-[60px] w-[60px]" />
          <span className="text-[20px] ml-[-12px]">Lookups</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className='hidden sm:flex gap-[20px] justify-end items-center font-bold'>
          {currentUser ? (
            <>
              <li>
                <Link to={"/profile"}>Profile</Link>
              </li>
              <li>
                <Link to={"/add-product"} className="text-emerald-600">Add Product</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Logout01Icon size={18} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
              <li>
                <Link to={"/register"}>Register</Link>
              </li>
            </>
          )}
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
          onClick={toggleMenu}
        >
          <ul
            className={`absolute top-0 right-0 w-2/3 h-full bg-white flex flex-col items-center justify-center gap-[30px] font-bold text-[20px] shadow-lg
            transform transition-transform duration-300 ease-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`
            }
            onClick={(e) => e.stopPropagation()}
          >
            {currentUser ? (
              <>
                <li>
                  <Link to={"/profile"} onClick={toggleMenu}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={"/add-product"} onClick={toggleMenu} className="text-emerald-600">
                    Add Product
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-red-500 transition-colors"
                  >
                    <Logout01Icon size={20} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="w-full border-b border-gray-200 bg-white"></div>
    </>
  );
}
