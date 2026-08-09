import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

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
    <div className="min-h-screen bg-brand-sidebar flex items-center justify-center p-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-card shadow-lift p-40"
      >
        <div className="text-center mb-32">
          <h1 className="text-h3 font-bold text-brand-primary mb-8">CareerSathi</h1>
          <p className="text-text-muted text-body">Create an account to start your journey.</p>
        </div>

        {error && (
          <div className="mb-24 p-12 bg-error-light text-error-main text-small font-medium rounded-lg border border-error-main/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
          <div className="space-y-8">
            <label className="text-small font-semibold text-text-main">Full Name</label>
            <Input 
              type="text" 
              placeholder="Enter your full name" 
              {...register("name")} 
              disabled={isLoading}
            />
            {errors.name && <p className="text-xs text-error-main mt-4">{errors.name.message}</p>}
          </div>

          <div className="space-y-8">
            <label className="text-small font-semibold text-text-main">Email</label>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              {...register("email")} 
              disabled={isLoading}
            />
            {errors.email && <p className="text-xs text-error-main mt-4">{errors.email.message}</p>}
          </div>

          <div className="space-y-8">
            <label className="text-small font-semibold text-text-main">Password</label>
            <Input 
              type="password" 
              placeholder="Create a password" 
              {...register("password")} 
              disabled={isLoading}
            />
            {errors.password && <p className="text-xs text-error-main mt-4">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full h-48" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center mt-32 text-small text-text-muted">
          Already have an account? <Link to="/login" className="text-brand-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
