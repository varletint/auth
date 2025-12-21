import React, { useState, useEffect } from "react";
// IMPROVEMENT #1: Added useLocation to auto-close menu on route change
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu01Icon,
  MultiplicationSignIcon,
  Logout01Icon,
  Search01Icon,
  ShoppingCart01Icon,
  FavouriteIcon,
  ShoppingBag01Icon,
  DashboardSquare01Icon,
  Settings02Icon,
  PackageIcon,
  MoneyBag01Icon,
  Analytics01Icon,
} from "hugeicons-react";
import useAuthStore from "../store/useAuthStore";
import lookups from "../assets/logo.png";

// ==========================================
// IMPROVEMENT #2: Extract Navigation Items into Config Arrays
// This reduces code duplication between desktop and mobile navigation
// ==========================================
const bizNavItems = [
  { to: "/inventory", icon: PackageIcon, label: "Inventory", hoverColor: "hover:text-blue-600" },
  { to: "/sales", icon: MoneyBag01Icon, label: "Sales", hoverColor: "hover:text-emerald-600" },
  { to: "/biz-dashboard", icon: Analytics01Icon, label: "Dashboard", hoverColor: "hover:text-emerald-600" },
];

const bizMobileNavItems = [
  { to: "/biz-dashboard", icon: Analytics01Icon, label: "Dashboard" },
  { to: "/inventory", icon: PackageIcon, label: "Inventory" },
  { to: "/sales", icon: MoneyBag01Icon, label: "Sales" },
  { to: "/expenses", icon: ShoppingBag01Icon, label: "Expenses" },
  { to: "/customers", icon: Settings02Icon, label: "Customers" },
];

const marketplaceNavItems = [
  { to: "/search", icon: Search01Icon, label: "Search", hoverColor: "hover:text-emerald-600" },
  { to: "/wishlist", icon: FavouriteIcon, label: "Wishlist", hoverColor: "hover:text-red-500" },
  { to: "/cart", icon: ShoppingCart01Icon, label: "Cart", hoverColor: "hover:text-emerald-600" },
  { to: "/my-products", icon: ShoppingBag01Icon, label: "My Products", hoverColor: "hover:text-emerald-600" },
  { to: "/dashboard", icon: DashboardSquare01Icon, label: "Dashboard", hoverColor: "hover:text-emerald-600" },
];

const marketplaceMobileNavItems = [
  { to: "/search", icon: Search01Icon, label: "Search" },
  { to: "/cart", icon: ShoppingCart01Icon, label: "Cart" },
  { to: "/wishlist", icon: FavouriteIcon, label: "Wishlist" },
  { to: "/my-products", icon: ShoppingBag01Icon, label: "My Products" },
  { to: "/dashboard", icon: DashboardSquare01Icon, label: "Dashboard" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuthStore();
  const navigate = useNavigate();
  // IMPROVEMENT #3: Added useLocation for auto-closing menu on route change
  const location = useLocation();

  // Check if user is admin
  const isAdmin = currentUser?.role?.includes("admin");
  // Check if user is business management user
  const isBizUser = currentUser?.appType === "business_management";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setIsMenuOpen(false);
  };



  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

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

  // Helper component for rendering nav items (reduces duplication)
  const NavIcon = ({ to, icon: Icon, label, hoverColor = "hover:text-emerald-600" }) => (
    <li>
      <Link to={to} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title={label}>
        <Icon size={22} className={`text-gray-600 ${hoverColor}`} />
      </Link>
    </li>
  );

  // Helper component for mobile nav items
  const MobileNavItem = ({ to, icon: Icon, label }) => (
    <li>
      <Link to={to} className="flex items-center gap-2">
        <Icon size={20} />
        {label}
      </Link>
    </li>
  );

  return (
    <>

      <header
        className=' sticky top-0 w-full border-b border-gray-200 
       z-[100]  bg-white'
      // className="header sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-6 h-14 sm:h-16">

          <Link
            to={isBizUser ? '/biz-dashboard' : '/'}
            className="flex items-center gap-2 group"
          >
            <img
              src={lookups}
              alt="Lookups"
              className="h-9 w-9 sm:h-10 sm:w-10 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Lookups
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden sm:flex items-center gap-1">
            {currentUser ? (
              <>

                {/* NEW: Using config arrays */}
                {(isBizUser ? bizNavItems : marketplaceNavItems).map((item) => (
                  <NavIcon key={item.to} {...item} />
                ))}

                <li className="border-l border-gray-200 pl-4 ml-2">
                  <Link to={"/profile"} className="hover:text-emerald-600 transition-colors">Profile</Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" className="text-red-600 hover:text-red-700 font-semibold transition-colors">Admin</Link>
                  </li>
                )}
                {!isBizUser && (
                  <li>
                    <Link to={"/add-product"} className="text-emerald-600 hover:text-emerald-700 transition-colors">Add Product</Link>
                  </li>
                )}
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
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className='flex sm:hidden justify-end z-[100] font-semibold text-[25px] '>
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


                  {(isBizUser ? bizMobileNavItems : marketplaceMobileNavItems).map((item) => (
                    <MobileNavItem key={item.to} {...item} />
                  ))}

                  <li className="border-t border-gray-200 pt-4 w-full text-center">
                    {/* PREVIOUS: onClick={toggleMenu} - no longer needed */}
                    <Link to={"/profile"}>
                      Profile
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin" className="text-red-600 font-semibold">
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  {!isBizUser && (
                    <li>
                      <Link to={"/add-product"} className="text-emerald-600">
                        Add Product
                      </Link>
                    </li>
                  )}
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
                    {/* PREVIOUS: onClick={toggleMenu} - no longer needed */}
                    <Link to={"/login"}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to={"/register"}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
