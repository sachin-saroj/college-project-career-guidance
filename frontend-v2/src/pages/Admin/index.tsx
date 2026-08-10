import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { DashboardHeader } from "../../components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Users, BookOpen, Trash2, Plus, Loader2 } from "lucide-react";
import api from "../../utils/api";

export const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "resources">("users");

  // Form state for adding new resource
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Courses");
  const [type, setType] = useState("course");
  const [provider, setProvider] = useState("");

  // Fetch Users
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await api.get("/admin/users");
      return res.data.users || [];
    },
  });

  // Fetch Resources
  const { data: resourcesData, isLoading: loadingResources } = useQuery({
    queryKey: ["adminResources"],
    queryFn: async () => {
      const res = await api.get("/resources");
      return res.data.resources || [];
    },
  });

  // Add Resource Mutation
  const addResourceMutation = useMutation({
    mutationFn: async () => {
      await api.post("/admin/resources", { title, url, category, type, provider });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setTitle("");
      setUrl("");
      setProvider("");
    },
  });

  // Delete Resource Mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !category || !type) return;
    addResourceMutation.mutate();
  };

  const users = usersData || [];
  const resources = resourcesData || [];

  return (
    <PageWrapper>
      <DashboardHeader />
      <div className="flex flex-col gap-6 max-w-6xl mx-auto py-4">
        <div className="border-b border-[#e5e7eb] pb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
            ADMINISTRATION CONSOLE • AUDIT & CONTENT MANAGEMENT
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight">System Admin Console</h1>
          <p className="text-slate text-sm mt-1">Audit registered student accounts and publish ecosystem resources.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            variant="stone"
            className={`cursor-pointer transition-all border ${activeTab === "users" ? "border-[#17171c] shadow-sm" : "border-[#d9d9dd]"}`}
            onClick={() => setActiveTab("users")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#17171c] flex items-center justify-center text-white">
                  <Users size={18} />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate block">REGISTERED USERS</span>
                  <p className="font-display text-3xl font-normal text-ink">{loadingUsers ? "..." : users.length}</p>
                </div>
              </div>
              <Button variant={activeTab === "users" ? "primary" : "outline"} size="sm" className="text-xs font-mono">
                VIEW ACCOUNTS →
              </Button>
            </CardContent>
          </Card>

          <Card 
            variant="stone"
            className={`cursor-pointer transition-all border ${activeTab === "resources" ? "border-[#17171c] shadow-sm" : "border-[#d9d9dd]"}`}
            onClick={() => setActiveTab("resources")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#003c33] flex items-center justify-center text-white">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate block">PUBLISHED RESOURCES</span>
                  <p className="font-display text-3xl font-normal text-ink">{loadingResources ? "..." : resources.length}</p>
                </div>
              </div>
              <Button variant={activeTab === "resources" ? "primary" : "outline"} size="sm" className="text-xs font-mono">
                MANAGE CATALOG →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card variant="canvas" className="border border-[#e5e7eb]">
            <CardHeader className="border-b border-[#e5e7eb] px-6 py-4">
              <CardTitle className="font-display text-lg font-normal text-ink">Registered Accounts ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="py-12 text-center font-mono text-xs text-slate"><Loader2 className="animate-spin inline mr-2" /> FETCHING ACCOUNTS...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] bg-[#f7f7f6] font-mono text-[11px] uppercase tracking-wider text-slate">
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Role</th>

                        <th className="p-16">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors text-body">
                          <td className="p-16 font-medium text-text-main">{u.name}</td>
                          <td className="p-16 text-text-muted">{u.email}</td>
                          <td className="p-16">
                            <span className={`px-8 py-2 rounded-full text-xs font-semibold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-16 text-text-muted text-small">
                            {new Date(u.createdAt).toLocaleDateString()}
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

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="flex flex-col gap-24">
            {/* Add Resource Card */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-h4 font-bold flex items-center gap-8">
                  <Plus size={18} className="text-brand-primary" /> Add New Resource
                </CardTitle>
              </CardHeader>
              <CardContent className="p-24">
                <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <label className="text-small font-medium text-text-main mb-4 block">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Intro to Python" required />
                  </div>
                  <div>
                    <label className="text-small font-medium text-text-main mb-4 block">URL</label>
                    <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required />
                  </div>
                  <div>
                    <label className="text-small font-medium text-text-main mb-4 block">Provider</label>
                    <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. Coursera / Harvard" />
                  </div>
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <label className="text-small font-medium text-text-main mb-4 block">Category</label>
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-40 w-full px-12 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-brand-primary"
                      >
                        <option value="Courses">Courses</option>
                        <option value="Scholarships">Scholarships</option>
                        <option value="Internships">Internships</option>
                        <option value="Roadmaps">Roadmaps</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-small font-medium text-text-main mb-4 block">Type</label>
                      <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        className="h-40 w-full px-12 rounded-md border border-border bg-white text-sm focus:outline-none focus:border-brand-primary"
                      >
                        <option value="course">course</option>
                        <option value="scholarship">scholarship</option>
                        <option value="internship">internship</option>
                        <option value="roadmap">roadmap</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" isLoading={addResourceMutation.isPending} className="gap-8">
                      <Plus size={16} /> Add Resource
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Resources List */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-h4 font-bold">Manage Resources ({resources.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingResources ? (
                  <div className="p-40 text-center text-text-muted"><Loader2 className="animate-spin inline mr-8" /> Loading resources...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-gray-50/50 text-small text-text-muted font-medium">
                          <th className="p-16">Title</th>
                          <th className="p-16">Provider</th>
                          <th className="p-16">Category</th>
                          <th className="p-16 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {resources.map((r: any) => (
                          <tr key={r.id} className="hover:bg-gray-50/50 transition-colors text-body">
                            <td className="p-16 font-medium text-text-main">
                              <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-primary">
                                {r.title}
                              </a>
                            </td>
                            <td className="p-16 text-text-muted">{r.provider || "N/A"}</td>
                            <td className="p-16">
                              <span className="px-8 py-2 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                                {r.category}
                              </span>
                            </td>
                            <td className="p-16 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  if (window.confirm(`Delete resource "${r.title}"?`)) {
                                    deleteResourceMutation.mutate(r.id);
                                  }
                                }}
                                className="text-status-danger hover:bg-red-50"
                              >
                                <Trash2 size={16} />
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
      </div>
    </PageWrapper>
  );
};
