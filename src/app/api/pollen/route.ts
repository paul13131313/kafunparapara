import { NextResponse } from "next/server";

interface PollenResponse {
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

const TOKYO_LAT = 35.68;
const TOKYO_LON = 139.69;

function getPollenLevel(count: number): { level: number; label: string } {
  if (count < 30) return { level: 1, label: "だいぶマシ" };
  if (count < 100) return { level: 2, label: "ふつう" };
  if (count < 300) return { level: 3, label: "まあヤバい" };
  if (count < 600) return { level: 4, label: "激ヤバ" };
  return { level: 5, label: "鬼ヤバ💀" };
}

const MONTH_BASE: Record<number, number> = {
  1: 5,
  2: 30,
  3: 120,
  4: 80,
  5: 20,
};

function estimatePollenCount(temperature: number, windSpeed: number, weatherCode: number): number {
  const month = new Date().getMonth() + 1;
  let score = MONTH_BASE[month] ?? 5;

  if (temperature >= 15) score *= 1.5;
  if (windSpeed >= 5) score *= 1.3;
  if (weatherCode <= 2) score *= 1.2;
  if (weatherCode >= 61) score *= 0.3;

  return Math.round(score);
}

export async function GET() {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FTokyo`;

    const weatherRes = await fetch(weatherUrl, { next: { revalidate: 3600 } });

    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo Weather API error: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    const temperature = current.temperature_2m ?? 0;
    const windSpeed = current.wind_speed_10m ?? 0;
    const weatherCode = current.weather_code ?? 0;

    const pollenCount = estimatePollenCount(temperature, windSpeed, weatherCode);
    const { level, label } = getPollenLevel(pollenCount);

    const weatherCodeMap: Record<number, string> = {
      0: "快晴",
      1: "晴れ",
      2: "くもり時々晴れ",
      3: "くもり",
      45: "霧",
      48: "着氷性の霧",
      51: "弱い霧雨",
      53: "霧雨",
      55: "強い霧雨",
      61: "小雨",
      63: "雨",
      65: "大雨",
      71: "小雪",
      73: "雪",
      75: "大雪",
      77: "あられ",
      80: "にわか雨",
      81: "にわか雨(強)",
      82: "激しいにわか雨",
      85: "にわか雪",
      86: "にわか雪(強)",
      95: "雷雨",
      96: "雷雨(あられ)",
      99: "雷雨(大あられ)",
    };

    const response: PollenResponse = {
      city: "東京",
      pollenLevel: level,
      pollenCount: pollenCount,
      pollenLabel: label,
      temperature: Math.round(temperature),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      windSpeed: Math.round(windSpeed * 10) / 10,
      weather: weatherCodeMap[weatherCode] ?? "不明",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Pollen API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pollen data" },
      { status: 500 }
    );
  }
}
