import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgxlukttumigzgqywjgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neGx1a3R0dW1pZ3pncXl3amduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTIzNTcsImV4cCI6MjA2NDM2ODM1N30.JWFSocQEycKxOCzcxrI_WSwZVe0kwAMB22EzIpXgLUs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);