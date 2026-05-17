export interface SpaceReading {
  id: number;
  distance: number | null;
  status: "available" | "occupied" | "unknown";
}

export interface ThingSpeakResponse {
  channel: { name?: string; updated_at?: string };
  feeds: Array<Record<string, string | null>>;
}

export const OCCUPIED_THRESHOLD_CM = 20;
export const SPACE_COUNT = 5;

export function statusFromDistance(d: number | null): SpaceReading["status"] {
  if (d === null || Number.isNaN(d)) return "unknown";
  return d < OCCUPIED_THRESHOLD_CM ? "occupied" : "available";
}

export async function fetchChannelFeed(channelId: string, readApiKey?: string, results = 100) {
  const url = new URL(`https://api.thingspeak.com/channels/${channelId}/feeds.json`);
  url.searchParams.set("results", String(results));
  if (readApiKey) url.searchParams.set("api_key", readApiKey);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`ThingSpeak error ${res.status}`);
  return (await res.json()) as ThingSpeakResponse;
}

export function latestReadings(data: ThingSpeakResponse): {
  readings: SpaceReading[];
  updatedAt: string | null;
} {
  const feeds = data.feeds ?? [];
  const last = feeds[feeds.length - 1];
  const readings: SpaceReading[] = [];
  for (let i = 1; i <= SPACE_COUNT; i++) {
    const raw = last ? last[`field${i}`] : null;
    const d = raw === null || raw === undefined || raw === "" ? null : Number(raw);
    readings.push({ id: i, distance: d, status: statusFromDistance(d) });
  }
  return { readings, updatedAt: last?.created_at ?? null };
}

export function occupancyStats(data: ThingSpeakResponse): Array<{
  id: number;
  occupied: number;
  available: number;
  total: number;
}> {
  const feeds = data.feeds ?? [];
  return Array.from({ length: SPACE_COUNT }, (_, i) => {
    const field = `field${i + 1}`;
    let occupied = 0;
    let available = 0;
    for (const f of feeds) {
      const v = f[field];
      if (v === null || v === undefined || v === "") continue;
      const n = Number(v);
      if (Number.isNaN(n)) continue;
      if (n < OCCUPIED_THRESHOLD_CM) occupied++;
      else available++;
    }
    return { id: i + 1, occupied, available, total: occupied + available };
  });
}

// Sample data for when no channel is configured
export function sampleData(): ThingSpeakResponse {
  const now = Date.now();
  const feeds = Array.from({ length: 60 }, (_, i) => {
    const t = new Date(now - (60 - i) * 60_000).toISOString();
    const row: Record<string, string> = { created_at: t, entry_id: String(i) };
    for (let s = 1; s <= SPACE_COUNT; s++) {
      // each space has its own occupation pattern
      const occupied = Math.sin(i / (4 + s) + s) > 0.2 - s * 0.05;
      const dist = occupied ? 5 + Math.random() * 12 : 40 + Math.random() * 60;
      row[`field${s}`] = dist.toFixed(1);
    }
    return row;
  });
  return { channel: { name: "Demo Channel" }, feeds };
}
