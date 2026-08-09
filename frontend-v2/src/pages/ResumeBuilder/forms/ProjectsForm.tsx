import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput, FormTextarea, TagInput } from "./FormHelpers";
import { Button } from "../../../components/ui/Button";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { resumeService } from "../../../services/resumeService";

export const ProjectsForm = () => {
  const { control, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const [improvingIndex, setImprovingIndex] = useState<number | null>(null);

  const handleAiImprove = async (index: number) => {
    const currentDesc = getValues(`projects.${index}.description`);
    if (!currentDesc) return;
    
    setImprovingIndex(index);
    try {
      const improved = await resumeService.rewriteSection("project", currentDesc);
      setValue(`projects.${index}.description`, improved, { shouldDirty: true, shouldValidate: true });
    } finally {
      setImprovingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-24">
      <AnimatePresence initial={false}>
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-16 p-16 border rounded-xl bg-white relative group"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-16 right-16 p-8 text-text-muted hover:text-status-danger hover:bg-status-danger/10 rounded transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
            
            <h4 className="font-semibold text-text-main text-small pr-32">Project #{index + 1}</h4>
            
            <FormInput name={`projects.${index}.name`} label="Project Name" placeholder="e.g. AI Career Guidance Portal" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <FormInput name={`projects.${index}.link`} label="Live Demo URL" placeholder="https://..." />
              <FormInput name={`projects.${index}.github`} label="GitHub URL" placeholder="https://github.com/..." />
            </div>

            <div className="relative">
              <FormTextarea 
                name={`projects.${index}.description`} 
                label="Description" 
                placeholder={"• What did you build?\n• What technologies did you use?\n• What was the impact?"} 
              />
              <Button 
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => handleAiImprove(index)}
                disabled={improvingIndex === index}
                className="absolute right-8 bottom-8 gap-8 text-xs py-4 px-8 h-auto"
              >
                <Sparkles size={12} className="text-brand-primary" />
                {improvingIndex === index ? "Improving..." : "AI Improve"}
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-small font-medium text-text-main">Tech Stack</label>
              <TagInput name={`projects.${index}.techStack`} placeholder="e.g. React, Node.js, MongoDB" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ 
          id: crypto.randomUUID(), 
          name: "", 
          description: "", 
          techStack: [], 
          link: "",
          github: "" 
        })}
      >
        <Plus size={16} className="mr-8" />
        Add Project
      </Button>
    </div>
  );
};
