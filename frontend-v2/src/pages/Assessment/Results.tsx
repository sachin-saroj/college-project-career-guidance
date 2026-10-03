import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Award,
  Compass,
  ArrowRight,
  Target,
  BrainCircuit,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Results = () => {
  const { resetAssessment, setStep, result } = useAssessmentStore();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Fallback to user's saved recommendations if store result is empty
  const activeResult = result || user?.lastRecommendations;

  const handleRetake = () => {
    resetAssessment();
    setStep("landing");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  // If no diagnostic results exist yet, show clean state with start action
  if (!activeResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#edfce9] border border-[#003c33]/20 flex items-center justify-center mx-auto mb-4 text-[#003c33]">
          <Target size={32} />
        </div>
        <h2 className="font-display text-2xl font-normal text-ink mb-2">No Diagnostic Completed Yet</h2>
        <p className="text-slate text-sm mb-6">
          Take our 10-question intelligent evaluation to discover your optimal career match, personalized milestone roadmap, and salary benchmarks.
        </p>
        <Button onClick={() => setStep("questions")} className="px-8">
          Start 10-Question Diagnostic →
        </Button>
      </div>
    );
  }

  // Normalize radar data for all 6 traits
  const defaultRadar = [
    { subject: "Logic", A: 88 },
    { subject: "Creativity", A: 76 },
    { subject: "Communication", A: 82 },
    { subject: "Quantitative", A: 80 },
    { subject: "Leadership", A: 85 },
    { subject: "Resilience", A: 90 }
  ];

  const radarData = Array.isArray(activeResult.radarData) && activeResult.radarData.length > 0
    ? activeResult.radarData.map((item: any) => ({
        subject: item.subject,
        A: typeof item.A === "number" ? item.A : typeof item.value === "number" ? item.value : 80
      }))
    : defaultRadar;

  const skillsList: string[] = Array.isArray(activeResult.skills) ? activeResult.skills : ["Problem Solving", "Modern Frameworks", "Continuous Learning"];
  const growthList: string[] = Array.isArray(activeResult.growthAreas) ? activeResult.growthAreas : [];
  const roadmapList: any[] = Array.isArray(activeResult.roadmap) ? activeResult.roadmap : [];
  const alternativeMatches: any[] = Array.isArray(activeResult.alternativeMatches) ? activeResult.alternativeMatches : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-6 print:p-0 print:m-0"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-[#e5e7eb] pb-6 print:border-b-2 print:border-black">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15">
              CAREER DIAGNOSTIC REPORT
            </span>
            {activeResult.archetype && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate bg-[#f0f0ee] px-2 py-0.5 rounded border border-[#e5e7eb]">
                {activeResult.archetype}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">
            Your Diagnostic Results
          </h1>
          <p className="text-slate text-sm mt-1">
            Evaluated by CareerSathi Multi-Dimensional Diagnostic Engine.
          </p>
        </div>
        <div className="flex gap-2.5 print:hidden">
          <Button variant="outline" size="sm" onClick={handleRetake} className="text-xs">
            <RefreshCcw size={14} className="mr-1.5" /> Retake Test
          </Button>
          <Button size="sm" className="text-xs" onClick={handleDashboard}>
            Save to Console →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Match + Roadmap + Growth (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Recommendation Card */}
          <Card variant="dark" className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-[#003c33] via-[#002f28] to-[#011c18] border border-[#004e43] text-white">
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] text-emerald-300 tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles size={13} /> TOP CAREER TRAJECTORY MATCH
                </span>
                {activeResult.marketDemand && (
                  <span className="font-mono text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    {activeResult.marketDemand}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-normal text-white">
                    {activeResult.topMatch}
                  </h2>
                  {activeResult.archetype && (
                    <p className="font-mono text-xs text-white/70 mt-1">
                      Archetype: <span className="text-emerald-300">{activeResult.archetype}</span>
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl">
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-white/70 uppercase">MATCH SCORE</span>
                    <span className="font-mono text-2xl font-bold text-white">{activeResult.matchScore}%</span>
                  </div>
                </div>
              </div>

              {/* Personalized Assessment Summary */}
              {activeResult.summary && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-white/90 leading-relaxed font-sans">
                    {activeResult.summary}
                  </p>
                </div>
              )}

              <div className="h-px bg-white/15 my-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-2.5">
                    Core Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill: string, idx: number) => (
                      <span key={idx} className="font-mono text-[11px] inline-flex items-center px-2.5 py-1 rounded bg-white/10 text-white border border-white/20">
                        <CheckCircle2 size={12} className="text-emerald-400 mr-1.5 shrink-0" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-2.5">
                    Estimated Salary Band
                  </span>
                  <p className="font-display text-2xl text-white font-normal">
                    {activeResult.salaryRange || "₹6,00,000 - ₹18,00,000 / yr"}
                  </p>
                  <span className="font-mono text-[10px] text-white/60 block mt-1">
                    Based on current Indian tech labor market data & entry-to-mid career progression
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth Areas & Skill Gaps */}
          {growthList.length > 0 && (
            <Card variant="canvas" className="p-6 border border-[#e5e7eb]">
              <CardHeader className="p-0 pb-3 border-b border-[#e5e7eb] flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-700" />
                  <CardTitle className="text-base">High-Impact Growth Areas</CardTitle>
                </div>
                <span className="font-mono text-[10px] uppercase text-slate">Recommended Next Focus</span>
              </CardHeader>
              <CardContent className="p-0 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {growthList.map((area: string, idx: number) => (
                    <div key={idx} className="p-3 bg-[#fbfbfa] border border-[#e5e7eb] rounded-lg">
                      <span className="font-mono text-[10px] text-slate block mb-1">PRIORITY 0{idx + 1}</span>
                      <p className="text-xs text-ink font-medium leading-snug">{area}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Milestone Roadmap */}
          <Card variant="canvas" className="p-6 border border-[#e5e7eb]">
            <CardHeader className="p-0 pb-4 border-b border-[#e5e7eb] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-[#003c33]" />
                <CardTitle className="text-lg">Recommended Milestone Roadmap</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-mono print:hidden"
                onClick={() => navigate('/roadmaps')}
              >
                Explore Full Roadmap <ArrowRight size={12} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="space-y-4">
                {roadmapList.map((item: any, idx: number) => {
                  const isRich = typeof item === 'object' && item !== null;
                  const stepNumber = isRich ? item.step : idx + 1;
                  const stepTitle = isRich ? item.title : item;
                  const duration = isRich ? item.duration : `Phase 0${idx + 1}`;
                  const desc = isRich ? item.description : null;
                  const actions = isRich && Array.isArray(item.actionItems) ? item.actionItems : [];

                  return (
                    <div key={idx} className="p-3.5 border border-[#e5e7eb] rounded-xl bg-white hover:border-[#17171c]/30 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="font-mono text-xs font-bold w-8 h-8 rounded-lg bg-[#eeece7] text-[#003c33] flex items-center justify-center shrink-0 mt-0.5 border border-[#d9d9dd]">
                          0{stepNumber}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <h4 className="text-sm font-semibold text-ink">{stepTitle}</h4>
                            <span className="font-mono text-[10px] text-slate bg-[#f0f0ee] px-2 py-0.5 rounded border border-[#e5e7eb]">
                              {duration}
                            </span>
                          </div>
                          {desc && (
                            <p className="text-xs text-slate mt-1 leading-relaxed">{desc}</p>
                          )}
                          {actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {actions.map((act: string, aIdx: number) => (
                                <span key={aIdx} className="font-mono text-[10px] bg-[#edfce9] text-[#003c33] px-2 py-0.5 rounded border border-[#003c33]/15">
                                  ✓ {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Career Matches */}
          {alternativeMatches.length > 0 && (
            <Card variant="canvas" className="p-6 border border-[#e5e7eb]">
              <CardHeader className="p-0 pb-3 border-b border-[#e5e7eb]">
                <CardTitle className="text-base">Secondary Career Fits</CardTitle>
                <p className="text-xs text-slate mt-0.5">Other trajectories aligned with your problem-solving profile.</p>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alternativeMatches.map((alt: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#e5e7eb] bg-[#fbfbfa]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display text-base font-normal text-ink">{alt.title}</h4>
                        <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {alt.matchScore}% Fit
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate block mb-1.5">{alt.salaryRange}</span>
                      <p className="text-xs text-slate leading-normal">{alt.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Trait Radar Chart & Action Deck */}
        <div className="space-y-6">
          <Card variant="stone" className="p-6 flex flex-col justify-between border border-[#d9d9dd]">
            <CardHeader className="p-0 pb-3 border-b border-[#d9d9dd]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Trait Analysis Radar</CardTitle>
                <BrainCircuit size={16} className="text-slate" />
              </div>
              <p className="text-xs text-slate mt-0.5">6-Dimensional psychometric aptitude breakdown</p>
            </CardHeader>

            <CardContent className="p-0 pt-4 flex flex-col items-center flex-1 justify-between">
              {/* Radar Chart with safe padding to prevent label truncation */}
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="66%" 
                    margin={{ top: 15, right: 35, bottom: 15, left: 35 }}
                    data={radarData}
                  >
                    <PolarGrid stroke="#d9d9dd" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#17171c', fontSize: 11, fontFamily: 'monospace' }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, 'Aptitude Score']}
                      contentStyle={{ backgroundColor: '#17171c', color: '#fff', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Radar
                      name="Aptitude"
                      dataKey="A"
                      stroke="#003c33"
                      fill="#003c33"
                      fillOpacity={0.28}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Trait Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                {radarData.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white border border-[#d9d9dd] rounded-md p-2 text-center">
                    <span className="font-mono text-[10px] uppercase text-slate block">{item.subject}</span>
                    <span className="font-mono text-sm font-semibold text-ink">{item.A}%</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2.5 mt-6 print:hidden">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadPdf}
                  className="w-full text-xs font-mono flex items-center justify-center border-[#17171c]/20 hover:bg-white"
                >
                  <Download size={14} className="mr-2" /> DOWNLOAD / PRINT PDF REPORT
                </Button>

                <Button 
                  onClick={() => navigate('/mentor')}
                  className="w-full text-xs font-mono flex items-center justify-center bg-[#003c33] text-white hover:bg-[#002f28]"
                >
                  <MessageSquare size={14} className="mr-2" /> DISCUSS WITH AI MENTOR
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => navigate('/roadmaps')}
                  className="w-full text-xs font-mono flex items-center justify-center"
                >
                  <Compass size={14} className="mr-2" /> BROWSE CAREER ROADMAPS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
