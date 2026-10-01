import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Logo } from "../../components/ui/Logo";
import { 
  Lock, 
  Mail,
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Shield,
  AlertCircle,
  GraduationCap,
  Compass,
  FileText
} from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. name@example.com)"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    }
  });

  // Pre-fill remembered email if saved in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("careersathi_remembered_email");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    if (data.rememberMe) {
      localStorage.setItem("careersathi_remembered_email", data.email.trim());
    } else {
      localStorage.removeItem("careersathi_remembered_email");
    }

    try {
      await login({
        email: data.email.trim(),
        password: data.password,
      });
      navigate("/");
    } catch (err: any) {
      const serverMsg = err.response?.data?.error || err.message;
      setError(serverMsg || "Unable to sign in. Please verify your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#00a4b4]/30 selection:text-[#38bdf8]">
      <div className="w-full max-w-5xl bg-[#101115] rounded-3xl border border-[#1f2129] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Brand Showcase & Institutional Trust (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-[#090b0e] via-[#042823] to-[#014d42] text-white flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#1f2129] overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Branding */}
          <div className="relative z-10">
            <Logo size="xl" variant="dark" showTagline={true} className="mb-6" />

            <div className="mt-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-300 text-[11px] font-mono font-medium backdrop-blur-sm">
                <Sparkles size={12} className="text-teal-300 shrink-0" />
                <span>AI-DRIVEN CAREER COUNSELING PLATFORM</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
                Real Guidance. Real Careers. No Financial Barrier.
              </h2>

              <p className="text-teal-100/85 text-sm leading-relaxed max-w-md font-sans">
                Empowering students across India with personalized career roadmaps, psychometric analysis, ATS resume evaluation, and direct scholarship discovery.
              </p>
            </div>
          </div>

          {/* Key Platform Capabilities */}
          <div className="my-8 grid grid-cols-2 gap-3 relative z-10">
            <div className="p-3.5 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <Compass size={18} className="text-teal-300 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">Career Roadmaps</p>
                <p className="text-[10px] text-teal-200/70">40+ Step-by-Step Tracks</p>
              </div>
            </div>
            <div className="p-3.5 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <FileText size={18} className="text-teal-300 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">ATS Resume Review</p>
                <p className="text-[10px] text-teal-200/70">AI Scoring & Keywords</p>
              </div>
            </div>
            <div className="p-3.5 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <GraduationCap size={18} className="text-teal-300 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">Scholarships Hub</p>
                <p className="text-[10px] text-teal-200/70">Verified 100% Free</p>
              </div>
            </div>
            <div className="p-3.5 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <Shield size={18} className="text-teal-300 shrink-0" />
              <div>
                <p className="text-xs text-white font-medium">Verified Identity</p>
                <p className="text-[10px] text-teal-200/70">Secure JWT Encryption</p>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="relative z-10 p-4 bg-white/[0.06] border border-white/15 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={15} className="text-teal-300" />
              <span className="text-xs font-semibold text-white">Student First Philosophy</span>
            </div>
            <p className="text-[11px] text-teal-100/80 leading-relaxed">
              Every student gets lifetime free access to AI mentor chats, assessment tests, and curated scholarship applications.
            </p>
          </div>
        </div>

        {/* Right Side: Professional Authentication Console (6 cols) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-[#101115] text-white">
          <div>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between pb-5 border-b border-[#1f2129] mb-8">
              <div className="flex items-center p-1 bg-[#17181f] rounded-xl border border-[#272935]">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00a4b4] text-white shadow-sm transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Create Account
                </Link>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Online</span>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-white mb-1.5">Welcome Back</h3>
              <p className="text-xs text-slate-400">
                Sign in with your registered email and password to access your personalized workspace.
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-6 p-3.5 bg-red-500/10 text-red-300 border border-red-500/25 rounded-xl text-xs flex items-start gap-2.5"
                >
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{error}</p>
                    {error.toLowerCase().includes("no account found") && (
                      <p className="mt-1 text-[11px] text-red-200">
                        Don't have an account yet?{" "}
                        <Link to="/signup" className="underline font-semibold text-white hover:text-red-100">
                          Click here to sign up for free
                        </Link>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-[#00a4b4]" /> Email Address
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Official or personal</span>
                </label>
                <Input 
                  type="email" 
                  autoComplete="email"
                  placeholder="e.g. yourname@gmail.com" 
                  {...register("email")} 
                  disabled={isLoading}
                  className="h-12 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Lock size={13} className="text-[#00a4b4]" /> Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  placeholder="Enter your password" 
                  {...register("password")} 
                  disabled={isLoading}
                  className="h-12 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Options: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded bg-[#16171d] border-[#262833] text-[#00a4b4] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember my email</span>
                </label>

                <Link
                  to="/signup"
                  className="text-xs text-slate-400 hover:text-teal-300 transition-colors"
                >
                  Need an account?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-12 text-sm bg-gradient-to-r from-[#00a4b4] via-[#008996] to-[#006e78] hover:brightness-110 text-white font-semibold rounded-xl border border-teal-400/20 shadow-lg shadow-teal-950/40 transition-all flex items-center justify-center gap-2 mt-2" 
                isLoading={isLoading}
              >
                <span>Sign In to CareerSathi</span>
                <ArrowRight size={16} />
              </Button>
            </form>

            {/* Bottom Register Redirect Notice */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                New to CareerSathi?{" "}
                <Link to="/signup" className="text-[#00a4b4] font-semibold hover:underline">
                  Create your free student account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="mt-8 pt-4 border-t border-[#1f2129] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield size={12} className="text-emerald-400" />
              <span>TLS 1.3 • 256-BIT ENCRYPTION</span>
            </span>
            <span className="text-slate-400">CAREERSATHI PORTAL</span>
          </div>
        </div>

      </div>
    </div>
  );
}
