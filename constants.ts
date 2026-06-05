
import { BloodType, UserRole, User, InventoryItem, Donor } from './types';

export const HOSPITAL_LOCATION = {
  lat: -1.2921, // Nairobi CBD area
  lng: 36.8219,
  name: "Nairobi Referral Hospital Blood Bank"
};

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', role: UserRole.ADMIN, name: 'Dr. Jane Muthoni' },
  { id: '2', username: 'nurse', role: UserRole.NURSE, name: 'Nurse Samuel Otieno' },
];

export const INITIAL_INVENTORY: InventoryItem[] = Object.values(BloodType).map((type, idx) => ({
  id: `inv-${idx}`,
  bloodType: type as BloodType,
  quantityMl: 10000,
  thresholdMl: 5000,
  lastUpdated: new Date().toISOString(),
}));

// Kenyan names and mock donors
export const MOCK_DONORS: Donor[] = [
  { id: 'd1', name: 'Kwame Kamau', bloodType: BloodType.OPositive, phone: '+254 711 000111', address: 'Westlands, Nairobi', lat: -1.2673, lng: 36.8067, isSignedUp: true, lastDonationDate: '2023-01-15' },
  { id: 'd2', name: 'Zari Abasi', bloodType: BloodType.ONegative, phone: '+254 711 222333', address: 'Kilimani, Nairobi', lat: -1.2892, lng: 36.7833, isSignedUp: true, lastDonationDate: '2023-05-10' },
  { id: 'd3', name: 'Juma Mwangi', bloodType: BloodType.APositive, phone: '+254 711 444555', address: 'Langata, Nairobi', lat: -1.3333, lng: 36.7667, isSignedUp: true, lastDonationDate: '2024-02-20' },
  { id: 'd4', name: 'Achieng Atieno', bloodType: BloodType.ANegative, phone: '+254 711 666777', address: 'Pangani, Nairobi', lat: -1.2667, lng: 36.8333, isSignedUp: false, lastDonationDate: '2022-11-30' },
  { id: 'd5', name: 'Bakhita Njeri', bloodType: BloodType.BPositive, phone: '+254 711 888999', address: 'Parklands, Nairobi', lat: -1.2597, lng: 36.8163, isSignedUp: true, lastDonationDate: '2023-09-12' },
  { id: 'd6', name: 'Jabali Odhiambo', bloodType: BloodType.BNegative, phone: '+254 711 111222', address: 'Karen, Nairobi', lat: -1.3167, lng: 36.7167, isSignedUp: true, lastDonationDate: '2024-05-01' },
  { id: 'd7', name: 'Makena Wambui', bloodType: BloodType.ABPositive, phone: '+254 711 333444', address: 'Upper Hill, Nairobi', lat: -1.2987, lng: 36.8136, isSignedUp: true, lastDonationDate: '2023-12-05' },
  { id: 'd8', name: 'Tendai Maina', bloodType: BloodType.ABNegative, phone: '+254 711 555666', address: 'Kileleshwa, Nairobi', lat: -1.2833, lng: 36.7833, isSignedUp: true, lastDonationDate: '2023-03-22' },
  { id: 'd9', name: 'Nuru Adhiambo', bloodType: BloodType.OPositive, phone: '+254 711 777888', address: 'Embakasi, Nairobi', lat: -1.3167, lng: 36.9167, isSignedUp: true, lastDonationDate: '2024-01-10' },
  { id: 'd10', name: 'Sefu Kariuki', bloodType: BloodType.ONegative, phone: '+254 711 999000', address: 'Kasarani, Nairobi', lat: -1.2167, lng: 36.9000, isSignedUp: true, lastDonationDate: '2023-08-15' },
];

// Compatibility rules: recipient -> can receive from
export const BLOOD_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  [BloodType.APositive]: [BloodType.APositive, BloodType.ANegative, BloodType.OPositive, BloodType.ONegative],
  [BloodType.ANegative]: [BloodType.ANegative, BloodType.ONegative],
  [BloodType.BPositive]: [BloodType.BPositive, BloodType.BNegative, BloodType.OPositive, BloodType.ONegative],
  [BloodType.BNegative]: [BloodType.BNegative, BloodType.ONegative],
  [BloodType.ABPositive]: Object.values(BloodType), // Universal recipient
  [BloodType.ABNegative]: [BloodType.ABNegative, BloodType.ANegative, BloodType.BNegative, BloodType.ONegative],
  [BloodType.OPositive]: [BloodType.OPositive, BloodType.ONegative],
  [BloodType.ONegative]: [BloodType.ONegative], // Universal donor
};

export const SISTER_HOSPITALS: SisterHospital[] = [
  {
    id: 'h1',
    name: 'Kenyatta National Hospital',
    location: 'Hospital Rd, Nairobi',
    lat: -1.3011,
    lng: 36.8073,
    contactPerson: 'Dr. Alice Wanjiku',
    phone: '+254 20 2726300',
    inventory: [
      { bloodType: BloodType.OPositive, quantityMl: 25000, status: 'EXCESS' },
      { bloodType: BloodType.APositive, quantityMl: 12000, status: 'STABLE' },
      { bloodType: BloodType.BNegative, quantityMl: 1500, status: 'CRITICAL' },
    ]
  },
  {
    id: 'h2',
    name: 'The Nairobi Hospital',
    location: 'Argwings Kodhek Rd, Nairobi',
    lat: -1.2965,
    lng: 36.8035,
    contactPerson: 'Dr. Mark Kamau',
    phone: '+254 703 082000',
    inventory: [
      { bloodType: BloodType.ABPositive, quantityMl: 8000, status: 'EXCESS' },
      { bloodType: BloodType.ONegative, quantityMl: 2000, status: 'CRITICAL' },
      { bloodType: BloodType.BPositive, quantityMl: 10000, status: 'STABLE' },
    ]
  },
  {
    id: 'h3',
    name: 'Aga Khan University Hospital',
    location: '3rd Parklands Ave, Nairobi',
    lat: -1.2611,
    lng: 36.8219,
    contactPerson: 'Nurse Sarah Hassan',
    phone: '+254 20 3662000',
    inventory: [
      { bloodType: BloodType.ANegative, quantityMl: 500, status: 'CRITICAL' },
      { bloodType: BloodType.OPositive, quantityMl: 15000, status: 'STABLE' },
      { bloodType: BloodType.ABNegative, quantityMl: 3000, status: 'EXCESS' },
    ]
  }
];
