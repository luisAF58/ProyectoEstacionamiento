import { Car, CircleCheck, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpaceReading } from "@/lib/thingspeak";

const STATUS_STYLES = {
  available: {
    card: "bg-available/10 border-available/40 text-available-foreground",
    badge: "bg-available text-primary-foreground",
    dot: "text-available",
    label: "Disponible",
    Icon: CircleCheck,
  },
  occupied: {
    card: "bg-occupied/10 border-occupied/40 text-occupied-foreground",
    badge: "bg-occupied text-occupied-foreground",
    dot: "text-occupied",
    label: "Ocupado",
    Icon: Car,
  },
  unknown: {
    card: "bg-unknown/15 border-unknown/40 text-unknown-foreground",
    badge: "bg-unknown text-unknown-foreground",
    dot: "text-unknown",
    label: "No hay datos",
    Icon: CircleHelp,
  },
} as const;

export function ParkingSpaceCard({ reading }: { reading: SpaceReading }) {
  const s = STATUS_STYLES[reading.status];
  const Icon = s.Icon;
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-500",
        "shadow-[var(--shadow-card)] hover:-translate-y-0.5",
        s.card,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Espacio
          </p>
          <p className="text-3xl font-semibold tabular-nums text-foreground">
            {String(reading.id).padStart(2, "0")}
          </p>
        </div>
        <div className={cn("status-dot h-3 w-3 rounded-full bg-current", s.dot)} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Icon className={cn("h-8 w-8 transition-transform duration-500", s.dot)} />
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
              s.badge,
            )}
          >
            {s.label}
          </span>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {reading.distance === null ? "— cm" : `${reading.distance.toFixed(1)} cm`}
          </p>
        </div>
      </div>
    </div>
  );
}
