'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from "next/image";

import TrendChart from '@/components/TrendChart';
import HeartRateChart from '@/components/HeartRateChart';
import BloodComposition from '@/components/BloodComposition';
import HistoryTable from '@/components/HistoryTable';
import WeeklyStatsChart from '@/components/WeeklyStatsChart';

export default function Home() {
  const [latest, setLatest] = useState({ spo2: 0, heart_rate: 0 });
  const [trendData, setTrendData] = useState([]);
  const [heartHistory, setHeartHistory] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);

  // Fetch latest SPO2 and HR
  const fetchLatest = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('spo2, heart_rate')
      .order('inserted_at', { ascending: false })
      .limit(1)
      .single();
    if (!error && data) setLatest(data);
  };

  // Trend chart (last 24 SPO2 readings)
  const fetchTrend = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('spo2')
      .order('inserted_at', { ascending: false })
      .limit(24);
    if (!error && data) {
      setTrendData(data.map((d) => d.spo2).reverse());
    }
  };

  // Heart rate history (last 10)
  const fetchHeartHistory = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('heart_rate')
      .order('inserted_at', { ascending: false })
      .limit(10);
    if (!error && data) {
      setHeartHistory(data.map((d) => d.heart_rate).reverse());
    }
  };

  // Reading history (last 5)
  const fetchHistoryTable = async () => {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .order('inserted_at', { ascending: false })
      .limit(5);
    if (!error && data) setHistoryData(data);
  };

  // Weekly stats from view
  const fetchWeeklyStats = async () => {
    const { data, error } = await supabase
      .from('weekly_spo2_stats')
      .select('*');
    if (!error && data) setWeeklyStats(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatest();
      fetchTrend();
      fetchHeartHistory();
      fetchHistoryTable();
      fetchWeeklyStats();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6 border-b pb-3">
        <div className="flex items-center space-x-3">
          <i className="fas fa-heartbeat text-red-500 text-2xl"></i>
          <h1 className="text-xl font-bold text-blue-700">Blood Oxygen Monitoring</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span>Dr. Sanmesh Joshi</span>
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">SJ</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Current SPO2 Level</h2>
            <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center">
              <i className="fas fa-lungs"></i>
            </div>
          </div>
          <div
            className={`text-5xl font-bold text-center ${
              latest.spo2 >= 95 ? 'text-green-500' : latest.spo2 >= 90 ? 'text-yellow-500' : 'text-red-500'
            }`}
          >
            {latest.spo2}%
          </div>
          <p className="text-center text-gray-500 mt-2">
            {latest.spo2 >= 95
              ? 'Normal Oxygen Level'
              : latest.spo2 >= 90
              ? 'Low Oxygen Level'
              : 'Critical Oxygen Level'}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Heart Rate</h2>
            <div className="w-10 h-10 bg-red-600 text-white rounded flex items-center justify-center">
              <i className="fas fa-heart"></i>
            </div>
          </div>
          <div className="text-5xl font-bold text-center text-red-500">
            {latest.heart_rate} bpm
          </div>
          <p className="text-center text-gray-500 mt-2">
            {latest.heart_rate < 60 || latest.heart_rate > 100
              ? 'Abnormal Heart Rate'
              : 'Normal Heart Rate'}
          </p>
        </div>

        <BloodComposition spo2={latest.spo2} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendChart dataPoints={trendData} />
        <HeartRateChart heartRates={heartHistory} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <HistoryTable history={historyData} />
        <WeeklyStatsChart weeklyData={weeklyStats} />
      </div>
    </div>
  );
}
