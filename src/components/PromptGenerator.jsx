import React, { useEffect, useState } from "react";
import { dailyPrompts } from "../api/entries";

const PromptGenerator = ({ onSelect }) => {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    let on = true;
    dailyPrompts()
      .then(({ data }) => { if (on && Array.isArray(data)) setPrompts(data); })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  return (
    <div className="mb-4">
      <h2 className="text-md font-medium mb-2">Need inspiration?</h2>
      <div className="flex flex-wrap gap-2">
        {prompts.map((p, i) => (
          <button
            key={`${i}-${p.slice(0,12)}`}
            onClick={() => onSelect(p)}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded border border-gray-300 transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptGenerator;
