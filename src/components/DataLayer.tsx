"use client";


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
  1: { level: 1, label: "ﾀﾞぃぶﾏｼ", count: 10 },
  2: { level: 2, label: "ふつぅ", count: 65 },
  3: { level: 3, label: "まぁャバぃ", count: 180 },
  4: { level: 4, label: "激ャバ", count: 450 },
  5: { level: 5, label: "鬼ャバ💀", count: 820 },
};

interface DataLayerProps {
  data: PollenData | null;
  loading: boolean;
  onSecretTap?: () => void;
  debugLevel?: number | null;
}

export default function DataLayer({ data, loading, onSecretTap, debugLevel }: DataLayerProps) {
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
  const displayLabel = debug?.label ?? data.pollenLabel;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {/* 左上: 花粉レベル */}
      <div className="absolute top-20 left-5 sm:left-8">
        <div
          className="text-xs sm:text-sm"
          style={{
            color: "var(--pollen-yellow-light)",
            fontFamily: "'Noto Serif JP', serif",
            opacity: 0.9,
          }}
        >
          花粉レベル
        </div>
        <div
          className="mt-1 text-4xl sm:text-6xl"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'DotGothic16', sans-serif",
            fontWeight: 400,
          }}
        >
          {displayLabel}
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
