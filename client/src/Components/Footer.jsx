import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className=' p-3.5 min-h-80 bg-[#222] mt-10'>
      <Link
        to='/'
        className=' font-bold text-[15px] text-nowrap
      px-[10px] py-[15px]'>
        Lookups
      </Link>
    </div>
  );
}
