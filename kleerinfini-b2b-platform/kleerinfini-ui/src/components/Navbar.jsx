import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 text-white bg-black text-sm">
      <div className="flex items-center gap-4">
        <button className="text-lg font-bold">☰ All categories</button>
        <a href="#">Featured selections</a>
        <a href="#">Order protections</a>
      </div>
      <div className="flex items-center gap-4">
        <span>Deliver to: 🇩🇿 DZ</span>
        <span>🌐 English-DZD</span>
        <span>🛒</span>
        <a href="#">Sign in</a>
        <button className="bg-[#FF4500] px-4 py-2 rounded-full text-white font-bold tracking-wider shadow-[0_0_15px_rgba(255,69,0,0.6)] hover:shadow-[0_0_25px_rgba(255,69,0,0.8)] transition-all duration-300 transform hover:scale-105 border border-[#FF4500]">Create account</button>
      </div>
    </nav>
  );
}
