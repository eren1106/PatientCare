import { BarChart2, Calendar, Dumbbell, Home, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
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
    to: "patients",
    title: "Patient",
    icon: <Users />
  },
  {
    to: "appointments",
    title: "Appointments",
    icon: <Calendar />
  }
]

interface SidebarProps {
  isDoctor?: boolean;
}

const Sidebar = ({ isDoctor=false }: SidebarProps) => {
  const location = useLocation();
  const navItems = isDoctor ? DASHBOARD_NAV_ITEMS : PATIENT_NAV_ITEMS;
  const checkIsSelected = (to: string): boolean => {
    if (isDoctor) {
      const isDashboardRoot = location.pathname === `/${DASHBOARD_ROOT_PATH}`;
      return isDashboardRoot && to === "" || location.pathname === `/${DASHBOARD_ROOT_PATH}/${to}`;
    }
    return location.pathname === `/${to}` || (location.pathname === to && to==="")
  }

  return (
    <div className='h-full w-60 flex flex-col items-center p-6 gap-3 border-r'>
      {
        navItems.map((item) => {
          // to make selected tab have color
          const selectedClassname = checkIsSelected(item.to) ? "bg-secondary" : "";

          return (
            <Link to={item.to} className="w-full">
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