import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div
      className=' header w-[1500px] max-w-[95%]  m-auto
      grid justify-around items-center relative z-[100] '>
      <Link
        className=' font-bold text-[25px] text-nowrap
      px-[10px] py-[15px]'>
        KNT Lookups
      </Link>
      <ul className=' hidden sm:flex  gap-[10px] justify-end font-medium'>
        <li>sign up</li>
        <li>sign up</li>
        <li>sign up</li>
      </ul>

      <button className='flex sm:hidden justify-end font-semibold'>Menu</button>
    </div>
  );
}
