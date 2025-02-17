import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCardProps } from '@/types/feedback'

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend 
}) => (
  <Card className="bg-black/50 backdrop-blur-sm border-purple-900/40 hover:border-purple-700/60 transition-all duration-300 group hover:-translate-y-1">
    <CardHeader className="p-6">
      <div className="flex items-center justify-between">
        <Icon className="text-purple-500 group-hover:text-purple-400 transition-colors" size={28} />
        <CardTitle className="text-lg capitalize text-purple-100/80 group-hover:text-purple-100 transition-colors">
          {title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <div className="text-4xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
        {typeof value === 'number' ? value.toFixed(1) : value}
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-purple-500/70">{subtitle}</p>
        {trend !== undefined && (
          <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
)