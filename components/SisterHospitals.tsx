
import React, { useState } from 'react';
import { SisterHospital, BloodType, TransferRequest } from '../types';
import { SISTER_HOSPITALS } from '../constants';
import { calculateDistance } from '../utils/geoUtils';
import { HOSPITAL_LOCATION } from '../constants';

const SisterHospitals: React.FC = () => {
  const [hospitals] = useState<SisterHospital[]>(SISTER_HOSPITALS);
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<SisterHospital | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    bloodType: BloodType.OPositive,
    quantityMl: 450,
  });

  const handleRequestBlood = (hospital: SisterHospital) => {
    setSelectedHospital(hospital);
    setShowRequestModal(true);
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital) return;

    const newRequest: TransferRequest = {
      id: `req-${Date.now()}`,
      fromHospitalId: selectedHospital.id,
      toHospitalId: 'current-hospital',
      bloodType: requestData.bloodType,
      quantityMl: requestData.quantityMl,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };

    setRequests([newRequest, ...requests]);
    setShowRequestModal(false);
    alert(`Request for ${requestData.quantityMl}ml of ${requestData.bloodType} sent to ${selectedHospital.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sister Hospitals Network</h2>
        <p className="text-slate-500 text-sm">Real-time visibility into regional blood bank reserves for inter-hospital transfers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hospitals.map(hospital => {
          const distance = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, hospital.lat, hospital.lng);
          return (
            <div key={hospital.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{hospital.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <i className="fa-solid fa-location-dot"></i>
                      {hospital.location} ({distance.toFixed(1)} km away)
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    Partner Facility
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Current Stock Levels</h4>
                <div className="grid grid-cols-3 gap-3">
                  {hospital.inventory.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      item.status === 'CRITICAL' ? 'bg-red-50 border-red-100' : 
                      item.status === 'EXCESS' ? 'bg-emerald-50 border-emerald-100' : 
                      'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="text-xs font-bold text-slate-500">{item.bloodType}</div>
                      <div className={`text-lg font-black ${
                        item.status === 'CRITICAL' ? 'text-red-600' : 
                        item.status === 'EXCESS' ? 'text-emerald-600' : 
                        'text-slate-700'
                      }`}>
                        {(item.quantityMl / 1000).toFixed(1)}L
                      </div>
                      <div className={`text-[10px] font-bold uppercase ${
                        item.status === 'CRITICAL' ? 'text-red-400' : 
                        item.status === 'EXCESS' ? 'text-emerald-400' : 
                        'text-slate-400'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t flex gap-3">
                <button 
                  onClick={() => handleRequestBlood(hospital)}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-truck-ramp-box"></i>
                  Request Transfer
                </button>
                <button 
                  className="flex-1 bg-slate-800 text-white font-bold py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm flex items-center justify-center gap-2"
                  onClick={() => alert(`Contacting ${hospital.contactPerson} at ${hospital.phone}`)}
                >
                  <i className="fa-solid fa-phone"></i>
                  Contact
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {requests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-bold text-slate-800">Recent Transfer Requests</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Hospital</th>
                <th className="px-6 py-3">Blood Type</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4 font-medium">{hospitals.find(h => h.id === req.fromHospitalId)?.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded text-xs">{req.bloodType}</span>
                  </td>
                  <td className="px-6 py-4">{req.quantityMl}ml</td>
                  <td className="px-6 py-4">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(req.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRequestModal && selectedHospital && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <h3 className="text-xl font-bold">Request Blood Transfer</h3>
              <p className="text-slate-400 text-sm">From: {selectedHospital.name}</p>
            </div>
            <form onSubmit={submitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Blood Type Needed</label>
                <select 
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={requestData.bloodType}
                  onChange={e => setRequestData({ ...requestData, bloodType: e.target.value as BloodType })}
                >
                  {selectedHospital.inventory.map(item => (
                    <option key={item.bloodType} value={item.bloodType}>{item.bloodType} ({item.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Quantity (ml)</label>
                <input 
                  type="number" 
                  step="450"
                  min="450"
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  value={requestData.quantityMl}
                  onChange={e => setRequestData({ ...requestData, quantityMl: parseInt(e.target.value) })}
                />
                <p className="text-[10px] text-slate-400 mt-1">* Standard unit is 450ml</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SisterHospitals;
