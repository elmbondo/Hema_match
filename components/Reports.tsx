
import React, { useState } from 'react';
import { UsageLog, NotificationLog } from '../types';

interface ReportsProps {
  usageLogs: UsageLog[];
  notificationLogs: NotificationLog[];
}

const Reports: React.FC<ReportsProps> = ({ usageLogs, notificationLogs }) => {
  const [activeTab, setActiveTab] = useState<'USAGE' | 'NOTIFICATIONS'>('USAGE');

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('USAGE')}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'USAGE' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Withdrawal History
        </button>
        <button 
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`px-6 py-3 font-bold transition-all border-b-2 ${activeTab === 'NOTIFICATIONS' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          Outreach & Responses
        </button>
      </div>

      {activeTab === 'USAGE' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Withdrawal Time</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Patient & Purpose</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-center">Type</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-right">Volume</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Authored By</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {usageLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{new Date(log.usageDate).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-400">{new Date(log.usageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-slate-900">{log.patientId.split(' (')[0]}</div>
                    {log.patientId.includes('(') && (
                      <div className="text-[10px] text-slate-500 italic truncate max-w-xs">
                        {log.patientId.split(' (')[1].replace(')', '')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block w-10 py-1 rounded bg-red-50 text-red-600 font-bold border border-red-100">
                      {log.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-800">{log.quantityMl} ml</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase">
                        {log.staffId.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-600">{log.staffId}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usageLogs.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              <i className="fa-solid fa-box-open block text-3xl mb-2 opacity-20"></i>
              No withdrawal records found.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sent Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Recipient</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Blood Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Response</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notificationLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500">{new Date(log.sentDate).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{log.donorName}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-amber-600">{log.bloodType}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 italic">
                    {log.response || <span className="text-slate-300">Waiting...</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      log.status === 'REPLIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {notificationLogs.length === 0 && <div className="p-12 text-center text-slate-400">No outreach notifications logged yet.</div>}
        </div>
      )}
    </div>
  );
};

export default Reports;
