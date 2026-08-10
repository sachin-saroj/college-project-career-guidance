import { CheckCircle2, ClipboardList, TrendingUp, Bookmark } from "lucide-react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { DashboardHeader } from "../../components/layout/DashboardHeader";
import { StatCard } from "../../components/dashboard/StatCard";
import { TaskTable } from "../../components/dashboard/TaskTable";
import { AIMentorCard } from "../../components/dashboard/AIMentorCard";
import { CareerMatchCard } from "../../components/dashboard/CareerMatchCard";
import { UpcomingDeadlineCard } from "../../components/dashboard/UpcomingDeadlineCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";

export const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as const }
    },
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/dashboard');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="py-24 text-center font-mono text-sm text-slate">
          Loading student console...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <DashboardHeader />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6"
      >
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="h-[180px]">
            <StatCard
              title="Profile Completion"
              value={`${dashboardData?.profileCompletion || 0}%`}
              icon={CheckCircle2}
              progress={dashboardData?.profileCompletion || 0}
              description="Keep your information updated"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[180px]">
            <StatCard
              title="Assessments Taken"
              value={dashboardData?.recommendations ? "1" : "0"}
              icon={ClipboardList}
              linkText="View assessment"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[180px]">
            <StatCard
              title="Recommended Careers"
              value={dashboardData?.recommendations ? "3" : "0"}
              icon={TrendingUp}
              linkText="Explore pathways"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[180px]">
            <StatCard
              title="Resources Saved"
              value={String(dashboardData?.savedResourcesCount || 0)}
              icon={Bookmark}
              linkText="View bookmarks"
            />
          </motion.div>
        </div>

        {/* Main Content: Tasks Table */}
        <motion.div variants={itemVariants} className="w-full">
          <TaskTable tasks={dashboardData?.tasks || []} />
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AIMentorCard />
            <CareerMatchCard recommendation={dashboardData?.recommendations} />
            <UpcomingDeadlineCard />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

