
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Donor, BloodType } from '../types';
import { calculateDistance } from '../utils/geoUtils';
import { HOSPITAL_LOCATION } from '../constants';

interface DonorsProps {
  donors: Donor[];
  setDonors: React.Dispatch<React.SetStateAction<Donor[]>>;
  isAdmin: boolean;
}

const Donors: React.FC<DonorsProps> = ({ donors, setDonors, isAdmin }) => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [search, setSearch] = useState<string>('');

  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      const dist = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, d.lat, d.lng);
      const matchesType = filterType === 'ALL' || d.bloodType === filterType;
      const matchesDist = dist <= maxDistance;
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search);
      return matchesType && matchesDist && matchesSearch;
    }).sort((a, b) => {
      const distA = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, a.lat, a.lng);
      const distB = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, b.lat, b.lng);
      return distA - distB;
    });
  }, [donors, filterType, maxDistance, search]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search Donors</label>
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Name or Phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border rounded-lg pl-10 pr-4 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Blood Type</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            {Object.values(BloodType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Distance ({maxDistance}km)</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={maxDistance} 
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {isAdmin && (
          <button 
            onClick={() => navigate('/register-donor')}
            className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Add New Donor
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Donor Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Blood Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Distance</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Last Donation</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredDonors.map(donor => {
              const dist = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, donor.lat, donor.lng);
              return (
                <tr key={donor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{donor.name}</div>
                    <div className="text-xs text-slate-500">{donor.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded text-sm">{donor.bloodType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{donor.address}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{dist.toFixed(1)} km</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{donor.lastDonationDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Contact">
                        <i className="fa-solid fa-message"></i>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors" title="Edit">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredDonors.length === 0 && (
          <div className="p-12 text-center text-slate-500 italic">
            No donors found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Donors;
