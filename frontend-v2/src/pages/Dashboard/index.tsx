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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] as const }
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
    return <PageWrapper><div className="p-40 text-center">Loading dashboard...</div></PageWrapper>;
  }

  return (
    <PageWrapper>
      <DashboardHeader />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-32"
      >
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
          <motion.div variants={itemVariants} className="h-[200px]">
            <StatCard
              title="Profile Completion"
              value={`${dashboardData?.profileCompletion || 0}%`}
              icon={CheckCircle2}
              iconBgColor="var(--status-success-light, #E8F5E9)"
              iconColor="#4CAF50"
              progress={dashboardData?.profileCompletion || 0}
              description="Keep it up!"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[200px]">
            <StatCard
              title="Assessments Taken"
              value={dashboardData?.recommendations ? "1" : "0"}
              icon={ClipboardList}
              iconBgColor="#E3F2FD"
              iconColor="#3F8CFF"
              linkText="View all"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[200px]">
            <StatCard
              title="Recommended Careers"
              value={dashboardData?.recommendations ? "3" : "0"}
              icon={TrendingUp}
              iconBgColor="#F4F1FF"
              iconColor="#7C5CFF"
              linkText="Explore now"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="h-[200px]">
            <StatCard
              title="Resources Saved"
              value={String(dashboardData?.savedResourcesCount || 0)}
              icon={Bookmark}
              iconBgColor="#FFF3E0"
              iconColor="#FF9800"
              linkText="View resources"
            />
          </motion.div>
        </div>

        {/* Main Content Area */}
        <motion.div variants={itemVariants} className="w-full">
          <TaskTable tasks={dashboardData?.tasks || []} />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <AIMentorCard />
            <CareerMatchCard recommendation={dashboardData?.recommendations} />
            <UpcomingDeadlineCard />
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};
