import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeSchema } from "../../schema/resumeSchema";
import type { ResumeType } from "../../schema/resumeSchema";
import { useResumeStore } from "../../store/useResumeStore";
import { resumeService } from "../../services/resumeService";
import { AccordionItem } from "../../components/ui/Accordion";
import { User, GraduationCap, Briefcase, Code, Wrench, Award, Globe, Heart, Trophy } from "lucide-react";

import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { EducationForm } from "./forms/EducationForm";
import { ExperienceForm } from "./forms/ExperienceForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import { SkillsForm } from "./forms/SkillsForm";
import { CertificatesForm } from "./forms/CertificatesForm";
import { TagInput } from "./forms/FormHelpers";

export const SidebarForms = () => {
  const { activeResumeId, resumes, updateResume, setSaving } = useResumeStore();
  const activeResume = resumes.find((r) => r.id === activeResumeId);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const methods = useForm<ResumeType>({
    resolver: zodResolver(ResumeSchema) as any,
    defaultValues: activeResume,
    mode: "onChange",
  });

  const { watch, reset } = methods;

  // Reset form when active resume changes
  useEffect(() => {
    if (activeResume) {
      reset(activeResume);
    }
  }, [activeResumeId, reset]); // intentional omission of activeResume

  // Auto-save logic
  useEffect(() => {
    const subscription = watch((value) => {
      // Sync with local store immediately for live preview
      if (activeResumeId && value) {
        updateResume(activeResumeId, value as Partial<ResumeType>);
      }

      // Debounce backend save using ref so previous timeout is always cleared
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        if (value && activeResumeId) {
          setSaving(true);
          try {
            await resumeService.saveResume(value as ResumeType);
          } catch { /* save failure is non-critical, logged in service */ }
          setSaving(false);
        }
      }, 2000);
    });
    return () => {
      subscription.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [watch, activeResumeId, updateResume, setSaving]);

  if (!activeResume) return null;

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col h-full bg-white">
        <div className="p-16 border-b">
          <input 
            {...methods.register("title")}
            className="text-h4 font-bold text-text-main bg-transparent border-none focus:outline-none focus:ring-0 w-full"
            placeholder="Resume Title"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <AccordionItem title="Personal Details" icon={<User size={18} />} defaultOpen>
            <PersonalInfoForm />
          </AccordionItem>
          
          <AccordionItem title="Professional Experience" icon={<Briefcase size={18} />}>
            <ExperienceForm />
          </AccordionItem>
          
          <AccordionItem title="Education" icon={<GraduationCap size={18} />}>
            <EducationForm />
          </AccordionItem>

          <AccordionItem title="Projects" icon={<Code size={18} />}>
            <ProjectsForm />
          </AccordionItem>

          <AccordionItem title="Skills" icon={<Wrench size={18} />}>
            <SkillsForm />
          </AccordionItem>

          <AccordionItem title="Certifications" icon={<Award size={18} />}>
            <CertificatesForm />
          </AccordionItem>

          <AccordionItem title="Achievements" icon={<Trophy size={18} />}>
            <TagInput name="achievements" placeholder="e.g. Dean's List, Hackathon Winner" />
          </AccordionItem>
          
          <AccordionItem title="Languages" icon={<Globe size={18} />}>
            <TagInput name="languages" placeholder="e.g. English, Hindi, Marathi" />
          </AccordionItem>
          
          <AccordionItem title="Hobbies" icon={<Heart size={18} />}>
            <TagInput name="hobbies" placeholder="e.g. Open Source, Reading, Chess" />
          </AccordionItem>
        </div>
      </form>
    </FormProvider>
  );
};
