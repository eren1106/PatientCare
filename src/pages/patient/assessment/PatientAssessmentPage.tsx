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
import AssessmentCard from "../components/AssessmentCard";
import useLoading from "@/hooks/useLoading.hook";
import Spinner from "@/components/Spinner";

const PatientAssessmentPage = () => {
  const patientId = getCurrentUser()?.id;
  const [assessments, setAssessments] = useState<PatientAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<
    PatientAssessment[]
  >([]);
  const [filter, setFilter] = useState<string>("All");
  
  const { isLoading, withLoading } = useLoading();
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
      withLoading(() => fetchAssessments(patientId));
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
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Assessments</h1>
      <Tabs defaultValue="All" onValueChange={handleFilterChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Assigned">Assigned</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
          <TabsTrigger value="Completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="All">
          <AssessmentGrid assessments={filteredAssessments} isLoading={isLoading}/>
        </TabsContent>
        <TabsContent value="Assigned">
          <AssessmentGrid assessments={filteredAssessments} isLoading={isLoading}/>
        </TabsContent>
        <TabsContent value="In Progress">
          <AssessmentGrid assessments={filteredAssessments} isLoading={isLoading}/>
        </TabsContent>
        <TabsContent value="Completed">
          <AssessmentGrid assessments={filteredAssessments} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const AssessmentGrid = ({
  assessments,
  isLoading,
}: {
  assessments: PatientAssessment[];
  isLoading: boolean;
}) => {

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4">
      {assessments.length > 0 ? (
        assessments.map((assessment, index) => (
              <AssessmentCard key={index} assessment={assessment} />
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
