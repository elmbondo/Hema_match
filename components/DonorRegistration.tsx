
import React, { useState } from 'react';
import { BloodType, Donor } from '../types';
import { useNavigate } from 'react-router-dom';

interface DonorRegistrationProps {
  onRegister: (donor: Donor) => void;
}

const DonorRegistration: React.FC<DonorRegistrationProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bloodType: BloodType.OPositive,
    phone: '',
    address: '',
    age: '',
    weight: '',
    lastDonationDate: '',
    hasChronicIllness: false,
    isPregnant: false,
    recentTattoo: false,
    recentIllness: false,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  const validateEligibility = () => {
    const newErrors: string[] = [];
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);

    if (!formData.name) newErrors.push("Name is required");
    if (!formData.phone) newErrors.push("Phone is required");
    if (!formData.address) newErrors.push("Address is required");
    
    if (isNaN(age) || age < 18 || age > 65) {
      newErrors.push("Age must be between 18 and 65 years");
    }

    if (isNaN(weight) || weight < 50) {
      newErrors.push("Weight must be at least 50kg");
    }

    if (formData.hasChronicIllness) {
      newErrors.push("Donors with chronic illnesses (HIV, Hepatitis, etc.) are not eligible");
    }

    if (formData.isPregnant) {
      newErrors.push("Pregnant or breastfeeding women are temporarily ineligible");
    }

    if (formData.recentTattoo) {
      newErrors.push("Donors with recent tattoos or piercings (within 6 months) are temporarily ineligible");
    }

    if (formData.recentIllness) {
      newErrors.push("Donors with recent illness or fever are temporarily ineligible");
    }

    if (formData.lastDonationDate) {
      const lastDate = new Date(formData.lastDonationDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 90) {
        newErrors.push("Last donation must be at least 90 days ago");
      }
    }

    setErrors(newErrors);
    const eligible = newErrors.length === 0;
    setIsEligible(eligible);
    return eligible;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEligibility()) {
      const newDonor: Donor = {
        id: `d-${Date.now()}`,
        name: formData.name,
        bloodType: formData.bloodType,
        phone: formData.phone,
        address: formData.address,
        lat: -1.2921 + (Math.random() - 0.5) * 0.1, // Randomize near hospital for demo
        lng: 36.8219 + (Math.random() - 0.5) * 0.1,
        isSignedUp: true,
        lastDonationDate: formData.lastDonationDate || new Date().toISOString().split('T')[0],
      };
      onRegister(newDonor);
      alert("Donor registered successfully!");
      navigate('/donors');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-white">
          <h2 className="text-xl font-bold">New Donor Registration</h2>
          <p className="text-slate-400 text-sm">Fill in the details and perform eligibility check</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+254..."
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Blood Type</label>
              <select
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.bloodType}
                onChange={e => setFormData({ ...formData, bloodType: e.target.value as BloodType })}
              >
                {Object.values(BloodType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Address</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Age (Years)</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Weight (Kg)</label>
              <input
                type="number"
                required
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last Donation Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:border-red-500"
                value={formData.lastDonationDate}
                onChange={e => setFormData({ ...formData, lastDonationDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-bold text-slate-800">Health Screening</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-red-600"
                  checked={formData.hasChronicIllness}
                  onChange={e => setFormData({ ...formData, hasChronicIllness: e.target.checked })}
                />
                <span className="text-sm text-slate-700">Chronic Illness (HIV, Hepatitis, etc.)</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-red-600"
                  checked={formData.isPregnant}
                  onChange={e => setFormData({ ...formData, isPregnant: e.target.checked })}
                />
                <span className="text-sm text-slate-700">Pregnant or Breastfeeding</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-red-600"
                  checked={formData.recentTattoo}
                  onChange={e => setFormData({ ...formData, recentTattoo: e.target.checked })}
                />
                <span className="text-sm text-slate-700">Recent Tattoo/Piercing (6 months)</span>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-red-600"
                  checked={formData.recentIllness}
                  onChange={e => setFormData({ ...formData, recentIllness: e.target.checked })}
                />
                <span className="text-sm text-slate-700">Recent Illness/Fever</span>
              </label>
            </div>
          </div>

          {isEligible === false && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                Ineligible for Donation
              </h4>
              <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={validateEligibility}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Check Eligibility
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
              disabled={isEligible === false}
            >
              Register Donor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorRegistration;
