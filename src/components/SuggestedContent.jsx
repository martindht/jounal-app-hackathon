import React, { useEffect, useState } from "react";
import { getSuggestions } from "../api/entries";

const SuggestedContent = ({ band }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let on = true;
    if (!band) { setData(null); return; }
    getSuggestions({ mood: band })
      .then(({ data }) => { if (on) setData(data || null); })
      .catch(() => { if (on) setData(null); });
    return () => { on = false; };
  }, [band]);

  if (!data || (!data.quote && !data.video && !data.article)) return null;

  return (
    <div className="card mt-4">
      <h3 className="mb-2">Suggested for you</h3>

      {data.quote && (
        <div className="mb-2 text-sm italic" style={{ color: "var(--text-secondary)" }}>
          “{data.quote}”
        </div>
      )}

      {data.video?.url && (
        <div className="mb-1">
          <a href={data.video.url} target="_blank" rel="noreferrer" className="text-sm"
             style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
            {data.video.title || "Open video"} →
          </a>
        </div>
      )}

      {data.article?.url && (
        <div>
          <a href={data.article.url} target="_blank" rel="noreferrer" className="text-sm"
             style={{ color: "var(--accent-primary)" }}>
            {data.article.title || "Read article"} →
          </a>
        </div>
      )}
    </div>
  );
};

export default SuggestedContent;
