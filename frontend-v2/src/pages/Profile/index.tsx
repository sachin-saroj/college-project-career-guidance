import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { profileService } from "../../services/profileService";
import type { ProfileUpdateRequest } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase, 
  Target, 
  Heart, 
  Wallet,
  Edit2,
  Check,
  X,
  AlertCircle
} from "lucide-react";

// Form Validation Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  education: z.string().max(100, "Education description is too long").optional(),
  skills: z.string().max(300, "Skills description is too long").optional(),
  interests: z.string().max(300, "Interests description is too long").optional(),
  careerGoal: z.string().max(200, "Career goal is too long").optional(),
  familyIncome: z.string().max(50, "Family income is too long").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Profile
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
  });

  const profileData = data?.profile;

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      education: "",
      skills: "",
      interests: "",
      careerGoal: "",
      familyIncome: "",
    },
  });

  // Reset form when data is loaded or edit mode is cancelled
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name || "",
        education: profileData.education || "",
        skills: profileData.skills || "",
        interests: profileData.interests || "",
        careerGoal: profileData.careerGoal || "",
        familyIncome: profileData.familyIncome || "",
      });
    }
  }, [profileData, reset, isEditing]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProfileUpdateRequest) => profileService.updateProfile(data),
    onSuccess: async () => {
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      // Update global auth context
      await refreshUser();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const onSubmit = (formData: ProfileFormValues) => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profileData) {
      reset({
        name: profileData.name || "",
        education: profileData.education || "",
        skills: profileData.skills || "",
        interests: profileData.interests || "",
        careerGoal: profileData.careerGoal || "",
        familyIncome: profileData.familyIncome || "",
      });
    }
  };

  // Calculate completion percentage (matching single source of truth)
  const calculateCompletion = () => {
    if (!profileData) return 0;
    let score = 0;
    if (profileData.name && profileData.name.trim()) score += 20;
    if (profileData.education && profileData.education.trim()) score += 16;
    if (profileData.skills && profileData.skills.trim()) score += 16;
    if ((profileData.interests && profileData.interests.trim()) || (profileData.careerGoal && profileData.careerGoal.trim())) score += 16;
    if (profileData.assessmentCompleted) score += 16;
    if (profileData.resumeData || (profileData.resumeText && profileData.resumeText.trim())) score += 16;
    return score;
  };

  const completionPercentage = calculateCompletion();

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="space-y-24 animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl w-full" />
          <div className="h-96 bg-gray-200 rounded-xl w-full" />
        </div>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-64 text-center">
          <AlertCircle className="w-48 h-48 text-error-main mb-16" />
          <h2 className="text-h3 font-bold text-text-main mb-8">Failed to load profile</h2>
          <p className="text-text-muted mb-24">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}>
            Retry
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* Success Toast / Alert */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-success-light text-success-main border border-success-main/20 p-16 rounded-lg flex items-center gap-12"
            >
              <Check size={20} />
              <span className="font-medium">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Update Error Alert */}
        <AnimatePresence>
          {updateMutation.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-error-light text-error-main border border-error-main/20 p-16 rounded-lg flex items-center gap-12 mb-24 overflow-hidden"
            >
              <AlertCircle size={20} />
              <span className="font-medium">Failed to update profile. Please try again.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="stone" className="overflow-hidden border border-[#d9d9dd]">
            <div className="h-28 bg-[#17171c]" />
            <CardContent className="px-8 pt-0 pb-6 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                  <div className="ring-4 ring-white rounded-full bg-white -mt-12 shrink-0 shadow-sm">
                    <Avatar initials={(profileData?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()} size="lg" className="w-20 h-20 md:w-24 md:h-24 text-xl bg-[#003c33] text-white" />
                  </div>
                  <div className="pt-2 md:pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2 py-0.5 rounded border border-[#003c33]/15 block mb-1.5 w-fit">
                      STUDENT CONTEXT PROFILE
                    </span>
                    <h1 className="font-display text-2xl md:text-3xl font-normal text-ink leading-tight">{profileData?.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="font-mono text-xs text-slate flex items-center">
                        <Mail size={14} className="mr-1.5" />
                        {profileData?.email}
                      </span>
                      <Badge variant="outline" className="capitalize font-mono text-[10px] border-[#d9d9dd]">
                        {profileData?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="w-full md:w-auto text-xs font-mono">
                      <Edit2 size={14} className="mr-1.5" />
                      EDIT PROFILE
                    </Button>
                  )}
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-[#d9d9dd]">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-display text-sm font-normal text-ink">Profile Completion Index</h3>
                    <p className="font-mono text-xs text-slate mt-0.5">
                      {completionPercentage === 100 
                        ? "Your profile is 100% complete — optimal AI matching active." 
                        : "Complete all fields to increase career & scholarship recommendation precision."}
                    </p>
                  </div>
                  <span className="font-mono text-lg font-semibold text-[#003c33]">{completionPercentage}%</span>
                </div>
                <div className="h-1.5 bg-[#eeece7] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[#003c33]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Sections */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card variant="canvas" className="border border-[#e5e7eb]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                  <User size={18} className="mr-2 text-[#003c33]" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="profile-name" className="font-mono text-xs uppercase tracking-wider text-slate">Full Name</label>
                    <Input 
                      id="profile-name"
                      aria-label="Full Name"
                      {...register("name")} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.name && <p className="font-mono text-xs text-red-600 mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate">Email Address</label>
                    <Input 
                      value={profileData?.email || ""}
                      disabled
                      className="bg-[#f7f7f6] border-[#d9d9dd]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Education & Financial */}
            <div className="space-y-6">
              <Card variant="canvas" className="border border-[#e5e7eb]">
                <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                  <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                    <GraduationCap size={18} className="mr-2 text-[#003c33]" />
                    Academic Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate">Highest Education / Institution</label>
                    <Input 
                      {...register("education")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., B.Tech in Computer Science, Year 2" : "Not provided"}
                      className={!isEditing && !profileData?.education ? "italic text-slate bg-[#f7f7f6] border-[#d9d9dd]" : !isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.education && <p className="font-mono text-xs text-red-600 mt-1">{errors.education.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card variant="canvas" className="border border-[#e5e7eb]">
                <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                  <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                    <Wallet size={18} className="mr-2 text-[#003c33]" />
                    Socioeconomic Indicator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate">Family Income Bracket (For Scholarships)</label>
                    <Input 
                      {...register("familyIncome")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Less than 2 LPA" : "Not provided"}
                      className={!isEditing && !profileData?.familyIncome ? "italic text-slate bg-[#f7f7f6] border-[#d9d9dd]" : !isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.familyIncome && <p className="font-mono text-xs text-red-600 mt-1">{errors.familyIncome.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Profile */}
            <div className="space-y-6">
              <Card variant="canvas" className="h-full border border-[#e5e7eb]">
                <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                  <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                    <Target size={18} className="mr-2 text-[#003c33]" />
                    Career Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate flex items-center">
                      <Briefcase size={12} className="mr-1.5 text-slate" />
                      Target Career Role
                    </label>
                    <Input 
                      {...register("careerGoal")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Software Engineer" : "Not provided"}
                      className={!isEditing && !profileData?.careerGoal ? "italic text-slate bg-[#f7f7f6] border-[#d9d9dd]" : !isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.careerGoal && <p className="font-mono text-xs text-red-600 mt-1">{errors.careerGoal.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate flex items-center">
                      <Target size={12} className="mr-1.5 text-slate" />
                      Assessed Skills
                    </label>
                    <Input 
                      {...register("skills")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Python, Communication, Logic" : "Not provided"}
                      className={!isEditing && !profileData?.skills ? "italic text-slate bg-[#f7f7f6] border-[#d9d9dd]" : !isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.skills && <p className="font-mono text-xs text-red-600 mt-1">{errors.skills.message}</p>}
                    
                    {!isEditing && profileData?.skills && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profileData.skills.split(',').map((skill, idx) => (
                          <span key={idx} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#eeece7] text-ink rounded border border-[#d9d9dd]">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase tracking-wider text-slate flex items-center">
                      <Heart size={12} className="mr-1.5 text-slate" />
                      Stated Interests
                    </label>
                    <Input 
                      {...register("interests")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., AI, Art, Technology" : "Not provided"}
                      className={!isEditing && !profileData?.interests ? "italic text-slate bg-[#f7f7f6] border-[#d9d9dd]" : !isEditing ? "bg-[#f7f7f6] border-[#d9d9dd]" : ""}
                    />
                    {errors.interests && <p className="font-mono text-xs text-red-600 mt-1">{errors.interests.message}</p>}

                    {!isEditing && profileData?.interests && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profileData.interests.split(',').map((interest, idx) => (
                          <span key={idx} className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white text-ink rounded border border-[#d9d9dd]">
                            {interest.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Sticky Bottom Actions */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="fixed bottom-0 left-0 right-0 md:left-64 z-40 p-4 bg-white border-t border-[#e5e7eb] shadow-lg flex justify-end gap-3"
              >
                <div className="max-w-4xl mx-auto w-full flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="text-xs font-mono"
                  >
                    <X size={14} className="mr-1.5" />
                    CANCEL
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    size="sm"
                    isLoading={updateMutation.isPending}
                    disabled={!isDirty || updateMutation.isPending}
                    className="text-xs font-mono"
                  >
                    <Check size={14} className="mr-1.5" />
                    SAVE CHANGES
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </PageWrapper>
  );
}

