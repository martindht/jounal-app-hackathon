import React, { useEffect, useState } from 'react';
import { listEntries } from '../api/entries';

const mapToUi = (doc) => ({
  id: doc._id,
  text: doc.content,
  date: doc.entryDate,
  mood: doc.selfReport,
  promptUsed: doc.prompt ?? null,
});

const Entries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    let on = true;
    listEntries()
      .then(({ data }) => {
        if (on) setEntries((data || []).map(mapToUi));
      })
      .catch((e) => console.error("Failed to load entries:", e));
    return () => { on = false; };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Past Journal Entries</h1>

      {entries.length === 0 ? (
        <p className="text-gray-600 italic">No entries yet. Start journaling!</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li key={entry.id} className="bg-white border rounded p-4 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">
                {new Date(entry.date).toLocaleString()}
              </div>
              <div className="text-base text-gray-800 whitespace-pre-wrap mb-2">
                {entry.text}
              </div>
              <div className="text-xs text-indigo-700">
                Mood Score: {entry.mood} / 10
                {entry.promptUsed && (
                  <span className="ml-2 italic text-gray-500">Prompt: “{entry.promptUsed}”</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Entries;
