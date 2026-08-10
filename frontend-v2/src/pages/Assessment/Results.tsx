import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { CheckCircle2, ChevronRight, Download, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export const Results = () => {
  const { resetAssessment, result } = useAssessmentStore();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleRetake = () => {
    resetAssessment();
  };

  const handleDashboard = () => {
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
            CAREER DIAGNOSTIC REPORT
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">
            Your Diagnostic Results
          </h1>
          <p className="text-slate text-sm mt-1">Based on your evaluation profile, here is your optimal career match.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleRetake} className="text-xs">
            <RefreshCcw size={14} className="mr-1.5" /> Retake
          </Button>
          <Button size="sm" className="text-xs" onClick={handleDashboard}>
            Save to Console →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Recommendation Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="dark" className="p-6">
            <CardContent className="p-0">
              <span className="font-mono text-[11px] text-white/80 uppercase tracking-widest block mb-2">
                TOP CAREER RECOMMENDATION
              </span>
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-display text-3xl md:text-4xl font-normal text-white">{result?.topMatch}</h2>
                <div className="font-mono text-2xl font-semibold bg-white/10 text-white px-3 py-1 rounded border border-white/20">
                  {result?.matchScore}%
                </div>
              </div>
              
              <div className="h-px bg-white/10 my-6" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-2">Core Competencies</span>
                  <div className="flex flex-wrap gap-2">
                    {result?.skills?.map((skill: string, idx: number) => (
                      <span key={idx} className="font-mono text-[11px] inline-flex items-center px-2.5 py-1 rounded bg-white/10 text-white border border-white/20">
                        <CheckCircle2 size={12} className="text-coral mr-1.5" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-2">Estimated Salary Band</span>
                  <p className="font-display text-2xl text-white font-normal">{result?.salaryRange}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="canvas" className="p-6">
            <CardHeader className="p-0 pb-4 border-b border-[#e5e7eb]">
              <CardTitle>Recommended Milestone Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="space-y-3">
                {result?.roadmap?.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-center py-2.5 border-b border-[#e5e7eb] last:border-b-0">
                    <div className="font-mono text-xs font-semibold w-7 h-7 rounded bg-[#eeece7] text-ink flex items-center justify-center mr-3 shrink-0">
                      0{idx + 1}
                    </div>
                    <p className="text-sm text-ink flex-1 font-medium">{step}</p>
                    {idx < result.roadmap.length - 1 && (
                      <ChevronRight size={14} className="text-slate hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Chart Column */}
        <div className="space-y-6">
          <Card variant="stone" className="h-full p-6 flex flex-col justify-between">
            <CardHeader className="p-0 pb-3 border-b border-[#d9d9dd]">
              <CardTitle>Trait Analysis Radar</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4 flex flex-col items-center flex-1 justify-between">
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="65%" 
                    data={(result?.radarData || [
                      { subject: "Logic", A: 85 },
                      { subject: "Creativity", A: 75 },
                      { subject: "Communication", A: 80 },
                      { subject: "Math", A: 70 },
                      { subject: "Teamwork", A: 90 }
                    ]).map((item: any) => ({
                      subject: item.subject,
                      A: typeof item.A === 'number' ? item.A : (typeof item.value === 'number' ? item.value : 80)
                    }))}
                  >
                    <PolarGrid stroke="#d9d9dd" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#212121', fontSize: 11, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Traits"
                      dataKey="A"
                      stroke="#003c33"
                      fill="#003c33"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <Button variant="outline" className="w-full mt-4 text-xs font-mono">
                <Download size={14} className="mr-2" /> DOWNLOAD PDF REPORT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

