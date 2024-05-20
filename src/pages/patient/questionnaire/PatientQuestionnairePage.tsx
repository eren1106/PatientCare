import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  age: z.number().min(0, { message: "Age must be a positive number." }),
  painLevel: z.enum(["None", "Mild", "Moderate", "Severe"]),
  painFrequency: z.enum(["Occasional", "Frequent", "Constant"]),
  mobility: z.enum(["Full", "Limited", "Severely Limited"]),
  strength: z.enum(["Normal", "Reduced", "Weak"]),
  swelling: z.enum(["None", "Mild", "Moderate", "Severe"]),
  stiffness: z.enum(["None", "Mild", "Moderate", "Severe"]),
  difficultySleeping: z.enum(["None", "Occasional", "Frequent"]),
  previousInjuries: z.string().optional(),
  surgeryHistory: z.string().optional(),
  dailyActivities: z.string().min(5, { message: "Please describe your daily activities." }),
  goals: z.string().min(5, { message: "Please describe your rehab goals." }),
  medication: z.string().optional(),
  additionalNotes: z.string().optional()
})

const PatientQuestionnairePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      age: 0,
      painLevel: "None",
      painFrequency: "Occasional",
      mobility: "Full",
      strength: "Normal",
      swelling: "None",
      stiffness: "None",
      difficultySleeping: "None",
      previousInjuries: "",
      surgeryHistory: "",
      dailyActivities: "",
      goals: "",
      medication: "",
      additionalNotes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Logic to determine the rehab exercise based on the questionnaire outcomes
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Knee Rehab Questionnaire</h1>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="painLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pain Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pain level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="painFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pain Frequency</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pain frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Occasional">Occasional</SelectItem>
                        <SelectItem value="Frequent">Frequent</SelectItem>
                        <SelectItem value="Constant">Constant</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobility</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mobility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full">Full</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                        <SelectItem value="Severely Limited">Severely Limited</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strength</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strength" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Reduced">Reduced</SelectItem>
                        <SelectItem value="Weak">Weak</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="swelling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swelling</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select swelling" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stiffness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stiffness</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stiffness" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficultySleeping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Sleeping</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty sleeping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Occasional">Occasional</SelectItem>
                        <SelectItem value="Frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousInjuries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Injuries</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe any previous injuries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surgeryHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surgery History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe any past surgeries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dailyActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Activities</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your daily activities" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rehab Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your rehab goals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication</FormLabel>
                  <FormControl>
                    <Input placeholder="Current medication" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default PatientQuestionnairePage
