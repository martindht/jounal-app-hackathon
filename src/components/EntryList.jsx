import React from 'react';

const EntryList = ({ entries = [], preview = false }) => {
  if (!entries.length) {
    return (
      <p className="text-gray-600 italic">
        No entries available. Write your first journal entry!
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="bg-white border rounded p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="text-sm text-gray-500 mb-1">
            {new Date(entry.date).toLocaleString()}
          </div>

          <div className="text-base text-gray-800 whitespace-pre-wrap mb-2">
            {preview ? entry.text.slice(0, 100) + '...' : entry.text}
          </div>

          <div className="text-xs text-indigo-600">
            Mood Score: {entry.mood} / 10
            {entry.promptUsed && (
              <span className="ml-2 italic text-gray-500">
                Prompt: “{entry.promptUsed}”
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EntryList;
