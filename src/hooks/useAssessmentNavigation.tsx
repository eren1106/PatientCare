import { AssessmentDetails } from "@/services/assessment.service";
import { useCallback, useState } from "react";

export const useAssessmentNavigation = (assessmentDetails: AssessmentDetails | null) => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
    const getCurrentSection = () => assessmentDetails?.sections[currentSectionIndex];
    const getCurrentQuestion = () => getCurrentSection()?.questions[currentQuestionIndex];

    const getTotalQuestions = () => {
        return (
          assessmentDetails?.sections?.reduce(
            (acc, section) => acc + section.questions.length,
            0
          ) || 0
        );
    };
  
    const getAbsoluteIndex = useCallback((sectionIndex: number, questionIndex: number): number => {
      let absoluteIndex = questionIndex;
      for (let i = 0; i < sectionIndex; i++) {
        absoluteIndex += assessmentDetails!.sections[i].questions.length;
      }
      return absoluteIndex;
    }, [assessmentDetails]);
  
    const handleNavigate = (absoluteIndex: number) => {
        const { sectionIndex, questionIndex } =
          getSectionAndQuestionIndex(absoluteIndex);
        setCurrentSectionIndex(sectionIndex);
        setCurrentQuestionIndex(questionIndex);
      };
    
      const handleNext = () => {
        const currentAbsoluteIndex = getAbsoluteIndex(
          currentSectionIndex,
          currentQuestionIndex
        );
        if (currentAbsoluteIndex < getTotalQuestions() - 1) {
          handleNavigate(currentAbsoluteIndex + 1);
        }
      };
    
      const handlePrevious = () => {
        const currentAbsoluteIndex = getAbsoluteIndex(
          currentSectionIndex,
          currentQuestionIndex
        );
        if (currentAbsoluteIndex > 0) {
          handleNavigate(currentAbsoluteIndex - 1);
        }
      };

      const isLastQuestion = () => {
        if (!assessmentDetails) return false;
        const isLastSectionQuestion =
          currentQuestionIndex ===
          (getCurrentSection()?.questions?.length ?? 0) - 1;
        const isLastSection =
          currentSectionIndex === assessmentDetails.sections.length - 1;
        return isLastSectionQuestion && isLastSection;
      };
    

      const getSectionAndQuestionIndex = (
        absoluteIndex: number
      ): { sectionIndex: number; questionIndex: number } => {
        let remainingIndex = absoluteIndex;
        let sectionIndex = 0;
    
        while (sectionIndex < assessmentDetails!.sections.length) {
          const sectionQuestions =
            assessmentDetails!.sections[sectionIndex].questions.length;
          if (remainingIndex < sectionQuestions) {
            return { sectionIndex, questionIndex: remainingIndex };
          }
          remainingIndex -= sectionQuestions;
          sectionIndex++;
        }
        return { sectionIndex: 0, questionIndex: 0 };
      };
    
    
  
    return {
      currentSectionIndex,
      currentQuestionIndex,
      getCurrentSection,
      getCurrentQuestion,
      handleNavigate,
      handleNext,
      handlePrevious,
      isLastQuestion,
      getAbsoluteIndex,
      getTotalQuestions,
    };
  };