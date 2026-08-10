import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { 
  Users, 
  BookOpen, 
  Plus, 
  Loader2, 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  Activity, 
  Edit, 
  Check, 
  AlertCircle,
  FileJson
} from "lucide-react";
import api from "../../utils/api";

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConsoleModal = ({ isOpen, onClose }: AdminConsoleModalProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"resources" | "users" | "datacontrol" | "telemetry">("resources");

  // Form state for Adding / Editing Resource
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Courses");
  const [type, setType] = useState("course");
  const [stream, setStream] = useState("Commerce & Finance");
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [isFree, setIsFree] = useState(true);

  // Status banners
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch Users
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.users || [];
    },
    enabled: isOpen,
  });

  // Fetch Resources
  const { data: resourcesData, isLoading: loadingResources } = useQuery({
    queryKey: ["adminResources"],
    queryFn: async () => {
      const res = await api.get("/resources");
      return res.data.resources || [];
    },
    enabled: isOpen,
  });

  // Add / Edit Resource Mutation
  const saveResourceMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        url,
        category,
        type,
        stream,
        provider,
        description,
        difficulty,
        duration,
        isFree,
        skills: skillsInput ? skillsInput.split(",").map(s => s.trim()) : [],
      };

      if (editingResourceId) {
        await api.put(`/admin/resources/${editingResourceId}`, payload);
      } else {
        await api.post("/admin/resources", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["roadmapsCatalog"] });
      setActionStatus({
        type: 'success',
        message: editingResourceId ? "Resource updated successfully!" : "New resource published successfully!"
      });
      resetForm();
    },
    onError: (err: any) => {
      setActionStatus({
        type: 'error',
        message: err.response?.data?.error || "Failed to save resource."
      });
    }
  });

  // Delete Resource Mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setActionStatus({ type: 'success', message: "Resource removed from catalog." });
    },
  });

  // Role Toggle Mutation
  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setActionStatus({ type: 'success', message: "User role updated successfully!" });
    }
  });

  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setActionStatus({ type: 'success', message: "User account deleted." });
    }
  });

  const resetForm = () => {
    setEditingResourceId(null);
    setTitle("");
    setUrl("");
    setProvider("");
    setDescription("");
    setSkillsInput("");
    setDuration("");
    setCategory("Courses");
    setType("course");
    setStream("Commerce & Finance");
    setDifficulty("Beginner");
    setIsFree(true);
  };

  const handleEditClick = (item: any) => {
    setEditingResourceId(item.id);
    setTitle(item.title || "");
    setUrl(item.url || "");
    setProvider(item.provider || "");
    setDescription(item.description || "");
    setCategory(item.category || "Courses");
    setType(item.type || "course");
    setStream(item.stream || "Commerce & Finance");
    setDifficulty(item.difficulty || "Beginner");
    setDuration(item.duration || "");
    setIsFree(item.isFree !== undefined ? item.isFree : true);
    setSkillsInput(Array.isArray(item.skills) ? item.skills.join(", ") : "");
  };

  const handleExportJSON = async () => {
    try {
      const res = await api.get("/admin/export", { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `careersathi_database_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setActionStatus({ type: 'success', message: 'Database backup downloaded successfully!' });
    } catch (err) {
      setActionStatus({ type: 'error', message: 'Failed to export database JSON.' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const payload = JSON.parse(event.target?.result as string);
        await api.post("/admin/import", payload);
        queryClient.invalidateQueries();
        setActionStatus({ type: 'success', message: 'Database imported & restored successfully!' });
      } catch (err: any) {
        setActionStatus({ type: 'error', message: 'Invalid JSON file structure.' });
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const users = usersData || [];
  const resources = resourcesData || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-[#d9d9dd] shadow-lift overflow-hidden relative"
      >
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#17171c] text-white flex items-center justify-between border-b border-[#2d2d35]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#003c33] text-white flex items-center justify-center border border-white/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-normal tracking-tight text-white">Advanced System Admin Console</h2>
                <span className="font-mono text-[10px] bg-[#003c33] text-white px-2 py-0.5 rounded border border-white/20 uppercase tracking-widest">
                  PASSKEY AUTHORIZED: TILAK-PRO
                </span>
              </div>
              <p className="font-mono text-xs text-slate-300 mt-0.5">Ecosystem data control, catalog CRUD, user authorization & telemetry.</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-3 bg-[#f7f7f6] border-b border-[#d9d9dd] overflow-x-auto scrollbar-hide">
          {[
            { id: "resources", label: `Catalog Management (${resources.length})`, icon: BookOpen },
            { id: "users", label: `User Directory (${users.length})`, icon: Users },
            { id: "datacontrol", label: "Data Control & Backup", icon: FileJson },
            { id: "telemetry", label: "System Telemetry", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? "bg-[#17171c] text-white border-[#17171c] shadow-sm font-semibold"
                  : "bg-white text-slate hover:text-ink border-[#d9d9dd]"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Alert Banner */}
        {actionStatus && (
          <div className={`px-6 py-3 flex items-center justify-between font-mono text-xs border-b ${
            actionStatus.type === 'success' ? 'bg-[#edfce9] text-[#003c33] border-[#003c33]/20' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {actionStatus.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              <span>{actionStatus.message}</span>
            </div>
            <button onClick={() => setActionStatus(null)} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: Catalog Management */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              
              {/* Form to Add / Edit Resource */}
              <Card variant="stone" className="border border-[#d9d9dd]">
                <CardHeader className="border-b border-[#e5e7eb] px-6 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="font-display text-base font-normal text-ink flex items-center gap-2">
                    {editingResourceId ? <Edit size={16} className="text-[#003c33]" /> : <Plus size={16} className="text-[#003c33]" />}
                    {editingResourceId ? `Edit Resource (ID: ${editingResourceId})` : "Publish New Ecosystem Resource"}
                  </CardTitle>
                  {editingResourceId && (
                    <Button variant="outline" size="sm" onClick={resetForm} className="font-mono text-xs">
                      CANCEL EDITING
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); saveResourceMutation.mutate(); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Title *</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chartered Accountant (CA) Complete Pathway" required />
                      </div>
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Target URL *</label>
                        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Category *</label>
                        <select 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                        >
                          <option value="Courses">Courses</option>
                          <option value="Scholarships">Scholarships</option>
                          <option value="Internships">Internships</option>
                          <option value="Roadmaps">Roadmaps</option>
                          <option value="Articles">Articles</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Type *</label>
                        <select 
                          value={type} 
                          onChange={(e) => setType(e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                        >
                          <option value="course">course</option>
                          <option value="scholarship">scholarship</option>
                          <option value="internship">internship</option>
                          <option value="roadmap">roadmap</option>
                          <option value="article">article</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Academic Stream</label>
                        <select 
                          value={stream} 
                          onChange={(e) => setStream(e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                        >
                          <option value="Commerce & Finance">Commerce & Finance</option>
                          <option value="Civil Services & Govt">Civil Services & Govt</option>
                          <option value="Arts & Law">Arts & Law</option>
                          <option value="Healthcare & Medical">Healthcare & Medical</option>
                          <option value="Vocational & Trades">Vocational & Trades</option>
                          <option value="Creative & Design">Creative & Design</option>
                          <option value="Technology">Technology</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Provider / Authority</label>
                        <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. ICAI / Harvard / Govt" />
                      </div>
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Duration</label>
                        <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 6 Months / 4 Years" />
                      </div>
                      <div>
                        <label className="font-mono text-xs uppercase text-slate mb-1 block">Difficulty</label>
                        <select 
                          value={difficulty} 
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate to Advanced">Intermediate to Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-xs uppercase text-slate mb-1 block">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Comprehensive summary of prerequisites, outcomes, and syllabus..."
                        rows={2}
                        className="w-full p-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-xs uppercase text-slate mb-1 block">Skills (Comma-separated)</label>
                      <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="Accounting, Taxation, Auditing, GST" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 font-mono text-xs text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFree}
                          onChange={(e) => setIsFree(e.target.checked)}
                          className="rounded border-slate text-[#17171c] focus:ring-0"
                        />
                        <span>Is 100% Free / Open Access</span>
                      </label>

                      <Button type="submit" isLoading={saveResourceMutation.isPending} className="font-mono text-xs gap-1.5">
                        {editingResourceId ? "UPDATE RESOURCE" : "PUBLISH RESOURCE"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Resource Data Table */}
              <Card variant="canvas" className="border border-[#e5e7eb]">
                <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                  <CardTitle className="font-display text-base font-normal text-ink">Catalog Directory ({resources.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingResources ? (
                    <div className="py-12 text-center font-mono text-xs text-slate"><Loader2 className="animate-spin inline mr-2" /> LOADING CATALOG...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#e5e7eb] bg-[#f7f7f6] font-mono text-[11px] uppercase tracking-wider text-slate">
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Stream</th>
                            <th className="py-3 px-4">Provider</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e5e7eb] font-sans text-xs text-ink">
                          {resources.map((item: any) => (
                            <tr key={item.id} className="hover:bg-[#f7f7f6] transition-colors">
                              <td className="py-3 px-4 font-medium">{item.title}</td>
                              <td className="py-3 px-4">
                                <span className="font-mono text-[10px] bg-[#eeece7] text-ink px-2 py-0.5 rounded border border-[#d9d9dd]">
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-slate text-[11px]">{item.stream || "General"}</td>
                              <td className="py-3 px-4 text-slate">{item.provider || "—"}</td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditClick(item)}
                                  className="h-7 px-2 text-[11px] font-mono"
                                >
                                  EDIT
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => deleteResourceMutation.mutate(item.id)}
                                  className="h-7 px-2 text-[11px] font-mono text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  DELETE
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          )}

          {/* TAB 2: User Directory */}
          {activeTab === "users" && (
            <Card variant="canvas" className="border border-[#e5e7eb]">
              <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                <CardTitle className="font-display text-base font-normal text-ink">Registered Accounts ({users.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingUsers ? (
                  <div className="py-12 text-center font-mono text-xs text-slate"><Loader2 className="animate-spin inline mr-2" /> FETCHING USER DIRECTORY...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#e5e7eb] bg-[#f7f7f6] font-mono text-[11px] uppercase tracking-wider text-slate">
                          <th className="py-3 px-6">Name</th>
                          <th className="py-3 px-6">Email</th>
                          <th className="py-3 px-6">Role</th>
                          <th className="py-3 px-6">Joined Date</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb] font-sans text-xs text-ink">
                        {users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-[#f7f7f6] transition-colors">
                            <td className="py-3 px-6 font-medium">{u.name}</td>
                            <td className="py-3 px-6 font-mono text-slate text-xs">{u.email}</td>
                            <td className="py-3 px-6">
                              <span className={`font-mono text-[10px] uppercase px-2.5 py-0.5 rounded border ${
                                u.role === 'admin' ? 'bg-[#003c33] text-white border-[#003c33]' : 'bg-[#eeece7] text-ink border-[#d9d9dd]'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-6 font-mono text-slate text-xs">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-6 text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleRoleMutation.mutate({
                                  userId: u.id,
                                  newRole: u.role === 'admin' ? 'user' : 'admin'
                                })}
                                className="h-7 px-2 text-[11px] font-mono"
                              >
                                {u.role === 'admin' ? 'SET AS USER' : 'MAKE ADMIN'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => deleteUserMutation.mutate(u.id)}
                                className="h-7 px-2 text-[11px] font-mono text-red-600 border-red-200 hover:bg-red-50"
                              >
                                DELETE
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 3: Data Control & Import/Export */}
          {activeTab === "datacontrol" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Export Card */}
              <Card variant="stone" className="border border-[#d9d9dd] flex flex-col justify-between">
                <div>
                  <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                    <CardTitle className="font-display text-base font-normal text-ink flex items-center gap-2">
                      <Download size={18} className="text-[#003c33]" />
                      Export Database JSON Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-slate text-xs leading-relaxed">
                      Download a full snapshot of the CareerSathi ecosystem state (`database.json`), including all registered users, published courses, roadmaps, and settings.
                    </p>
                    <div className="p-3 bg-[#f7f7f6] rounded border border-[#d9d9dd] font-mono text-[11px] text-slate">
                      Format: Pretty JSON (.json) <br />
                      Contains: users, resources, assessmentRecords
                    </div>
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <Button onClick={handleExportJSON} className="w-full font-mono text-xs gap-2">
                    <Download size={14} /> DOWNLOAD FULL BACKUP (.JSON)
                  </Button>
                </div>
              </Card>

              {/* Import Card */}
              <Card variant="stone" className="border border-[#d9d9dd] flex flex-col justify-between">
                <div>
                  <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
                    <CardTitle className="font-display text-base font-normal text-ink flex items-center gap-2">
                      <Upload size={18} className="text-[#003c33]" />
                      Import & Restore Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-slate text-xs leading-relaxed">
                      Restore or overwrite system state from a previously exported `database.json` backup file.
                    </p>
                    <div className="p-3 bg-amber-50 rounded border border-amber-200 font-mono text-[11px] text-amber-800">
                      ⚠️ WARNING: Importing will overwrite the current live database file.
                    </div>
                  </CardContent>
                </div>
                <div className="p-6 pt-0">
                  <label className="w-full flex items-center justify-center gap-2 h-10 bg-[#17171c] hover:bg-[#17171c]/90 text-white rounded-md font-mono text-xs cursor-pointer transition-colors">
                    <Upload size={14} /> SELECT BACKUP FILE TO RESTORE
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>
              </Card>

            </div>
          )}

          {/* TAB 4: System Telemetry */}
          {activeTab === "telemetry" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="stone" className="border border-[#d9d9dd] p-5">
                  <span className="font-mono text-[10px] uppercase text-slate block">REGISTERED USERS</span>
                  <p className="font-display text-3xl font-normal text-ink mt-1">{users.length}</p>
                  <span className="font-mono text-[10px] text-[#003c33] mt-2 block">System Authorized</span>
                </Card>

                <Card variant="stone" className="border border-[#d9d9dd] p-5">
                  <span className="font-mono text-[10px] uppercase text-slate block">TOTAL RESOURCES</span>
                  <p className="font-display text-3xl font-normal text-ink mt-1">{resources.length}</p>
                  <span className="font-mono text-[10px] text-[#003c33] mt-2 block">Active Catalog</span>
                </Card>

                <Card variant="stone" className="border border-[#d9d9dd] p-5">
                  <span className="font-mono text-[10px] uppercase text-slate block">SERVER STATUS</span>
                  <p className="font-display text-3xl font-normal text-emerald-600 mt-1">ONLINE</p>
                  <span className="font-mono text-[10px] text-slate mt-2 block">Port 5000 Express API</span>
                </Card>

                <Card variant="stone" className="border border-[#d9d9dd] p-5">
                  <span className="font-mono text-[10px] uppercase text-slate block">STORAGE ENGINE</span>
                  <p className="font-display text-2xl font-normal text-ink mt-1">Local JSON</p>
                  <span className="font-mono text-[10px] text-slate mt-2 block">database.json</span>
                </Card>
              </div>

              <Card variant="canvas" className="border border-[#e5e7eb] p-6">
                <h4 className="font-display text-base font-normal text-ink mb-2">System Diagnostics Log</h4>
                <div className="bg-[#17171c] text-emerald-400 p-4 rounded-xl font-mono text-xs space-y-1">
                  <p>[INFO] Express API server online on Port 5000</p>
                  <p>[INFO] Database engine: Local JSON storage read/write ready</p>
                  <p>[SECURITY] System Admin Console passkey authentication ACTIVE (TILAK-PRO)</p>
                  <p>[STATUS] All 14 routes rendering clean in production build</p>
                </div>
              </Card>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f7f7f6] border-t border-[#d9d9dd] flex items-center justify-between">
          <span className="font-mono text-xs text-slate">CAREERSATHI SYSTEM ADMIN • AUTHORIZED EXECUTIVE ACCESS</span>
          <Button variant="outline" size="sm" onClick={onClose} className="font-mono text-xs">
            EXIT ADMIN CONSOLE
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
