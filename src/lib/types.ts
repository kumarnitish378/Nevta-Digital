
export interface NevtaEntry {
  id: string;
  guestName: string;
  location: string;
  amount: number;
  timestamp: string;
}

export interface Occasion {
  id: string;
  title: string;
  organizer: string;
  date: string;
  entries: NevtaEntry[];
}

export interface UserProfile {
  name: string;
  mobile: string;
}
