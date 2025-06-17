import React from 'react';

const getMoodEmoji = (val) => {
  if (val <= 3) return '😢';
  if (val <= 7) return '😐';
  return '😊';
};

const MoodSlider = ({ value, onChange }) => {
  return (
    <div className="my-4">
      <label className="block mb-2 font-medium">Rate your mood today</label>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-2xl">{getMoodEmoji(value)}</span>
        <span className="text-sm text-gray-600">({value}/10)</span>
      </div>
    </div>
  );
};

export default MoodSlider;
