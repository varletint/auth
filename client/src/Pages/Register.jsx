import React, { useEffect, useState } from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthStore from "../store/useAuthStore";

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  phone_no: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(11, "Phone number must not exceed 11 digits"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
}).required();

export default function Register() {
  document.title = "Register | New Account";
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);

  const { loading, error, signInStart, signInSuccess, signInFailure } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(watch());

  // Auto-dismiss error after 3.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        signInFailure(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const onSubmit = async (data) => {
    signInStart();
    const signUpData = {
      username: data.username,
      phone_no: data.phone_no,
      password: data.password,
    };
    try {
      const result = await authApi.signup(signUpData);

      console.log("Registration success:", result);
      signInSuccess(result);
      setSuccessMessage("Account created successfully! Redirecting...");

      // Navigate after showing success message (2 seconds)
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      signInFailure(err.message);
    }
  };

  return (
    <div className='min-h-screen w-full relative flex items-center justify-center bg-off-white overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20/30 blur-[100px]'></div>
        <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20/30 blur-[100px]'></div>
      </div>

      <div className='relative z-10 w-full max-w-md mx-4'>
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
            <p className='text-gray-500'>Join us and start your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <div>
              <Input
                type={"text"}
                placeholder={"Username"}
                id={"username"}
                {...register("username")}
                className={errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-600 focus:ring-primary/20"}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</p>}
            </div>

            <div>
              <Input
                type={"text"}
                placeholder={"Phone Number"}
                id={"phone_no"}
                {...register("phone_no")}
                className={errors.phone_no ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-600 focus:ring-primary/20"}
              />
              {errors.phone_no && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone_no.message}</p>}
            </div>

            <div>
              <Input
                type={"password"}
                placeholder={"Password"}
                id='password'
                {...register("password")}
                className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-600 focus:ring-primary/20"}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {successMessage && (
              <div className="text-green-700 text-sm text-center bg-green-50 border border-green-200 p-3 rounded-lg animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <Button
              text={loading ? "Creating Account..." : "Sign Up"}
              className={`w-full mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loading}
            />
          </form>

          <div className='mt-6 text-center text-sm text-gray-500'>
            Already have an account?{" "}
            <Link to='/login' className='font-semibold text-blue-500 hover:text-blue-600 transition-colors'>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


