"use client";
import { useState } from 'react';
// TODO: Adjust the import path if needed, or define mockAgents here if the file does not exist.
import { mockAgents } from '../../../../../components/agents/mockData';
// If the above path is still incorrect, you can temporarily define mockAgents below for development:
// const mockAgents = [{ id: '1', nav: 100000, tokenSupply: 10000 }];

export default function AgentInvest({ params }: { params: { id: string } }) {
  // Mock NAV and ownership calculation
  const agent = mockAgents.find(a => a.id === params.id) || { nav: 100000, tokenSupply: 10000 };
  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const ownership = agent.tokenSupply ? (amount / agent.nav) * agent.tokenSupply : 0;

  return (
    <div className="max-w-xl mx-auto p-8 bg-card rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Invest in Agent</h1>
      <div className="mb-6">
        <div className="text-lg">Net Asset Value (NAV): <span className="font-mono">${agent.nav.toLocaleString('en-US')}</span></div>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Ownership Calculator</label>
        <input
          type="number"
          min={0}
          className="input input-bordered w-full mb-2"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <div className="text-sm text-muted">You would own <span className="font-bold">{ownership.toFixed(2)}</span> tokens</div>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          setShowModal(true);
        }}
        className="mb-4"
      >
        <label className="block mb-2 font-semibold">Buy Form</label>
        <input
          type="number"
          min={0}
          className="input input-bordered w-full mb-2"
          placeholder="Amount to invest"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <button type="submit" className="btn btn-primary w-full">Buy</button>
      </form>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-lg w-80">
            {!success ? (
              <>
                <div className="mb-4 text-lg font-semibold">Confirm Purchase</div>
                <div className="mb-4">Invest <span className="font-bold">{amount}</span> for <span className="font-bold">{ownership.toFixed(2)}</span> tokens?</div>
                <div className="flex gap-2">
                  <button className="btn btn-primary flex-1" onClick={() => { setSuccess(true); setTimeout(() => { setShowModal(false); setSuccess(false); }, 1500); }}>Confirm</button>
                  <button className="btn flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="text-center text-green-600 font-bold">Success!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
