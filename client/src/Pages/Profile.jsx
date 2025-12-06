import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { apiCall } from "../api/api.js";
import {
  GridViewIcon,
  UserIcon,
  ShoppingBag02Icon,
  Settings02Icon,
  Logout01Icon,
  Camera01Icon,
  Edit02Icon,
  PlusSignIcon,
  Menu01Icon,
  MultiplicationSignIcon,
  Loading03Icon
} from "hugeicons-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [profileStats, setProfileStats] = useState({
    totalProducts: 0,
    postsRemaining: 7,
    postsUsed: 0,
    weeklyLimit: 7,
    daysUntilReset: 7,
    isSeller: false
  });
  const { currentUser, signOut } = useAuthStore();
  const navigate = useNavigate();

  // Fetch profile stats on mount
  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!currentUser) return;
      try {
        setStatsLoading(true);
        const data = await apiCall("/user/profile-stats", "GET");
        if (data.success) {
          setProfileStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching profile stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchProfileStats();
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      signOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: <GridViewIcon size={20} />, path: null },
    { id: "profile", label: "Edit Profile", icon: <UserIcon size={20} />, path: "/edit-profile" },
    { id: "products", label: "My Products", icon: <ShoppingBag02Icon size={20} />, path: "/my-products" },
    { id: "orders", label: "Orders", icon: <ShoppingBag02Icon size={20} />, path: "/orders" },
    { id: "settings", label: "Settings", icon: <Settings02Icon size={20} />, path: "/settings" },
  ];

  return (
    <>
      {/* <Header /> */}
      <div className='min-h-screen bg-off-white flex border border-gray-900'>
        {/* Mobile menu button */}
        <button
          className='md:hidden fixed top-4 left-4 z-50 p-2 py-2 rounded-md bg-white shadow-md text-gray-700'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MultiplicationSignIcon size={24} /> : <Menu01Icon size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:sticky md:top-0 md:h-screen overflow-y-auto flex flex-col`}
        >
          <div className='p-6 pt-20 md:pt-6 flex flex-col flex-grow'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase'>
                {currentUser?.username?.[0] || "U"}
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>{currentUser?.username || "User"}</h3>
                <p className='text-xs text-gray-500'>Free Account</p>
              </div>
            </div>
            <nav className='space-y-1 flex-grow'>
              {sidebarItems.map((item) => (
                item.path ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-off-white hover:text-gray-900`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-off-white hover:text-gray-900"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )
              ))}
            </nav>
          </div>
          <div className='p-6 pt-0'>
            <button
              onClick={handleSignOut}
              className='w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors'
            >
              <Logout01Icon size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/70 z-30 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className='flex-1 md:ml- pt-   '>
          <div className='sticky  top-0 z-10 bg-white py-4 px-6 border-b border-gray-200 mb-3 flex items-center justify-between'>
            <button
              className='md:hidden fixed top-4 left-4 z-50 p-2 py-2 rounded-md bg-white  text-gray-700'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <MultiplicationSignIcon size={24} /> : <Menu01Icon size={24} />}
            </button>
            <h2 className='ml-20 text-2xl font-bold text-gray-900'>My Profile</h2>
          </div>
          <div className='max-w- mx-auto p-2'>
            {/* Header Section */}
            <div className='relative mb-2.5 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200'>
              <div className='h-32 bg-gradient-to-r from-blue-600 to-amber-400'></div>
              <div className='px-8 pb-8'>
                <div className='relative flex justify-between items-end -mt-12 mb-6'>
                  <div className='relative'>
                    <div className='w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-100 uppercase'>
                      {currentUser?.username?.[0] || "U"}
                    </div>
                    <button className='absolute bottom-0 right-0 p-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full  shadow-sm border-2 border-white'>
                      <Camera01Icon size={14} />
                    </button>
                  </div>
                  <Button text='Edit Profile' onClick={() => navigate('/edit-profile')} className='!py-2 !px-4 !text-sm bg-white !text-gray-700 border border-gray-200 hover:bg-off-white !shadow-sm' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>{currentUser?.username || "User"}</h1>
                  <p className='text-gray-500'>{currentUser?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className='grid grid-cols-1 gap-2.5'>
              <div className='grid grid-cols-1 md:grid-2 lg:grid-cols-2 gap-2.5'>
                {/* Left Column - Stats/Info */}
                <div className='space-y-6'>
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                    <h3 className='font-semibold text-gray-900 mb-4'>Profile Stats</h3>
                    {statsLoading ? (
                      <div className='flex justify-center py-4'>
                        <Loading03Icon size={24} className='animate-spin text-indigo-600' />
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                          <span className='text-gray-600'>Total Products</span>
                          <span className='font-semibold text-gray-900'>{profileStats.totalProducts}</span>
                        </div>
                        {profileStats.isSeller && (
                          <>
                            <div className='flex justify-between items-center'>
                              <span className='text-gray-600'>Posts This Week</span>
                              <span className='font-semibold text-gray-900'>
                                {profileStats.postsUsed} / {profileStats.weeklyLimit}
                              </span>
                            </div>
                            <div className='flex justify-between items-center'>
                              <span className='text-gray-600'>Posts Remaining</span>
                              <span className={`font-semibold ${profileStats.postsRemaining > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {profileStats.postsRemaining}
                              </span>
                            </div>
                            <div className='flex justify-between items-center'>
                              <span className='text-gray-600'>Days Until Reset</span>
                              <span className='font-semibold text-blue-600'>{profileStats.daysUntilReset} days</span>
                            </div>
                            {/* Progress bar for weekly posts */}
                            <div className='pt-2'>
                              <div className='flex justify-between text-xs text-gray-500 mb-1'>
                                <span>Weekly Post Usage</span>
                                <span>{Math.round((profileStats.postsUsed / profileStats.weeklyLimit) * 100)}%</span>
                              </div>
                              <div className='w-full bg-gray-200 rounded-full h-2'>
                                <div
                                  className={`h-2 rounded-full transition-all ${profileStats.postsRemaining > 3 ? 'bg-emerald-500' :
                                    profileStats.postsRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  style={{ width: `${(profileStats.postsUsed / profileStats.weeklyLimit) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </>
                        )}
                        {!profileStats.isSeller && (
                          <div className='text-sm text-gray-500 pt-2'>
                            <Link to="/become-seller" className='text-indigo-600 hover:underline'>
                              Become a seller
                            </Link> to start listing products.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Main Content */}

              </div>
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='font-semibold text-gray-900'>My Products</h3>
                  <Link to='/add-product'>
                    <Button text='Add Product' className='bg-blue-600 hover:bg-blue-600-dark !py-2 !px-4 !text-sm' />
                  </Link>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow'>
                      <div className='h-48 bg-gray-200 relative'>
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors'></div>
                      </div>
                      <div className='p-4'>
                        <h4 className='font-semibold text-gray-900 mb-1'>Product Name {item}</h4>
                        <p className='text-sm text-gray-500 mb-3'>$99.00</p>
                        <div className='flex gap-2'>
                          <button className='flex-1 py-2 text-sm font-medium text-gray-600 bg-off-white rounded-lg hover:bg-gray-100'>Edit</button>
                          <button className='flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100'>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
// </aside >


