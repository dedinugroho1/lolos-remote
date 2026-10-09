"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ScoreBreakdown } from "@/lib/schemas/job-match";
import { breakdownCategories, scoreColor } from "@/lib/score";

export type BreakdownChartProps = { breakdown: ScoreBreakdown };

/** Bar chart horizontal 5 kategori skor (Recharts). */
export default function BreakdownChart({ breakdown }: BreakdownChartProps) {
  const data = breakdownCategories.map((c) => {
    const value = breakdown[c.key];
    return { name: c.short, label: `${value}/${c.max}`, pct: Math.round((value / c.max) * 100) };
  });

  return (
    <div>
      <div aria-hidden className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 52, bottom: 0, left: 0 }} barCategoryGap={12}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }}
            />
            <Bar
              dataKey="pct"
              radius={999}
              background={{ fill: "var(--muted)", radius: 999 }}
              isAnimationActive
              animationDuration={1000}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={scoreColor(d.pct)} />
              ))}
              <LabelList
                dataKey="label"
                position="right"
                offset={10}
                style={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>Rincian skor per kategori</caption>
        <tbody>
          {breakdownCategories.map((c) => (
            <tr key={c.key}>
              <th scope="row">{c.label}</th>
              <td>
                {breakdown[c.key]} dari {c.max}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
