import { useState, useMemo, useEffect } from "react";
import { MoreHorizontal, Plus, ArrowUpDown, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Done";
}

const mockTasks: Task[] = [
  { id: "1", name: "Complete Career Assessment", description: "Discover careers that match your interests", deadline: "May 20, 2025", priority: "High", status: "Pending" },
  { id: "2", name: "Build Your Resume", description: "Create a professional resume with AI", deadline: "May 25, 2025", priority: "Medium", status: "In Progress" },
  { id: "3", name: "Explore Scholarships", description: "Find scholarships suitable for you", deadline: "May 30, 2025", priority: "Low", status: "Pending" },
  { id: "4", name: "Mock Interview Practice", description: "Practice behavioral questions", deadline: "Jun 02, 2025", priority: "Medium", status: "Pending" },
  { id: "5", name: "Update LinkedIn Profile", description: "Add new skills and summary", deadline: "Jun 05, 2025", priority: "Low", status: "Done" },
];

const priorityOrder = { High: 3, Medium: 2, Low: 1 };
const statusOrder = { "Done": 3, "In Progress": 2, "Pending": 1 };

export const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    // Simulate network fetch
    const timer = setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    if (filterStatus !== "All") {
      result = result.filter(t => t.status === filterStatus);
    }
    
    if (sortField) {
      result.sort((a, b) => {
        let valA: string | number = a[sortField];
        let valB: string | number = b[sortField];
        
        if (sortField === "priority") {
          valA = priorityOrder[a.priority as keyof typeof priorityOrder];
          valB = priorityOrder[b.priority as keyof typeof priorityOrder];
        }
        if (sortField === "status") {
          valA = statusOrder[a.status as keyof typeof statusOrder];
          valB = statusOrder[b.status as keyof typeof statusOrder];
        }

        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [tasks, sortField, sortDir, filterStatus]);

  const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === "Done" ? "Pending" : "Done" };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-24 pb-16 gap-16">
          <div className="flex items-center gap-12">
            <h2 className="text-[18px] font-bold text-text-main">My Tasks</h2>
            <Badge variant="default" className="bg-brand-light rounded-full w-24 h-24 p-0 shrink-0">
              {tasks.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-12 w-full sm:w-auto">
            <Menu as="div" className="relative">
              <Menu.Button as={Button} variant="outline" size="sm" className="gap-8">
                <Filter size={16} />
                {filterStatus}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-8 w-40 origin-top-right rounded-xl bg-white shadow-lift ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden py-4">
                  {["All", "Pending", "In Progress", "Done"].map((status) => (
                    <Menu.Item key={status}>
                      {({ active }) => (
                        <button
                          onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                          className={`${active ? 'bg-gray-50 text-text-main' : 'text-text-muted'} group flex w-full items-center px-16 py-12 text-sm font-medium transition-colors`}
                        >
                          {status}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            <Button variant="primary" size="sm" className="gap-8">
              <Plus size={16} />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-24 pb-24 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-16 text-small text-text-muted font-medium font-sans w-[25%]">Task name</th>
                <th className="pb-16 text-small text-text-muted font-medium font-sans w-[35%]">Description</th>
                <th 
                  className="pb-16 text-small text-text-muted font-medium font-sans w-[15%] cursor-pointer hover:text-text-main group"
                  onClick={() => handleSort("deadline")}
                >
                  <div className="flex items-center gap-4">
                    Deadline
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "deadline" ? "opacity-100 text-brand-primary" : ""}`} />
                  </div>
                </th>
                <th 
                  className="pb-16 text-small text-text-muted font-medium font-sans w-[10%] cursor-pointer hover:text-text-main group"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center gap-4">
                    Priority
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "priority" ? "opacity-100 text-brand-primary" : ""}`} />
                  </div>
                </th>
                <th 
                  className="pb-16 text-small text-text-muted font-medium font-sans w-[10%] cursor-pointer hover:text-text-main group"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-4">
                    Status
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "status" ? "opacity-100 text-brand-primary" : ""}`} />
                  </div>
                </th>
                <th className="pb-16 text-small text-text-muted font-medium font-sans text-right w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  // Skeleton loader rows
                  Array.from({ length: 3 }).map((_, idx) => (
                    <motion.tr 
                      key={`skeleton-${idx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/50"
                    >
                      <td className="py-20"><div className="h-20 w-3/4 bg-gray-100 animate-pulse rounded" /></td>
                      <td className="py-20 pr-16"><div className="h-20 w-full bg-gray-100 animate-pulse rounded" /></td>
                      <td className="py-20"><div className="h-20 w-24 bg-gray-100 animate-pulse rounded" /></td>
                      <td className="py-20"><div className="h-24 w-16 bg-gray-100 animate-pulse rounded-full" /></td>
                      <td className="py-20"><div className="h-24 w-20 bg-gray-100 animate-pulse rounded-full" /></td>
                      <td className="py-20 text-right"><div className="h-32 w-32 bg-gray-100 animate-pulse rounded-full ml-auto" /></td>
                    </motion.tr>
                  ))
                ) : paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <motion.tr 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group/row border-b border-border/50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-20 align-top">
                        <div className="flex items-start gap-12">
                          <input 
                            type="checkbox" 
                            checked={task.status === "Done"}
                            onChange={() => toggleTaskStatus(task.id)}
                            className="mt-1 w-16 h-16 rounded-[4px] border-border text-brand-primary focus:ring-brand-primary cursor-pointer transition-all"
                          />
                          <span className={`text-body font-medium transition-colors ${task.status === "Done" ? "text-text-muted line-through" : "text-text-main"}`}>
                            {task.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-20 align-top pr-16 text-body text-text-muted">
                        {task.description}
                      </td>
                      <td className="py-20 align-top text-body text-text-main font-medium">
                        {task.deadline}
                      </td>
                      <td className="py-20 align-top">
                        <Badge variant={task.priority === "High" ? "danger" : task.priority === "Medium" ? "warning" : "success"}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-20 align-top">
                        <Badge variant={task.status === "Pending" ? "warning" : task.status === "In Progress" ? "info" : "success"}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="py-20 align-top text-right">
                        <Menu as="div" className="relative inline-block text-left">
                          <Menu.Button as={Button} variant="ghost" size="icon" className="h-32 w-32 -mt-4 opacity-0 group-hover/row:opacity-100 transition-opacity rounded-full hover:bg-gray-100 focus-visible:opacity-100">
                            <MoreHorizontal size={18} />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lift ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden py-4">
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={() => toggleTaskStatus(task.id)} className={`${active ? 'bg-gray-50 text-text-main' : 'text-text-muted'} group flex w-full items-center px-16 py-10 text-sm font-medium transition-colors`}>
                                    <CheckCircle2 size={16} className="mr-12" /> Mark {task.status === "Done" ? "Undone" : "Done"}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-gray-50 text-text-main' : 'text-text-muted'} group flex w-full items-center px-16 py-10 text-sm font-medium transition-colors`}>
                                    <Edit2 size={16} className="mr-12" /> Edit Task
                                  </button>
                                )}
                              </Menu.Item>
                              <div className="h-px bg-border my-4" />
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={() => deleteTask(task.id)} className={`${active ? 'bg-red-50 text-status-danger' : 'text-status-danger/80'} group flex w-full items-center px-16 py-10 text-sm font-medium transition-colors`}>
                                    <Trash2 size={16} className="mr-12" /> Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="py-40 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-48 w-48 bg-brand-light/50 rounded-full flex items-center justify-center mb-16">
                          <CheckCircle2 size={24} className="text-brand-primary/50" />
                        </div>
                        <h4 className="text-body font-bold text-text-main mb-4">No tasks found</h4>
                        <p className="text-small text-text-muted mb-16">Try adjusting your filters or add a new task.</p>
                        <Button variant="outline" size="sm">Add Task</Button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {!isLoading && filteredTasks.length > 0 && (
          <div className="px-24 py-16 border-t border-border flex items-center justify-between mt-auto">
            <span className="text-small text-text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>
            <div className="flex items-center gap-8">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-32 px-12" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} className="mr-4" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-32 px-12" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={16} className="ml-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
