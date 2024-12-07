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
import DynamicSelectField from "@/components/DynamicSelectField"
import { useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import { User } from "@/interfaces/user"
import { getAllPatientsByDoctorId } from "@/services/user.service"
import { getCurrentUser } from "@/services/auth.service"
import { ExerciseCompetionSummary } from "@/interfaces/exercise"
import { getExerciseCompletionSummaryByPatientId } from "@/services/patientExercise.service"
import { MOCK_EXERCISE_COMPLETION_SUMMARY } from "@/constants"
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

// TODO: add left and right button to allow user to change month
const ExerciseCompletionGraph = () => {
  const userData = getCurrentUser();

  const [loading, setLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<User[]>([]);
  const [summaries, setSummaries] = useState<ExerciseCompetionSummary[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const fetchData = async () => {
    if(!userData) return;

    setLoading(true);
    try {
      const getPatients = await getAllPatientsByDoctorId(userData.id);
      const getSummaries = await getExerciseCompletionSummaryByPatientId(getPatients[0].id);
      setPatients(getPatients);
      setSelectedPatientId(getPatients[0].id);
      setSummaries(getSummaries);
      // setSummaries(MOCK_EXERCISE_COMPLETION_SUMMARY); // TODO: dont use mock, this just for demo purpose, use seed to populate dailyPatientExercise data
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPatient = async (value: string) => {
    setLoading(true);
    try {
      const getSummaries = await getExerciseCompletionSummaryByPatientId(value);
      setSummaries(getSummaries);
      setSelectedPatientId(value);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false);
    }
  }

  if(loading) return <Spinner />
  return (
    <div className="flex flex-col gap-6">
      <DynamicSelectField
        options={patients.map((patient) => ({
          label: patient.fullname,
          value: patient.id
        }))}
        className="w-64"
        label="Select Patient"
        onChange={handleSelectPatient}
        value={selectedPatientId ?? undefined}
      />
      <Card>
        <CardHeader>
          <CardTitle>Exercise Completion Graph</CardTitle>
          <CardDescription>
            Showing percentage of exercise completion of selected user for current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[26rem]">
            <AreaChart
              accessibilityLayer
              data={summaries.map((summary) => ({
                day: String(summary.day),
                percentage: summary.percentage,
              }))}
              margin={{
                left: 12,
                right: 12,
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
    </div>
  )
}

export default ExerciseCompletionGraph
