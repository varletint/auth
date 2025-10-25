import React from "react";
import Header from "../Components/Header";
import Input from "../Components/Input";
import {
  AddCircleHalfDotIcon,
  Doc01Icon,
  Doc02Icon,
  ListViewIcon,
  ProductLoadingIcon,
  Profile02Icon,
  ProfileIcon,
  PropertyAddIcon,
  UserIcon,
  ViewIcon,
} from "hugeicons-react";

export default function Profile() {
  return (
    <>
      {/* <Header /> */}
      <div className='flex flex-row '>
        <div
          className='  h-[100vh] lg:w-60 sm:w-52 hidden sm:block bg-gray-500 sticky
        overflow-y-none top-0  '>
          <div className='px-2 flex flex-col gap-5'>
            <div className=' py-2.5 h-[50px] '>
              <h1 className=' text-lg font-semibold'>Dashboard</h1>
            </div>
            <div className=' font-semibold '>
              <ul className=' text-sm flex flex-col gap-4'>
                <li className='flex items-center gap-1'>
                  <UserIcon size={18} /> Profile
                </li>
                <li className='flex items-center gap-1 text-nowrap'>
                  <Doc02Icon size={18} /> Overview
                </li>
                <li className='flex items-center gap-1 text-nowrap'>
                  <ProductLoadingIcon size={18} /> My Products
                </li>
                <li className='flex items-center gap-1 text-nowrap'>
                  <AddCircleHalfDotIcon size={18} /> Add product
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className=' bg-red-600 min-h-[1500px w-full '>
          <div className=' min-h-[50px] bg-amber-300'></div>
          <div className='w-full bg-red-200 p-3'>
            <div className='h-[] bg-yellow-700 p-1.5'>
              <div className='flex flex-col sm:flex-row  items-center gap-2.5'>
                <div className='bg-red-500 h-42 w-42 rounded-full'></div>
                <div className='flex gap-2 flex-col'>
                  <Input
                    className='bg-white px-1.5 py-1'
                    placeholder={"Fullname"}
                  />
                  <Input
                    className='bg-white px-1.5 py-1'
                    placeholder={"username"}
                  />
                </div>
                <div className='flex gap-2 flex-col'>
                  <Input
                    className='bg-white px-1.5 py-1'
                    placeholder={"Fullname"}
                  />
                  <Input
                    className='bg-white px-1.5 py-1'
                    placeholder={"username"}
                  />
                </div>
              </div>
            </div>
            <div className='mt-5'>
              <h1 className=' font-bold'>My Products</h1>
              <div
                className=' grid gap-2 
              [grid-template-columns:repeat(2,1fr)]
              sm:[grid-template-columns:repeat(3,1fr)]
              
              lg:[grid-template-columns:repeat(5,1fr)]
               mt-2'>
                {/* <div className='bg-red-500 h-20'>1</div>
                <div className='bg-red-500 h-20'>1</div>
                <div className='bg-red-500 h-20'>1</div> */}
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
                <div className='card'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
