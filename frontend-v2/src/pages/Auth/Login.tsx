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
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck,
  UserCheck
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      await login(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'sweeptester@example.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'student@example.com');
      setValue('password', 'password123');
    }
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-[#090a0c] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-[#121316] rounded-3xl border border-[#22242b] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Brand Showcase & Student Testimonials (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-[#0c0d10] via-[#053a31] to-[#015e51] text-white flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#22242b] overflow-hidden">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Branding */}
          <div className="relative z-10">
            <Logo size="xl" variant="dark" showTagline={true} className="mb-6" />

            <div className="mt-8 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-white/10 text-teal-300 border border-white/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-semibold backdrop-blur-sm">
                <Sparkles size={12} className="text-teal-300" /> AI CAREER GUIDANCE CONSOLE
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
                Empowering Underprivileged Students Step by Step.
              </h2>

              <p className="text-teal-100/90 text-sm leading-relaxed max-w-md font-sans">
                Personalized AI roadmaps, exam strategies (CA, UPSC, Trades), ATS resume builder, and 100% free scholarship access.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="my-8 grid grid-cols-2 gap-3 relative z-10">
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white font-medium">40+ Career Roadmaps</span>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white font-medium">AI Resume Analyzer</span>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white font-medium">Live AI Mentor</span>
            </div>
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white font-medium">Verified Scholarships</span>
            </div>
          </div>

          {/* Testimonial Quote Card */}
          <div className="relative z-10 p-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md shadow-lg">
            <p className="text-xs text-teal-50 italic leading-relaxed font-sans">
              "CareerSathi gave me a structured roadmap for CA Intermediate without paying 50,000+ for private coaching."
            </p>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px]">
              <span className="text-white font-semibold">Pooja Sharma • CA Aspirant</span>
              <span className="text-teal-300 font-semibold">COMMERCE STREAM</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form Console (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-[#121316] text-white">
          <div>
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between pb-6 border-b border-[#22242b] mb-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#00a4b4] bg-[#00a4b4]/10 border border-[#00a4b4]/30 px-2.5 py-1 rounded font-semibold">
                  SIGN IN
                </span>
                <span className="text-slate-400 text-xs font-mono">• PORTAL ACCESS</span>
              </div>
              <Link 
                to="/signup" 
                className="font-mono text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              >
                CREATE ACCOUNT <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h3>
              <p className="font-mono text-xs text-slate-400">Enter your credentials to resume your career workspace.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-mono text-xs flex items-center gap-2"
              >
                <span>⚠️ {error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-300 block">Email Address *</label>
                <Input 
                  type="email" 
                  placeholder="e.g. student@example.com" 
                  {...register("email")} 
                  disabled={isLoading}
                  className="h-12 bg-[#18191e] border-[#2a2c35] text-white focus:border-[#00a4b4]"
                />
                {errors.email && <p className="font-mono text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
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
                className="w-full h-12 text-xs font-mono bg-gradient-to-r from-[#00a4b4] via-[#008392] to-[#005f6a] hover:brightness-110 text-white font-semibold rounded-xl border border-white/10 shadow-lg mt-2" 
                isLoading={isLoading}
              >
                AUTHENTICATE & LOG IN →
              </Button>
            </form>

            {/* Quick Demo Login Buttons */}
            <div className="mt-8 pt-6 border-t border-[#22242b]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-3 text-center">
                ONE-TAP QUICK DEMO SIGN IN
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student')}
                  className="p-2.5 bg-[#18191e] hover:bg-[#22242c] border border-[#2a2c35] hover:border-[#00a4b4] rounded-xl text-left font-mono text-xs text-white transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <UserCheck size={16} className="text-[#00a4b4] group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Student Demo</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instant Access</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2.5 bg-[#18191e] hover:bg-[#22242c] border border-[#2a2c35] hover:border-[#00a4b4] rounded-xl text-left font-mono text-xs text-white transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <ShieldCheck size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-xs leading-none">Admin Demo</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Passkey Console</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-4 border-t border-[#22242b] flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" /> 256-BIT ENCRYPTED SESSION
            </span>
            <span className="text-[#00a4b4] font-semibold">TILAK-PRO PROTECTED</span>
          </div>
        </div>

      </div>
    </div>
  );
}
