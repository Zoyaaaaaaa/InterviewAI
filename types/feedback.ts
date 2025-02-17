// types/feedback.ts
export interface Feedback {
    id: string
    created_at: string
    technical_score: number
    communication_score: number
    confidence_score: number
    overall_score: number
  }
  
  export type ScoreType = 'technical' | 'communication' | 'confidence' | 'overall'
  
  export interface MetricCard {
    name: ScoreType
    value: number
    icon: React.FC<{ className?: string; size?: number }>
    description: string
  }
  
  export interface TimeSeriesData {
    date: string
    technical: number
    communication: number
    confidence: number
    overall: number
  }
  
  export interface MonthlyAverage {
    month: string
    count: number
    technical: number
    communication: number
    confidence: number
    overall: number
  }
  
  export interface ChartTooltipProps {
    active?: boolean
    payload?: Array<{
      name: string
      value: number
      color?: string
      payload: {
        date: string
        [key: string]: any
      }
    }>
  }
  
  export interface StatCardProps {
    title: string
    value: string | number
    subtitle: string
    icon: React.FC<{ className?: string; size?: number }>
    trend?: number
  }