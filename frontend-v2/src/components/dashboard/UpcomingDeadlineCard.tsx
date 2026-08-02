import { CalendarClock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UpcomingDeadlineCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const deadlines = [
    { id: 1, month: "MAY", day: "20", title: "Career Assessment", date: "May 20, 2025", timeLeft: "3 days left" },
    { id: 2, month: "MAY", day: "25", title: "Resume Builder", date: "May 25, 2025", timeLeft: "8 days left" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400); // slightly staggered
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card hoverEffect className="h-full flex flex-col group">
      <CardContent className="p-24 pb-32 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-8">
            <div className="text-brand-primary">
              <CalendarClock size={18} />
            </div>
            <h3 className="font-bold text-[18px] text-text-main">Upcoming Deadlines</h3>
          </div>
          <button 
            onClick={() => navigate('/assessment')} // generic route for now
            className="text-small font-semibold text-brand-primary hover:text-brand-accent transition-colors flex items-center group-hover:underline"
          >
            View All <ChevronRight size={14} className="ml-2 group-hover:translate-x-4 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-16">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-16 w-full"
              >
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-16 w-full">
                    <div className="flex flex-col items-center justify-center min-w-[40px] pt-4 gap-4">
                      <div className="h-10 w-24 bg-gray-100 animate-pulse rounded" />
                      <div className="h-20 w-32 bg-gray-100 animate-pulse rounded" />
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="h-16 w-3/4 bg-gray-100 animate-pulse rounded" />
                      <div className="h-12 w-1/2 bg-gray-100 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : deadlines.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-16 w-full"
              >
                {deadlines.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="flex items-start gap-16 group/row cursor-pointer rounded-lg p-8 -mx-8 hover:bg-brand-light/50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex flex-col items-center justify-center min-w-[40px] pt-4">
                      <span className="text-[10px] font-bold text-brand-primary leading-none mb-1 group-hover/row:scale-110 transition-transform">{item.month}</span>
                      <span className="text-[18px] font-bold text-text-main leading-none">{item.day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-body font-medium text-text-main mb-2 group-hover/row:text-brand-primary transition-colors">{item.title}</h4>
                      <p className="text-small text-text-muted">
                        {item.date} • <span className="text-status-warning font-medium">{item.timeLeft}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center px-16"
              >
                <div className="h-48 w-48 bg-brand-light/50 rounded-full flex items-center justify-center mb-12">
                  <CalendarClock size={20} className="text-brand-primary/50" />
                </div>
                <p className="text-small text-text-muted mb-12">You have no upcoming deadlines.</p>
                <button className="text-xs font-semibold text-brand-primary hover:underline">Explore tasks</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
