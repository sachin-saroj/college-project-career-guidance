import { useResumeStore } from "../../store/useResumeStore";
import { ResumeDashboard } from "./Dashboard";
import { ResumeBuilderLayout } from "./Builder";

export const ResumeBuilder = () => {
  const { activeResumeId } = useResumeStore();

  if (activeResumeId) {
    return <ResumeBuilderLayout />;
  }

  return <ResumeDashboard />;
};
