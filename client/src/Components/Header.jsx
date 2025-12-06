import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu01Icon,
  MultiplicationSignIcon,
  Logout01Icon,
  Search01Icon,
  ShoppingCart01Icon,
  FavouriteIcon,
  ShoppingBag01Icon,
  DashboardSquare01Icon,
  Settings02Icon
} from "hugeicons-react";
import useAuthStore from "../store/useAuthStore";
import lookups from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuthStore();
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = currentUser?.role?.includes("admin");

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
              {/* Quick Access Icons */}
              <li>
                <Link to={"/search"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Search">
                  <Search01Icon size={22} className="text-gray-600 hover:text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link to={"/wishlist"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Wishlist">
                  <FavouriteIcon size={22} className="text-gray-600 hover:text-red-500" />
                </Link>
              </li>
              <li>
                <Link to={"/cart"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Cart">
                  <ShoppingCart01Icon size={22} className="text-gray-600 hover:text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link to={"/my-products"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="My Products">
                  <ShoppingBag01Icon size={22} className="text-gray-600 hover:text-emerald-600" />
                </Link>
              </li>
              <li>
                <Link to={"/dashboard"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Dashboard">
                  <DashboardSquare01Icon size={22} className="text-gray-600 hover:text-emerald-600" />
                </Link>
              </li>
              <li className="border-l border-gray-200 pl-4 ml-2">
                <Link to={"/profile"} className="hover:text-emerald-600 transition-colors">Profile</Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold transition-colors">Admin</Link>
                </li>
              )}
              <li>
                <Link to={"/add-product"} className="text-emerald-600 hover:text-emerald-700 transition-colors">Add Product</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors py-2"
                >
                  <Logout01Icon size={18} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/search"} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Search">
                  <Search01Icon size={22} className="text-gray-600 hover:text-emerald-600" />
                </Link>
              </li>
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
                  <Link to={"/search"} onClick={toggleMenu} className="flex items-center gap-2">
                    <Search01Icon size={20} />
                    Search
                  </Link>
                </li>
                <li>
                  <Link to={"/cart"} onClick={toggleMenu} className="flex items-center gap-2">
                    <ShoppingCart01Icon size={20} />
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to={"/wishlist"} onClick={toggleMenu} className="flex items-center gap-2">
                    <FavouriteIcon size={20} />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to={"/my-products"} onClick={toggleMenu} className="flex items-center gap-2">
                    <ShoppingBag01Icon size={20} />
                    My Products
                  </Link>
                </li>
                <li>
                  <Link to={"/dashboard"} onClick={toggleMenu} className="flex items-center gap-2">
                    <DashboardSquare01Icon size={20} />
                    Dashboard
                  </Link>
                </li>
                <li className="border-t border-gray-200 pt-4 w-full text-center">
                  <Link to={"/profile"} onClick={toggleMenu}>
                    Profile
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" onClick={toggleMenu} className="text-red-600 font-semibold">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <Link to={"/add-product"} onClick={toggleMenu} className="text-emerald-600">
                    Add Product
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-red-500 transition-colors py-2"
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
