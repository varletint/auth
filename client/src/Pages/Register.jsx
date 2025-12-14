import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAuthStore from "../store/useAuthStore";
import { authApi } from "../api/authApi";
import {
  Store04Icon,
  ShoppingBag01Icon,
  Analytics01Icon,
  ChartLineData03Icon,
  ArrowLeft01Icon,
} from "hugeicons-react";

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
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const [step, setStep] = useState(1); // Step 1: App Type Selection, Step 2: Registration Form
  const [selectedAppType, setSelectedAppType] = useState(null);

  const { loading, error, signInStart, signInSuccess, signInFailure } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });



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

  const handleAppTypeSelect = (appType) => {
    setSelectedAppType(appType);
    setStep(2);
  };

  const goBackToAppSelection = () => {
    setStep(1);
    setSelectedAppType(null);
  };

  const onSubmit = async (data) => {
    signInStart();
    const signUpData = {
      username: data.username,
      phone_no: data.phone_no,
      password: data.password,
      appType: selectedAppType, // Include selected app type
    };
    try {
      const result = await authApi.signup(signUpData);
      signInSuccess(result);
      setSuccessMessage("Account created successfully! Redirecting...");

      // Navigate based on app type (2 seconds delay)
      setTimeout(() => {
        if (selectedAppType === "business_management") {
          navigate("/biz-dashboard");
        } else {
          navigate("/profile");
        }
      }, 2000);
    } catch (err) {
      signInFailure(err.message);
    }
  };

  // App Type Selection Options
  const appOptions = [
    {
      id: "marketplace",
      title: "Marketplace",
      subtitle: "Buy & Sell Products",
      description: "Shop, sell products, manage orders, wishlist, and more. Perfect for buyers and sellers.",
      icon: ShoppingBag01Icon,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      features: ["Buy & sell products", "Manage orders", "Wishlist & cart", "Seller dashboard"],
    },
    {
      id: "business_management",
      title: "Business Management",
      subtitle: "Track Your Business",
      description: "Manage inventory, record sales, track expenses, and view reports. Perfect for business owners.",
      icon: Analytics01Icon,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      features: ["Inventory tracking", "Sales recording", "Expense management", "Business reports"],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Register | Lookups</title>
        <meta name="description" content="Create your Lookups account to start selling and buying products on our marketplace." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className='min-h-screen w-full relative flex items-center justify-center bg-off-white overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20/30 blur-[100px]'></div>
          <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20/30 blur-[100px]'></div>
        </div>

        {/* Step 1: App Type Selection */}
        {step === 1 && (
          <div className='relative z-10 w-full max-w-3xl mx-4'>
            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8'>
              <div className='mb-8 text-center'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>Choose Your Experience</h1>
                <p className='text-gray-500'>What would you like to use Lookups for?</p>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                {appOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAppTypeSelect(option.id)}
                    className={`group relative p-6 rounded-2xl border-2 border-gray-200 hover:border-transparent transition-all duration-300 text-left overflow-hidden hover:shadow-xl ${option.bgColor} hover:scale-[1.02]`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    <div className='relative z-10'>
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 group-hover:bg-white/20`}>
                        <option.icon size={28} className='text-white' />
                      </div>

                      {/* Title & Subtitle */}
                      <h2 className='text-xl font-bold text-gray-900 group-hover:text-white mb-1'>
                        {option.title}
                      </h2>
                      <p className='text-sm font-medium text-gray-600 group-hover:text-white/80 mb-3'>
                        {option.subtitle}
                      </p>

                      {/* Description */}
                      <p className='text-sm text-gray-500 group-hover:text-white/70 mb-4'>
                        {option.description}
                      </p>

                      {/* Features */}
                      <ul className='space-y-1'>
                        {option.features.map((feature, idx) => (
                          <li key={idx} className='text-xs text-gray-500 group-hover:text-white/70 flex items-center gap-2'>
                            <span className='w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-white/60'></span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Arrow indicator */}
                      <div className='absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gray-200 group-hover:bg-white/20 flex items-center justify-center'>
                        <ChartLineData03Icon size={18} className='text-gray-500 group-hover:text-white' />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className='mt-8 text-center text-sm text-gray-500'>
                Already have an account?{" "}
                <Link to='/login' className='font-semibold text-blue-500 hover:text-blue-600 transition-colors'>
                  Log in
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className='relative z-10 w-full max-w-md mx-4'>
            <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8'>
              {/* Back Button */}
              <button
                onClick={goBackToAppSelection}
                className='flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-colors'
              >
                <ArrowLeft01Icon size={18} />
                Back to selection
              </button>

              {/* Selected App Type Badge */}
              <div className='mb-6'>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${selectedAppType === "business_management"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}>
                  {selectedAppType === "business_management" ? (
                    <Analytics01Icon size={16} />
                  ) : (
                    <ShoppingBag01Icon size={16} />
                  )}
                  {selectedAppType === "business_management" ? "Business Management" : "Marketplace"}
                </div>
              </div>

              <div className='mb-8'>
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
        )}
      </div>
    </>
  );
}
