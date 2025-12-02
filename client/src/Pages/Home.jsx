import React, { useEffect, useState, useCallback } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { productApi } from "../api/productApi";
import {
  AdvertisimentIcon,
  FireIcon,
  GoogleLensIcon,
  HotPriceIcon,
  NanoTechnologyIcon,
  OrganicFoodIcon,
  Setting06Icon,
  Settings02Icon,
  Settings03Icon,
  SmartPhone01Icon,
} from "hugeicons-react";
import { Link } from "react-router-dom";
import Button from "../Components/Button";

// Skeleton Components
const HeroSkeleton = () => (
  <div className="w-full lg:h-[500px] md:h-[350px] h-60 mt-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skeleton-shimmer"></div>
  </div>
);

const CardSkeleton = () => (
  <div className="card bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skeleton-shimmer"></div>
  </div>
);

const CarouselSkeleton = () => (
  <div className="carousel">
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <CardSkeleton key={item} />
    ))}
  </div>
);

export default function Home() {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewProduct, setPreviewProduct] = useState(null);


  useEffect(() => {
    if (previewProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [previewProduct]);

  // Trending slides data
  const trendingSlides = [
    {
      id: 1,
      title: "Summer Collection",
      gradient: "from-blue-600 via-cyan-accent to-blue-500"
    },
    {
      id: 2,
      title: "New Arrivals",
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
      id: 3,
      title: "Hot Deals",
      gradient: "from-orange-500 via-pink-500 to-red-500"
    },
    {
      id: 4,
      title: "Featured Products",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500"
    }
  ];

  const fetchApiData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch from your backend instead of dummy API
      const data = await productApi.getProducts({ limit: 10 });
      setApiData(data.products || []);

      // OLD: Dummy API call (commented out)
      // const res = await fetch(`https://dummyjson.com/products?limit=10`);
      // const data = await res.json();
      // setApiData(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiData();

    // Simulate hero image loading
    const heroTimer = setTimeout(() => {
      setHeroLoading(false);
    }, 1500);

    return () => clearTimeout(heroTimer);
  }, [fetchApiData]);

  // Auto-slide for trending section
  useEffect(() => {
    if (!heroLoading && trendingSlides.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % trendingSlides.length);
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(slideInterval);
    }
  }, [heroLoading]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen scroll-smooth mt-10 pb-8">
        <div className="container mx-auto px-2">
          {/* Trending Lookups Section with Auto-Sliding */}
          <div className="mb-12 animate-fade-in">
            <h1 className="font-bold text-2xl md:text-3xl flex items-center gap-2 mb-4 text-gray-900">
              Trending Lookups
              <FireIcon size={24} className="text-gray-900 animate-pulse" />
            </h1>
            {/* <h1 className="font-bold text-2xl md:text-3xl flex items-center gap-2 mb-4 bg-gradient-to-r from-blue-600 to-amber-400 bg-clip-text text-transparent">
              Trending Lookups
              <FireIcon size={24} className="text-blue-500 animate-pulse" />
            </h1> */}

            {heroLoading ? (
              <HeroSkeleton />
            ) : (
              <div className="relative">
                {/* Slides Container */}
                <div className="relative w-full lg:h-[500px] md:h-[350px] h-60 mt-3 rounded-lg  overflow-hidden">
                  {trendingSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.gradient} transition-all duration-700 ease-in-out transform ${index === currentSlide
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center text-white 
                      ">
                        <h2 className="text-3xl md:text-5xl font-bold mb-2 cursor-grab">{slide.title}</h2>
                        <p className="text-lg md:text-xl opacity-90 cursor-pointer">Discover Amazing Products</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {trendingSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'w-3 bg-blue-600'
                        : 'w-2 bg-gray-300 hover:bg-gray-900'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Latest Lookups Section */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              {/* <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105"> */}
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 text-gray-900 transform transition-all hover:scale-105">
                Latest Lookups
                <HotPriceIcon size={22} className="animate-bounce" />
              </h1>
              <Link
                to="/products"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <CarouselSkeleton />
            ) : apiData && apiData.length > 0 ? (
              <div className="carousel">
                {apiData.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => setPreviewProduct(product)}
                    className="card group relative overflow-hidden  rounded shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className=" w-full h-[139px] ">

                      <img
                        src={product.images[0]}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={product.name}
                        loading="lazy"
                      />
                    </div>
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"> */}
                    {/* <div className="absolute> <inset-0. bg-gradient-to-t from-black/0 ">
                      <div className="<absolute bottom-0> left-0 right-0 p-4 text-blue-600 ">
                        <h3 className="font-bold text-lg truncate">{product.title}</h3>
                        <p className="text-sm opacity-90 text-orange-500">${product.price}</p>
                      </div>
                    </div> */}
                    <div className=" flex flex-col gap-[-.5px]">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      <p className="text-xs opacity-90 text-orange-500">₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No products available
              </div>
            )}
          </div>

          {/* Food to Order Section */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              {/* <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-amber-400 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105"> */}
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 text-gray-900 transform transition-all hover:scale-105">
                Food to Order
                <OrganicFoodIcon size={22} className="animate-pulse" />
              </h1>
              <Link
                to="/food"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <CarouselSkeleton />
            ) : (
              <div className="carousel">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="card bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"></div>
                ))}

              </div>
            )}
          </div>

          {/* Marketing Section */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-bold text-2xl md:text-3xl flex items-center gap-2 mb-4 bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent">
              Marketing
              <AdvertisimentIcon size={24} className="text-slate-600" />
            </h1>

            {heroLoading ? (
              <HeroSkeleton />
            ) : (
              <div className="w-full lg:h-[500px] md:h-[350px] h-60 mt-3 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  Advertisement Space
                </div>
              </div>
            )}
          </div>

          {/* Tech & Gadgets Section */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              {/* <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105"> */}
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 text-gray-900 transform transition-all hover:scale-105">
                Tech & Gadgets
                <Settings03Icon size={22} className="animate-spin" />
              </h1>
              <Link
                to="/phones"
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <CarouselSkeleton />
            ) : (
              <div className="carousel">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="card bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewProduct && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-2 animate-fade-out"
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-00 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 truncate flex-1 pr-4">
                {previewProduct.name}
              </h2>
              <button
                onClick={() => setPreviewProduct(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-00 text-gray-600 hover:text-gray-800"
                aria-label="Close preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-2">
              {/* Product Image */}
              <div className="w-full aspect-video mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={previewProduct.images[0]}
                  alt={previewProduct.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-emerald-600">
                    ₦{previewProduct.price.toLocaleString()}
                  </span>
                  {previewProduct.averageRating && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="font-semibold">{previewProduct.averageRating}</span>
                    </div>
                  )}
                </div>

                {previewProduct.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {previewProduct.description.split(' ').length > 40
                      ? previewProduct.description.split(' ').slice(0, 40).join(' ') + '.....'
                      : previewProduct.description}
                  </p>
                )}

                {/* View Full Product Button */}
                <div className="flex w-full justify-end mb-2.5">
                  <Link
                    to={`/product/${previewProduct.id}`}
                    className="flex items-end "
                  >
                    {/* <button className="w-full bg-gradient-to-r from-blue-600 to-amber-400 text-nowrap
                  hover:from-blue-600-dark hover:to-blue-700 text-white font-bold py-2 px-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                      View
                    </button> */}
                    <Button text="View" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skeleton-shimmer {
          animation: shimmer 2s infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}


