import React, { useState } from 'react';
import EntryForm from '../components/EntryForm';
import MoodSlider from '../components/MoodSlider';
import PromptGenerator from '../components/PromptGenerator';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(5); // mood scale 1–10
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (entryText, date) => {
    const newEntry = {
      id: Date.now(),
      text: entryText,
      date: date || new Date().toISOString(),
      mood: currentMood,
      promptUsed: prompt,
    };

    setEntries(prev => [newEntry, ...prev]);

    // Save to local storage
    localStorage.setItem('journalEntries', JSON.stringify([newEntry, ...entries]));

    // Reset fields
    setPrompt('');
    setCurrentMood(5);
  };

  const handlePromptSelect = (selectedPrompt) => {
    setPrompt(selectedPrompt);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Today's Journal</h1>

      <PromptGenerator onSelect={handlePromptSelect} />
      {prompt && <p className="text-sm text-gray-600 mb-2 italic">Prompt: {prompt}</p>}

      <MoodSlider value={currentMood} onChange={setCurrentMood} />

      <EntryForm onSubmit={handleSubmit} defaultPrompt={prompt} />

      <h2 className="text-xl font-semibold mt-8 mb-4">Previous Entries (preview)</h2>
      <ul className="space-y-3">
        {entries.map(entry => (
          <li key={entry.id} className="border p-4 rounded shadow-sm bg-white">
            <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleString()}</div>
            <div className="text-base">{entry.text.slice(0, 100)}...</div>
            <div className="text-xs mt-1 text-indigo-600">Mood: {entry.mood}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Journal;
