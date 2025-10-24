import React, { useState } from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";

export default function Register() {
  document.title = "Register | New Account";

  const [formData, setFormData] = useState({});

  console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  return (
    <div className='h-[100vh] bg-[#fefcff]  w-full relative'>
      {/* <div
        class='absolute inset-0 -z-0 desi'
        style={{
          backgroundImage: `radial-gradient(circle at 30% 70%,  rgba(230, 221, 173) transparent 60% ),
    radial-gradient(circle at 70% 30%, rgba(250, 182, 193) transparent 60%)`,
        }}
      /> */}

      <div className='max-w-xl bg-red-500 h-screen mx-auto '>
        <div
          className='w-full h-full flex flex-col justify-center 
              items-center px-[.5rem] gap-5'>
          {/* <div className=''> */}
          <Input
            type={"text"}
            placeholder={"Username"}
            OnChange={handleChange}
            id={"username"}
          />
          <Input
            type={"text"}
            placeholder={"Password"}
            OnChange={handleChange}
            id='password'
          />
          {/* </div> */}
          <Button
            text='Submit'
            className='bg-white w-full mt-2 
          p-2.5 font-semibold'
          />
        </div>
      </div>
    </div>
  );
}
