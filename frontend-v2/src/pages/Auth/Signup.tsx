import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";
import { 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  GraduationCap
} from "lucide-react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      await registerAuth(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0c] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-[#121316] rounded-3xl border border-[#22242b] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Brand Showcase (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-[#0b0c0e] via-[#04332c] to-[#00a4b4]/30 text-white flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#22242b] overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Logo size="xl" variant="dark" showTagline={true} className="mb-6" />

            <div className="mt-8 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-[#00a4b4]/20 text-[#38bdf8] border border-[#00a4b4]/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-semibold">
                <GraduationCap size={14} /> FREE STUDENT ACCOUNT
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                Start Your Career Journey with AI Precision.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                Join thousands of students accessing free guidance for CA, UPSC, Nursing, Trades, and Software Engineering.
              </p>
            </div>
          </div>

          <div className="my-8 space-y-3 relative z-10">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#38bdf8] shrink-0" />
              <span className="text-xs text-white/90">Instant AI Career Skill Assessment</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#38bdf8] shrink-0" />
              <span className="text-xs text-white/90">Curated Scholarship Alerts (Reliance, NSP)</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={18} className="text-[#38bdf8] shrink-0" />
              <span className="text-xs text-white/90">ATS-Optimized Resume Builder</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-300">
            <span>CAREERSATHI AI PLATFORM</span>
            <span className="text-[#38bdf8]">100% FREE FOR STUDENTS</span>
          </div>
        </div>

        {/* Right Side: Signup Form Console (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-[#121316] text-white">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#22242b] mb-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#00a4b4] bg-[#00a4b4]/10 border border-[#00a4b4]/30 px-2.5 py-1 rounded font-semibold">
                  REGISTER
                </span>
                <span className="text-slate-500 text-xs font-mono">• NEW ACCOUNT</span>
              </div>
              <Link 
                to="/login" 
                className="font-mono text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                ALREADY HAVE ACCOUNT? <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-white mb-1">Create Student Profile</h3>
              <p className="font-mono text-xs text-slate-400">Fill in details below to generate your personalized workspace.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-mono text-xs"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-300">Full Name *</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Alex Johnson" 
                  {...register("name")} 
                  disabled={isLoading}
                  className="h-12 bg-[#18191e] border-[#2a2c35] text-white focus:border-[#00a4b4]"
                />
                {errors.name && <p className="font-mono text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-300">Email Address *</label>
                <Input 
                  type="email" 
                  placeholder="e.g. alex@student.edu" 
                  {...register("email")} 
                  disabled={isLoading}
                  className="h-12 bg-[#18191e] border-[#2a2c35] text-white focus:border-[#00a4b4]"
                />
                {errors.email && <p className="font-mono text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-300">Password *</label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="font-mono text-[11px] text-[#00a4b4] hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...register("password")} 
                  disabled={isLoading}
                  className="h-12 bg-[#18191e] border-[#2a2c35] text-white focus:border-[#00a4b4]"
                />
                {errors.password && <p className="font-mono text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-12 text-xs font-mono bg-gradient-to-r from-[#00a4b4] to-[#003c33] hover:brightness-110 text-white font-semibold rounded-xl border border-white/10 shadow-lg mt-2" 
                isLoading={isLoading}
              >
                CREATE ACCOUNT & GET STARTED →
              </Button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-[#22242b] flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" /> SECURE REGISTRATION
            </span>
            <Link to="/login" className="text-[#00a4b4] hover:underline">SIGN IN INSTEAD</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
