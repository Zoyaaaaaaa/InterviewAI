import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  value: number
  subtitle: string
  trend?: number
}

export const StatCard: React.FC<StatCardProps> = ({ 
  value, 
  subtitle, 
  trend = 0 
}) => {
  const formatValue = (val: number) => {
    return val.toFixed(1)
  }

  const getTrendColor = (trendValue: number) => {
    if (trendValue > 0) return 'text-green-400'
    if (trendValue < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getTrendIcon = (trendValue: number) => {
    if (trendValue > 0) return <TrendingUp className="w-4 h-4" />
    if (trendValue < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-purple-800/10 backdrop-blur-sm border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-purple-500/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-purple-300/70 uppercase tracking-wider">
            {subtitle}
          </h3>
          <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
        </div>

        {/* Main Value */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
            {formatValue(value)}
            <span className="text-lg text-purple-400/60 ml-1">/10</span>
          </div>
          
          {/* Trend Indicator */}
          {trend !== 0 && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span className="font-medium">
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </span>
              <span className="text-purple-400/60">vs last period</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-purple-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(value / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-400/60">
            <span>0</span>
            <span>10</span>
          </div>
        </div>

        {/* Score Category */}
        <div className="pt-2 border-t border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300/60">Performance</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                value >= 8 ? 'bg-green-400' :
                value >= 6 ? 'bg-yellow-400' :
                value >= 4 ? 'bg-orange-400' :
                'bg-red-400'
              }`} />
              <span className="text-xs text-purple-200/80 font-medium">
                {value >= 8 ? 'Excellent' :
                 value >= 6 ? 'Good' :
                 value >= 4 ? 'Average' :
                 'Needs Improvement'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}