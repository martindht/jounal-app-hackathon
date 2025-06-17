import React, { useEffect, useState } from 'react';
import MoodChart from '../components/MoodChart';
import SuggestedContent from '../components/SuggestedContent';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [recentMood, setRecentMood] = useState(5); // default neutral

  useEffect(() => {
    const stored = localStorage.getItem('journalEntries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEntries(parsed);

      if (parsed.length > 0) {
        setRecentMood(parsed[0].mood); // assume most recent is at index 0
      }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Mood Dashboard</h1>
      <p className="text-gray-600 text-lg mb-8">
        Visualize your emotional patterns over time.
      </p>

      {entries.length > 0 ? (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Mood Over Time</h2>
            <div className="flex justify-center">
              <div className="w-full max-w-3xl">
                <MoodChart data={entries} />
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Mood Summary</h2>
            <p className="text-lg text-gray-800">
              Average Mood Score: <strong>{stats.avg}</strong> / 10
            </p>
            <ul className="mt-4 list-disc list-inside text-sm text-gray-700 text-left inline-block">
              {Object.entries(stats.moodDist).map(([band, count]) => (
                <li key={band}>
                  <span className="font-medium">{band}</span> Mood Days: {count}
                </li>
              ))}
            </ul>
          </section>

          <SuggestedContent mood={recentMood} />
        </>
      ) : (
        <p className="text-gray-600 italic text-lg">
          No journal entries yet. Write your first one to see mood stats here!
        </p>
      )}
    </div>
  );
};

export default Dashboard;
