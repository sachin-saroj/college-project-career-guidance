import { useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export const FormInput = ({ name, label, className, ...props }: FormInputProps) => {
  const { register, formState: { errors } } = useFormContext();
  
  // Handle nested fields like "personalInfo.fullName"
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label className="text-small font-medium text-text-main">{label}</label>
      <input
        {...register(name)}
        className={cn(
          "h-40 px-12 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm",
          error ? "border-status-danger focus:border-status-danger" : "border-border hover:border-text-muted focus:border-brand-primary"
        )}
        {...props}
      />
      {error && <span className="text-[12px] text-status-danger">{error.message as string}</span>}
    </div>
  );
};

export const FormTextarea = ({ name, label, className, ...props }: FormInputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { register, formState: { errors } } = useFormContext();
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label className="text-small font-medium text-text-main">{label}</label>
      <textarea
        {...register(name)}
        className={cn(
          "p-12 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm resize-y min-h-[100px]",
          error ? "border-status-danger focus:border-status-danger" : "border-border hover:border-text-muted focus:border-brand-primary"
        )}
        {...props}
      />
      {error && <span className="text-[12px] text-status-danger">{error.message as string}</span>}
    </div>
  );
};

/** Reusable tag input for string arrays (skills, languages, hobbies, techStack) */
export const TagInput = ({ name, placeholder }: { name: string; placeholder?: string }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim();
      if (value) {
        append(value as any);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && fields.length > 0) {
      remove(fields.length - 1);
    }
  };

  return (
    <div className="min-h-[48px] p-8 border rounded-xl bg-white focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all flex flex-wrap gap-8 items-start">
      <AnimatePresence>
        {fields.map((field, index) => {
          const tagValue = (field as any).value || (field as any).id || field;
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-4 px-12 py-6 bg-brand-primary/10 text-brand-primary rounded-button text-small"
            >
              <span>{typeof tagValue === "string" ? tagValue : ""}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 hover:bg-brand-primary/20 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={fields.length === 0 ? (placeholder || "Type and press Enter") : "Add another..."}
        className="flex-1 min-w-[120px] h-32 bg-transparent border-none focus:outline-none text-small"
      />
    </div>
  );
};
