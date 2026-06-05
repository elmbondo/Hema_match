
import React, { useState } from 'react';
import { BloodType, InventoryItem } from '../types';

interface UsageProps {
  inventory: InventoryItem[];
  registerUsage: (type: BloodType, amount: number, patientId: string, customDate: string) => void;
  currentStaffName: string;
}

const Usage: React.FC<UsageProps> = ({ inventory, registerUsage, currentStaffName }) => {
  const [selectedType, setSelectedType] = useState<BloodType>(BloodType.OPositive);
  const [amount, setAmount] = useState<number>(0);
  const [patientId, setPatientId] = useState<string>('');
  const [withdrawalDate, setWithdrawalDate] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  const currentStock = inventory.find(i => i.bloodType === selectedType)?.quantityMl || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Withdrawal amount must be greater than 0.');
      return;
    }
    if (amount > currentStock) {
      setError(`Insufficient stock. Only ${currentStock}ml available.`);
      return;
    }
    if (!patientId.trim()) {
      setError('Patient ID or National ID is required for tracking.');
      return;
    }

    registerUsage(selectedType, amount, `${patientId} ${notes ? `(${notes})` : ''}`, new Date(withdrawalDate).toISOString());
    setAmount(0);
    setPatientId('');
    setNotes('');
    alert('Blood withdrawal registered in official ledger.');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-file-signature text-red-600"></i>
              Blood Withdrawal Registration
            </h2>
            <p className="text-slate-500 text-sm mt-1">Official register for releasing units from inventory.</p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Staff</span>
            <span className="text-sm font-semibold text-slate-700">{currentStaffName}</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Withdrawal Time</label>
                <input 
                  type="datetime-local"
                  value={withdrawalDate}
                  onChange={(e) => setWithdrawalDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Blood Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as BloodType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-lg font-bold text-red-600"
                >
                  {Object.values(BloodType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-slate-400 italic">
                  Available: <span className="font-bold text-slate-600">{currentStock.toLocaleString()} ml</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Quantity to Withdraw (ml)</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 text-lg"
                  placeholder="e.g. 450"
                  step="50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Patient ID / File No.</label>
                <input 
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                  placeholder="Patient ID..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Purpose / Destination Ward (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 h-20 resize-none"
              placeholder="e.g. Maternity Ward - Emergency C-Section"
            />
          </div>

          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <div className="flex gap-3">
              <i className="fa-solid fa-info-circle text-red-400 mt-1"></i>
              <div className="text-xs text-red-800 leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-wider text-[10px]">Verification Checklist</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Verify blood bag compatibility with patient records.</li>
                  <li>Check expiration date of unit being withdrawn.</li>
                  <li>Register withdrawal immediately upon taking unit from storage.</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-check-double"></i>
            Register Official Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
};

export default Usage;
