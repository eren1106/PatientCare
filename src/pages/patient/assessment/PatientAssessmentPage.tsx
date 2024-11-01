import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAllAssessmentsByPatientId,
  PatientAssessment,
} from "@/services/assessment.service";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Link, useParams } from "react-router-dom";
import { getCurrentUser } from "@/services/auth.service";

const PatientAssessmentPage = () => {
  const patientId = getCurrentUser()?.id;
  const [assessments, setAssessments] = useState<PatientAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<
    PatientAssessment[]
  >([]);
  const [filter, setFilter] = useState<string>("All");

  const fetchAssessments = async (patientId: string) => {
    try {
      const result = await getAllAssessmentsByPatientId(patientId);
      setAssessments(result);
      setFilteredAssessments(result);
    } catch (e) {
      console.error("Failed to fetch assessments", e);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchAssessments(patientId);
    }
  }, [patientId]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === "All") {
      setFilteredAssessments(assessments);
    } else {
      setFilteredAssessments(
        assessments.filter((assessment) => assessment.status === value)
      );
    }
  };

  return (
    <Card className="p-6 h-screen">
      <h1 className="text-2xl font-bold mb-6">Patient Assessments</h1>
      <Tabs defaultValue="All" onValueChange={handleFilterChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Assigned">Assigned</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
          <TabsTrigger value="Completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="All">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>
        <TabsContent value="Assigned">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>
        <TabsContent value="In Progress">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>
        <TabsContent value="Completed">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const AssessmentGrid = ({
  assessments,
}: {
  assessments: PatientAssessment[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {assessments.length > 0 ? (
        assessments.map((assessment, index) => (
          <Card key={index} className="p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">
                {assessment.questionnaireName}
              </h2>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {assessment.questionnaireType}
                </Badge>
                <Badge variant="default">{assessment.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Assigned By:</p>
              <div className="flex mt-2">
                <ProfileAvatar
                  src={assessment.profileImageUrl}
                  size="md"
                  fallbackText={assessment.doctorName.charAt(0)}
                />
                  <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {assessment.doctorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {assessment.doctorEmail}
                  </p>
                </div>
              </div>

            </div>
            <div className="mt-4">
              {assessment.status === "Completed" && (
                <Link to={`/assessment/${assessment.assessmentId}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              )}
              {assessment.status === "In Progress" && (
                <Link to={`/assessment/${assessment.assessmentId}`}>
                <Button variant="outline">Continue Assessment</Button>
                </Link>
              )}
              {assessment.status === "Assigned" && (
                <Link to={`/assessment/${assessment.assessmentId}`}>
                <Button variant="outline">Start Assessment</Button>
                </Link>
              )}
            </div>
          </Card>
        ))
      ) : (
        <p className="text-center col-span-full">
          No assessments available at the moment.
        </p>
      )}
    </div>
  );
};

export default PatientAssessmentPage;
