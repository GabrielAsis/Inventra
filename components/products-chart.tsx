"use client";

import { Area, AreaChart, CartesianGrid, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ChartData {
  week: string;
  products: number;
}

export default function ProductsChart({ data }: { data: ChartData[] }) {
  console.log(data)
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Area
            type="monotone"
            dataKey="products"
            stroke="#05df72"
            fill="#05df72"
            fillOpacity={0.2}
            strokeWidth={1.5}
            dot={{ fill: "05df72", strokeWidth: 2, r: 2 }}
            activeDot={{ fill: "05df72", strokeWidth: 2, r: 4 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}
            labelStyle={{ color: "gray", fontWeight: "500" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
