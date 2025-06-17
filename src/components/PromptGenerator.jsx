import React from 'react';

const PROMPTS = [ 
  "What emotion has been strongest today?",
  "What’s been on your mind lately?",
  "How much do your current goals reflect your desires vs someone else’s?",
  "In what ways are you currently self-sabotaging or holding yourself back?",
  "Write about a mistake that taught you something about yourself.",
  "Write about an aspect of your personality that you appreciate in other people as well."



];

const PromptGenerator = ({ onSelect }) => {
  const handlePromptClick = (prompt) => {
    onSelect(prompt);
  };

  return (
    <div className="mb-4">
      <h2 className="text-md font-medium mb-2">Need inspiration?</h2>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handlePromptClick(prompt)}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 transition"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptGenerator;
