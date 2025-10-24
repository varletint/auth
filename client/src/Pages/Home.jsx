import React from "react";
import Header from "../Components/Header";
import {
  AdvertisimentIcon,
  FireIcon,
  GoogleLensIcon,
  HotPriceIcon,
  NanoTechnologyIcon,
  OrganicFoodIcon,
  SmartPhone01Icon,
} from "hugeicons-react";

export default function Home() {
  return (
    <>
      <Header />
      <div className=' min-h-screen  scroll-smooth mt-10'>
        <div className=' '>
          <h1 className=' px-3 font-semibold flex items-center gap-1.5'>
            Trending Lookups <FireIcon size={20} className='' />
          </h1>
          <div className='w-full bg-amber-500 lg:h-[500px] md:h-[350px] h-60 mt-3'></div>
          <div
            className='flex justify-between font-semibold 
            mt-10 px-3'>
            <h1
              className=' font-semibold flex items-center gap-1.5 py-1.5 
            bg-red-600 text-white  px-2.5'>
              Latest Lookups <HotPriceIcon size={20} className='' />
            </h1>
          </div>
          <div className='crousel justify-center mt-3'>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>

            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
              '></div>
          </div>
          <div
            className='flex justify-between font-semibold 
            mt-10 px-3'>
            <h1
              className=' font-semibold flex items-center gap-1.5 py-1.5 
            bg-red-600 text-white  px-2.5'>
              Food to Order <OrganicFoodIcon size={20} className='' />
            </h1>
          </div>
          <div className='crousel justify-center mt-3'>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
          </div>
          <h1
            className=' font-semibold flex items-center gap-1.5 px-3 mt-10 
          '>
            Marketing <AdvertisimentIcon size={20} className='' />
          </h1>
          <div className='w-full bg-amber-500 lg:h-[500px] md:h-[350px] h-60 mt-3'></div>
          <div
            className='flex justify-between font-semibold 
            mt-10 px-3'>
            <h1 className=' font-semibold flex items-center gap-1.5 bg-red-600 text-white  px-2.5 py-1.5'>
              Phone & Accessories <SmartPhone01Icon size={20} className='' />
            </h1>
            {/* <h1 className=' justify-end'>View All</h1> */}
          </div>
          <div className='crousel justify-center mt-3'>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
            <div
              className=' w-48 h-52 bg-red-600  flex-shrink-0
            '></div>
          </div>
        </div>
      </div>
    </>
  );
}
