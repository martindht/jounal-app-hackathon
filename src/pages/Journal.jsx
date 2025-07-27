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

  // Helper function to get mood class+
  const getMoodClass = (mood) => {
    if (mood <= 3) return 'mood-low';
    if (mood <= 7) return 'mood-medium';
    return 'mood-high';
  };

  const getMoodText = (mood) => {
    if (mood <= 3) return 'Struggling';
    if (mood <= 4) return 'Low Energy';
    if (mood <= 6) return 'Feeling OK';
    if (mood <= 8) return 'Content';
    return 'Amazing';
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="journal-header">
        <h1>Daily Reflection</h1>
        <p>A  space for your thoughts and emotions ✨</p>
      </div>

      {/* Main Journal Entry Section */}
      <div className="card card-large">
        {/* Prompt Section */}
        <div className="mb-6">
          <PromptGenerator onSelect={handlePromptSelect} />
          {prompt && (
            <div className="prompt-section">
              <span className="prompt-label">Writing Prompt:</span>
              <div className="prompt-text">"{prompt}"</div>
            </div>
          )}
        </div>

        {/* Mood Slider Section */}
        <div className="mb-6">
          <MoodSlider value={currentMood} onChange={setCurrentMood} />
        </div>

        {/* Entry Form */}
        <EntryForm onSubmit={handleSubmit} defaultPrompt={prompt} />
      </div>

      {/* Previous Entries Section */}
      <div className="card card-large">
        <div className="flex justify-between items-center mb-6">
          <h2>Recent Reflections</h2>
          {entries.length > 0 && (
            <span style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-muted)', 
              background: 'var(--bg-secondary)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px',
              border: '1px solid var(--border-primary)'
            }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>

        {entries.length > 0 ? (
          <div>
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="entry-card">
                {/* Entry Header */}
                <div className="entry-header">
                  <div className="entry-date">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <span className={`mood-indicator ${getMoodClass(entry.mood)}`}>
                    {getMoodText(entry.mood)}
                  </span>
                </div>

                {/* Entry Content */}
                <div className="entry-content">
                  {entry.text.length > 150 
                    ? `${entry.text.slice(0, 150)}...` 
                    : entry.text
                  }
                </div>

                {/* Entry Footer */}
                {entry.promptUsed && (
                  <div className="entry-footer">
                    Prompt: "{entry.promptUsed.slice(0, 60)}..."
                  </div>
                )}
              </div>
            ))}

            {entries.length > 5 && (
              <div className="text-center" style={{ paddingTop: '1rem' }}>
                <a href="#" style={{ 
                  color: 'var(--accent-primary)', 
                  fontSize: '0.875rem', 
                  fontWeight: '500' 
                }}>
                  View all {entries.length} reflections →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center" style={{ 
            padding: '2rem', 
            color: 'var(--text-muted)', 
            fontStyle: 'italic' 
          }}>
            No journal entries yet. Start writing above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;