import React, { useEffect, useState, useCallback } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
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

  const fetchApiData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://dummyjson.com/products?limit=10`);
      const data = await res.json();
      setApiData(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
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

  return (
    <>
      <Header />
      <div className="min-h-screen scroll-smooth mt-10 pb-8">
        <div className="container mx-auto px-3">
          {/* Trending Lookups Section */}
          <div className="mb-12 animate-fade-in">
            <h1 className="font-bold text-2xl md:text-3xl flex items-center gap-2 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Trending Lookups
              <FireIcon size={24} className="text-emerald-500 animate-pulse" />
            </h1>

            {heroLoading ? (
              <HeroSkeleton />
            ) : (
              <div className="w-full lg:h-[500px] md:h-[350px] h-60 mt-3 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  Featured Content
                </div>
              </div>
            )}
          </div>

          {/* Latest Lookups Section */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Latest Lookups
                <HotPriceIcon size={22} className="animate-bounce" />
              </h1>
              <Link
                to="/products"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <CarouselSkeleton />
            ) : apiData && apiData.length > 0 ? (
              <div className="carousel">
                {apiData.map((product, index) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="card group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img
                      src={product.images[0]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={product.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg truncate">{product.title}</h3>
                        <p className="text-sm opacity-90">${product.price}</p>
                      </div>
                    </div>
                  </Link>
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
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Food to Order
                <OrganicFoodIcon size={22} className="animate-pulse" />
              </h1>
              <Link
                to="/food"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
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
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 rounded-lg shadow-lg transform transition-all hover:scale-105">
                Tech & Gadgets
                <Settings03Icon size={22} className="animate-spin" />
              </h1>
              <Link
                to="/phones"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base transition-colors duration-200 hover:underline"
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
      `}</style>
    </>
  );
}
