import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2, RefreshCw, ParkingCircle } from "lucide-react";
import {
  fetchChannelFeed,
  latestReadings,
  occupancyStats,
  sampleData,
  SPACE_COUNT,
} from "@/lib/thingspeak";
import { ParkingSpaceCard } from "@/components/ParkingSpaceCard";
import { OccupancyChart } from "@/components/OccupancyChart";
import { ChannelSettings } from "@/components/ChannelSettings";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Sistema de estacionamiento" },
      {
        name: "description",
        content:
          "Panel de control de estacionamiento ESP32 en tiempo real con datos ThingSpeak en vivo y análisis de ocupación por espacio.",
      },
    ],
  }),
});

const REFRESH_MS = 15_000;
const LS_KEY = "smart-parking.config";

function useConfig() {
  const [cfg, setCfg] = useState<{ channelId: string; readApiKey: string }>(() => {
    if (typeof window === "undefined") return { channelId: "", readApiKey: "" };
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : { channelId: "", readApiKey: "" };
    } catch {
      return { channelId: "", readApiKey: "" };
    }
  });
  const save = (channelId: string, readApiKey: string) => {
    const next = { channelId, readApiKey };
    setCfg(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  return { cfg, save };
}

export default function Dashboard() {
  const { cfg, save } = useConfig();
  const isDemo = !cfg.channelId;

  const query = useQuery({
    queryKey: ["thingspeak", cfg.channelId, cfg.readApiKey],
    queryFn: async () => {
      if (isDemo) return sampleData();
      return fetchChannelFeed(cfg.channelId, cfg.readApiKey || undefined, 200);
    },
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: false,
  });

  const { readings, updatedAt } = useMemo(() => {
    if (!query.data) {
      return {
        readings: Array.from({ length: SPACE_COUNT }, (_, i) => ({
          id: i + 1,
          distance: null,
          status: "unknown" as const,
        })),
        updatedAt: null,
      };
    }
    return latestReadings(query.data);
  }, [query.data]);

  const stats = useMemo(
    () =>
      query.data
        ? occupancyStats(query.data)
        : Array.from({ length: SPACE_COUNT }, (_, i) => ({
            id: i + 1,
            occupied: 0,
            available: 0,
            total: 0,
          })),
    [query.data],
  );

  const availableCount = readings.filter((r) => r.status === "available").length;
  const occupiedCount = readings.filter((r) => r.status === "occupied").length;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const lastUpdateLabel = updatedAt
    ? relativeTime(new Date(updatedAt).getTime(), now)
    : "—";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <ParkingCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Sistema de vigilancia de estacionamiento
            </h1>
            <p className="text-sm text-muted-foreground">
               {isDemo && ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
            className="gap-2"
          >
            {query.isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <ChannelSettings
            channelId={cfg.channelId}
            readApiKey={cfg.readApiKey}
            onSave={save}
          />
        </div>
      </header>

      <section className="stats-grid">
        <StatTile label="Espacios totales" value={SPACE_COUNT} />
        <StatTile label="Disponibles" value={availableCount} accent="available" />
        <StatTile label="Ocupados" value={occupiedCount} accent="occupied" />
        <StatTile label="Actualización" value={lastUpdateLabel} mono={false} />
      </section>

      {query.isError && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <div>
            <p className="font-medium">Couldn't reach ThingSpeak.</p>
            <p className="opacity-80">
              {(query.error as Error).message} — verify your channel ID is public or
              provide a Read API key.
            </p>
          </div>
        </div>
      )}

      <section className="mt-8 animate-fade-up">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Espacios</h2>
          <p className="text-xs text-muted-foreground">
            Actualización cada {REFRESH_MS / 1000}s
          </p>
        </div>
        <div className="spaces-grid">
          {readings.map((r) => (
            <ParkingSpaceCard key={r.id} reading={r} />
          ))}
        </div>
      </section>

      <section className="mt-10 animate-fade-up">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Analisis de ocupación</h2>
          <p className="text-xs text-muted-foreground">
            Basado en las ultimas {query.data?.feeds.length ?? 0} actualizaciones
          </p>
        </div>
        <div className="spaces-grid">
          {stats.map((s) => (
            <OccupancyChart
              key={s.id}
              spaceId={s.id}
              occupied={s.occupied}
              available={s.available}
            />
          ))}
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        Threshold: distance &lt; 20 cm → occupied
      </footer>
    </main>
  );
}

function StatTile({
  label,
  value,
  accent,
  mono = true,
}: {
  label: string;
  value: string | number;
  accent?: "available" | "occupied";
  mono?: boolean;
}) {
  const accentClass =
    accent === "available"
      ? "text-available"
      : accent === "occupied"
        ? "text-occupied"
        : "text-foreground";
  return (
    <div className="card">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold ${mono ? "tabular-nums" : ""} ${accentClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function relativeTime(then: number, now: number) {
  const s = Math.max(0, Math.round((now - then) / 1000));
  if (s < 60) return `Hace ${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `Hace ${m}m`;
  const h = Math.round(m / 60);
  return `Hace ${h}h`;
}
