import { BarChart2, Calendar, Dumbbell, Home, MessageCircle, Newspaper, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { DASHBOARD_ROOT_PATH } from "@/constants"

const PATIENT_NAV_ITEMS = [
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
    to : "chat",
    title: "Chat",
    icon: <MessageCircle />
  },
  {
    to: "appointments",
    title: "Appointments",
    icon: <Calendar />
  }
]

const DASHBOARD_NAV_ITEMS = [
  {
    to: "",
    title: "Dashboard",
    icon: <BarChart2 />
  },
  {
    to: "exercises",
    title: "Exercises",
    icon: <Dumbbell />
  },
  {
    to: "questionnaire",
    title: "Questionnaire",
    icon: <Newspaper />
  },
  {
    to : "chat",
    title: "Chat",
    icon: <MessageCircle />
  },
  {
    to: "appointments",
    title: "Appointments",
    icon: <Calendar />
  },

]

interface SidebarProps {
  isDoctor?: boolean;
}

const Sidebar = ({ isDoctor = false }: SidebarProps) => {
  const location = useLocation();
  const navItems = isDoctor ? DASHBOARD_NAV_ITEMS : PATIENT_NAV_ITEMS;

  const checkIsSelected = (to: string): boolean => {
    const normalizePath = (path: string): string => path.replace(/\/+$/, ""); // Remove trailing slashes

    const currentPath = normalizePath(location.pathname);
    const rootPath = normalizePath(isDoctor ? `/${DASHBOARD_ROOT_PATH}` : "/");
    
    if (to === "") {
      // Check if the current path is exactly the root or dashboard root
      return currentPath === rootPath;
    }

    // Check if the current path matches the tab's path or starts with the tab's path
    const pathPrefix = normalizePath(isDoctor ? `/${DASHBOARD_ROOT_PATH}/${to}` : `/${to}`);
    return currentPath.startsWith(pathPrefix);
  }

  return (
    <div className='h-full w-60 flex flex-col items-center p-6 gap-3 border-r fixed mt-16 bg-background'>
      {
        navItems.map((item) => {
          // to make selected tab have color
          const selectedClassname = checkIsSelected(item.to) ? "bg-secondary" : "";

          return (
            <Link to={item.to} className="w-full" key={item.title}>
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