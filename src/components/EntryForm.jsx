import React, { useEffect, useMemo, useRef, useState } from "react";

const hasWebSpeech =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function EntryForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [date, setDate] = useState(""); // optional; backend will default to now if empty
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Build recognition instance once (Chrome only)
  const RecognitionCtor = useMemo(
    () => (hasWebSpeech ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null),
    []
  );

  useEffect(() => {
    if (!RecognitionCtor) return;

    const rec = new RecognitionCtor();
    rec.lang = "en-US";
    rec.interimResults = true;      // show partials while speaking
    rec.continuous = true;          // keep listening until stopped

    rec.onresult = (event) => {
      // Combine final transcripts across results
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript + " ";
      }
      if (finalTranscript) {
        // Append with a space if needed
        setText((prev) => (prev ? prev + " " : "") + finalTranscript.trim());
      }
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    return () => {
      try {
        rec.onresult = rec.onerror = rec.onend = null;
        rec.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, [RecognitionCtor]);

  const startStop = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (!listening) {
      try {
        rec.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    } else {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const iso = date ? new Date(date).toISOString() : undefined;
    await onSubmit(trimmed, iso);
    setText("");
    // keep date as-is so users can post multiple entries for same day if they want
  };

  const disabled = !text.trim();

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <label className="input-label">Your reflection</label>
      <div className="textarea-wrap">
        <textarea
          className="journal-textarea"
          placeholder="Speak or type your thoughts…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
        <div className="toolbar">
          <div className="left">
            {RecognitionCtor ? (
              <button
                type="button"
                className={`mic-btn ${listening ? "on" : ""}`}
                onClick={startStop}
                aria-pressed={listening}
                title={listening ? "Stop recording" : "Start voice to text"}
              >
                {listening ? "● Listening…" : "🎤 Voice to text"}
              </button>
            ) : (
              // only works for chrome
              <span className="hint">Voice input unsupported in this browser</span>
            )}
          </div>
          <div className="right">
            <input
              type="datetime-local"
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={disabled}>
              Save entry
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
