import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Props {
  spaceId: number;
  occupied: number;
  available: number;
}

export function OccupancyChart({ spaceId, occupied, available }: Props) {
  const total = occupied + available;
  const data = [
    { name: "Ocupado", value: occupied, color: "var(--occupied)" },
    { name: "Disponible", value: available, color: "var(--available)" },
  ];
  const pct = total === 0 ? 0 : Math.round((occupied / total) * 100);

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Espacio {spaceId}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {pct}% ocupado
        </span>
      </div>
      <div className="h-44">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No hay datos
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={38}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={24}
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
