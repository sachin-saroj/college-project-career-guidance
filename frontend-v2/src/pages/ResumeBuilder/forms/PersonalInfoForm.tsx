import { FormInput, FormTextarea } from "./FormHelpers";
import { Button } from "../../../components/ui/Button";
import { Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { resumeService } from "../../../services/resumeService";
import { useState } from "react";

export const PersonalInfoForm = () => {
  const { getValues, setValue } = useFormContext();
  const [isImproving, setIsImproving] = useState(false);

  const handleAiImprove = async () => {
    const currentSummary = getValues("personalInfo.summary");
    if (!currentSummary) return;
    
    setIsImproving(true);
    try {
      const improved = await resumeService.rewriteSection("summary", currentSummary);
      setValue("personalInfo.summary", improved, { shouldDirty: true, shouldValidate: true });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <FormInput name="personalInfo.fullName" label="Full Name" placeholder="e.g. Jane Doe" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <FormInput name="personalInfo.email" label="Email Address" type="email" placeholder="jane@example.com" />
        <FormInput name="personalInfo.phone" label="Phone Number" placeholder="+1 234 567 890" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <FormInput name="personalInfo.location" label="Location" placeholder="e.g. San Francisco, CA" />
        <FormInput name="personalInfo.linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <FormInput name="personalInfo.github" label="GitHub URL" placeholder="https://github.com/..." />
        <FormInput name="personalInfo.portfolio" label="Portfolio URL" placeholder="https://..." />
      </div>

      <div className="relative">
        <FormTextarea 
          name="personalInfo.summary" 
          label="Professional Summary" 
          placeholder="A brief summary of your professional background and goals..." 
        />
        <Button 
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleAiImprove}
          disabled={isImproving}
          className="absolute right-8 bottom-8 gap-8 text-xs py-4 px-8 h-auto"
        >
          <Sparkles size={12} className="text-brand-primary" />
          {isImproving ? "Improving..." : "AI Improve"}
        </Button>
      </div>
    </div>
  );
};
