import React from 'react'
import { ChartTooltipProps } from '@/types/feedback'

export const CustomTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  
  return (
    <div className="bg-black/90 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 shadow-xl">
      <p className="font-semibold text-purple-200 mb-2">{payload[0].payload.date}</p>
      {payload.map((p) => (
        <p key={p.name} className="capitalize text-purple-400 flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
          <span>{p.name}: {p.value.toFixed(1)}</span>
        </p>
      ))}
    </div>
  )
}
