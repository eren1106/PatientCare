interface AssessmentHeaderProps {
  title: string;
  description: string;
}

export const AssessmentHeader = ({
  title,
  description,
}: AssessmentHeaderProps) => (
  <div className="bg-red-100 rounded-md p-5 mb-2">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);
