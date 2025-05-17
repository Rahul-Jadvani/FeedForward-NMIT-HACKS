
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock notification data
interface NotificationPreview {
  id: string;
  title: string;
  timestamp: string;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationPreview[]>([]);

  // Fetch notifications (would be replaced with real data in production)
  useEffect(() => {
    // Mock API call
    const mockUnreadCount = 3;
    const mockRecentNotifications = [
      { id: "1", title: "New Food Available Nearby", timestamp: "10 min ago" },
      { id: "2", title: "Claim Approved", timestamp: "2 hours ago" },
      { id: "3", title: "Food Expiring Soon", timestamp: "3 hours ago" }
    ];

    setUnreadCount(mockUnreadCount);
    setRecentNotifications(mockRecentNotifications);
  }, []);

  const handleViewAll = () => {
    navigate("/notifications");
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative transition-transform hover:scale-110 active:scale-95"
            onClick={handleViewAll}
          >
            <Bell className="h-[1.2rem] w-[1.2rem] transition-all hover:text-primary" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] translate-x-1/3 -translate-y-1/3 transition-transform animate-bounce-in"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-80 animate-scale-in">
        <div className="space-y-2">
          <h4 className="font-semibold">Recent Notifications</h4>
          
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications</p>
          ) : (
            <>
              <div className="space-y-2">
                {recentNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="flex justify-between items-start text-sm p-2 -mx-2 rounded-md hover:bg-muted cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={handleViewAll}
                  >
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                size="sm" 
                className="w-full transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0" 
                onClick={handleViewAll}
              >
                View All Notifications
              </Button>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
