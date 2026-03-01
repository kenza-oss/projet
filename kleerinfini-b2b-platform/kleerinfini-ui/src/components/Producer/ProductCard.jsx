import React from "react";
import {
  Edit3,
  Trash2,
  Download,
  ArrowUpRight,
  Archive,
  Clock,
  ChevronRight,
  Package
} from "lucide-react";
import { motion } from "framer-motion";
import { getProductImage } from "../../utils/utils";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const imgUrl = getProductImage(product.images?.[0] || product.image, 0, product);

  return (
    <motion.div
      layout
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-600/30 transition-all duration-500 relative h-full flex flex-col"
    >
      {/* Visual Header */}
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />

        {/* Action Overlay (Context Menu Style) */}
        <div className="absolute inset-0 bg-[#050B18]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20 backdrop-blur-sm">
          <button onClick={() => onEdit?.(product)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#050B18] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
            <Edit3 size={18} />
          </button>
          <button onClick={() => onDelete?.(product.id)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#050B18] hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">
            <Trash2 size={18} />
          </button>
        </div>

        {/* Status Badge */}
        {product.status === 'active' && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-xl shadow-black/20">
              Active
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-bold text-[#050B18] tracking-tight leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <span className="text-sm font-extrabold text-[#050B18] tabular-nums whitespace-nowrap ml-4">{product.price || '0'} {product.currency || 'DA'}</span>
          </div>
          <p className="text-[11px] text-[#1A1A1A] font-semibold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Provenance: {product.origin || 'Algérie'}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-blue-600" />
              <span className="text-[11px] font-bold text-[#1A1A1A] tabular-nums tracking-wide">{product.stock || '0'} Items</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
