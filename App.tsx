
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  BloodType, User, UserRole, InventoryItem, Donor, 
  UsageLog, NotificationLog 
} from './types';
import { 
  INITIAL_INVENTORY, MOCK_DONORS, 
  HOSPITAL_LOCATION 
} from './constants';
import { calculateDistance } from './utils/geoUtils';

// Components
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Donors from './components/Donors';
import Usage from './components/Usage';
import Reports from './components/Reports';
import DonorOutreach from './components/DonorOutreach';
import DonorRegistration from './components/DonorRegistration';
import SisterHospitals from './components/SisterHospitals';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem('donors');
    return saved ? JSON.parse(saved) : MOCK_DONORS;
  });

  const [usageLogs, setUsageLogs] = useState<UsageLog[]>(() => {
    const saved = localStorage.getItem('usageLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('notificationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('donors', JSON.stringify(donors));
    localStorage.setItem('usageLogs', JSON.stringify(usageLogs));
    localStorage.setItem('notificationLogs', JSON.stringify(notificationLogs));
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [inventory, donors, usageLogs, notificationLogs, currentUser]);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const registerDonor = (donor: Donor) => {
    setDonors(prev => [donor, ...prev]);
  };

  const registerUsage = (type: BloodType, amount: number, patientId: string, customDate?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.bloodType === type) {
        return { ...item, quantityMl: Math.max(0, item.quantityMl - amount), lastUpdated: new Date().toISOString() };
      }
      return item;
    }));

    const newLog: UsageLog = {
      id: `usage-${Date.now()}`,
      bloodType: type,
      quantityMl: amount,
      usageDate: customDate || new Date().toISOString(),
      patientId,
      staffId: currentUser?.name || currentUser?.id || 'unknown',
    };
    setUsageLogs(prev => [newLog, ...prev]);
  };

  const addStock = (type: BloodType, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.bloodType === type) {
        return { ...item, quantityMl: item.quantityMl + amount, lastUpdated: new Date().toISOString() };
      }
      return item;
    }));
  };

  const updateThreshold = (type: BloodType, threshold: number) => {
    setInventory(prev => prev.map(item => {
      if (item.bloodType === type) {
        return { ...item, thresholdMl: threshold };
      }
      return item;
    }));
  };

  const simulateResponse = (logId: string) => {
    const possibleResponses = [
      "I am on my way to the hospital now.",
      "I can come tomorrow morning at 9am.",
      "I donated recently elsewhere, sorry.",
      "I am currently unwell, maybe next month.",
      "Confirming I will be there in 30 minutes.",
      "Thank you for the alert, I'll be there."
    ];
    
    setTimeout(() => {
      setNotificationLogs(prev => prev.map(log => {
        if (log.id === logId && Math.random() > 0.4) { // 60% chance of response
          return {
            ...log,
            status: 'REPLIED',
            response: possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
          };
        }
        return log;
      }));
    }, 4000 + Math.random() * 8000); // 4-12 seconds delay
  };

  const initiateBroadcast = async (type: BloodType, targetDonors: Donor[]) => {
    const newLogs: NotificationLog[] = [];
    const timestamp = new Date().toISOString();

    for (const donor of targetDonors) {
      const logId = `notif-${Date.now()}-${donor.id}`;
      const log: NotificationLog = {
        id: logId,
        donorId: donor.id,
        donorName: donor.name,
        bloodType: type,
        message: `URGENT: ${donor.name}, Nairobi Referral Hospital has a critical shortage of ${type} blood. Your donation is needed immediately. Please visit us today.`,
        sentDate: timestamp,
        status: 'SENT',
      };
      newLogs.push(log);
      simulateResponse(logId);
    }
    setNotificationLogs(prev => [...newLogs, ...prev]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-100 font-sans">
        <Sidebar role={currentUser.role} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">HemaMatch</h1>
              <p className="text-slate-500 text-sm">Nairobi Referral Hospital Blood Bank Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          </header>

          <Routes>
            <Route path="/" element={
              <Dashboard 
                inventory={inventory} 
                usageLogs={usageLogs} 
                donors={donors} 
                onInitiateBroadcast={initiateBroadcast} 
              />
            } />
            <Route path="/inventory" element={<Inventory inventory={inventory} addStock={addStock} updateThreshold={updateThreshold} isAdmin={currentUser.role === UserRole.ADMIN} />} />
            <Route path="/donors" element={<Donors donors={donors} setDonors={setDonors} isAdmin={currentUser.role === UserRole.ADMIN} />} />
            <Route path="/outreach" element={<DonorOutreach inventory={inventory} donors={donors} notificationLogs={notificationLogs} onInitiateBroadcast={initiateBroadcast} />} />
            <Route path="/register-donor" element={
              currentUser.role === UserRole.ADMIN ? (
                <DonorRegistration onRegister={registerDonor} />
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/usage" element={<Usage inventory={inventory} registerUsage={registerUsage} currentStaffName={currentUser.name} />} />
            <Route path="/reports" element={<Reports usageLogs={usageLogs} notificationLogs={notificationLogs} />} />
            <Route path="/sister-hospitals" element={<SisterHospitals />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
