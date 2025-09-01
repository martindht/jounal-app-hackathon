import React, { useMemo } from "react";

const startOfDayKey = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};

const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

const colorFor = ({ moodLabel, selfReport }) => {
  if (typeof selfReport === "number") {
    const s = Math.max(1, Math.min(10, selfReport));
    if (s <= 3) return "#ef4444";
    if (s <= 5) return "#f59e0b";
    if (s <= 7) return "#10b981";
    if (s <= 9) return "#22c55e";
    return "#3b82f6";
  }
  switch ((moodLabel || "neutral").toLowerCase()) {
    case "happy": return "#22c55e";
    case "calm": return "#10b981";
    case "neutral": return "#9ca3af";
    case "sad": return "#60a5fa";
    case "anxious":
    case "angry": return "#ef4444";
    default: return "#9ca3af";
  }
};

export default function YearInPixels({ entries = [], year = new Date().getFullYear() }) {
  const byDay = useMemo(() => {
    const m = new Map();
    for (const e of entries) {
      const key = startOfDayKey(e.timestamp || e.date || e.createdAt);
      if (key) m.set(key, e);
    }
    return m;
  }, [entries]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // shared grid sizing so header + rows align perfectly
  const PIX = 20, GAP = 3, DAY_COL = 22;
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `${DAY_COL}px repeat(12, ${PIX}px)`,
    columnGap: `${GAP}px`,
    rowGap: `${GAP}px`,
    alignItems: "center",
  };
  return (
    <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
      {/* This wrapper shrinks to the exact width of GRID + LEGEND */}
      <div style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* Now the title centers over BOTH grid and legend */}
        <h2 style={{ margin: '0 0 8px 0' }}>Your Year in Pixels — {year}</h2>
  
        {/* Row: [GRID][LEGEND] */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          {/* --- GRID --- */}
          <div style={{ display: 'inline-block' }}>
            {/* month header aligned to columns */}
            <div style={{ ...gridStyle, marginBottom: '4px' }}>
              <div /> {/* spacer for day numbers */}
              {MONTHS.map((m, i) => (
                <div
                  key={`h-${i}`}
                  style={{ width: PIX, height: 12, lineHeight: '12px', textAlign: 'center', color: '#d1d5db', fontSize: 12 }}
                >
                  {m}
                </div>
              ))}
            </div>
  
            {/* day rows */}
            <div style={gridStyle}>
              {days.map((dayNum) => (
                <React.Fragment key={`r-${dayNum}`}>
                  <div
                    style={{
                      width: DAY_COL,
                      lineHeight: `${PIX}px`,
                      textAlign: 'right',
                      paddingRight: 4,
                      color: '#9ca3af',
                      fontSize: 12,
                      fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
                    }}
                  >
                    {dayNum}
                  </div>
  
                  {MONTHS.map((_, monthIdx) => {
                    const d = new Date(year, monthIdx, dayNum);
                    if (d.getMonth() !== monthIdx) {
                      return (
                        <div
                          key={`${monthIdx}-${dayNum}`}
                          className="pixel blank"
                          style={{ width: PIX, height: PIX }}
                        />
                      );
                    }
                    const key = startOfDayKey(d);
                    const entry = byDay.get(key);
                    const style = entry
                      ? { background: colorFor(entry), width: PIX, height: PIX, borderRadius: 3, outline: '1px solid rgba(255,255,255,.06)' }
                      : { width: PIX, height: PIX }; // .pixel CSS will handle empty color
                    return (
                      <div
                        key={`${monthIdx}-${dayNum}`}
                        className={`pixel ${entry ? 'has' : 'empty'}`}
                        style={style}
                        title={
                          entry
                            ? `${key}\nMood: ${entry.moodLabel ?? '—'}\nSelf-report: ${entry.selfReport ?? '—'}`
                            : key
                        }
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
  
          {/* --- LEGEND (to the right) --- */}
          <aside
            style={{
              alignSelf: 'flex-start',
              paddingLeft: 20,
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              minWidth: 140,
              lineHeight: 1.5,
              fontSize: 12,
              color: '#9ca3af',
            }}
          >
            <div style={{ marginBottom: 6, color: '#e5e7eb', fontWeight: 500 }}>Mood Legend</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" style={{ background: '#ef4444' }} /> bad</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" style={{ background: '#f59e0b' }} /> poor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" style={{ background: '#10b981' }} /> fair</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" style={{ background: '#22c55e' }} /> good</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" style={{ background: '#3b82f6' }} /> great</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="legend-swatch" /> no data</div>
          </aside>
        </div>
      </div>
    </section>
  );
  
  
  
      
}
