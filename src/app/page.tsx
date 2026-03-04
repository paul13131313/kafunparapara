"use client";

import { useEffect, useState } from "react";
import CharacterPlayer from "@/components/CharacterPlayer";
import PollenParticles from "@/components/PollenParticles";
import DataLayer from "@/components/DataLayer";
import Clock from "@/components/Clock";

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

export default function Home() {
  const [data, setData] = useState<PollenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPollen() {
      try {
        const res = await fetch("/api/pollen");
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (e) {
        console.error("Failed to fetch pollen data:", e);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }

    fetchPollen();
  }, []);

  const pollenLevel = data?.pollenLevel ?? 1;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 flex items-start justify-between px-5 sm:px-8 pt-5 pb-4"
        style={{
          zIndex: 30,
          background: "rgba(255, 244, 237, 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          className="tracking-wider"
          style={{
            color: "var(--pollen-yellow)",
            fontFamily: "'Crimson Pro', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(22px, 5vw, 26px)",
          }}
        >
          KAFUN PARAPARA
        </h1>
        <Clock />
      </header>

      {/* エラー表示 */}
      {error && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm"
          style={{
            zIndex: 30,
            background: "rgba(180, 60, 60, 0.06)",
            color: "#8B3A3A",
          }}
        >
          {error}
        </div>
      )}

      {/* キャラクター動画 */}
      <div className="relative flex items-center justify-center min-h-screen">
        <CharacterPlayer pollenLevel={pollenLevel} />
      </div>

      {/* 花粉パーティクル */}
      <PollenParticles pollenLevel={pollenLevel} />

      {/* データレイヤー */}
      <DataLayer data={data} loading={loading} />
    </main>
  );
}
