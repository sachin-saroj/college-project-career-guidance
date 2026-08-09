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
      <div className="flex flex-col gap-32 max-w-6xl mx-auto py-16">
        <div>
          <h1 className="text-h2 font-bold text-text-main mb-8">Admin Dashboard</h1>
          <p className="text-body text-text-muted">Manage registered users and educational resources.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <Card 
            className={`cursor-pointer transition-all ${activeTab === "users" ? "ring-2 ring-brand-primary" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <CardContent className="p-24 flex items-center justify-between">
              <div className="flex items-center gap-16">
                <div className="w-48 h-48 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-small text-text-muted mb-4">Total Users</p>
                  <p className="text-h3 font-bold text-text-main">{loadingUsers ? "..." : users.length}</p>
                </div>
              </div>
              <Button variant={activeTab === "users" ? "primary" : "outline"} size="sm">
                View Users
              </Button>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeTab === "resources" ? "ring-2 ring-brand-primary" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            <CardContent className="p-24 flex items-center justify-between">
              <div className="flex items-center gap-16">
                <div className="w-48 h-48 rounded-full bg-status-success/10 flex items-center justify-center text-status-success">
                  <BookOpen size={24} />
                </div>
                <div>
                  <p className="text-small text-text-muted mb-4">Total Resources</p>
                  <p className="text-h3 font-bold text-text-main">{loadingResources ? "..." : resources.length}</p>
                </div>
              </div>
              <Button variant={activeTab === "resources" ? "primary" : "outline"} size="sm">
                Manage Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-h4 font-bold">Registered Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="p-40 text-center text-text-muted"><Loader2 className="animate-spin inline mr-8" /> Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-gray-50/50 text-small text-text-muted font-medium">
                        <th className="p-16">Name</th>
                        <th className="p-16">Email</th>
                        <th className="p-16">Role</th>
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
