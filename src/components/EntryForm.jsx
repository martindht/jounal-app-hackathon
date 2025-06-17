import React, { useState } from 'react';

const EntryForm = ({ onSubmit, defaultPrompt }) => {
  const [text, setText] = useState(defaultPrompt || '');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text, date);
    setText('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <textarea
        className="w-full h-40 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write your thoughts..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600">
          Optional Date:
          <input
            type="datetime-local"
            className="ml-2 border rounded px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
