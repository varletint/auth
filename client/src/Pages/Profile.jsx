import React, { useState } from "react";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import {
  UserIcon,
  GridViewIcon,
  PackageIcon,
  Settings02Icon,
  Logout01Icon,
  Camera01Icon,
  Edit02Icon,
  PlusSignIcon,
  Menu01Icon, // Added for mobile menu button
  // XCloseIcon, // Added for mobile menu close button
  MultiplicationSignIcon
} from "hugeicons-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar visibility

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: <GridViewIcon size={20} /> },
    { id: "profile", label: "My Profile", icon: <UserIcon size={20} /> },
    { id: "products", label: "My Products", icon: <PackageIcon size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings02Icon size={20} /> },
  ];

  return (
    <>
      {/* <Header /> */}
      <div className='min-h-screen bg-gray-50 flex border border-gray-900'>
        {/* Mobile menu button */}
        {/* <button
          className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md text-gray-700'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <MultiplicationSignIcon size={24} /> : <Menu01Icon size={24} />}
        </button> */}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:sticky md:top-0 md:h-screen overflow-y-auto flex flex-col`}
        >
          <div className='p-6 pt-20 md:pt-6 flex flex-col flex-grow'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold'>
                JD
              </div>
              <div>
                <h3 className='font-semibold text-gray-900'>John Doe</h3>
                <p className='text-xs text-gray-500'>Free Account</p>
              </div>
            </div>
            <nav className='space-y-1 flex-grow'>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close sidebar on item click for mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className='p-6 pt-0'>
            <button className='w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors'>
              <Logout01Icon size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/90 z-30 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className='flex-1 md:ml- pt-   '>
          <div className='sticky  top-0 z-10 bg-white py-4 px-6 border-b border-gray-200 mb-3 flex items-center justify-between'>
            <button
              className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white  text-gray-700'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <MultiplicationSignIcon size={24} /> : <Menu01Icon size={24} />}
            </button>
            <h2 className='ml-20 text-2xl font-bold text-gray-900'>My Profile</h2>
            {/* You can add a logo or other elements here */}
            {/* <img src="/path/to/your/logo.png" alt="Logo" className="h-8" /> */}
          </div>
          <div className='max-w- mx-auto p-2'>
            {/* Header Section */}
            {/* </div> */}
            <div className='relative mb-2.5 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200'>
              <div className='h-32 bg-gradient-to-r from-indigo-500 to-purple-600'></div>
              <div className='px-8 pb-8'>
                <div className='relative flex justify-between items-end -mt-12 mb-6'>
                  <div className='relative'>
                    <div className='w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden'>
                      <img
                        src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <button className='absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm text-gray-600 hover:text-indigo-600'>
                      <Camera01Icon size={16} />
                    </button>
                  </div>
                  <Button text='Edit Profile' className='bg-white border border-gray-200 !text-gray-700 hover:bg-gray-50 !py-2 !px-4 !shadow-sm' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>John Doe</h1>
                  <p className='text-gray-500'>Gadget Seller • Niger, KNT</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className='grid grid-cols-1 gap-2.5'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5'>
                {/* Left Column - Stats/Info */}
                <div className='space-y-6'>
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                    <h3 className='font-semibold text-gray-900 mb-4'>Profile Stats</h3>
                    <div className='space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600'>Profile Views</span>
                        <span className='font-semibold text-gray-900'>1,234</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600'>Products</span>
                        <span className='font-semibold text-gray-900'>45</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600'>Followers</span>
                        <span className='font-semibold text-gray-900'>892</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Main Content */}
                <div className='lg:col-span-1 md: space-y-6'>
                  {/* Edit Form */}
                  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                    <div className='flex justify-between items-center mb-6'>
                      <h3 className='font-semibold text-gray-900'>Personal Information</h3>
                      <button className='text-indigo-600 hover:text-indigo-700 text-sm font-medium'>Save Changes</button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>First Name</label>
                        <Input placeholder='John' type='text' />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>Last Name</label>
                        <Input placeholder='Doe' type='text' />
                      </div>
                      <div className='space-y-2 md:col-span-2'>
                        <label className='text-sm font-medium text-gray-700'>Email Address</label>
                        <Input placeholder='john.doe@example.com' type='email' />
                      </div>
                      <div className='space-y-2 md:col-span-2'>
                        <label className='text-sm font-medium text-gray-700'>Bio</label>
                        <textarea
                          className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 min-h-[100px]'
                          placeholder='Tell us about yourself...'
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}

                </div>
              </div>
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='font-semibold text-gray-900'>My Products</h3>
                  <Button text='Add Product' className='bg-indigo-600 !py-2 !px-4 !text-sm' />
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
                          <button className='flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100'>Edit</button>
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
