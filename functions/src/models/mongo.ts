import type { ObjectId } from 'mongodb';

export interface Ancilla {
  code: string;
  name: {
    en: string;
    it: string;
    de: string;
    pt: string;
  };
  date: Date;
}

export interface Fraternity {
  location: string;
  seats: number;
  masses: {
    sunday?: string[];
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    default?: string[];
    overrides?: {
      [day: string]: string[];
    };
  };
}

export interface HolyMassParticipant {
  userId: string;
  seats: number;
  bookingId: ObjectId;
  deleted?: boolean;
}

export interface HolyMass {
  date: Date;
  fraternity: {
    id: ObjectId;
    location: string;
    seats: number;
  };
  participants: HolyMassParticipant[];
}

export interface PrayerLocalizedField {
  it?: string;
  la?: string;
  de?: string;
  en?: string;
  pt?: string;
}

export interface Prayer {
  slug: string;
  title: PrayerLocalizedField;
  subtitle?: PrayerLocalizedField;
  content: PrayerLocalizedField;
  image?: string;
}

export interface Song {
  number: string;
  title: string;
  content: string;
}

export interface Subscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}
