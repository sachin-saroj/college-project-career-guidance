import { useFormContext, useFieldArray } from "react-hook-form";
import { FormInput } from "./FormHelpers";
import { Button } from "../../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CertificatesForm = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates",
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
            
            <h4 className="font-semibold text-text-main text-small pr-32">Certificate #{index + 1}</h4>
            
            <FormInput name={`certificates.${index}.name`} label="Certificate Name" placeholder="e.g. AWS Cloud Practitioner" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <FormInput name={`certificates.${index}.issuer`} label="Issuing Organization" placeholder="e.g. Amazon Web Services" />
              <FormInput name={`certificates.${index}.date`} label="Date Obtained" type="month" />
            </div>

            <FormInput name={`certificates.${index}.link`} label="Certificate URL (Optional)" placeholder="https://..." />
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
          issuer: "", 
          date: "",
          link: "" 
        })}
      >
        <Plus size={16} className="mr-8" />
        Add Certificate
      </Button>
    </div>
  );
};
