import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const spo2 = Math.floor(Math.random() * 6) + 94;
    const heartRate = Math.floor(Math.random() * 40) + 60;

    const { error } = await supabase
      .from('readings')
      .insert([{ spo2, heart_rate: heartRate }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Simulated data inserted' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
