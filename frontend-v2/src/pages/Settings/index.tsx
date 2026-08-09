import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Switch";
import { useAuth } from "../../context/AuthContext";
import { useSettingsStore } from "../../store/useSettingsStore";
import { settingsService } from "../../services/settingsService";
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  LogOut,
  AlertTriangle,
  Check,
  X,
  AlertCircle
} from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const settings = useSettingsStore();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordChange = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    setPasswordStatus(null);
    try {
      await settingsService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setPasswordStatus({ type: 'success', message: 'Password changed successfully' });
      reset();
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordStatus(null);
      }, 2000);
    } catch (err: any) {
      setPasswordStatus({ 
        type: 'error', 
        message: err.response?.data?.error || 'Failed to change password' 
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const onDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;
    setIsDeletingAccount(true);
    try {
      await settingsService.deleteAccount();
      logout();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-24">
        
        <div className="mb-32">
          <h1 className="text-h2 font-bold text-text-main leading-tight mb-8">Settings</h1>
          <p className="text-body text-text-muted">Manage your account and application preferences.</p>
        </div>

        {/* Account Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center text-h4">
                <User size={20} className="mr-12 text-brand-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
              <div>
                <h4 className="font-semibold text-text-main text-body">{user?.name}</h4>
                <p className="text-text-muted text-small mt-4">{user?.email}</p>
                <div className="mt-8">
                  <span className="inline-block px-12 py-4 bg-brand-light text-brand-primary text-xs font-semibold rounded-full capitalize">
                    {user?.role} Status
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/profile")}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center text-h4">
                <Palette size={20} className="mr-12 text-brand-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-24">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
                <button 
                  onClick={() => settings.setTheme('light')}
                  className={`p-16 border-2 rounded-xl text-left transition-all ${settings.theme === 'light' ? 'border-brand-primary bg-brand-light/30' : 'border-border hover:border-brand-accent/50'}`}
                >
                  <div className="h-40 w-full bg-gray-100 rounded-md mb-12 flex items-center justify-center border border-gray-200">
                    <div className="w-1/2 h-4 bg-gray-300 rounded-full" />
                  </div>
                  <p className="font-medium text-text-main text-small">Light</p>
                </button>
                <button 
                  disabled
                  className="p-16 border-2 border-border rounded-xl text-left opacity-70 cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] px-8 py-2 rounded-bl-lg font-semibold">Coming Soon</div>
                  <div className="h-40 w-full bg-gray-800 rounded-md mb-12 flex items-center justify-center border border-gray-700">
                    <div className="w-1/2 h-4 bg-gray-600 rounded-full" />
                  </div>
                  <p className="font-medium text-text-main text-small">Dark</p>
                </button>
                <button 
                  disabled
                  className="p-16 border-2 border-border rounded-xl text-left opacity-70 cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] px-8 py-2 rounded-bl-lg font-semibold">Coming Soon</div>
                  <div className="h-40 w-full bg-gradient-to-r from-gray-100 to-gray-800 rounded-md mb-12 flex items-center justify-center border border-gray-300">
                    <div className="w-1/2 h-4 bg-white/50 rounded-full" />
                  </div>
                  <p className="font-medium text-text-main text-small">System</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center text-h4">
                <Bell size={20} className="mr-12 text-brand-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                <div className="p-24 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h5 className="font-medium text-text-main text-body">Email notifications</h5>
                    <p className="text-small text-text-muted mt-4">Receive important updates and announcements via email.</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={settings.toggleEmailNotifications} />
                </div>
                <div className="p-24 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h5 className="font-medium text-text-main text-body">Career recommendations</h5>
                    <p className="text-small text-text-muted mt-4">Get personalized career paths based on your profile.</p>
                  </div>
                  <Switch checked={settings.careerRecommendations} onCheckedChange={settings.toggleCareerRecommendations} />
                </div>
                <div className="p-24 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h5 className="font-medium text-text-main text-body">New resource alerts</h5>
                    <p className="text-small text-text-muted mt-4">Be notified when new scholarships or internships are added.</p>
                  </div>
                  <Switch checked={settings.newResourceAlerts} onCheckedChange={settings.toggleNewResourceAlerts} />
                </div>
                <div className="p-24 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h5 className="font-medium text-text-main text-body">Assessment reminders</h5>
                    <p className="text-small text-text-muted mt-4">Get reminders to complete your career assessment.</p>
                  </div>
                  <Switch checked={settings.assessmentReminders} onCheckedChange={settings.toggleAssessmentReminders} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center text-h4">
                <Shield size={20} className="mr-12 text-brand-primary" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-24">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
                <div>
                  <h5 className="font-medium text-text-main text-body">Change Password</h5>
                  <p className="text-small text-text-muted mt-4">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center text-h4">
                <LogOut size={20} className="mr-12 text-brand-primary" />
                Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
              <div>
                <h5 className="font-medium text-text-main text-body">Sign Out</h5>
                <p className="text-small text-text-muted mt-4">Log out of your account on this device.</p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
          <Card className="border-error-main/20 shadow-none overflow-hidden relative">
            <div className="absolute top-0 left-0 w-4 h-full bg-error-main" />
            <CardHeader className="border-b border-error-main/10 bg-error-light/30">
              <CardTitle className="flex items-center text-h4 text-error-main">
                <AlertTriangle size={20} className="mr-12" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-16 bg-error-light/10">
              <div>
                <h5 className="font-medium text-text-main text-body">Delete Account</h5>
                <p className="text-small text-text-muted mt-4">Permanently delete your account and all of your data.</p>
              </div>
              <Button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-error-main hover:bg-error-main/90 text-white shadow-soft"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-16">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
              onClick={() => !isChangingPassword && setIsPasswordModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-card shadow-lift overflow-hidden"
            >
              <div className="p-24 border-b border-border flex justify-between items-center">
                <h3 className="text-h4 font-bold text-text-main">Change Password</h3>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isChangingPassword}
                  className="text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onPasswordChange)} className="p-24 space-y-24">
                
                {passwordStatus && (
                  <div className={`p-12 rounded-lg flex items-center gap-8 text-small font-medium ${
                    passwordStatus.type === 'success' 
                      ? 'bg-success-light text-success-main border border-success-main/20' 
                      : 'bg-error-light text-error-main border border-error-main/20'
                  }`}>
                    {passwordStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    {passwordStatus.message}
                  </div>
                )}

                <div className="space-y-8">
                  <label className="text-small font-medium text-text-main">Current Password</label>
                  <Input 
                    type="password" 
                    {...register("currentPassword")} 
                    disabled={isChangingPassword || passwordStatus?.type === 'success'}
                  />
                  {errors.currentPassword && <p className="text-xs text-error-main mt-4">{errors.currentPassword.message}</p>}
                </div>
                
                <div className="space-y-8">
                  <label className="text-small font-medium text-text-main">New Password</label>
                  <Input 
                    type="password" 
                    {...register("newPassword")} 
                    disabled={isChangingPassword || passwordStatus?.type === 'success'}
                  />
                  {errors.newPassword && <p className="text-xs text-error-main mt-4">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-8">
                  <label className="text-small font-medium text-text-main">Confirm New Password</label>
                  <Input 
                    type="password" 
                    {...register("confirmPassword")} 
                    disabled={isChangingPassword || passwordStatus?.type === 'success'}
                  />
                  {errors.confirmPassword && <p className="text-xs text-error-main mt-4">{errors.confirmPassword.message}</p>}
                </div>

                <div className="pt-8 flex justify-end gap-12">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    isLoading={isChangingPassword}
                    disabled={isChangingPassword || passwordStatus?.type === 'success'}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-16">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-text-main/20 backdrop-blur-sm"
              onClick={() => !isDeletingAccount && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-card shadow-lift overflow-hidden"
            >
              <div className="p-24 border-b border-border">
                <div className="flex items-center gap-12 text-error-main mb-8">
                  <div className="w-40 h-40 rounded-full bg-error-light flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-h4 font-bold text-text-main">Delete Account</h3>
                </div>
                <p className="text-text-muted text-body mt-8">
                  This action cannot be undone. All of your data, including profile information, bookmarks, and assessment results will be permanently removed.
                </p>
              </div>
              
              <div className="p-24 space-y-24">
                <div className="space-y-8">
                  <label className="text-small font-medium text-text-main">To confirm, type <strong>DELETE</strong> below:</label>
                  <Input 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    disabled={isDeletingAccount}
                  />
                </div>

                <div className="pt-8 flex justify-end gap-12">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmation("");
                    }}
                    disabled={isDeletingAccount}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={onDeleteAccount}
                    isLoading={isDeletingAccount}
                    disabled={deleteConfirmation !== "DELETE" || isDeletingAccount}
                    className="bg-error-main hover:bg-error-main/90 text-white disabled:bg-error-main/50"
                  >
                    Permanently Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
}
