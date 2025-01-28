import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ChevronLeftIcon,
  ClipboardList,
  Upload,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getRole, getUser, logout } from "@/lib/auth";
import { useNotices } from "@/services/notice.service";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { getUnreadNoticesCount } = useNotices();

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadNoticesCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds

    window.addEventListener("noticeViewed", fetchUnreadCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("noticeViewed", fetchUnreadCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsSidebarOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("fixed bottom-4 right-4 z-50 md:hidden")}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <ChevronLeftIcon className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </Button>

      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300",
          "w-[240px]",
          !isSidebarOpen && "-translate-x-full",
          "border-r flex flex-col"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-3 border-b justify-center">
            <span className="font-bold text-lg text-green-600">
              LearnHill LMS
            </span>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <div className="space-y-1 px-3">
              <Link
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/courses"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <LayoutDashboardIcon className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link
                to="/notices"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground relative"
              >
                <ClipboardList className="h-4 w-4" />
                <span>Notice Board</span>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              {user && getRole() === 2 && (
                <Link
                  to="/users/bulk-upload"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Upload className="h-4 w-4" />
                  <span>Bulk User Upload</span>
                </Link>
              )}
            </div>
          </div>

          {user && (
            <div className="sticky bottom-0 border-t bg-background p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-3 p-0 h-auto"
                  >
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="User"
                      />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" side="top">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
