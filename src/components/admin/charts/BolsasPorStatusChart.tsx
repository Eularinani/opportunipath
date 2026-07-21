'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  status: string;
  total: number;
}

interface Props {
  data: DataPoint[];
}

const statusColors: Record<string, string> = {
  ABERTA: '#22C55E',
  FECHADA: '#9CA3AF',
  URGENTE: '#C41E3A',
  EM_BREVE: '#3B82F6',
};

export default function BolsasPorStatusChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={statusColors[entry.status] ?? '#8B5CF6'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Legend verticalAlign="bottom" height={24} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
