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

export const TaskTable = ({ tasks = [] }: { tasks?: Task[] }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [isLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filteredTasks = useMemo(() => {
    let result = [...localTasks];
    
    if (filterStatus !== "All") {
      result = result.filter(t => t.status === filterStatus);
    }
    
    if (sortField) {
      result.sort((a, b) => {
        let valA: string | number = a[sortField];
        let valB: string | number = b[sortField];
        
        if (sortField === "priority") {
          const pOrder = { High: 3, Medium: 2, Low: 1 };
          valA = pOrder[a.priority as keyof typeof pOrder] || 0;
          valB = pOrder[b.priority as keyof typeof pOrder] || 0;
        }
        if (sortField === "status") {
          const sOrder = { "Done": 3, "In Progress": 2, "Pending": 1 };
          valA = sOrder[a.status as keyof typeof sOrder] || 0;
          valB = sOrder[b.status as keyof typeof sOrder] || 0;
        }

        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [localTasks, sortField, sortDir, filterStatus]);

  const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const toggleTaskStatus = (id: string) => {
    setLocalTasks(localTasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === "Done" ? "Pending" : "Done" };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setLocalTasks(localTasks.filter(t => t.id !== id));
  };

  return (
    <Card variant="canvas" className="h-full flex flex-col p-0">
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-[#e5e7eb] gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-normal text-ink">Action Plan & Tasks</h2>
            <Badge variant="default" className="font-mono text-xs">
              {localTasks.length} items
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Menu as="div" className="relative">
              <Menu.Button as={Button} variant="outline" size="sm" className="gap-2 text-xs">
                <Filter size={14} />
                Status: {filterStatus}
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
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-lg bg-white border border-[#e5e7eb] shadow-lift focus:outline-none z-50 overflow-hidden p-1">
                  {["All", "Pending", "In Progress", "Done"].map((status) => (
                    <Menu.Item key={status}>
                      {({ active }) => (
                        <button
                          onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                          className={`${active ? 'bg-[#eeece7] text-ink' : 'text-slate'} group flex w-full items-center px-3 py-2 text-xs font-mono transition-colors rounded`}
                        >
                          {status}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Plus size={14} />
              Add Task
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-6 pb-2 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate w-[28%]">Task item</th>
                <th className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate w-[34%]">Details</th>
                <th 
                  className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate w-[14%] cursor-pointer hover:text-ink group"
                  onClick={() => handleSort("deadline")}
                >
                  <div className="flex items-center gap-1.5">
                    Deadline
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "deadline" ? "opacity-100 text-ink" : ""}`} />
                  </div>
                </th>
                <th 
                  className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate w-[10%] cursor-pointer hover:text-ink group"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center gap-1.5">
                    Priority
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "priority" ? "opacity-100 text-ink" : ""}`} />
                  </div>
                </th>
                <th 
                  className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate w-[10%] cursor-pointer hover:text-ink group"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1.5">
                    Status
                    <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === "status" ? "opacity-100 text-ink" : ""}`} />
                  </div>
                </th>
                <th className="py-4 font-mono text-[11px] uppercase tracking-wider text-slate text-right w-[4%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="border-b border-[#e5e7eb]">
                      <td className="py-4"><div className="h-4 w-3/4 bg-[#eeece7] animate-pulse rounded" /></td>
                      <td className="py-4 pr-4"><div className="h-4 w-full bg-[#eeece7] animate-pulse rounded" /></td>
                      <td className="py-4"><div className="h-4 w-20 bg-[#eeece7] animate-pulse rounded" /></td>
                      <td className="py-4"><div className="h-4 w-12 bg-[#eeece7] animate-pulse rounded" /></td>
                      <td className="py-4"><div className="h-4 w-16 bg-[#eeece7] animate-pulse rounded" /></td>
                      <td className="py-4 text-right"><div className="h-6 w-6 bg-[#eeece7] animate-pulse rounded-full ml-auto" /></td>
                    </tr>
                  ))
                ) : paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <motion.tr 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="group/row border-b border-[#e5e7eb] hover:bg-[#f7f7f6] transition-colors"
                    >
                      <td className="py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={task.status === "Done"}
                            onChange={() => toggleTaskStatus(task.id)}
                            className="w-4 h-4 rounded border-[#d9d9dd] text-[#17171c] focus:ring-0 cursor-pointer"
                          />
                          <span className={`text-[14px] font-medium transition-colors ${task.status === "Done" ? "text-slate line-through" : "text-ink"}`}>
                            {task.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 align-middle pr-4 text-[13px] text-slate">
                        {task.description}
                      </td>
                      <td className="py-4 align-middle font-mono text-[12px] text-ink">
                        {task.deadline}
                      </td>
                      <td className="py-4 align-middle">
                        <Badge variant={task.priority === "High" ? "coral" : task.priority === "Medium" ? "warning" : "default"}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="py-4 align-middle">
                        <Badge variant={task.status === "Pending" ? "warning" : task.status === "In Progress" ? "info" : "success"}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="py-4 align-middle text-right">
                        <Menu as="div" className="relative inline-block text-left">
                          <Menu.Button as={Button} variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <MoreHorizontal size={16} />
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
                            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-lg bg-white border border-[#e5e7eb] shadow-lift focus:outline-none z-50 p-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={() => toggleTaskStatus(task.id)} className={`${active ? 'bg-[#eeece7] text-ink' : 'text-slate'} group flex w-full items-center px-3 py-2 text-xs font-mono transition-colors rounded`}>
                                    <CheckCircle2 size={14} className="mr-2" /> Mark {task.status === "Done" ? "Undone" : "Done"}
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-[#eeece7] text-ink' : 'text-slate'} group flex w-full items-center px-3 py-2 text-xs font-mono transition-colors rounded`}>
                                    <Edit2 size={14} className="mr-2" /> Edit Task
                                  </button>
                                )}
                              </Menu.Item>
                              <div className="h-px bg-[#e5e7eb] my-1" />
                              <Menu.Item>
                                {({ active }) => (
                                  <button onClick={() => deleteTask(task.id)} className={`${active ? 'bg-[#b30000]/10 text-[#b30000]' : 'text-[#b30000]'} group flex w-full items-center px-3 py-2 text-xs font-mono transition-colors rounded`}>
                                    <Trash2 size={14} className="mr-2" /> Delete
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
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 size={24} className="text-slate mb-2" />
                        <h4 className="font-display text-sm text-ink font-medium mb-1">No tasks found</h4>
                        <p className="text-xs text-slate mb-3">Adjust your status filter to see other items.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {!isLoading && filteredTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-[#e5e7eb] flex items-center justify-between mt-auto">
            <span className="font-mono text-xs text-slate">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-3 text-xs" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} className="mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-3 text-xs" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

