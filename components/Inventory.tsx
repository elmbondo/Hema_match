
import React, { useState } from 'react';
import { InventoryItem, BloodType } from '../types';

interface InventoryProps {
  inventory: InventoryItem[];
  addStock: (type: BloodType, amount: number) => void;
  updateThreshold: (type: BloodType, threshold: number) => void;
  isAdmin: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, addStock, updateThreshold, isAdmin }) => {
  const [selectedType, setSelectedType] = useState<BloodType>(BloodType.OPositive);
  const [amount, setAmount] = useState<number>(0);
  const [thresholdVal, setThresholdVal] = useState<number>(5000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    addStock(selectedType, amount);
    setAmount(0);
  };

  const handleUpdateThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    updateThreshold(selectedType, thresholdVal);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Blood Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock (ml)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Threshold (ml)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inventory.map(item => (
                <tr key={item.bloodType} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{item.bloodType}</td>
                  <td className="px-6 py-4">{item.quantityMl.toLocaleString()} ml</td>
                  <td className="px-6 py-4">{item.thresholdMl.toLocaleString()} ml</td>
                  <td className="px-6 py-4">
                    {item.quantityMl < item.thresholdMl ? (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Low Stock</span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Optimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-plus-circle text-blue-500"></i>
            Add New Stock
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as BloodType)}
                className="w-full bg-slate-50 border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              >
                {Object.values(BloodType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (ml)</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="e.g. 500"
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Register Incoming Blood
            </button>
          </form>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-amber-500"></i>
              Adjust Thresholds
            </h3>
            <form onSubmit={handleUpdateThreshold} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as BloodType)}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                >
                  {Object.values(BloodType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Threshold (ml)</label>
                <input 
                  type="number"
                  value={thresholdVal}
                  onChange={(e) => setThresholdVal(Number(e.target.value))}
                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                  placeholder="e.g. 3000"
                />
              </div>
              <button className="w-full bg-amber-600 text-white font-bold py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-sm">
                Update Minimum Level
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
