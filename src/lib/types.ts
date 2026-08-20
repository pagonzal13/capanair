export type LoyaltyTier = "Clasica" | "Plata" | "Oro" | "Platino";

export interface Passenger {
  id: string;
  full_name: string;
  seat_code: string | null;
  editions_attended: number;
  is_dead: boolean;
  died_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ScheduleDay = "viernes" | "sabado" | "domingo";

export interface ScheduleEvent {
  id: string;
  day: ScheduleDay;
  event_time: string; // "HH:MM:SS"
  activity: string;
  description: string | null;
  location: string | null;
  sort_order: number;
}

export interface AppSettings {
  capawards_voting_open: boolean;
  capawards_results_published: boolean;
}

export interface CapawardsCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  winner_passenger_id: string | null;
}
