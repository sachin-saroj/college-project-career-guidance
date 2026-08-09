import { useResumeStore } from "../../store/useResumeStore";
import { ModernTemplate } from "./templates/ModernTemplate";

export const LivePreview = () => {
  const { activeResumeId, resumes } = useResumeStore();
  const resume = resumes.find(r => r.id === activeResumeId);

  if (!resume) return null;

  return (
    <div 
      className="bg-white shadow-xl mx-auto overflow-hidden text-left" 
      // A4 dimensions at 96 DPI: 794px x 1123px
      style={{ 
        width: "794px", 
        minHeight: "1123px",
      }}
    >
      <ModernTemplate data={resume} />
    </div>
  );
};
