import React, { useState, useEffect } from "react";
import { ArrowUp01Icon } from "hugeicons-react";
import { useLocation } from "react-router-dom";

export default function ScrollToUp() {
    const [isVisible, setIsVisible] = useState(false);
    const { pathname } = useLocation();

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    useEffect(() => {
        if (!pathname) return;
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pathname]);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full 
        bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg 
        hover:shadow-xl transform transition-all duration-300 ease-in-out
        ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10 pointer-events-none"
                }`}
            aria-label="Scroll to top"
            title="Scroll to top"
        >
            <ArrowUp01Icon size={24} />
        </button>
    );
}
