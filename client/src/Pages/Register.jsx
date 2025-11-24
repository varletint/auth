import React, { useState } from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Link } from "react-router-dom";

export default function Register() {
  document.title = "Register | New Account";

  const [formData, setFormData] = useState({});

  console.log(formData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  return (
    <div className='min-h-screen w-full relative flex items-center justify-center bg-gray-50 overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[100px]'></div>
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-[100px]'></div>
      </div>

      <div className='relative z-10 w-full max-w-md mx-4'>
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
            <p className='text-gray-500'>Join us and start your journey</p>
          </div>

          <div className='flex flex-col gap-5'>
            <Input
              type={"text"}
              placeholder={"Username"}
              OnChange={handleChange}
              id={"username"}
            />
            <Input
              type={"password"}
              placeholder={"Password"}
              OnChange={handleChange}
              id='password'
            />

            <Button
              text='Sign Up'
              className='bg-indigo-600 hover:bg-indigo-700 w-full mt-2'
            />
          </div>

          <div className='mt-6 text-center text-sm text-gray-500'>
            Already have an account?{" "}
            <Link to='/login' className='font-semibold text-indigo-600 hover:text-indigo-500 transition-colors'>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
