export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          role?: string;
          created_at?: string;
        };
      };

      runs: {
        Row: {
          id: string;
          date: string;
          type: string;
          vehicle_id: string;
          client_id: string;
          team_id: string;
        };
        Insert: {
          id?: string;
          date: string;
          type: string;
          vehicle_id: string;
          client_id: string;
          team_id: string;
        };
        Update: {
          date?: string;
          type?: string;
          vehicle_id?: string;
          client_id?: string;
          team_id?: string;
        };
      };

      run_logs: {
        Row: {
          id: string;
          run_id: string;
          event: string;
          note: string;
          photo_url: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          event: string;
          note: string;
          photo_url: string;
          timestamp?: string;
        };
        Update: {
          event?: string;
          note?: string;
          photo_url?: string;
          timestamp?: string;
        };
      };

      rdn_slips: {
        Row: {
          id: string;
          run_id: string;
          image_url: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          image_url: string;
        };
        Update: {
          run_id?: string;
          image_url?: string;
        };
      };

      fuel_receipts: {
        Row: {
          id: string;
          run_id: string;
          amount: number;
          image_url: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          amount: number;
          image_url: string;
        };
        Update: {
          amount?: number;
          image_url?: string;
        };
      };

      vehicles: {
        Row: {
          id: string;
          name: string;
          plate_number: string;
        };
        Insert: {
          id?: string;
          name: string;
          plate_number: string;
        };
        Update: {
          name?: string;
          plate_number?: string;
        };
      };

      clients: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
    };
  };
}
