import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon, Menu01Icon } from "hugeicons-react";

export default function Header() {
  return (
    <div
      className=' header w-[1500px] max-w-[95%]  m-auto
      flex justify-between items-center relative z-[100] px-[10px] py-[15px]
        '>
      <Link
        to='/'
        className=' font-bold text-[25px] text-nowrap
      '>
        Lookups
      </Link>
      <ul className=' hidden sm:flex  gap-[10px] justify-end font-bold'>
        <li>
          <Link to={"/register"}>Account</Link>
        </li>
        {/* <li>sign up</li>
        <li>sign up</li> */}
      </ul>
      <div className="">
        <ul className=" flex gap-[10px] justify-end font-bold">
          <li>
            <Link to={"/profile"}>Profile</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/register"}>Register</Link>
          </li>
        </ul>
      </div>

      <button className='flex sm:hidden justify-end font-semibold '>
        <Link to={"/profile"}>
          <Menu01Icon />
        </Link>
      </button>
    </div>
  );
}
