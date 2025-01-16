import { useState, useEffect } from "react";
import { User } from "@/interfaces/user";
import { getCurrentUser } from "@/services/auth.service";
import { getAllPatientsByDoctorId } from "@/services/user.service";
import AssessmentScoreGraph from "./components/AssessmentScoreGraph";
import ExerciseCompletionGraph from "./components/ExerciseCompletionGraph";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import DynamicSelectField from "@/components/DynamicSelectField";

const DoctorTrackingPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<User[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const fetchPatients = async () => {
    const userData = getCurrentUser();
    if (!userData) return;

    setLoading(true);
    try {
      const getPatients = await getAllPatientsByDoctorId(userData.id);
      setPatients(getPatients);
      if (getPatients.length > 0) {
        setSelectedPatientId(getPatients[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 p-6">
      <h2>Patient Progress Tracking</h2>
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

      <div className="grid gap-6">
        <ExerciseCompletionGraph selectedPatientId={selectedPatientId} />
        <AssessmentScoreGraph selectedPatientId={selectedPatientId} />

      </div>
    </div>
  );
};

export default DoctorTrackingPage;