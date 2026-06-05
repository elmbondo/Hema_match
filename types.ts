
export enum BloodType {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface InventoryItem {
  id: string;
  bloodType: BloodType;
  quantityMl: number;
  thresholdMl: number;
  lastUpdated: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  isSignedUp: boolean;
  lastDonationDate: string;
}

export interface UsageLog {
  id: string;
  bloodType: BloodType;
  quantityMl: number;
  usageDate: string;
  patientId: string;
  staffId: string;
}

export interface NotificationLog {
  id: string;
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  message: string;
  sentDate: string;
  status: 'SENT' | 'FAILED' | 'REPLIED';
  response?: string;
}

export interface StockHistory {
  date: string;
  [key: string]: string | number;
}

export interface SisterHospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  contactPerson: string;
  phone: string;
  inventory: {
    bloodType: BloodType;
    quantityMl: number;
    status: 'EXCESS' | 'STABLE' | 'CRITICAL';
  }[];
}

export interface TransferRequest {
  id: string;
  fromHospitalId: string;
  toHospitalId: string;
  bloodType: BloodType;
  quantityMl: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  timestamp: string;
}
