import { useEffect, useState, useRef } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { resumeService } from "../../services/resumeService";
import { Button } from "../../components/ui/Button";
import { ChevronLeft, Download, Sparkles, ZoomIn, ZoomOut, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { SidebarForms } from "./SidebarForms";
import { LivePreview } from "./LivePreview";

export const ResumeBuilderLayout = () => {
  const { activeResumeId, resumes, setActiveResume, atsScore, setAtsScore } = useResumeStore();
  const [zoom, setZoom] = useState(1);
  const [atsLoading, setAtsLoading] = useState(false);
  const [showAtsPanel, setShowAtsPanel] = useState(false);
  const activeResume = resumes.find(r => r.id === activeResumeId);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const autoFit = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const A4_WIDTH = 794;
        const padding = 64;
        const availableWidth = containerWidth - padding;
        
        if (availableWidth < A4_WIDTH) {
          setZoom(availableWidth / A4_WIDTH);
        } else {
          setZoom(1);
        }
      }
    };
    
    autoFit();
    window.addEventListener("resize", autoFit);
    return () => window.removeEventListener("resize", autoFit);
  }, []);

  if (!activeResume) {
    setActiveResume(null);
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleAtsCheck = async () => {
    setAtsLoading(true);
    setShowAtsPanel(true);
    try {
      const result = await resumeService.analyzeResume(activeResume);
      setAtsScore(result);
    } catch {
      setAtsScore({ score: 0, missingSkills: [], formattingIssues: ["Failed to analyze — check your API key and try again."], suggestions: [] });
    } finally {
      setAtsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Builder Toolbar */}
      <div className="h-14 shrink-0 border-b border-[#e5e7eb] bg-white flex items-center justify-between px-6 z-20 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setActiveResume(null)} className="gap-1.5 text-xs font-mono">
            <ChevronLeft size={14} />
            BACK TO WORKSPACE
          </Button>
          <div className="h-4 w-px bg-[#e5e7eb]" />
          <h2 className="font-display text-sm font-normal text-ink truncate max-w-[200px] md:max-w-md">
            {activeResume.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1 hover:bg-black/5 rounded text-slate">
              <ZoomOut size={14} />
            </button>
            <span className="font-mono text-xs text-slate w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-black/5 rounded text-slate">
              <ZoomIn size={14} />
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleAtsCheck} disabled={atsLoading} className="gap-1.5 hidden md:flex text-xs font-mono">
            {atsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-[#003c33]" />}
            {atsLoading ? "ANALYZING..." : "ATS AUDIT"}
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-mono">
            <Download size={14} />
            <span className="hidden sm:inline">EXPORT PDF</span>
          </Button>
        </div>
      </div>

      {/* ATS Score Panel */}
      {showAtsPanel && atsScore && !atsLoading && (
        <div className="shrink-0 border-b border-[#d9d9dd] bg-[#eeece7] px-6 py-4 print:hidden">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {atsScore.score >= 70 
                  ? <CheckCircle size={18} className="text-[#003c33]" /> 
                  : <AlertTriangle size={18} className="text-amber-600" />
                }
                <span className="font-display text-lg text-ink">ATS Compatibility Score: <strong className="font-mono">{atsScore.score}/100</strong></span>
              </div>
              <button onClick={() => setShowAtsPanel(false)} className="p-1 hover:bg-black/5 rounded text-slate">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {atsScore.suggestions.length > 0 && (
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-2">SUGGESTIONS</h4>
                  <ul className="space-y-1 text-slate">
                    {atsScore.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {atsScore.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-2">MISSING SKILLS</h4>
                  <div className="flex flex-wrap gap-1">
                    {atsScore.missingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[11px]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {atsScore.formattingIssues.length > 0 && (
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-2">FORMATTING ISSUES</h4>
                  <ul className="space-y-1 text-slate">
                    {atsScore.formattingIssues.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Split Screen Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Forms */}
        <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 border-r border-[#e5e7eb] bg-white overflow-y-auto print:hidden">
          <SidebarForms />
        </div>

        {/* Right Area - Live Preview */}
        <div 
          ref={previewContainerRef}
          className="hidden md:flex flex-1 bg-[#eeece7]/40 overflow-auto items-start justify-center p-8 print:p-0 print:block print:bg-white print:overflow-visible"
        >
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: "top center" 
            }}
            className="print:transform-none print:m-0 shadow-lg border border-[#e5e7eb]"
          >
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

