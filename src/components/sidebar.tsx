import { Activity, BarChart2, Calendar, Dumbbell, Home, MessageCircle, Newspaper, Shield, Tags, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { DASHBOARD_ROOT_PATH } from "@/constants"
import { getCurrentUser } from "@/services/auth.service"
import { UserRole } from "@/enums"
import { useMessageStore } from "@/stores/messageStore"
import { Badge } from "./ui/badge"

const UnreadBadge = () => {
  const unreadCount = useMessageStore((state) => state.unreadCount);
  
  if (unreadCount === 0) return null;
  
  return (
    <Badge 
      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white rounded-full"
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
};


interface NavItem {
  to: string;
  title: string;
  icon: JSX.Element;
}

const PATIENT_NAV_ITEMS: NavItem[] = [
  {
    to: "",
    title: "Home",
    icon: <Home />
  },
  {
    to: "exercises",
    title: "Exercises",
    icon: <Dumbbell />
  },
  {
    to: "assessment",
    title: "Assessment",
    icon: <Newspaper />
  },
  {
    to: "chat",
    title: "Chat",
    icon: (
      <div className="relative">
        <MessageCircle />
        <UnreadBadge />
      </div>
    ),
  },
  {
    to: "appointments",
    title: "Appointments",
    icon: <Calendar />
  },
  {
    to: "tracking",
    title: "Tracking",
    icon: <Activity />
  },
]

const DASHBOARD_NAV_ITEMS: NavItem[] = [
  {
    to: "",
    title: "Dashboard",
    icon: <BarChart2 />
  },
  {
    to: "questionnaire",
    title: "Questionnaire",
    icon: <Newspaper />
  },
  {
    to: "chat",
    title: "Chat",
    icon: (
      <div className="relative">
        <MessageCircle />
        <UnreadBadge />
      </div>
    ),
  },
  {
    to: "appointments",
    title: "Appointments",
    icon: <Calendar />
  },
  {
    to: "tracking",
    title: "Tracking",
    icon: <Activity />
  },
];

const ADMIN_NAV_ITEM: NavItem[] = [
  {
    to: "admin",
    title: "Admin",
    icon: <Shield />
  },
  {
    to: "exercises",
    title: "Exercises",
    icon: <Dumbbell />,
  },
  {
    to: "exercise-categories",
    title: "Exercises Categories",
    icon: <Tags />,
  },
]

interface SidebarProps {
  isDoctor?: boolean;
  onNavItemClicked?: () => void;
}


const Sidebar = ({ isDoctor = false, onNavItemClicked }: SidebarProps) => {
  const location = useLocation();
  let navItems = isDoctor ? DASHBOARD_NAV_ITEMS : PATIENT_NAV_ITEMS;
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  if (isAdmin) {
    navItems = [...navItems, ...ADMIN_NAV_ITEM];
  }


  const checkIsSelected = (to: string): boolean => {
    const normalizePath = (path: string): string => path.replace(/\/+$/, ""); // Remove trailing slashes

    const currentPath = normalizePath(location.pathname);
    const rootPath = normalizePath(isDoctor || isAdmin ? `/${DASHBOARD_ROOT_PATH}` : "/");

    if (to === "") {
      // Check if the current path is exactly the root or dashboard root
      return currentPath === rootPath;
    }

    // Check if the current path matches the tab's path or starts with the tab's path
    const pathPrefix = normalizePath(isDoctor || isAdmin ? `/${DASHBOARD_ROOT_PATH}/${to}` : `/${to}`);
    return currentPath.startsWith(pathPrefix);
  }

  return (
    <div className='flex flex-col items-center p-6 gap-3 border-r bg-background w-full'>
      {
        navItems.map((item) => {
          // to make selected tab have color
          const selectedClassname = checkIsSelected(item.to) ? "bg-secondary" : "";

          return (
            <Link to={item.to} className="w-full" key={item.title} onClick={onNavItemClicked}>
              <div className={cn("flex items-center justify-start gap-3 p-3 w-full rounded-lg", selectedClassname)}>
                {item.icon}
                <p>{item.title}</p>
              </div>
            </Link>
          )
        })
      }
    </div>
  )
}

export default Sidebar