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

function findClosestHourIndex(times: string[]): number {
  const now = new Date();
  let closestIndex = 0;
  let closestDiff = Infinity;

  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - now.getTime());
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = i;
    }
  }
  return closestIndex;
}

export async function GET() {
  try {
    const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&hourly=alder_pollen,birch_pollen,grass_pollen&timezone=Asia%2FTokyo`;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${TOKYO_LAT}&longitude=${TOKYO_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FTokyo`;

    const [pollenRes, weatherRes] = await Promise.all([
      fetch(pollenUrl, { next: { revalidate: 3600 } }),
      fetch(weatherUrl, { next: { revalidate: 3600 } }),
    ]);

    if (!pollenRes.ok) {
      throw new Error(`Open-Meteo Air Quality API error: ${pollenRes.status}`);
    }
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo Weather API error: ${weatherRes.status}`);
    }

    const pollenData = await pollenRes.json();
    const weatherData = await weatherRes.json();

    const hourIndex = findClosestHourIndex(pollenData.hourly.time);

    const alderPollen = pollenData.hourly.alder_pollen?.[hourIndex] ?? 0;
    const birchPollen = pollenData.hourly.birch_pollen?.[hourIndex] ?? 0;
    const pollenCount = Math.round(alderPollen + birchPollen);

    const { level, label } = getPollenLevel(pollenCount);

    const current = weatherData.current;
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
      temperature: Math.round(current.temperature_2m ?? 0),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      windSpeed: Math.round((current.wind_speed_10m ?? 0) * 10) / 10,
      weather: weatherCodeMap[current.weather_code] ?? "不明",
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
