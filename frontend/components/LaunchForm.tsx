import React, { useState } from 'react';
import { PlusCircle, HelpCircle, Leaf, Sparkles } from 'lucide-react';

export default function LaunchForm() {
    const [formData, setFormData] = useState({
        name: 'EvoLaunch Seed',
        symbol: 'SEED',
        supply: '1000000',
        sellTax: '5',
        buyTax: '2',
        maxTx: '10000',
    });

    return (
        <div className="luxury-card p-14 max-w-3xl mx-auto relative overflow-hidden shadow-luxury-soft">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/[0.03] rounded-full blur-3xl -mr-40 -mt-40" />

            <h2 className="text-4xl font-bold text-white mb-12 flex items-center gap-5 relative tracking-tight">
                <PlusCircle className="text-gold" size={36} /> Initialize Institutional Launch
            </h2>

            <div className="space-y-10 relative">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-2">Token Name</label>
                        <input
                            type="text"
                            className="w-full bg-secondary border border-gold/[0.08] rounded-2xl px-6 py-4 focus:bg-gold/[0.03] focus:border-gold/40 outline-none transition-all duration-500 text-white font-medium placeholder:text-muted/20"
                            placeholder="e.g. EvoLaunch Prime"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-2">Ticker Symbol</label>
                        <input
                            type="text"
                            className="w-full bg-secondary border border-gold/[0.08] rounded-2xl px-6 py-4 focus:bg-gold/[0.03] focus:border-gold/40 outline-none transition-all duration-500 text-white font-medium placeholder:text-muted/20"
                            placeholder="e.g. EVO"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                        Total Issuance (Supply) <HelpCircle size={10} className="text-muted/40" />
                    </label>
                    <input
                        type="number"
                        className="w-full bg-secondary border border-gold/[0.08] rounded-2xl px-6 py-4 focus:bg-gold/[0.03] focus:border-gold/40 outline-none transition-all duration-500 text-white font-medium"
                        value={formData.supply}
                        onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-2">Sell Performance Fee (%)</label>
                        <input
                            type="number"
                            className="w-full bg-secondary border border-gold/[0.08] rounded-2xl px-6 py-4 focus:bg-gold/[0.03] focus:border-gold/40 outline-none transition-all duration-500 text-white font-medium"
                            value={formData.sellTax}
                            onChange={(e) => setFormData({ ...formData, sellTax: e.target.value })}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-2">Buy Allocation Fee (%)</label>
                        <input
                            type="number"
                            className="w-full bg-secondary border border-gold/[0.08] rounded-2xl px-6 py-4 focus:bg-gold/[0.03] focus:border-gold/40 outline-none transition-all duration-500 text-white font-medium"
                            value={formData.buyTax}
                            onChange={(e) => setFormData({ ...formData, buyTax: e.target.value })}
                        />
                    </div>
                </div>

                <button className="w-full py-6 bg-gold-gradient text-[#0C0C0F] font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 mt-8 shadow-gold-subtle flex items-center justify-center gap-4 group uppercase tracking-widest text-sm">
                    Deploy Strategic Layer
                    <Sparkles size={20} className="animate-pulse" />
                </button>

                <p className="text-[10px] text-muted/40 text-center font-medium italic mt-4 tracking-widest uppercase">
                    Secured via Root-DAO Protocol Architecture
                </p>
            </div>
        </div>
    );
}
