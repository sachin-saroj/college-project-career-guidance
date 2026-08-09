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

  // Auto-fit preview on mount and window resize
  useEffect(() => {
    const autoFit = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const A4_WIDTH = 794; // approx pixels at 96dpi
        const padding = 64; // 32px each side
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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Builder Toolbar */}
      <div className="h-64 shrink-0 border-b bg-white flex items-center justify-between px-16 z-20 print:hidden">
        <div className="flex items-center gap-16">
          <Button variant="outline" size="sm" onClick={() => setActiveResume(null)} className="gap-8">
            <ChevronLeft size={16} />
            Dashboard
          </Button>
          <div className="h-24 w-px bg-border" />
          <h2 className="font-semibold text-text-main truncate max-w-[200px] md:max-w-md">
            {activeResume.title}
          </h2>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 mr-16">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-8 hover:bg-black/5 rounded text-text-muted">
              <ZoomOut size={16} />
            </button>
            <span className="text-small text-text-muted w-48 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-8 hover:bg-black/5 rounded text-text-muted">
              <ZoomIn size={16} />
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleAtsCheck} disabled={atsLoading} className="gap-8 hidden md:flex">
            {atsLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-brand-primary" />}
            {atsLoading ? "Checking..." : "ATS Check"}
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-8">
            <Download size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </div>

      {/* ATS Score Panel — slides in below toolbar */}
      {showAtsPanel && atsScore && !atsLoading && (
        <div className="shrink-0 border-b bg-white px-24 py-16 print:hidden">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-12">
                {atsScore.score >= 70 
                  ? <CheckCircle size={20} className="text-status-success" /> 
                  : <AlertTriangle size={20} className="text-status-warning" />
                }
                <span className="text-h4 font-bold text-text-main">ATS Score: {atsScore.score}/100</span>
              </div>
              <button onClick={() => setShowAtsPanel(false)} className="p-8 hover:bg-black/5 rounded text-text-muted">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-small">
              {atsScore.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-main mb-8">💡 Suggestions</h4>
                  <ul className="space-y-4 text-text-muted">
                    {atsScore.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {atsScore.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-main mb-8">🔧 Missing Skills</h4>
                  <div className="flex flex-wrap gap-8">
                    {atsScore.missingSkills.map((s, i) => (
                      <span key={i} className="px-8 py-4 bg-status-warning/10 text-status-warning rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {atsScore.formattingIssues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-text-main mb-8">⚠️ Issues</h4>
                  <ul className="space-y-4 text-text-muted">
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
        <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 border-r bg-white overflow-y-auto print:hidden">
          <SidebarForms />
        </div>

        {/* Right Area - Live Preview */}
        <div 
          ref={previewContainerRef}
          className="hidden md:flex flex-1 bg-[#F3F4F6] overflow-auto items-start justify-center p-32 print:p-0 print:block print:bg-white print:overflow-visible"
        >
          {/* A4 Paper Container */}
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: "top center" 
            }}
            className="print:transform-none print:m-0"
          >
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
};
