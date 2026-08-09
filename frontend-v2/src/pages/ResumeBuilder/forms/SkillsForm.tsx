import { TagInput } from "./FormHelpers";

export const SkillsForm = () => {
  return (
    <div className="flex flex-col gap-16">
      <div className="text-small text-text-muted mb-8">
        Type a skill and press <kbd className="px-4 py-2 bg-black/5 rounded text-xs">Enter</kbd> or <kbd className="px-4 py-2 bg-black/5 rounded text-xs">,</kbd>
      </div>
      <TagInput name="skills" placeholder="e.g. React, Node.js, Project Management" />
    </div>
  );
};
