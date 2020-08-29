import type { ObjectId } from 'mongodb';

export interface MongoDBRecord {
  _id: ObjectId;
}

export interface Ancilla extends MongoDBRecord {
  code: string;
  name: {
    en: string;
    id: string;
    de: string;
    pt: string;
  };
  date: Date;
}

export interface Fraternity extends MongoDBRecord {
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

export interface HolyMass extends MongoDBRecord {
  date: Date;
  fraternity: {
    id: ObjectId;
    location: string;
    seats: number;
  };
  participants: HolyMassParticipant[];
}

export interface Prayer extends MongoDBRecord {
  slug: string;
  title: {
    it?: string;
    la?: string;
    de?: string;
    en?: string;
    pt?: string;
  };
  subtitle?: {
    it?: string;
    la?: string;
    de?: string;
    en?: string;
    pt?: string;
  };
  content: {
    it?: string;
    la?: string;
    de?: string;
    en?: string;
    pt?: string;
  };
  image: string;
}

export interface Song extends MongoDBRecord {
  number: string;
  title: string;
  content: string;
}

export interface Subscription extends MongoDBRecord {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}
