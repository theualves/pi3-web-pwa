"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dadosGrafico = [
  { categoria: "Ensino", envios: 125 },
  { categoria: "Pesquisa", envios: 42 },
  { categoria: "Extensão", envios: 89 },
];

export function GraficoAtividades() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Distribuição de Envios por Categoria
        </h2>
      </div>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dadosGrafico}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="categoria" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 14 }} 
              dy={10} 
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 14 }} 
            />
            
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#1e293b'
              }}
            />
            
            <Bar 
              dataKey="envios" 
              name="Total de Envios" 
              fill="#004A8D" 
              radius={[6, 6, 0, 0]} 
              barSize={80} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}