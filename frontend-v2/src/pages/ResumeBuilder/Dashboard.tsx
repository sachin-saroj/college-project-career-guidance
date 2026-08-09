import { PageWrapper } from "../../components/layout/PageWrapper";
import { useResumeStore } from "../../store/useResumeStore";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Plus, FileText, Copy, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { defaultResume } from "../../schema/resumeSchema";

export const ResumeDashboard = () => {
  const { resumes, addResume, setActiveResume, deleteResume, duplicateResume } = useResumeStore();

  const handleCreateNew = () => {
    const newResume = {
      ...defaultResume,
      id: crypto.randomUUID(),
      title: `Untitled Resume ${resumes.length + 1}`,
      lastModified: new Date().toISOString(),
    };
    addResume(newResume);
    setActiveResume(newResume.id);
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto py-32 px-16 md:px-32">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-16 mb-32">
          <div>
            <h1 className="text-h3 md:text-h2 font-bold text-text-main">Resume Builder</h1>
            <p className="text-text-muted mt-4">Create, manage, and optimize your ATS-friendly resumes.</p>
          </div>
          <Button onClick={handleCreateNew} size="lg" className="gap-8">
            <Plus size={18} />
            Create New Resume
          </Button>
        </div>

        {resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-64 text-center border-2 border-dashed border-border rounded-xl bg-white"
          >
            <div className="w-64 h-64 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-24">
              <FileText size={32} />
            </div>
            <h2 className="text-h4 font-bold text-text-main mb-8">No resumes yet</h2>
            <p className="text-text-muted max-w-md mb-24">
              Create your first ATS-friendly resume in less than 10 minutes with our AI-powered builder.
            </p>
            <Button onClick={handleCreateNew}>Get Started</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group relative overflow-hidden">
                  <div className="aspect-[1/1.414] bg-background-alt w-full border-b flex items-center justify-center text-text-muted relative">
                    <FileText size={48} className="opacity-20" />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-16 backdrop-blur-sm">
                      <Button variant="secondary" size="sm" onClick={() => setActiveResume(resume.id)}>
                        <Edit size={16} className="mr-8" /> Edit
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-16">
                    <h3 className="font-semibold text-text-main truncate">{resume.title}</h3>
                    <p className="text-small text-text-muted mt-4">
                      Last edited {new Date(resume.lastModified).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-8 mt-16">
                      <button 
                        onClick={() => duplicateResume(resume.id)}
                        className="p-8 rounded hover:bg-black/5 text-text-muted transition-colors flex-1 flex justify-center"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <div className="w-px h-16 bg-border" />
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete "${resume.title}"? This cannot be undone.`)) {
                            deleteResume(resume.id);
                          }
                        }}
                        className="p-8 rounded hover:bg-status-danger/10 text-status-danger transition-colors flex-1 flex justify-center"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
