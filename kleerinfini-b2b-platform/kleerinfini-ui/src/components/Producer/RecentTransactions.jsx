import React from "react";
import {
    CreditCard,
    Building2,
    Smartphone,
    ChevronDown,
    ArrowUpRight,
    ArrowDownLeft
} from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
    {
        provider: "CCP Transfer",
        description: "Paiement client",
        amount: 12500,
        time: "Hier - 12:20 AM",
        icon: <Building2 className="text-emerald-500" size={20} />,
    },
    {
        provider: "BaridiMob",
        description: "Commission service",
        amount: -350,
        time: "Hier - 10:02 AM",
        icon: <Smartphone className="text-purple-500" size={20} />,
    },
    {
        provider: "Virement Bancaire",
        description: "Vente export",
        amount: 45000,
        time: "Il y a 2 jours - 10:45 AM",
        icon: <Building2 className="text-slate-500" size={20} />,
    }
];

export default function RecentTransactions() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-black flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    TRANSACTIONS RÉCENTES
                </h3>

                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-400">Revenus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-slate-400">Dépenses</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {["Toutes", "Mois", "Catégorie"].map((filter) => (
                    <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        {filter} <ChevronDown size={14} />
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {transactions.map((tx, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="group flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                {tx.icon}
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#050B18]">{tx.provider}</p>
                                <p className="text-[11px] text-slate-400 font-bold">{tx.description}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={`text-base font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} DA
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{tx.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
