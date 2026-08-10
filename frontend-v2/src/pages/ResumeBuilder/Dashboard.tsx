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
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 border-b border-[#e5e7eb] pb-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
              RESUME SYSTEM • ATS OPTIMIZER
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">Resume Workspace</h1>
            <p className="text-slate text-sm mt-1">Author, manage, and audit your professional resume documents.</p>
          </div>
          <Button onClick={handleCreateNew} size="sm" className="gap-2 text-xs font-mono">
            <Plus size={14} />
            CREATE NEW RESUME →
          </Button>
        </div>

        {resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-[#d9d9dd] rounded-[22px] bg-[#eeece7]/40 max-w-3xl mx-auto"
          >
            <div className="w-12 h-12 bg-[#003c33] text-white rounded-full flex items-center justify-center mb-4 border border-[#003c33]/20">
              <FileText size={20} />
            </div>
            <h2 className="font-display text-2xl font-normal text-ink mb-2">No resumes found in your workspace</h2>
            <p className="text-slate text-sm max-w-md mb-8 leading-relaxed">
              Build an ATS-optimized, high-impact resume structured specifically to pass automated recruitment filters and land interviews.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8 text-left">
              <div className="bg-white p-4 rounded-xl border border-[#d9d9dd]">
                <span className="font-mono text-[10px] uppercase text-[#003c33] bg-[#edfce9] px-2 py-0.5 rounded block w-fit mb-2">STEP 01</span>
                <h4 className="font-display text-sm text-ink mb-1">Structured Builder</h4>
                <p className="text-xs text-slate">Input education, experience, and projects in an intuitive form.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#d9d9dd]">
                <span className="font-mono text-[10px] uppercase text-[#003c33] bg-[#edfce9] px-2 py-0.5 rounded block w-fit mb-2">STEP 02</span>
                <h4 className="font-display text-sm text-ink mb-1">AI ATS Critique</h4>
                <p className="text-xs text-slate">Extract PDF text and generate constructive AI feedback scores.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#d9d9dd]">
                <span className="font-mono text-[10px] uppercase text-[#003c33] bg-[#edfce9] px-2 py-0.5 rounded block w-fit mb-2">STEP 03</span>
                <h4 className="font-display text-sm text-ink mb-1">Instant Export</h4>
                <p className="text-xs text-slate">Download clean, formatted PDFs ready for job applications.</p>
              </div>
            </div>

            <Button onClick={handleCreateNew} size="md" className="gap-2 font-mono text-xs">
              <Plus size={14} /> CREATE FIRST RESUME →
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card variant="stone" className="h-full group relative overflow-hidden flex flex-col justify-between">
                  <div className="aspect-[1/1.2] bg-white w-full border-b border-[#e5e7eb] flex items-center justify-center text-slate relative">
                    <FileText size={40} className="opacity-30" />
                    <div className="absolute inset-0 bg-[#17171c]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <Button variant="dark-pill" size="sm" onClick={() => setActiveResume(resume.id)} className="text-xs">
                        <Edit size={14} className="mr-1.5" /> Edit Document
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display text-base font-normal text-ink truncate">{resume.title}</h3>
                    <p className="font-mono text-xs text-slate mt-1">
                      Edited {new Date(resume.lastModified).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#d9d9dd]">
                      <button 
                        onClick={() => duplicateResume(resume.id)}
                        className="p-1.5 rounded hover:bg-black/5 text-slate hover:text-ink transition-colors flex-1 flex items-center justify-center gap-1 font-mono text-xs"
                        title="Duplicate"
                      >
                        <Copy size={13} /> Duplicate
                      </button>
                      <div className="w-px h-3 bg-[#d9d9dd]" />
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete "${resume.title}"? This cannot be undone.`)) {
                            deleteResume(resume.id);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors flex-1 flex items-center justify-center gap-1 font-mono text-xs"
                        title="Delete"
                      >
                        <Trash2 size={13} /> Delete
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

