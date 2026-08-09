import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput, FormTextarea } from "./FormHelpers";
import { Button } from "../../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const EducationForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

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
            
            <h4 className="font-semibold text-text-main text-small pr-32">Education #{index + 1}</h4>
            
            <FormInput name={`education.${index}.institution`} label="Institution / University" placeholder="e.g. Mumbai University" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <FormInput name={`education.${index}.degree`} label="Degree / Course" placeholder="e.g. B.Tech Computer Science" />
              <FormInput name={`education.${index}.score`} label="CGPA / Percentage" placeholder="e.g. 9.2 or 85%" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <FormInput name={`education.${index}.startDate`} label="Start Date" type="month" />
              <FormInput name={`education.${index}.endDate`} label="End Date (or Expected)" type="month" />
            </div>

            <FormTextarea name={`education.${index}.description`} label="Description (Optional)" placeholder="Additional details, coursework, honors..." />
          </motion.div>
        ))}
      </AnimatePresence>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ 
          id: crypto.randomUUID(), 
          institution: "", 
          degree: "", 
          startDate: "", 
          endDate: "",
          current: false,
          score: "",
          description: "" 
        })}
      >
        <Plus size={16} className="mr-8" />
        Add Education
      </Button>
    </div>
  );
};
