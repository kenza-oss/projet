import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomSelect({ options, value, onChange, placeholder, icon: Icon, iconColor = "text-luxury-gold" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white border-b border-white/20 p-5 transition-all group hover:bg-gray-50 ${isOpen ? "border-white/40 bg-gray-50" : ""
                    }`}
                type="button"
            >
                <div className="flex items-center gap-5">
                    {Icon && (
                        <Icon
                            size={22}
                            className={`transition-colors ${isOpen ? "text-black" : iconColor}`}
                        />
                    )}
                    <span className={`font-medium tracking-wide text-base text-black ${!selectedOption && "opacity-75"}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-black/60 transition-transform duration-300 ${isOpen ? "rotate-180 text-black" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {/* Reset Option (if needed) */}
                            <button
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold font-cinzel uppercase tracking-widest text-[#2B1400]/80 hover:bg-[#2B1400]/5 hover:text-[#2B1400] transition-colors flex items-center justify-between group"
                            >
                                <span>{placeholder || "Tout sélectionner"}</span>
                                {value === "" && <Check size={14} className="text-[#D4AF37]" />}
                            </button>

                            {options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-light tracking-wide transition-all flex items-center justify-between group ${value === option.value
                                        ? "bg-white/5"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <span className="text-[#2B1400] font-bold">
                                        {option.label}
                                    </span>
                                    {value === option.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-[#FF4D00]"
                                        >
                                            <Check size={14} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
