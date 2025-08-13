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
    <div style={styles.container}>
      <h1 style={styles.h1}>Mood Dashboard</h1>
      <p style={styles.subtitle}>
        Visualize your emotional patterns over time.
      </p>

      {entries.length > 0 ? (
        <>
          {/* Side-by-side: Year in Pixels (left) and right column (Suggested + Summary + Trends) */}
          <section className="two-col" style={styles.section}>
            {/* Left column */}
            <div style={{ textAlign: 'left' }}>
              <YearInPixels entries={pixelEntries} year={new Date().getFullYear()} />
            </div>

            {/* Right column */}
            <div style={{ textAlign: 'left' }}>
              {/* Suggested for You */}
              <div style={{ marginBottom: 24 }}>
                <SuggestedContent mood={recentMood} />
              </div>

              {/* Mood Summary */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={styles.h2}>Mood Summary</h2>
                <p style={styles.summaryText}>
                  Average Mood Score: <strong>{stats?.avg}</strong> / 10
                </p>
                <ul style={styles.summaryList}>
                  {stats && Object.entries(stats.moodDist).map(([band, count]) => (
                    <li key={band}>
                      <span style={{ fontWeight: 600 }}>{band}</span> Mood Days: {count}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mood Trends (extra space on the right) */}
              <h2 style={styles.h2}>Mood Trends</h2>
              <div style={{ width: '100%', paddingRight: '6rem' }}>
                <MoodChart data={entries} />
              </div>
            </div>
          </section>
        </>
      ) : (
        <p style={styles.emptyState}>
          No journal entries yet. Write your first one to see mood stats here!
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1120px',        // ~7xl-ish
    margin: '0 auto',
    padding: '32px 24px',
    textAlign: 'center',
  },
  h1: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: '#f3f4f6',
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '1.125rem',
    margin: '0 0 40px',
  },
  section: {
    marginBottom: '48px',
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: '0 0 16px',
    color: '#e5e7eb',
  },
  summaryText: {
    fontSize: '1.125rem',
    color: '#e5e7eb',
    margin: 0,
  },
  summaryList: {
    marginTop: '16px',
    listStyle: 'disc',
    paddingInlineStart: '1.25rem',
    fontSize: '0.875rem',
    color: '#d1d5db',
  },
  emptyState: {
    color: '#9ca3af',
    fontStyle: 'italic',
    fontSize: '1.125rem',
  },
};

export default Dashboard;
