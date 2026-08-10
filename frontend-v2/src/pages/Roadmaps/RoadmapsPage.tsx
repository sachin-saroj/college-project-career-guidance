import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../../components/layout/Sidebar";
import { TopNavbar } from "../../components/layout/TopNavbar";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { 
  Compass, 
  Search, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles
} from "lucide-react";
import api from "../../utils/api";

const STREAMS = [
  "All",
  "Commerce & Finance",
  "Civil Services & Govt",
  "Arts & Law",
  "Healthcare & Medical",
  "Vocational & Trades",
  "Creative & Design",
  "Technology",
];

interface DetailedStage {
  title: string;
  duration: string;
  description: string;
  keyItems: string[];
}

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  stream: string;
  provider: string;
  skills: string[];
  difficulty: string;
  duration?: string;
  url?: string;
  image?: string;
  stages?: DetailedStage[];
}

// Detailed multi-stream milestone data generator for modal view
const GET_DETAILED_STAGES = (title: string, stream: string): DetailedStage[] => {
  if (stream === "Commerce & Finance" || title.includes("CA")) {
    return [
      {
        title: "Stage 1: Foundational Qualification",
        duration: "Class 12th Commerce / Graduation",
        description: "Build strong fundamentals in Financial Accounting, Economics, Business Studies, and Quantitative Aptitude.",
        keyItems: ["12th Commerce (50%+ aggregate)", "B.Com / BBA Foundation", "Basic Tally & Excel Proficiency"]
      },
      {
        title: "Stage 2: Professional Registration & Entrance",
        duration: "6 - 12 Months",
        description: "Register with professional bodies (ICAI / ICSI) and crack entry-level professional eligibility tests.",
        keyItems: ["ICAI CA Foundation Exam", "ICSI CSEET Entrance (for CS)", "IBPS / SBI Preliminary Banking Exam"]
      },
      {
        title: "Stage 3: Advanced Core & Competency Training",
        duration: "2 Years",
        description: "Deep dive into Corporate Law, Direct & Indirect Taxation, Advanced Auditing, and Financial Management.",
        keyItems: ["CA Intermediate (Group 1 & 2)", "Articleship Practical Training", "GST & Corporate Compliance"]
      },
      {
        title: "Stage 4: Practical Exposure & Licensing",
        duration: "2 - 3 Years",
        description: "Complete mandatory articleship/internship under a practicing CA/Firm and clear final licensing exams.",
        keyItems: ["3-Year ICAI Articleship", "CA Final Examination", "ICAI Membership & Practice License"]
      }
    ];
  }

  if (stream === "Civil Services & Govt" || title.includes("UPSC") || title.includes("SSC")) {
    return [
      {
        title: "Stage 1: Graduation & Eligibility Check",
        duration: "Undergraduate Degree",
        description: "Obtain a Bachelor's degree in any discipline (Arts, Science, Commerce, Engineering) from a recognized university.",
        keyItems: ["Bachelor's Degree (Any discipline)", "Age eligibility (21-32 years)", "NCERT Textbooks Foundation (Class 6-12)"]
      },
      {
        title: "Stage 2: Preliminary Examination Mastery",
        duration: "8 - 12 Months",
        description: "Master General Studies Paper-I (History, Polity, Geography, Economy) and CSAT Paper-II.",
        keyItems: ["UPSC Prelims GS-I (Cutoff 90-100 marks)", "CSAT Aptitude Qualifying (33% required)", "Current Affairs Newspaper Analysis"]
      },
      {
        title: "Stage 3: Mains Written Strategy & Optional Subject",
        duration: "4 Months",
        description: "Prepare 9 written papers including Essay, 4 General Studies papers, Ethics, and 2 Optional papers.",
        keyItems: ["Choose Optional Subject", "Answer Writing Practice", "Ethics, Integrity & Aptitude (GS IV)"]
      },
      {
        title: "Stage 4: Personality Test & Cadre Allocation",
        duration: "3 Months",
        description: "Face the UPSC Interview Board testing unbiased judgement, leadership potential, and situational ethics.",
        keyItems: ["Detailed Application Form (DAF) Mock Interviews", "Current National Issues Review", "Final Merit List & IAS/IPS Cadre Posting"]
      }
    ];
  }

  if (stream === "Arts & Law" || title.includes("Law")) {
    return [
      {
        title: "Stage 1: Law Entrance Examination",
        duration: "Class 12th / Prep Year",
        description: "Crack national law university entrance tests focusing on Legal Reasoning, Logical Reasoning, and English.",
        keyItems: ["CLAT UG / AILET Examination", "State CET Law Entrance", "Higher Secondary School Certificate"]
      },
      {
        title: "Stage 2: 5-Year Integrated Degree (BA LL.B)",
        duration: "5 Years",
        description: "Undergo rigorous legal education covering Constitutional Law, Criminal Procedure Code, Civil Law, and Moot Courts.",
        keyItems: ["Moot Court Competition Participation", "Legal Drafting & Case Law Analysis", "State High Court Internships"]
      },
      {
        title: "Stage 3: Bar Licensing & Practice",
        duration: "6 Months",
        description: "Enroll with the State Bar Council and clear the All India Bar Examination (AIBE) for court practice license.",
        keyItems: ["State Bar Council Enrollment", "All India Bar Examination (AIBE)", "Junior Advocate Apprenticeship under Senior Counsel"]
      }
    ];
  }

  if (stream === "Healthcare & Medical" || title.includes("Nursing")) {
    return [
      {
        title: "Stage 1: Science (PCB) Foundation & Entrance",
        duration: "Class 12th Science",
        description: "Qualify 10+2 with Physics, Chemistry, and Biology (PCB) and sit for Nursing / Paramedical entrance tests.",
        keyItems: ["10+2 PCB with 50%+ marks", "NEET / AIIMS B.Sc Nursing Entrance", "State Paramedical CET"]
      },
      {
        title: "Stage 2: B.Sc Nursing Academic & Clinical Lab",
        duration: "4 Years",
        description: "Study Human Anatomy, Physiology, Clinical Biochemistry, Pathology, and Pharmacology with hospital duty.",
        keyItems: ["Clinical Rotations in OPD & ICU", "Community Health Fieldwork", "Surgical Nursing Training"]
      },
      {
        title: "Stage 3: State Council Registration & Employment",
        duration: "6 Months",
        description: "Register as a Registered Nurse & Midwife (RN/RM) with State Nursing Council and apply for hospital postings.",
        keyItems: ["State Nursing Council License", "Hospital ICU / Ward Staff Posting", "NCLEX-RN Overseas Certification (Optional)"]
      }
    ];
  }

  if (stream === "Vocational & Trades" || title.includes("Solar") || title.includes("Electrician")) {
    return [
      {
        title: "Stage 1: 10th Pass & ITI Trade Enrolment",
        duration: "10th Standard / Matriculation",
        description: "Enroll in a recognized Government Industrial Training Institute (ITI) for 1 or 2-year trade diplomas.",
        keyItems: ["10th Matric Pass", "NCVT / SCVT ITI Electrician Trade", "Basic Electrical Workshop Safety"]
      },
      {
        title: "Stage 2: Apprenticeship & NTC Certificate",
        duration: "1 Year",
        description: "Undergo National Apprenticeship Training (ATS) in DISCOMs, railways, or private industrial plants.",
        keyItems: ["National Trade Certificate (NTC)", "All India Trade Test (AITT)", "Solar PV System Installer Training"]
      },
      {
        title: "Stage 3: Supervisor Wireman License & Job Entry",
        duration: "Ongoing",
        description: "Obtain Electrical Wireman License from State Licensing Board and enter industrial or self-employed trade.",
        keyItems: ["State Electrical License", "Solar Energy Contractor / Technician", "Discom / Plant Maintenance Tech"]
      }
    ];
  }

  // Default Technology / Engineering
  return [
    {
      title: "Stage 1: Core Fundamentals & Programming Language",
      duration: "2 - 3 Months",
      description: "Master foundational concepts, problem solving, data types, logic building, and version control.",
      keyItems: ["HTML/CSS & JavaScript fundamentals", "Git & GitHub Version Control", "Basic Data Structures"]
    },
    {
      title: "Stage 2: Frameworks & Application Architecture",
      duration: "3 - 4 Months",
      description: "Learn modern component-based frontend and backend server frameworks.",
      keyItems: ["React.js & State Management", "Node.js & Express REST APIs", "Database Systems (SQL & MongoDB)"]
    },
    {
      title: "Stage 3: Real World Projects & Portfolio",
      duration: "2 Months",
      description: "Build 2-3 production-grade applications, optimize performance, and deploy to cloud platforms.",
      keyItems: ["Full Stack Web Application", "Authentication & Security", "Vercel / AWS Deployment"]
    },
    {
      title: "Stage 4: Job Placement & Interview Prep",
      duration: "1 - 2 Months",
      description: "Prepare technical interview questions, system design basics, and apply for engineering roles.",
      keyItems: ["Resume & Portfolio Optimization", "DSA Practice", "Mock Interviews & Applications"]
    }
  ];
};

