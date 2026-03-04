"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`
      );
      setDate(
        now.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right">
      <div
        style={{
          color: "var(--pollen-yellow)",
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 400,
          fontSize: "12px",
          opacity: 0.9,
          lineHeight: "28px",
        }}
      >
        {date}
      </div>
      <div
        className="tabular-nums"
        style={{
          color: "var(--pollen-yellow)",
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 400,
          fontSize: "10.5px",
          opacity: 0.65,
          lineHeight: "1.4",
        }}
      >
        {time}
      </div>
    </div>
  );
}
