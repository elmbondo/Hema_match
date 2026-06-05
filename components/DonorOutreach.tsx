
import React, { useState, useMemo } from 'react';
import { InventoryItem, Donor, BloodType, NotificationLog } from '../types';
import { calculateDistance } from '../utils/geoUtils';
import { HOSPITAL_LOCATION } from '../constants';

interface DonorOutreachProps {
  inventory: InventoryItem[];
  donors: Donor[];
  notificationLogs: NotificationLog[];
  onInitiateBroadcast: (type: BloodType, targetDonors: Donor[]) => Promise<void>;
}

const DonorOutreach: React.FC<DonorOutreachProps> = ({ inventory, donors, notificationLogs, onInitiateBroadcast }) => {
  const [selectedType, setSelectedType] = useState<BloodType | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const criticalTypes = useMemo(() => 
    inventory.filter(i => i.quantityMl < i.thresholdMl), 
    [inventory]
  );

  const getEligibleDonors = (type: BloodType) => {
    return donors.filter(d => {
      const dist = calculateDistance(HOSPITAL_LOCATION.lat, HOSPITAL_LOCATION.lng, d.lat, d.lng);
      const monthsSinceLast = (Date.now() - new Date(d.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return d.bloodType === type && d.isSignedUp && dist <= 20 && monthsSinceLast > 3;
    });
  };

  const recentDispatch = useMemo(() => {
    if (!selectedType) return [];
    // Show last 20 messages for this blood type
    return notificationLogs
      .filter(log => log.bloodType === selectedType)
      .slice(0, 20);
  }, [notificationLogs, selectedType]);

  const handleBroadcast = async () => {
    if (!selectedType) return;
    const targetDonors = getEligibleDonors(selectedType);
    if (targetDonors.length === 0) {
      alert("No eligible donors found for this type within 20km.");
      return;
    }

    if (window.confirm(`Confirm broadcast of emergency SMS to ${targetDonors.length} donors?`)) {
      setIsBroadcasting(true);
      await onInitiateBroadcast(selectedType, targetDonors);
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <i className="fa-solid fa-bullhorn text-red-500"></i>
          Donor Recruitment Center
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Low blood levels trigger recruitment alerts. Select a critical blood type to notify eligible local donors. 
          The system will track responses in real-time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {criticalTypes.map(item => (
            <button
              key={item.bloodType}
              onClick={() => setSelectedType(item.bloodType)}
              className={`p-4 rounded-xl border-2 transition-all text-left group ${
                selectedType === item.bloodType 
                  ? 'border-red-600 bg-red-50 ring-4 ring-red-50' 
                  : 'border-slate-100 bg-white hover:border-red-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-2xl font-black text-red-600">{item.bloodType}</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">LOW</span>
              </div>
              <p className="text-xs font-bold text-slate-700">{item.quantityMl.toLocaleString()}ml Stock</p>
              <p className="text-[10px] text-slate-400">Target: {item.thresholdMl.toLocaleString()}ml</p>
            </button>
          ))}
          {criticalTypes.length === 0 && (
            <div className="col-span-full py-10 text-center bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-check text-emerald-600 text-xl"></i>
              </div>
              <h3 className="text-emerald-800 font-bold">Inventory Levels Healthy</h3>
              <p className="text-emerald-600 text-sm">No emergency recruitment required at this time.</p>
            </div>
          )}
        </div>
      </div>

      {selectedType && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* BROADCAST PANEL */}
          <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Recruitment Control</h3>
            <p className="text-sm text-slate-500 mb-6">Initiate a mass SMS alert for {selectedType} donors.</p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Pool</span>
                <span className="text-2xl font-black text-slate-900">{getEligibleDonors(selectedType).length}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot w-4 text-center"></i>
                  Within 20km of CBD
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check w-4 text-center"></i>
                  Eligible to donate (&gt;3mo)
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-envelope w-4 text-center"></i>
                  Signed up for alerts
                </div>
              </div>
            </div>

            <button 
              onClick={handleBroadcast}
              disabled={isBroadcasting || getEligibleDonors(selectedType).length === 0}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                isBroadcasting || getEligibleDonors(selectedType).length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-slate-900 shadow-red-100'
              }`}
            >
              {isBroadcasting ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  Broadcasting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Send Emergency Broadcast
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-slate-400 text-center uppercase font-bold tracking-widest">
              Standard SMS Gateway Charges Apply
            </p>
          </div>

          {/* STATUS LOG PANEL */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-blue-500"></i>
                Real-time Response Tracking
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Replied
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Sent
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[600px] p-6 space-y-4">
              {recentDispatch.map(log => (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    log.status === 'REPLIED' 
                      ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                      : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        log.status === 'REPLIED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {log.donorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1">{log.donorName}</p>
                        <p className="text-[10px] text-slate-400">
                          Dispatched {new Date(log.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                      log.status === 'REPLIED' ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.status === 'REPLIED' ? (
                        <><i className="fa-solid fa-check-double mr-1"></i> Received</>
                      ) : (
                        <><i className="fa-solid fa-paper-plane mr-1"></i> Outgoing</>
                      )}
                    </span>
                  </div>

                  {log.status === 'REPLIED' ? (
                    <div className="mt-3 pl-10">
                      <div className="relative bg-white border border-emerald-200 p-3 rounded-xl rounded-tl-none italic text-sm text-emerald-900">
                        <span className="absolute -left-2 top-0 text-emerald-100 text-2xl">
                          <i className="fa-solid fa-quote-left"></i>
                        </span>
                        {log.response}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pl-13">
                      <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                        <i className="fa-solid fa-spinner animate-spin text-[10px]"></i>
                        Awaiting donor response...
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {recentDispatch.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                    <i className="fa-solid fa-satellite-dish text-2xl opacity-20"></i>
                  </div>
                  <p className="text-sm font-medium">No messages sent for this type yet.</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1">Initiate broadcast to see logs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorOutreach;
