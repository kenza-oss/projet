import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductImageSlideshow = ({
    images = [],
    productName = "",
    interval = 4000,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}>
                No Image
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full overflow-hidden group ${className}`}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={images[currentIndex]}
                    src={images[currentIndex]}
                    alt={`${productName} - View ${currentIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-full h-full object-cover"
                    style={{
                        filter: 'brightness(1.02) contrast(1.05) saturate(1.05)',
                        imageRendering: '-webkit-optimize-contrast'
                    }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800";
                    }}
                />
            </AnimatePresence>

            {/* Navigation Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-[#FF6600] w-4"
                                : "bg-white/50 hover:bg-white"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Overlay for hover effect */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};

export default ProductImageSlideshow;
