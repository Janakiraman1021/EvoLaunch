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
        <div className="organic-card p-12 rounded-[3rem] max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <h2 className="text-4xl font-bold text-forest mb-10 flex items-center gap-4 relative">
                <PlusCircle className="text-sage" size={32} /> Plant New Launch
            </h2>

            <div className="space-y-8 relative">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-forest/30 uppercase tracking-[0.2em] ml-2">Seed Name</label>
                        <input
                            type="text"
                            className="w-full bg-forest/5 border border-forest/5 rounded-2xl px-6 py-4 focus:bg-white focus:border-sage/40 outline-none transition-all duration-300 text-forest font-medium"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-forest/30 uppercase tracking-[0.2em] ml-2">Ticker</label>
                        <input
                            type="text"
                            className="w-full bg-forest/5 border border-forest/5 rounded-2xl px-6 py-4 focus:bg-white focus:border-sage/40 outline-none transition-all duration-300 text-forest font-medium"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-forest/30 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                        Total Biomass (Supply) <HelpCircle size={10} />
                    </label>
                    <input
                        type="number"
                        className="w-full bg-forest/5 border border-forest/5 rounded-2xl px-6 py-4 focus:bg-white focus:border-sage/40 outline-none transition-all duration-300 text-forest font-medium"
                        value={formData.supply}
                        onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-forest/30 uppercase tracking-[0.2em] ml-2">Initial Sell Tax (%)</label>
                        <input
                            type="number"
                            className="w-full bg-forest/5 border border-forest/5 rounded-2xl px-6 py-4 focus:bg-white focus:border-sage/40 outline-none transition-all duration-300 text-forest font-medium"
                            value={formData.sellTax}
                            onChange={(e) => setFormData({ ...formData, sellTax: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-forest/30 uppercase tracking-[0.2em] ml-2">Initial Buy Tax (%)</label>
                        <input
                            type="number"
                            className="w-full bg-forest/5 border border-forest/5 rounded-2xl px-6 py-4 focus:bg-white focus:border-sage/40 outline-none transition-all duration-300 text-forest font-medium"
                            value={formData.buyTax}
                            onChange={(e) => setFormData({ ...formData, buyTax: e.target.value })}
                        />
                    </div>
                </div>

                <button className="w-full py-6 bg-forest text-ivory font-bold rounded-2xl hover:bg-forest-light active:scale-[0.98] transition-all duration-500 mt-6 shadow-2xl shadow-forest/20 flex items-center justify-center gap-3 group">
                    <Leaf className="group-hover:rotate-12 transition-transform" />
                    Initialize Evolution Layer
                    <Sparkles size={18} className="text-olive animate-pulse" />
                </button>

                <p className="text-[10px] text-forest/20 text-center font-medium italic mt-2">
                    This action will deploy the Root-DAO contracts atomically.
                </p>
            </div>
        </div>
    );
}
