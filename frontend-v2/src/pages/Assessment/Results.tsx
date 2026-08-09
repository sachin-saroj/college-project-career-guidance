import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { CheckCircle2, ChevronRight, Download, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Results = () => {
  const { resetAssessment, result } = useAssessmentStore();
  const navigate = useNavigate();

  const handleRetake = () => {
    resetAssessment();
  };

  const handleDashboard = () => {
    navigate("/");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-24"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-40 gap-16">
        <div>
          <h1 className="text-h2 font-bold text-text-main mb-8">Your Results Are Ready</h1>
          <p className="text-body text-text-muted">Based on your responses, we've found your optimal career path.</p>
        </div>
        <div className="flex gap-16">
          <Button variant="outline" onClick={handleRetake} className="px-24">
            <RefreshCcw size={16} className="mr-8" /> Retake
          </Button>
          <Button className="px-24" onClick={handleDashboard}>
            Save to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        {/* Main Recommendation Column */}
        <div className="lg:col-span-2 space-y-24">
          <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20">
            <CardContent className="p-32">
              <p className="text-small font-semibold text-brand-primary uppercase tracking-wider mb-8">Top Match</p>
              <div className="flex items-end justify-between mb-24">
                <h2 className="text-[32px] font-bold text-text-main leading-none">{result?.topMatch}</h2>
                <div className="text-h3 font-bold text-brand-primary">{result?.matchScore}%</div>
              </div>
              
              <div className="w-full h-px bg-border my-24" />
              
              <div className="grid grid-cols-2 gap-24">
                <div>
                  <p className="text-small text-text-muted mb-12">Core Skills</p>
                  <div className="flex flex-wrap gap-8">
                    {result?.skills?.map((skill: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center px-12 py-4 rounded-full bg-white border text-small font-medium text-text-main">
                        <CheckCircle2 size={12} className="text-status-success mr-4" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-small text-text-muted mb-12">Expected Salary</p>
                  <p className="text-h4 font-bold text-text-main">{result?.salaryRange}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="p-24 pt-0">
              <div className="space-y-16">
                {result?.roadmap?.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-32 h-32 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-small mr-16 shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-body font-medium text-text-main flex-1">{step}</p>
                    {idx < result.roadmap.length - 1 && (
                      <ChevronRight size={16} className="text-text-muted/50 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Chart Column */}
        <div className="space-y-24">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
            </CardHeader>
            <CardContent className="p-24 pt-0 flex flex-col items-center">
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result?.radarData || []}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Traits"
                      dataKey="A"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <Button variant="outline" className="w-full mt-24">
                <Download size={16} className="mr-8" /> Download PDF Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
