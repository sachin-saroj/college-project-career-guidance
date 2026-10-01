import { useState, useMemo } from "react";
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
  User as UserIcon,
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Shield,
  AlertCircle,
  GraduationCap,
  Compass,
  Award
} from "lucide-react";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address (e.g. name@example.com)"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the Terms of Service to create an account"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: true,
    }
  });

  const passwordValue = watch("password") || "";

  // Dynamic Password Strength Evaluation
  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { score: 0, label: "", color: "" };
    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 8) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue) || (/[A-Z]/.test(passwordValue) && /[a-z]/.test(passwordValue))) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-400" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { score: 0, label: "", color: "", text: "" };
    }
  }, [passwordValue]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      await registerAuth({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      navigate("/");
    } catch (err: any) {
      const serverMsg = err.response?.data?.error || err.message;
      setError(serverMsg || "Failed to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#00a4b4]/30 selection:text-[#38bdf8]">
      <div className="w-full max-w-5xl bg-[#101115] rounded-3xl border border-[#1f2129] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* Left Side: Brand Showcase & Student Mission (5 cols) */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-gradient-to-br from-[#090b0e] via-[#042823] to-[#014d42] text-white flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#1f2129] overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Branding */}
          <div className="relative z-10">
            <Logo size="xl" variant="dark" showTagline={true} className="mb-6" />

            <div className="mt-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-300 text-[11px] font-mono font-medium backdrop-blur-sm">
                <GraduationCap size={13} className="text-teal-300 shrink-0" />
                <span>FREE STUDENT REGISTRATION</span>
              </div>

              <h2 className="font-display text-3xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
                Unlock Your Real Career Potential.
              </h2>

              <p className="text-teal-100/85 text-sm leading-relaxed font-sans">
                Join our platform for free, personalized AI career counseling, verified scholarship applications, and complete skill roadmaps.
              </p>
            </div>
          </div>

          {/* Student Perks */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="p-3 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white">Psychometric Career Assessment</span>
            </div>
            <div className="p-3 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <Compass size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white">40+ Step-by-Step Learning Tracks</span>
            </div>
            <div className="p-3 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <Award size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white">Verified Government & NGO Scholarships</span>
            </div>
            <div className="p-3 bg-white/[0.07] border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
              <Shield size={16} className="text-teal-300 shrink-0" />
              <span className="text-xs text-white">100% Free & Ad-Free Forever</span>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-teal-100/70 font-mono">
            <span>SECURE STUDENT DATABASE</span>
            <span className="text-teal-300">PRIVACY PROTECTED</span>
          </div>
        </div>

        {/* Right Side: Professional Registration Console (7 cols) */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between bg-[#101115] text-white">
          <div>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between pb-5 border-b border-[#1f2129] mb-7">
              <div className="flex items-center p-1 bg-[#17181f] rounded-xl border border-[#272935]">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00a4b4] text-white shadow-sm transition-all"
                >
                  Create Account
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span>Free Student Account</span>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-white mb-1.5">Create Your Profile</h3>
              <p className="text-xs text-slate-400">
                Register with your details to start your career assessment and get personalized roadmaps.
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
                    {error.toLowerCase().includes("already exists") && (
                      <p className="mt-1 text-[11px] text-red-200">
                        Already have this account?{" "}
                        <Link to="/login" className="underline font-semibold text-white hover:text-red-100">
                          Sign in here
                        </Link>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <UserIcon size={13} className="text-[#00a4b4]" /> Full Name *
                </label>
                <Input 
                  type="text" 
                  autoComplete="name"
                  placeholder="e.g. Priya Sharma" 
                  {...register("name")} 
                  disabled={isLoading}
                  className="h-11 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                    <span>•</span> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Mail size={13} className="text-[#00a4b4]" /> Email Address *
                </label>
                <Input 
                  type="email" 
                  autoComplete="email"
                  placeholder="e.g. priya.sharma@gmail.com" 
                  {...register("email")} 
                  disabled={isLoading}
                  className="h-11 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                    <span>•</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password & Strength Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Lock size={13} className="text-[#00a4b4]" /> Create Password *
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
                  autoComplete="new-password"
                  placeholder="At least 6 characters" 
                  {...register("password")} 
                  disabled={isLoading}
                  className="h-11 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                    <span>•</span> {errors.password.message}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {passwordValue.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Strength:</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`h-full rounded-full transition-all duration-300 ${
                            passwordStrength.score >= step 
                              ? passwordStrength.color 
                              : "bg-[#252833]"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Lock size={13} className="text-[#00a4b4]" /> Confirm Password *
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[11px] text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password"
                  placeholder="Re-enter your password" 
                  {...register("confirmPassword")} 
                  disabled={isLoading}
                  className="h-11 bg-[#16171d] border-[#262833] text-white placeholder:text-slate-500 focus:border-[#00a4b4] focus:ring-1 focus:ring-[#00a4b4] rounded-xl text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                    <span>•</span> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="w-4 h-4 mt-0.5 rounded bg-[#16171d] border-[#262833] text-[#00a4b4] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>
                    I agree to the CareerSathi Terms of Service and Privacy Policy for free educational counseling.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-12 text-sm bg-gradient-to-r from-[#00a4b4] via-[#008996] to-[#006e78] hover:brightness-110 text-white font-semibold rounded-xl border border-teal-400/20 shadow-lg shadow-teal-950/40 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer" 
                isLoading={isLoading}
              >
                <span>Create Student Account & Start</span>
                <ArrowRight size={16} />
              </Button>
            </form>

            {/* Bottom Login Redirect Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <Link to="/login" className="text-[#00a4b4] font-semibold hover:underline">
                  Sign in to your account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="mt-6 pt-4 border-t border-[#1f2129] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield size={12} className="text-emerald-400" />
              <span>END-TO-END SECURE REGISTRATION</span>
            </span>
            <Link to="/login" className="text-[#00a4b4] hover:underline font-sans">
              Sign In Instead →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
