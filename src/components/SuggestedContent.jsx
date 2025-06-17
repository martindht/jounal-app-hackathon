import React, { useEffect, useState } from 'react';
import suggestions from '../utils/suggestions.json';

const SuggestedContent = ({ mood }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Match mood range
    const match = suggestions.find(item =>
      mood >= item.moodRange[0] && mood <= item.moodRange[1]
    );
    setContent(match);
  }, [mood]);

  if (!content) return null;

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-lg font-semibold mb-2">Suggested for You</h2>

      {content.quote && (
        <p className="mb-2 italic text-indigo-700">“{content.quote}”</p>
      )}

      {content.activity && (
        <p className="mb-2">
          <strong>Try this:</strong> {content.activity}
        </p>
      )}

      {content.video && (
        <div className="mb-4">
          <strong>Watch:</strong>{' '}
          <a
            href={content.video}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Recommended video
          </a>
        </div>
      )}
    </div>
  );
};

export default SuggestedContent;
