import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput, FormTextarea } from "./FormHelpers";
import { Button } from "../../../components/ui/Button";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { resumeService } from "../../../services/resumeService";

export const ExperienceForm = () => {
  const { control, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });
  
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null);

  const handleAiImprove = async (index: number) => {
    const currentDesc = getValues(`experience.${index}.description`);
    if (!currentDesc) return;
    
    setImprovingIndex(index);
    try {
      const improved = await resumeService.rewriteSection("experience", currentDesc);
      setValue(`experience.${index}.description`, improved, { shouldDirty: true, shouldValidate: true });
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
            
            <h4 className="font-semibold text-text-main text-small pr-32">Experience #{index + 1}</h4>
            
            <FormInput name={`experience.${index}.company`} label="Company / Organization" placeholder="e.g. Google" />
            <FormInput name={`experience.${index}.role`} label="Job Title / Role" placeholder="e.g. Software Engineer" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <FormInput name={`experience.${index}.startDate`} label="Start Date" type="month" />
              <FormInput name={`experience.${index}.endDate`} label="End Date" type="month" />
            </div>

            <div className="relative">
              <FormTextarea 
                name={`experience.${index}.description`} 
                label="Description" 
                placeholder="• What did you do?&#10;• What technologies did you use?&#10;• What was the impact?" 
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
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ 
          id: crypto.randomUUID(), 
          company: "", 
          role: "", 
          startDate: "", 
          endDate: "",
          current: false,
          description: "" 
        })}
      >
        <Plus size={16} className="mr-8" />
        Add Experience
      </Button>
    </div>
  );
};
