"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import { ExerciseCompetionSummary } from "@/interfaces/exercise"
import { getExerciseCompletionSummaryByPatientId } from "@/services/patientExercise.service"
// const chartData = [
//   { day: "January", percentage: 186 },
//   { day: "February", percentage: 305 },
//   { day: "March", percentage: 237 },
//   { day: "April", percentage: 73 },
//   { day: "May", percentage: 209 },
//   { day: "June", percentage: 214 },
// ]

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface ExerciseCompletionGraphProps {
  selectedPatientId: string | null;
}

const ExerciseCompletionGraph = ({ selectedPatientId }: ExerciseCompletionGraphProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [summaries, setSummaries] = useState<ExerciseCompetionSummary[]>([]);

  const getCurrentMonthAsText = (): string => {
    const date = new Date(); // Get the current date
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()]; // Get the month's name
    const year = date.getFullYear(); // Get the current year

    return `${month} ${year}`; // Combine the month and year
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPatientId) return;

      setLoading(true);
      try {
        const getSummaries = await getExerciseCompletionSummaryByPatientId(selectedPatientId);
        setSummaries(getSummaries);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPatientId]);

  if (loading) return <Spinner />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Completion Graph</CardTitle>
        <CardDescription>
          Showing percentage of exercise completion of selected user for current month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="font-bold mb-6 text-center">
          Daily Exercise Completion Percentage for {getCurrentMonthAsText()}
        </CardDescription>
        <ChartContainer config={chartConfig} className="h-[20rem] w-full">
          <AreaChart
            accessibilityLayer
            data={summaries.map((summary) => ({
              day: String(summary.day),
              percentage: summary.percentage,
            }))}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="percentage"
              type="linear"
              fill="hsl(var(--primary))"
              fillOpacity={0.4}
              stroke="hsl(var(--primary))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ExerciseCompletionGraph
