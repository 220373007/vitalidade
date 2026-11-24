import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpnzewubvqqlpxugdptl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbnpld3VidnFxbHB4dWdkcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0ODAwNTUsImV4cCI6MjExMTA1NjA1NX0.X0yv8QRiGTT6hao8C9Qd_pK4ZLM7DFSicCFByP1yNsE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { User, Session };
