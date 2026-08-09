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

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!profileData) return 0;
    const fields = ['name', 'education', 'skills', 'interests', 'careerGoal', 'familyIncome'];
    let filled = 0;
    fields.forEach(field => {
      // @ts-ignore
      if (profileData[field] && profileData[field].trim() !== "") {
        filled++;
      }
    });
    return Math.round((filled / fields.length) * 100);
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden">
            <div className="h-120 bg-gradient-to-r from-brand-primary to-brand-secondary" />
            <CardContent className="px-32 pt-0 pb-32 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-24">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-24 -mt-40 md:-mt-48 relative z-10">
                  <div className="ring-4 ring-white rounded-full bg-white">
                    <Avatar initials={(profileData?.name || "S").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()} size="lg" className="w-96 h-96 md:w-120 md:h-120 text-3xl" />
                  </div>
                  <div className="mb-8">
                    <h1 className="text-h2 font-bold text-text-main leading-tight">{profileData?.name}</h1>
                    <div className="flex items-center gap-16 mt-4">
                      <span className="flex items-center text-text-muted text-small">
                        <Mail size={16} className="mr-6" />
                        {profileData?.email}
                      </span>
                      <Badge variant="default" className="capitalize">
                        {profileData?.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-12 w-full md:w-auto">
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="secondary" className="w-full md:w-auto">
                      <Edit2 size={16} className="mr-8" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mt-32 p-24 bg-gray-50 rounded-xl border border-border">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h3 className="font-semibold text-text-main">Profile Completion</h3>
                    <p className="text-small text-text-muted mt-4">
                      {completionPercentage === 100 
                        ? "Your profile is complete! You will receive better career recommendations." 
                        : "Complete your profile to receive more personalized career recommendations."}
                    </p>
                  </div>
                  <span className="text-h3 font-bold text-brand-primary">{completionPercentage}%</span>
                </div>
                <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-brand-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Sections */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center text-h4">
                  <User size={20} className="mr-12 text-brand-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-24 space-y-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main">Full Name</label>
                    <Input 
                      {...register("name")} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.name && <p className="text-xs text-error-main mt-4">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main">Email (Read Only)</label>
                    <Input 
                      value={profileData?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-24"
          >
            {/* Education & Financial */}
            <div className="space-y-24">
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center text-h4">
                    <GraduationCap size={20} className="mr-12 text-brand-primary" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-24 space-y-24">
                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main">Highest Education / Current School</label>
                    <Input 
                      {...register("education")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., B.Tech in Computer Science, Year 2" : "Not provided"}
                      className={!isEditing && !profileData?.education ? "italic text-text-muted bg-gray-50" : !isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.education && <p className="text-xs text-error-main mt-4">{errors.education.message}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center text-h4">
                    <Wallet size={20} className="mr-12 text-brand-primary" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-24 space-y-24">
                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main">Family Income (For Scholarships)</label>
                    <Input 
                      {...register("familyIncome")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Less than 2 LPA" : "Not provided"}
                      className={!isEditing && !profileData?.familyIncome ? "italic text-text-muted bg-gray-50" : !isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.familyIncome && <p className="text-xs text-error-main mt-4">{errors.familyIncome.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Profile */}
            <div className="space-y-24">
              <Card className="h-full">
                <CardHeader className="border-b border-border">
                  <CardTitle className="flex items-center text-h4">
                    <Target size={20} className="mr-12 text-brand-primary" />
                    Career Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-24 space-y-24">
                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main flex items-center">
                      <Briefcase size={14} className="mr-6 text-text-muted" />
                      Career Goal
                    </label>
                    <Input 
                      {...register("careerGoal")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Software Engineer" : "Not provided"}
                      className={!isEditing && !profileData?.careerGoal ? "italic text-text-muted bg-gray-50" : !isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.careerGoal && <p className="text-xs text-error-main mt-4">{errors.careerGoal.message}</p>}
                  </div>

                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main flex items-center">
                      <Target size={14} className="mr-6 text-text-muted" />
                      Skills (Comma separated)
                    </label>
                    <Input 
                      {...register("skills")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Python, Communication, Design" : "Not provided"}
                      className={!isEditing && !profileData?.skills ? "italic text-text-muted bg-gray-50" : !isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.skills && <p className="text-xs text-error-main mt-4">{errors.skills.message}</p>}
                    
                    {/* Render Skills as chips when not editing and they exist */}
                    {!isEditing && profileData?.skills && (
                      <div className="flex flex-wrap gap-8 mt-12">
                        {profileData.skills.split(',').map((skill, idx) => (
                          <Badge key={idx} variant="default" className="bg-gray-50">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <label className="text-small font-medium text-text-main flex items-center">
                      <Heart size={14} className="mr-6 text-text-muted" />
                      Interests (Comma separated)
                    </label>
                    <Input 
                      {...register("interests")} 
                      disabled={!isEditing}
                      placeholder={isEditing ? "e.g., Artificial Intelligence, Art, Reading" : "Not provided"}
                      className={!isEditing && !profileData?.interests ? "italic text-text-muted bg-gray-50" : !isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.interests && <p className="text-xs text-error-main mt-4">{errors.interests.message}</p>}

                    {/* Render Interests as chips when not editing and they exist */}
                    {!isEditing && profileData?.interests && (
                      <div className="flex flex-wrap gap-8 mt-12">
                        {profileData.interests.split(',').map((interest, idx) => (
                          <Badge key={idx} variant="default">
                            {interest.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Action Buttons (Sticky Bottom) */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-0 left-0 right-0 md:left-80 z-40 p-16 md:p-24 bg-white border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-end gap-16"
              >
                <div className="max-w-4xl mx-auto w-full flex justify-end gap-16">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                  >
                    <X size={16} className="mr-8" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    isLoading={updateMutation.isPending}
                    disabled={!isDirty || updateMutation.isPending}
                  >
                    <Check size={16} className="mr-8" />
                    Save Changes
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
