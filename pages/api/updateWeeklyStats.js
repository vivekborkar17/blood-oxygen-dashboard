import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Fetch stats directly from the view
      const { data: weeklyStats, error: statsError } = await supabase
        .from('weekly_spo2_stats')
        .select('*')
        .order('date', { ascending: true });  // Order by actual date
        
      if (statsError) throw statsError;
      
      res.status(200).json({ 
        message: 'Weekly stats retrieved successfully',
        data: weeklyStats 
      });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
