import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const MoodChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No mood data to display.</p>;

  // Sort and format data
  const formattedData = [...data]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      mood: entry.mood
    }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4f46e5" // Indigo
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
