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
        <button className="bg-orange-500 px-3 py-1 rounded text-white font-medium">Create account</button>
      </div>
    </nav>
  );
}
