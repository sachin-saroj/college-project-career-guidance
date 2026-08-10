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
import { AdminConsoleModal } from "../Admin/AdminConsoleModal";
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  LogOut,
  AlertTriangle,
  Check,
  X,
  AlertCircle,
  ShieldCheck,
  Lock
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

  // Admin Console Security Passkey State
  const [isAdminPasskeyModalOpen, setIsAdminPasskeyModalOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [adminPasskeyInput, setAdminPasskeyInput] = useState("");
  const [adminPasskeyError, setAdminPasskeyError] = useState("");

  const handleAdminPasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasskeyInput === "TILAK-PRO") {
      setIsAdminPasskeyModalOpen(false);
      setAdminPasskeyInput("");
      setAdminPasskeyError("");
      setIsAdminConsoleOpen(true);
    } else {
      setAdminPasskeyError("Invalid Security Passkey. Access Denied.");
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="mb-6 border-b border-[#e5e7eb] pb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
            SYSTEM PREFERENCES
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">Account & Preferences</h1>
          <p className="text-slate text-sm mt-1">Configure your authentication details, notifications, and visual environment.</p>
        </div>

        {/* Account Section */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                <User size={18} className="mr-2 text-[#003c33]" />
                Account Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-display text-lg font-normal text-ink">{user?.name}</h4>
                <p className="font-mono text-xs text-slate mt-0.5">{user?.email}</p>
                <div className="mt-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#edfce9] text-[#003c33] border border-[#003c33]/20 rounded">
                    ROLE: {user?.role}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/profile")} className="text-xs font-mono">
                EDIT PROFILE →
              </Button>
            </CardContent>
          </Card>
        </motion.div>


        {/* Appearance Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                <Palette size={18} className="mr-2 text-[#003c33]" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => settings.setTheme('light')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    settings.theme === 'light' ? 'border-[#17171c] bg-[#eeece7]/40 font-semibold' : 'border-[#d9d9dd] hover:border-[#17171c]'
                  }`}
                >
                  <div className="h-10 w-full bg-white rounded-md mb-3 flex items-center justify-center border border-[#d9d9dd]">
                    <div className="w-1/2 h-2.5 bg-[#d9d9dd] rounded-full" />
                  </div>
                  <p className="font-mono text-xs uppercase text-ink">Light Mode</p>
                </button>
                <button 
                  onClick={() => settings.setTheme('dark')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    settings.theme === 'dark' ? 'border-[#17171c] bg-[#17171c] text-white font-semibold' : 'border-[#d9d9dd] hover:border-[#17171c]'
                  }`}
                >
                  <div className="h-10 w-full bg-[#17171c] rounded-md mb-3 flex items-center justify-center border border-[#2e2e38]">
                    <div className="w-1/2 h-2.5 bg-[#2e2e38] rounded-full" />
                  </div>
                  <p className="font-mono text-xs uppercase">Dark Mode</p>
                </button>
                <button 
                  onClick={() => settings.setTheme('system')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    settings.theme === 'system' ? 'border-[#17171c] bg-[#eeece7]/40 font-semibold' : 'border-[#d9d9dd] hover:border-[#17171c]'
                  }`}
                >
                  <div className="h-10 w-full bg-gradient-to-r from-white to-[#17171c] rounded-md mb-3 flex items-center justify-center border border-[#d9d9dd]">
                    <div className="w-1/2 h-2.5 bg-white/50 rounded-full" />
                  </div>
                  <p className="font-mono text-xs uppercase text-ink">System Preference</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                <Bell size={18} className="mr-2 text-[#003c33]" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#e5e7eb]">
                <div className="p-6 flex items-center justify-between hover:bg-[#f7f7f6] transition-colors">
                  <div>
                    <h5 className="font-display text-base font-normal text-ink">Email notifications</h5>
                    <p className="text-xs text-slate mt-1">Receive important updates and announcements via email.</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={settings.toggleEmailNotifications} />
                </div>
                <div className="p-6 flex items-center justify-between hover:bg-[#f7f7f6] transition-colors">
                  <div>
                    <h5 className="font-display text-base font-normal text-ink">Career recommendations</h5>
                    <p className="text-xs text-slate mt-1">Get personalized career paths based on your profile.</p>
                  </div>
                  <Switch checked={settings.careerRecommendations} onCheckedChange={settings.toggleCareerRecommendations} />
                </div>
                <div className="p-6 flex items-center justify-between hover:bg-[#f7f7f6] transition-colors">
                  <div>
                    <h5 className="font-display text-base font-normal text-ink">New resource alerts</h5>
                    <p className="text-xs text-slate mt-1">Be notified when new scholarships or internships are added.</p>
                  </div>
                  <Switch checked={settings.newResourceAlerts} onCheckedChange={settings.toggleNewResourceAlerts} />
                </div>
                <div className="p-6 flex items-center justify-between hover:bg-[#f7f7f6] transition-colors">
                  <div>
                    <h5 className="font-display text-base font-normal text-ink">Assessment reminders</h5>
                    <p className="text-xs text-slate mt-1">Get reminders to complete your career assessment.</p>
                  </div>
                  <Switch checked={settings.assessmentReminders} onCheckedChange={settings.toggleAssessmentReminders} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                <Shield size={18} className="mr-2 text-[#003c33]" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h5 className="font-display text-base font-normal text-ink">Change Password</h5>
                  <p className="text-xs text-slate mt-1">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="text-xs font-mono">
                  CHANGE PASSWORD →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-ink">
                <LogOut size={18} className="mr-2 text-[#003c33]" />
                Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h5 className="font-display text-base font-normal text-ink">Sign Out</h5>
                <p className="text-xs text-slate mt-1">Log out of your account on this device.</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="text-xs font-mono">
                SIGN OUT
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
          <Card variant="canvas" className="border border-red-200 overflow-hidden relative shadow-xs">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />
            <CardHeader className="border-b border-red-100 bg-red-50/50 px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-red-700">
                <AlertTriangle size={18} className="mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-50/10">
              <div>
                <h5 className="font-display text-base font-normal text-ink">Delete Account</h5>
                <p className="text-xs text-slate mt-1">Permanently delete your account and all of your data.</p>
              </div>
              <Button 
                onClick={() => setIsDeleteModalOpen(true)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs"
              >
                DELETE ACCOUNT
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Admin Console Section - Placed at the very bottom */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
          <Card variant="canvas" className="border border-[#17171c] overflow-hidden relative shadow-sm">
            <CardHeader className="border-b border-[#e5e7eb] bg-[#17171c] text-white px-6 py-4">
              <CardTitle className="flex items-center font-display text-base font-normal text-white">
                <ShieldCheck size={18} className="mr-2 text-[#003c33]" />
                System Admin Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f7f7f6]">
              <div>
                <h5 className="font-display text-base font-normal text-ink">Administrative Workspace & Ecosystem Control</h5>
                <p className="text-slate text-xs mt-1">Manage ecosystem resources (CRUD), user accounts, data backups (JSON export/import), and system telemetry.</p>
                <div className="mt-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate bg-white px-2 py-0.5 rounded border border-[#d9d9dd]">
                    SECURITY STATUS: PASSKEY PROTECTED
                  </span>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsAdminPasskeyModalOpen(true)}
                className="text-xs font-mono gap-1.5 shrink-0"
              >
                <Lock size={14} /> UNLOCK ADMIN CONSOLE →
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

      {/* Admin Passkey Security Modal */}
      <AnimatePresence>
        {isAdminPasskeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsAdminPasskeyModalOpen(false);
                setAdminPasskeyInput("");
                setAdminPasskeyError("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-lift border border-[#d9d9dd] overflow-hidden z-10"
            >
              <div className="p-6 bg-[#17171c] text-white border-b border-[#2d2d35] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#003c33] flex items-center justify-center text-white border border-white/20">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-normal text-white">System Admin Authorization</h3>
                    <p className="font-mono text-[10px] text-slate-300">Enter security passkey to open console.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAdminPasskeyModalOpen(false);
                    setAdminPasskeyInput("");
                    setAdminPasskeyError("");
                  }}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleAdminPasskeySubmit} className="p-6 space-y-4">
                {adminPasskeyError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 font-mono text-xs">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{adminPasskeyError}</span>
                  </div>
                )}

                <div>
                  <label className="font-mono text-xs uppercase text-slate mb-1 block">Security Passkey *</label>
                  <Input 
                    type="password"
                    value={adminPasskeyInput}
                    onChange={(e) => {
                      setAdminPasskeyInput(e.target.value);
                      if (adminPasskeyError) setAdminPasskeyError("");
                    }}
                    placeholder="Enter passkey (e.g. TILAK-PRO)"
                    autoFocus
                    required
                  />
                  <p className="font-mono text-[11px] text-slate mt-1">Hint: Password is set to <strong>TILAK-PRO</strong></p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAdminPasskeyModalOpen(false);
                      setAdminPasskeyInput("");
                      setAdminPasskeyError("");
                    }}
                    className="font-mono text-xs"
                  >
                    CANCEL
                  </Button>
                  <Button 
                    type="submit" 
                    className="font-mono text-xs gap-1.5"
                  >
                    AUTHENTICATE & OPEN →
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced System Admin Console Modal */}
      <AdminConsoleModal 
        isOpen={isAdminConsoleOpen} 
        onClose={() => setIsAdminConsoleOpen(false)} 
      />

    </PageWrapper>
  );
}
