
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Area, AreaChart, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Award, Brain, MessageSquare, ThumbsUp, TrendingUp, Calendar, Target, LucideIcon } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomTooltip } from '../components/CustomToolTip'
import { StatCard } from './StatCard'

// Define TypeScript interfaces
interface Feedback {
  id: string
  created_at: string
  technical_score: number
  communication_score: number
  confidence_score: number
  overall_score: number
}

interface TimeSeriesData {
  date: string
  technical: number
  communication: number
  confidence: number
  overall: number
}

interface MonthlyAverage {
  month: string
  count: number
  technical: number
  communication: number
  confidence: number
  overall: number
}

interface MetricCard {
  name: string
  value: number
  icon: LucideIcon
  description: string
}

export default function FeedbackOverview() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback')
        if (!response.ok) {
          throw new Error(await response.text())
        }
        
        const data: Feedback[] = await response.json()
        setFeedback(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load feedback data')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // const calculateTrend = (metric: keyof Omit<Feedback, 'id' | 'created_at'>): number => {
  //   if (feedback.length < 2) return 0
  //   const first = feedback[0][metric]
  //   const last = feedback[feedback.length - 1][metric]
  //   return ((last - first) / first) * 100
  // }

  // Calculate cumulative averages
  const cumulativeData: TimeSeriesData[] = feedback.map((item, index) => {
    const slice = feedback.slice(0, index + 1)
    return {
      date: new Date(item.created_at).toLocaleDateString(),
      technical: slice.reduce((acc, curr) => acc + curr.technical_score, 0) / (index + 1),
      communication: slice.reduce((acc, curr) => acc + curr.communication_score, 0) / (index + 1),
      confidence: slice.reduce((acc, curr) => acc + curr.confidence_score, 0) / (index + 1),
      overall: slice.reduce((acc, curr) => acc + curr.overall_score, 0) / (index + 1)
    }
  })

  // Calculate monthly averages
  const monthlyData: Record<string, MonthlyAverage> = feedback.reduce((acc, curr) => {
    const month = new Date(curr.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
    if (!acc[month]) {
      acc[month] = {
        month,
        count: 0,
        technical: 0,
        communication: 0,
        confidence: 0,
        overall: 0
      }
    }
    acc[month].count++
    acc[month].technical += curr.technical_score
    acc[month].communication += curr.communication_score
    acc[month].confidence += curr.confidence_score
    acc[month].overall += curr.overall_score
    return acc
  }, {} as Record<string, MonthlyAverage>)

  const monthlyAverages: MonthlyAverage[] = Object.values(monthlyData).map(item => ({
    ...item,
    technical: item.technical / item.count,
    communication: item.communication / item.count,
    confidence: item.confidence / item.count,
    overall: item.overall / item.count
  }))

  const metricCards: MetricCard[] = [
    {
      name: 'technical',
      value: feedback.reduce((acc, item) => acc + item.technical_score, 0) / Math.max(1, feedback.length),
      icon: Brain,
      description: 'Technical Proficiency'
    },
    {
      name: 'communication',
      value: feedback.reduce((acc, item) => acc + item.communication_score, 0) / Math.max(1, feedback.length),
      icon: MessageSquare,
      description: 'Communication Skills'
    },
    {
      name: 'confidence',
      value: feedback.reduce((acc, item) => acc + item.confidence_score, 0) / Math.max(1, feedback.length),
      icon: ThumbsUp,
      description: 'Confidence Level'
    },
    {
      name: 'overall',
      value: feedback.reduce((acc, item) => acc + item.overall_score, 0) / Math.max(1, feedback.length),
      icon: Award,
      description: 'Overall Performance'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Performance Analytics
          </h1>
          <p className="text-xl text-purple-400/60">Interview Excellence Dashboard</p>
        </header>

        {/* Metrics Overview Cards */}
        <div className="grid lg:grid-cols-4 gap-6">
          {metricCards.map((card) => (
            <StatCard
              key={card.name}
              title={card.name}
              value={card.value}
              subtitle={card.description}
              icon={card.icon}
              // trend={calculateTrend(`${card.name}_score` as keyof Omit<Feedback, 'id' | 'created_at'>)}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Trends Chart */}
          <Card className="bg-black/50 backdrop-blur-sm border-purple-900/40">
            <CardHeader className="p-6">
              <CardTitle className="text-purple-100/80 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <CustomTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="technical" 
                      stroke="#9333ea" 
                      strokeWidth={2} 
                      dot={false} 
                      name="Technical"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="communication" 
                      stroke="#a855f7" 
                      strokeWidth={2} 
                      dot={false}
                      name="Communication"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#bf95f7" 
                      strokeWidth={2} 
                      dot={false}
                      name="Confidence"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="overall" 
                      stroke="#d8b4fe" 
                      strokeWidth={2} 
                      dot={false}
                      name="Overall"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance Chart */}
          <Card className="bg-black/50 backdrop-blur-sm border-purple-900/40">
            <CardHeader className="p-6">
              <CardTitle className="text-purple-100/80 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyAverages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <CustomTooltip />
                    <Bar 
                      dataKey="technical" 
                      fill="#9333ea" 
                      radius={[4, 4, 0, 0]} 
                      name="Technical"
                    />
                    <Bar 
                      dataKey="communication" 
                      fill="#a855f7" 
                      radius={[4, 4, 0, 0]}
                      name="Communication"
                    />
                    <Bar 
                      dataKey="confidence" 
                      fill="#bf95f7" 
                      radius={[4, 4, 0, 0]}
                      name="Confidence"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution Chart */}
          <Card className="bg-black/50 backdrop-blur-sm border-purple-900/40 lg:col-span-2">
            <CardHeader className="p-6">
              <CardTitle className="text-purple-100/80 flex items-center gap-2">
                <Target className="w-5 h-5" /> Performance Distribution 
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 51, 234, 0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#a855f7" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <CustomTooltip />
                    <Area
                      type="monotone"
                      dataKey="technical"
                      stackId="1"
                      stroke="#9333ea"
                      fill="#9333ea"
                      fillOpacity={0.2}
                      name="Technical"
                    />
                    <Area
                      type="monotone"
                      dataKey="communication"
                      stackId="1"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.2}
                      name="Communication"
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stackId="1"
                      stroke="#bf95f7"
                      fill="#bf95f7"
                      fillOpacity={0.2}
                      name="Confidence"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}