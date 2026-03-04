"use client";

import { useState } from "react";

interface PollenData {
  city: string;
  pollenLevel: number;
  pollenCount: number;
  pollenLabel: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weather: string;
  updatedAt: string;
}

const DEBUG_LABELS: Record<number, { level: number; label: string; count: number }> = {
  1: { level: 1, label: "だいぶマシ", count: 10 },
  2: { level: 2, label: "ふつう", count: 65 },
  3: { level: 3, label: "まあヤバい", count: 180 },
  4: { level: 4, label: "激ヤバ", count: 450 },
  5: { level: 5, label: "鬼ヤバ💀", count: 820 },
};

interface DataLayerProps {
  data: PollenData | null;
  loading: boolean;
  onSecretTap?: () => void;
  debugLevel?: number | null;
}

export default function DataLayer({ data, loading, onSecretTap, debugLevel }: DataLayerProps) {
  const [showInfo, setShowInfo] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
        <div
          className="text-xl animate-pulse"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'Crimson Pro', serif",
            fontStyle: "italic",
          }}
        >
          花粉データ取得中...
        </div>
      </div>
    );
  }

  if (!data) return null;

  const debug = debugLevel != null ? DEBUG_LABELS[debugLevel] : null;
  const displayCount = debug?.count ?? data.pollenCount;
  const displayLabel = debug?.label ?? data.pollenLabel;
  const displayLevel = debug?.level ?? data.pollenLevel;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {/* 左上: メイン数値 */}
      <div className="absolute top-20 left-5 sm:left-8">
        <div
          className="text-6xl sm:text-8xl tabular-nums"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'Crimson Pro', serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {displayCount}
        </div>
        <div
          className="text-xs sm:text-sm mt-0.5 flex items-center gap-1.5"
          style={{
            color: "var(--pollen-yellow-light)",
            fontFamily: "'Source Serif 4', serif",
            fontStyle: "italic",
            opacity: 0.9,
          }}
        >
          grains/m³
          <span
            onClick={() => setShowInfo((v) => !v)}
            style={{
              pointerEvents: "auto",
              cursor: "pointer",
              fontSize: "11px",
              opacity: 0.6,
              fontStyle: "normal",
            }}
          >
            ⓘ
          </span>
        </div>
        {showInfo && (
          <div
            onClick={() => setShowInfo(false)}
            className="mt-1.5 px-3 py-2 rounded-xl"
            style={{
              pointerEvents: "auto",
              background: "rgba(60, 50, 30, 0.85)",
              color: "rgba(255, 230, 150, 0.9)",
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "11px",
              lineHeight: 1.6,
              maxWidth: "200px",
              cursor: "pointer",
            }}
          >
            気温・風速・季節をもとに算出した推定値です
          </div>
        )}

        <div
          className="mt-3 text-xl sm:text-2xl"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'Crimson Pro', serif",
            fontWeight: 600,
          }}
        >
          {displayLabel}
        </div>

        <div
          className="mt-2 text-xs px-2.5 py-1 rounded-full inline-block"
          style={{
            background: "var(--pollen-yellow-soft)",
            color: "var(--pollen-yellow)",
            fontFamily: "'Source Serif 4', serif",
            fontWeight: 600,
          }}
        >
          Lv.{displayLevel}
        </div>
      </div>

      {/* 右下: 気象情報 */}
      <div className="absolute bottom-8 right-5 sm:right-8 text-right" style={{ pointerEvents: "auto" }}>
        <div
          className="px-3.5 py-2.5 rounded-2xl"
          onClick={onSecretTap}
          style={{
            background: "var(--panel-bg)",
            fontFamily: "'Source Serif 4', serif",
            fontSize: "clamp(12px, 2.8vw, 14.4px)",
          }}
        >
          <div className="flex justify-between gap-6">
            <span style={{ color: "var(--pollen-yellow)", fontStyle: "italic", opacity: 1 }}>天気</span>
            <span style={{ color: "var(--pollen-yellow)", fontWeight: 600 }}>{data.weather}</span>
          </div>
          <div className="flex justify-between gap-6 mt-1.5">
            <span style={{ color: "var(--pollen-yellow)", fontStyle: "italic", opacity: 1 }}>気温</span>
            <span style={{ color: "var(--pollen-yellow)", fontWeight: 600 }}>{data.temperature}°C</span>
          </div>
          <div className="flex justify-between gap-6 mt-1.5">
            <span style={{ color: "var(--pollen-yellow)", fontStyle: "italic", opacity: 1 }}>湿度</span>
            <span style={{ color: "var(--pollen-yellow)", fontWeight: 600 }}>{data.humidity}%</span>
          </div>
          <div className="flex justify-between gap-6 mt-1.5">
            <span style={{ color: "var(--pollen-yellow)", fontStyle: "italic", opacity: 1 }}>風速</span>
            <span style={{ color: "var(--pollen-yellow)", fontWeight: 600 }}>{data.windSpeed}m/s</span>
          </div>
        </div>
        <div
          className="mt-2"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'Source Serif 4', serif",
            fontStyle: "italic",
            fontSize: "10.8px",
            opacity: 0.7,
          }}
        >
          {data.city} - {(() => { const d = new Date(data.updatedAt); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`; })()} 更新
        </div>
      </div>
    </div>
  );
}
