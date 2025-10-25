import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon, Menu01Icon } from "hugeicons-react";

export default function Header() {
  return (
    <div
      className=' header w-[1500px] max-w-[95%]  m-auto
      flex justify-between items-center relative z-[100] px-[10px] py-[15px]
       bg-green-500 '>
      <Link
        to='/'
        className=' font-bold text-[25px] text-nowrap
      '>
        Lookups
      </Link>
      <ul className=' hidden sm:flex  gap-[10px] justify-end font-medium'>
        <li>
          <Link to={"/register"}>sign up</Link>
        </li>
        <li>sign up</li>
        <li>sign up</li>
      </ul>

      <button className='flex sm:hidden justify-end font-semibold '>
        <Link to={"/profile"}>
          <Menu01Icon />
        </Link>
      </button>
    </div>
  );
}
