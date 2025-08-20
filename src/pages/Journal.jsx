import React, { useState, useEffect } from 'react';
import EntryForm from '../components/EntryForm';
import MoodSlider from '../components/MoodSlider';
import PromptGenerator from '../components/PromptGenerator';
import { createEntry, listEntries } from '../api/entries';

// server → UI mapper
const mapToUi = (doc) => ({
  id: doc._id,
  text: doc.content,
  date: doc.entryDate,
  mood: doc.selfReport,
  promptUsed: doc.prompt ?? null,
});

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(5); // mood scale 1–10
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    let on = true;
    listEntries()
      .then(({ data }) => { if (on) setEntries((data || []).map(mapToUi)); })
      .catch((e) => console.error('Failed to load entries:', e));
    return () => { on = false; };
  }, []);

  const handlePromptSelect = (p) => setPrompt(p);

  const handleSubmit = async (entryText, date) => {
    try {
      await createEntry({
        content: entryText,
        selfReport: currentMood,
        entryDate: date || new Date().toISOString(),
        prompt: prompt || null,
      });
      const { data } = await listEntries();
      setEntries((data || []).map(mapToUi));
    } catch (e) {
      console.error('Failed to create entry:', e);
    }
  };

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
              <div className="prompt-text">“{prompt}”</div>
            </div>
          )}
        </div>

        {/* Mood Slider Section */}
        <div className="mb-6">
          <MoodSlider value={currentMood} onChange={setCurrentMood} />
          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium mood-indicator ${getMoodClass(currentMood)}`}>
            {getMoodText(currentMood)} ({currentMood}/10)
          </div>
        </div>

        {/* Entry Form */}
        <EntryForm onSubmit={handleSubmit} />
      </div>

      {/* Recent Entries / recap — now fed by server data */}
      <div className="card mt-6">
        <div className="section-header">
          <h2>Recent Reflections</h2>
          {entries.length > 0 && (
            <span className="badge" style={{ border: '1px solid var(--border-primary)' }}>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>

        {entries.length > 0 ? (
          <div>
            {entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="entry-card">
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

                <div className="entry-content">
                  <p className="whitespace-pre-wrap">{entry.text}</p>
                </div>

                {entry.promptUsed && (
                  <div className="prompt-section" style={{ marginTop: '0.5rem' }}>
                    <span className="prompt-label">Prompt</span>
                    <div className="prompt-text">
                      {entry.promptUsed.length > 120
                        ? `“${entry.promptUsed.slice(0, 120)}…”`
                        : `“${entry.promptUsed}”`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No journal entries yet. Start writing above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;