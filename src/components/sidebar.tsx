import { BarChart2, Calendar, Users } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { DASHBOARD_ROOT_PATH } from "@/constants"

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

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className='h-full w-60 flex flex-col items-center p-6 gap-3 border-r'>
      {
        DASHBOARD_NAV_ITEMS.map((item) => {
          // to make selected tab have color
          const isDashboardRoot = location.pathname === `/${DASHBOARD_ROOT_PATH}`;
          const isActive = isDashboardRoot && item.to === "" || location.pathname === `/${DASHBOARD_ROOT_PATH}/${item.to}`;
          const selectedClassname = isActive ? "bg-secondary" : "";

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