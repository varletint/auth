import React from "react";
import Header from "../Components/Header";
import Input from "../Components/Input";

export default function Profile() {
  return (
    <>
      {/* <Header /> */}
      <div className='flex flex-row '>
        <div className=' min-h-screen lg:w-52 sm:w-40 bg-gray-500'></div>
        <div className=' bg-red-600 min-h-[1500px] w-full '>
          <div className=' min-h-[8vh] bg-amber-300'></div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
