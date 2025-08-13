import React, { useEffect, useState } from 'react';
import MoodChart from '../components/MoodChart';
import SuggestedContent from '../components/SuggestedContent';
import YearInPixels from '../components/YearInPixels';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [recentMood, setRecentMood] = useState(5); // default neutral

  useEffect(() => {
    const stored = localStorage.getItem('journalEntries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEntries(parsed);
      if (parsed.length > 0) setRecentMood(parsed[0].mood); // assume most recent first
    }
  }, []);

  const getMoodStats = () => {
    if (!entries.length) return null;
    const moods = entries.map(e => e.mood);
    const avg = (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(2);
    const moodDist = moods.reduce((acc, mood) => {
      const band = mood <= 3 ? 'Low' : mood <= 7 ? 'Medium' : 'High';
      acc[band] = (acc[band] || 0) + 1;
      return acc;
    }, {});
    return { avg, moodDist };
  };

  const stats = getMoodStats();

  // Normalize for <YearInPixels/>
  const pixelEntries = entries
    .map(e => ({
      timestamp: e.timestamp ? new Date(e.timestamp)
        : e.date ? new Date(e.date)
        : e.createdAt ? new Date(e.createdAt)
        : null,
      selfReport: typeof e.mood === 'number' ? e.mood : undefined,
      moodLabel: e.moodLabel || e.label || undefined,
    }))
    .filter(e => e.timestamp);

  return (
    <div className="mx-auto px-6 py-8 max-w-7xl text-center">
      <h1 className="text-4xl font-bold text-gray-100 mb-2">Mood Dashboard</h1>
      <p className="text-gray-400 text-lg mb-10">
        Visualize your emotional patterns over time.
      </p>

      {entries.length > 0 ? (
        <>
          {/* Side-by-side: Year in Pixels (left) and Mood Trends (right) */}
          <section className="two-col mb-12">
            <div className="text-left">
              <YearInPixels entries={pixelEntries} year={new Date().getFullYear()} />
            </div>

            <div className="text-left">
              <h2 className="text-2xl font-semibold mb-4">Mood Trends</h2>
              <div className="w-full">
                <MoodChart data={entries} />
              </div>
            </div>
          </section>

          {/* Summary below */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Mood Summary</h2>
            <p className="text-lg text-gray-200">
              Average Mood Score: <strong>{stats?.avg}</strong> / 10
            </p>
            <ul className="mt-4 list-disc list-inside text-sm text-gray-300 text-left inline-block">
              {stats && Object.entries(stats.moodDist).map(([band, count]) => (
                <li key={band}>
                  <span className="font-medium">{band}</span> Mood Days: {count}
                </li>
              ))}
            </ul>
          </section>

          <SuggestedContent mood={recentMood} />
        </>
      ) : (
        <p className="text-gray-400 italic text-lg">
          No journal entries yet. Write your first one to see mood stats here!
        </p>
      )}
    </div>
  );
};

export default Dashboard;