export const RoadmapsPage = () => {
  const [activeStream, setActiveStream] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapItem | null>(null);

  // Fetch roadmaps from API
  const { data: rawRoadmaps, isLoading } = useQuery({
    queryKey: ["roadmapsCatalog"],
    queryFn: async () => {
      const res = await api.get("/resources");
      const allResources = res.data.resources || [];
      // Filter for roadmaps or category = Roadmaps
      return allResources.filter((r: any) => r.type === "roadmap" || r.category === "Roadmaps");
    },
  });

  const roadmaps: RoadmapItem[] = useMemo(() => {
    return rawRoadmaps || [];
  }, [rawRoadmaps]);

  // Filter roadmaps by activeStream and search query
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((r) => {
      const matchesStream =
        activeStream === "All" || (r.stream && r.stream.toLowerCase().includes(activeStream.toLowerCase())) || activeStream === "General";
      const matchesQuery =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStream && matchesQuery;
    });
  }, [roadmaps, activeStream, searchQuery]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <TopNavbar />

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-16">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Banner */}
            <div className="border-b border-[#e5e7eb] pb-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
                STRUCTURED CAREER PATHWAYS • ALL ACADEMIC STREAMS
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">
                Career Roadmaps Hub
              </h1>
              <p className="text-slate text-sm max-w-3xl mt-1 leading-relaxed">
                Step-by-step career path guides for Commerce, Civil Services, Arts, Healthcare, Vocational Trades, and Technology. Discover required degrees, exams, skills, and entry salary benchmarks.
              </p>
            </div>

            {/* Search and Stream Filter Bar */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-[#d9d9dd] shadow-sm">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by career title, exam, or skill (e.g. CA, UPSC, Nursing, Tally)..."
                  className="w-full h-10 pl-10 pr-4 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none transition-all font-sans text-xs text-ink placeholder:text-slate"
                />
              </div>

              {/* Stream Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-1 pb-1">
                {STREAMS.map((stream) => (
                  <button
                    key={stream}
                    onClick={() => setActiveStream(stream)}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                      activeStream === stream
                        ? "bg-[#17171c] text-white border-[#17171c] shadow-sm"
                        : "bg-[#eeece7]/60 hover:bg-[#eeece7] text-slate hover:text-ink border-[#d9d9dd]"
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            {/* Roadmaps Grid */}
            {isLoading ? (
              <div className="py-20 text-center font-mono text-xs text-slate flex flex-col items-center gap-3">
                <Compass className="animate-spin text-[#003c33]" size={28} />
                LOADING CAREER PATHWAYS...
              </div>
            ) : filteredRoadmaps.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-[#d9d9dd] p-8">
                <Compass size={36} className="mx-auto text-slate mb-3 opacity-60" />
                <h3 className="font-display text-lg font-normal text-ink">No Roadmaps Found</h3>
                <p className="font-mono text-xs text-slate mt-1 max-w-md mx-auto">
                  No structured path matched your current stream filter "{activeStream}". Try switching stream tabs or clear your search term.
                </p>
                <Button variant="outline" size="sm" onClick={() => { setActiveStream("All"); setSearchQuery(""); }} className="mt-4 text-xs font-mono">
                  RESET FILTERS
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map((item) => (
                  <Card 
                    key={item.id} 
                    variant="stone" 
                    className="flex flex-col h-full border border-[#d9d9dd] hover:border-[#17171c] transition-all hover:shadow-md overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedRoadmap(item)}
                  >
                    {/* Header Image or Stream Banner */}
                    <div className="h-36 bg-[#17171c] relative overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#17171c] to-[#003c33] flex items-center justify-center">
                          <Compass size={40} className="text-white/30" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur-md text-[#17171c] px-2.5 py-0.5 rounded border border-white/20 font-medium">
                        {item.stream || "General Stream"}
                      </span>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-lg font-normal text-ink group-hover:text-[#003c33] transition-colors leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-slate text-xs mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {item.skills.slice(0, 4).map((skill) => (
                            <span 
                              key={skill} 
                              className="font-mono text-[10px] bg-[#eeece7] text-ink px-2 py-0.5 rounded border border-[#d9d9dd]"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.skills.length > 4 && (
                            <span className="font-mono text-[10px] text-slate px-1">
                              +{item.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-[10px] border-[#d9d9dd]">
                            {item.difficulty}
                          </Badge>
                          {item.duration && (
                            <span className="font-mono text-[11px] text-slate">
                              {item.duration}
                            </span>
                          )}
                        </div>

                        <Button variant="dark-pill" size="sm" className="text-xs font-mono gap-1 group-hover:bg-[#17171c] group-hover:text-white">
                          VIEW PATH →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Interactive Step-by-Step Roadmap Modal */}
      {selectedRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#d9d9dd] shadow-lift p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedRoadmap(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#eeece7] text-slate hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div className="pr-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
                {selectedRoadmap.stream || "CAREER PATHWAY"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-ink leading-tight">
                {selectedRoadmap.title}
              </h2>
              <p className="text-slate text-sm mt-2 leading-relaxed">
                {selectedRoadmap.description}
              </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 p-4 bg-[#f7f7f6] rounded-xl border border-[#d9d9dd]">
              <div>
                <span className="font-mono text-[10px] uppercase text-slate block">ESTIMATED DURATION</span>
                <span className="font-display text-base font-normal text-ink">{selectedRoadmap.duration || "Self-Paced"}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-slate block">DIFFICULTY LEVEL</span>
                <span className="font-display text-base font-normal text-ink">{selectedRoadmap.difficulty}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-mono text-[10px] uppercase text-slate block">ISSUING AUTHORITY / GUIDE</span>
                <span className="font-display text-base font-normal text-[#003c33]">{selectedRoadmap.provider}</span>
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="space-y-6 my-6">
              <h3 className="font-display text-lg font-normal text-ink flex items-center gap-2">
                <Sparkles size={18} className="text-[#003c33]" />
                Step-by-Step Roadmap Stages
              </h3>

              <div className="relative border-l-2 border-[#17171c] ml-4 pl-6 space-y-8">
                {GET_DETAILED_STAGES(selectedRoadmap.title, selectedRoadmap.stream).map((stage, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#17171c] ring-4 ring-white border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base font-normal text-ink">
                          {stage.title}
                        </h4>
                        <span className="font-mono text-xs bg-[#eeece7] text-slate px-2 py-0.5 rounded border border-[#d9d9dd]">
                          {stage.duration}
                        </span>
                      </div>

                      <p className="text-slate text-xs mt-1 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Key Milestones List */}
                      <div className="mt-3 space-y-1.5">
                        {stage.keyItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-mono text-ink">
                            <CheckCircle2 size={14} className="text-[#003c33] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="pt-4 border-t border-[#e5e7eb]">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate mb-2">Essential Skills & Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoadmap.skills.map((skill) => (
                  <span key={skill} className="font-mono text-xs bg-[#eeece7] text-ink px-3 py-1 rounded-md border border-[#d9d9dd]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setSelectedRoadmap(null)} className="font-mono text-xs">
                CLOSE GUIDANCE
              </Button>
              {selectedRoadmap.url && (
                <Button 
                  size="sm" 
                  onClick={() => window.open(selectedRoadmap.url, "_blank")} 
                  className="font-mono text-xs gap-1.5"
                >
                  OFFICIAL PORTAL / SYLLABUS <ExternalLink size={14} />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
