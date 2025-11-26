import React from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthStore from "../store/useAuthStore";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
}).required();

export default function Login() {
  document.title = "Login | Welcome Back";
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    signInStart();
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.username, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        signInFailure(result.message || "Login failed");
        return;
      }

      console.log("Login success:", result);
      signInSuccess(result);
      navigate("/profile");
    } catch (err) {
      signInFailure(err.message);
    }
  };

  return (
    <div className='min-h-screen w-full relative flex items-center justify-center bg-off-white overflow-hidden'>
      {/* Background decoration */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20/30 blur-[100px]'></div>
        <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20/30 blur-[100px]'></div>
      </div>

      <div className='relative z-10 w-full max-w-md mx-4'>
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8'>
          <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
            <p className='text-gray-500'>Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <div>
              <Input
                type={"text"}
                placeholder={"Email"}
                id={"username"}
                {...register("username")}
                className={errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-600 focus:ring-primary/20"}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</p>}
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
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <Button
              text={loading ? "Signing In..." : "Sign In"}
              className={`w-full mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loading}
            />
          </form>

          <div className='mt-6 text-center text-sm text-gray-500'>
            Don't have an account?{" "}
            <Link to='/register' className='font-semibold text-blue-500 hover:text-blue-600 transition-colors'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


