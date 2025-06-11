'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faLungs, faHistory, faChartLine, faChartPie, faTint } from '@fortawesome/free-solid-svg-icons';
import TrendChart from '@/components/TrendChart';
import HeartRateChart from '@/components/HeartRateChart';
import BloodComposition from '@/components/BloodComposition';
import HistoryTable from '@/components/HistoryTable';
import WeeklyStatsChart from '@/components/WeeklyStatsChart';

export default function Home() {
  const [latest, setLatest] = useState({ spo2: 0, heart_rate: 0 });
  const [trendData, setTrendData] = useState([]);
  const [heartRateData, setHeartRateData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchAllData();

    // Set up automatic simulation and data refresh every second
    const interval = setInterval(() => {
      simulateReading().then(() => fetchAllData());
    }, 1000);

    // Set up real-time subscription as backup
    const subscription = supabase
      .channel('readings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'readings' }, payload => {
        console.log('New reading:', payload);
        fetchAllData();
      })
      .subscribe();

    // Cleanup interval and subscription
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  // Fetch latest SPO2 and HR
  const fetchLatest = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('spo2, heart_rate')
      .order('inserted_at', { ascending: false })
      .limit(1);
    if (!error && data && data.length > 0) setLatest(data[0]);
  };

  // Fetch trend data (last 24 hours)
  const fetchTrend = async () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('readings')
      .select('spo2, inserted_at')
      .gte('inserted_at', twentyFourHoursAgo)
      .order('inserted_at', { ascending: true });
    
    if (!error && data) {
      // Group data by hour and calculate average
      const hourlyData = {};
      data.forEach(reading => {
        const hour = new Date(reading.inserted_at).getHours();
        if (!hourlyData[hour]) {
          hourlyData[hour] = { sum: 0, count: 0 };
        }
        hourlyData[hour].sum += reading.spo2;
        hourlyData[hour].count += 1;
      });

      // Create array of 24 values with averages
      const trend = Array(24).fill(null);
      Object.entries(hourlyData).forEach(([hour, stats]) => {
        trend[hour] = Math.round(stats.sum / stats.count);
      });
      
      setTrendData(trend);
    }
  };

  // Fetch heart rate data
  const fetchHeartRate = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('heart_rate')
      .order('inserted_at', { ascending: false })
      .limit(10);
    if (!error && data) {
      setHeartRateData(data.map(d => d.heart_rate).reverse());
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .order('inserted_at', { ascending: false })
      .limit(5);
    if (!error && data) {
      setHistoryData(data);
    }
  };

  // Fetch weekly stats
  const fetchWeeklyStats = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_spo2_stats')
        .select('*')
        .order('date', { ascending: true });  // Order by actual date
      
      if (error) {
        console.error('Error fetching weekly stats:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Transform the data to match the expected format
        const stats = data.map(item => ({
          date: item.date,  // Full date from the view
          avgSpo2: item.avg_spo2,  // Average SPO2 from the view
          avgHeartRate: item.avg_heart_rate  // Average heart rate from the view
        }));
        setWeeklyStats(stats);
      }
    } catch (error) {
      console.error('Error in fetchWeeklyStats:', error);
    }
  };

  const processWeeklyStats = (data) => {
    // Get current date
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Calculate the date of last Sunday
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - currentDay);
    lastSunday.setHours(0, 0, 0, 0);
    
    // Create array from Sunday to Saturday
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(lastSunday);
      date.setDate(lastSunday.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    // Process data to get daily averages
    const dailyStats = {};
    // Initialize all 7 days with empty arrays
    weekDays.forEach(date => {
      dailyStats[date] = { spo2: [], heart_rate: [] };
    });

    // Fill in the actual data
    data.forEach(reading => {
      const date = new Date(reading.inserted_at).toISOString().split('T')[0];
      if (dailyStats[date]) {
        dailyStats[date].spo2.push(reading.spo2);
        dailyStats[date].heart_rate.push(reading.heart_rate);
      }
    });

    // Convert to array and calculate averages, use 0 for days without data
    return weekDays.map(date => ({
      date,
      avgSpo2: dailyStats[date].spo2.length > 0 
        ? dailyStats[date].spo2.reduce((a, b) => a + b, 0) / dailyStats[date].spo2.length 
        : 0,
      avgHeartRate: dailyStats[date].heart_rate.length > 0
        ? dailyStats[date].heart_rate.reduce((a, b) => a + b, 0) / dailyStats[date].heart_rate.length
        : 0,
    }));
  };

  // Helper function to fetch all data
  const fetchAllData = async () => {
    await Promise.all([
      fetchLatest(),
      fetchTrend(),
      fetchHeartRate(),
      fetchHistory(),
      fetchWeeklyStats()
    ]);
  };

  // Simulate new reading
  const simulateReading = async () => {
    try {
      await fetch('/api/simulate', { method: 'POST' });
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-5 py-6 sm:py-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-0">
          <FontAwesomeIcon icon={faHeartbeat} className="text-2xl sm:text-3xl text-red-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Blood Oxygen Monitoring</h1>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-base sm:text-lg text-gray-700">Dr. Sanmesh Joshi</span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
            SJ
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Current SPO2 Level */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Current SPO2 Level</h2>
            <div className="card-icon primary">
              <FontAwesomeIcon icon={faLungs} className="text-xl" />
            </div>
          </div>
          <div className={`spo2-value ${latest.spo2 >= 95 ? 'normal' : latest.spo2 >= 90 ? 'warning' : 'critical'}`}>
            {latest.spo2}
          </div>
          <div className="spo2-status">
            {latest.spo2 >= 95 ? 'Normal Oxygen Level' : 
             latest.spo2 >= 90 ? 'Low Oxygen Level - Monitor Patient' : 
             'Critical Oxygen Level - Immediate Attention Required'}
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Oxygenated Blood</span>
              <span className="stat-value">{latest.spo2}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Deoxygenated Blood</span>
              <span className="stat-value">{100 - latest.spo2}%</span>
            </div>
          </div>
        </div>

        {/* SPO2 Trend */}
        <div className="card md:col-span-2">
          <div className="card-header">
            <h2 className="card-title">SPO2 Trend (Last 24 Hours)</h2>
            <div className="card-icon success">
              <FontAwesomeIcon icon={faChartLine} className="text-lg sm:text-xl" />
            </div>
          </div>
          <div className="chart-container">
            <TrendChart data={trendData} />
          </div>
        </div>

        {/* Heart Rate */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Heart Rate</h2>
            <div className="card-icon danger">
              <FontAwesomeIcon icon={faHeartbeat} className="text-lg sm:text-xl" />
            </div>
          </div>
          <div className="mb-4 text-center">
            <div className="text-4xl font-bold text-red-500">{latest.heart_rate}</div>
            <div className="text-sm text-gray-600 mt-1">BPM</div>
          </div>
          <div className="chart-container">
            <HeartRateChart data={heartRateData} currentRate={latest.heart_rate} />
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="card md:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Weekly Statistics</h2>
            <div className="card-icon success">
              <FontAwesomeIcon icon={faChartPie} className="text-lg sm:text-xl" />
            </div>
          </div>
          <div className="chart-container">
            <WeeklyStatsChart data={weeklyStats} />
          </div>
        </div>

        {/* History Table */}
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="card-title">Recent History</h2>
            <div className="card-icon primary">
              <FontAwesomeIcon icon={faHistory} className="text-lg sm:text-xl" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <HistoryTable data={historyData} />
          </div>
        </div>

        {/* Blood Composition */}
        <div className="card md:col-span-2">
          <div className="card-header">
            <h2 className="card-title">Blood Composition</h2>
            <div className="card-icon danger">
              <FontAwesomeIcon icon={faTint} className="text-lg sm:text-xl" />
            </div>
          </div>
          <div className="chart-container">
            <BloodComposition spo2={latest.spo2} />
          </div>
        </div>
      </div>
    </div>
  );
}
