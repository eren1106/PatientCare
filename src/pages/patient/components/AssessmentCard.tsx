import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProfileAvatar from '@/components/ProfileAvatar';
import { formatDate } from '@/utils';

interface AssessmentCardProps {
  assessment: {
    questionnaireName: string;
    questionnaireType: string;
    status: string;
    profileImageUrl: string;
    doctorName: string;
    doctorEmail: string;
    assessmentId: string;
    assignedDate: Date;
  };
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  return (
    <Card className="p-4 flex flex-col justify-between ">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{assessment.questionnaireName}</h2>
        <div className="flex gap-2">
          <Badge variant="secondary">{assessment.questionnaireType}</Badge>
          <Badge variant="default">{assessment.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground font-semibold">Assigned By:</p>
        <div className="flex mt-2">
          <ProfileAvatar
            src={assessment.profileImageUrl}
            size="md"
            fallbackText={assessment.doctorName.charAt(0)}
          />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{assessment.doctorName}</p>
            <p className="text-sm text-muted-foreground">{assessment.doctorEmail}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {assessment.status === "Completed" && (
          <Link to={`/assessment/${assessment.assessmentId}`} state={{ assessmentDetails: assessment }} >
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
        <p className="text-sm text-muted-foreground font-semibold mt-2">Assigned Date : {formatDate(assessment.assignedDate)}</p>
      </div>
    </Card>
  );
};

export default AssessmentCard;