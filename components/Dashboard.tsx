
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { InventoryItem, UsageLog, Donor, BloodType } from '../types';
import { calculateDistance } from '../utils/geoUtils';
import { HOSPITAL_LOCATION } from '../constants';

interface DashboardProps {
  inventory: InventoryItem[];
  usageLogs: UsageLog[];
  donors: Donor[];
  onInitiateBroadcast: (type: BloodType, targetDonors: Donor[]) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, usageLogs, donors, onInitiateBroadcast }) => {
  const [broadcasting, setBroadcasting] = useState<string | null>(null);

  const chartData = inventory.map(item => ({
    name: item.bloodType,
    ml: item.quantityMl,
    threshold: item.thresholdMl,
    isLow: item.quantityMl < item.thresholdMl,
  }));

  const pieData = inventory.map(item => ({
    name: item.bloodType,
    value: item.quantityMl,
  }));

  const COLORS = ['#ef4444', '#f87171', '#3b82f6', '#60a5fa', '#10b981', '#34d399', '#f59e0b', '#fbbf24'];

  const totalStock = inventory.reduce((acc, curr) => acc + curr.quantityMl, 0);
  const lowStockItems = inventory.filter(i => i.quantityMl < i.thresholdMl);

  const getEligibleDonors = (type: BloodType) => {
    return donors.filter(d => {
      const dist = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, d.lat, d.lng);
      const monthsSinceLast = (Date.now() - new Date(d.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return d.bloodType === type && d.isSignedUp && dist <= 15 && monthsSinceLast > 3;
    });
  };

  const handleBroadcast = async (type: BloodType) => {
    const targetDonors = getEligibleDonors(type);
    if (targetDonors.length === 0) {
      alert("No eligible donors found nearby for this type.");
      return;
    }
    setBroadcasting(type);
    await onInitiateBroadcast(type, targetDonors);
    setBroadcasting(null);
  };

  return (
    <div className="space-y-6">
      {/* ACTION CENTER / SIGNALING SECTION */}
      {lowStockItems.length > 0 && (
        <div className="bg-white border-2 border-red-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-red-50 px-6 py-3 flex items-center justify-between border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <i className="fa-solid fa-tower-broadcast text-red-600"></i>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">Recruitment Signals: Action Required</h3>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-white px-2 py-0.5 rounded border border-red-100">CRITICAL STOCK</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map(item => {
              const eligibleCount = getEligibleDonors(item.bloodType).length;
              return (
                <div key={item.bloodType} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="block text-2xl font-black text-red-600 leading-none">{item.bloodType}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Shortage Detected</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-slate-700">{item.quantityMl}ml</span>
                      <span className="text-[10px] text-slate-400">Min: {item.thresholdMl}ml</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600 font-medium">
                      <i className="fa-solid fa-users-viewfinder mr-1 text-slate-400"></i>
                      {eligibleCount} eligible donors
                    </span>
                    <button 
                      onClick={() => handleBroadcast(item.bloodType)}
                      disabled={broadcasting !== null}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                        broadcasting === item.bloodType 
                        ? 'bg-slate-200 text-slate-500' 
                        : 'bg-red-600 text-white hover:bg-slate-900 shadow-sm'
                      }`}
                    >
                      {broadcasting === item.bloodType ? (
                        <>
                          <i className="fa-solid fa-spinner animate-spin"></i>
                          Processing
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane"></i>
                          Signal Donors
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Inventory</p>
          <p className="text-3xl font-bold text-slate-900">{(totalStock / 1000).toFixed(1)}L</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Low Stock Signals</p>
          <p className={`text-3xl font-bold ${lowStockItems.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {lowStockItems.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Usage Today</p>
          <p className="text-3xl font-bold text-slate-900">
            {usageLogs.filter(log => log.usageDate.includes(new Date().toISOString().split('T')[0])).reduce((a, b) => a + b.quantityMl, 0)}ml
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Active Donors</p>
          <p className="text-3xl font-bold text-slate-900">{donors.length}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-simple text-slate-400"></i>
            Current Inventory Snapshot (ml)
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="ml" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isLow ? '#ef4444' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-pie-chart text-slate-400"></i>
            Distribution
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-auto grid grid-cols-2 gap-2 text-center">
            {inventory.slice(0, 4).map((item, idx) => (
              <div key={item.bloodType} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="font-medium text-slate-600">{item.bloodType}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
