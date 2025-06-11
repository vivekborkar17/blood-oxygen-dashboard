import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const spo2 = Math.floor(Math.random() * 6) + 94;
    const heartRate = Math.floor(Math.random() * 40) + 60;

    const { error } = await supabase
      .from('readings')
      .insert([{ spo2, heart_rate: heartRate }]);    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }    // Update weekly statistics after inserting new reading
    try {
      // Call updateWeeklyStats directly since we're on the server
      const updateWeeklyStatsHandler = require('./updateWeeklyStats').default;
      await updateWeeklyStatsHandler({ method: 'POST' }, { 
        status: () => ({ json: () => ({}) }),
        json: () => ({})
      });
    } catch (weeklyStatsError) {
      console.error("Error updating weekly stats:", weeklyStatsError);
      // Continue anyway since the main reading was inserted successfully
    }

    return res.status(200).json({ message: 'Simulated data inserted', spo2, heartRate });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
