import { CalendarClock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UpcomingDeadlineCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getDynamicDeadlines = () => {
    const today = new Date();
    
    const target1 = new Date(today);
    target1.setDate(today.getDate() + 5);
    
    const target2 = new Date(today);
    target2.setDate(today.getDate() + 12);
    
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const fullMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return [
      {
        id: 1,
        month: months[target1.getMonth()],
        day: String(target1.getDate()).padStart(2, '0'),
        title: "Career Assessment Review",
        date: `${fullMonths[target1.getMonth()]} ${target1.getDate()}, ${target1.getFullYear()}`,
        timeLeft: "5 days left"
      },
      {
        id: 2,
        month: months[target2.getMonth()],
        day: String(target2.getDate()).padStart(2, '0'),
        title: "Resume & Portfolio Refresh",
        date: `${fullMonths[target2.getMonth()]} ${target2.getDate()}, ${target2.getFullYear()}`,
        timeLeft: "12 days left"
      }
    ];
  };

  const deadlines = getDynamicDeadlines();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card variant="canvas" hoverEffect className="h-full flex flex-col p-6">
      <CardContent className="p-0 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2">
            <div className="text-ink">
              <CalendarClock size={16} />
            </div>
            <h3 className="font-display text-lg font-normal text-ink">Upcoming Milestones</h3>
          </div>
          <button 
            onClick={() => navigate('/resources')}
            className="font-mono text-xs text-ink hover:underline flex items-center gap-1"
          >
            All dates <ChevronRight size={12} />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-2">
          {isLoading ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="h-4 w-full bg-[#eeece7] animate-pulse rounded" />
              <div className="h-4 w-full bg-[#eeece7] animate-pulse rounded" />
            </div>
          ) : deadlines.length > 0 ? (
            <div className="flex flex-col w-full">
              {deadlines.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between py-3 border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f7f7f6] px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-center bg-[#eeece7] px-2 py-1 rounded text-ink min-w-[38px]">
                      <span className="text-[9px] uppercase tracking-wider block text-slate leading-none">{item.month}</span>
                      <span className="text-[14px] font-semibold leading-none">{item.day}</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-medium text-ink">{item.title}</h4>
                      <span className="font-mono text-[11px] text-slate">{item.date}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] uppercase bg-[#ff7759]/10 text-[#ff7759] px-2 py-0.5 rounded border border-[#ff7759]/20">
                    {item.timeLeft}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <CalendarClock size={24} className="text-slate mb-2" />
              <p className="text-xs text-slate">No pending deadlines.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
