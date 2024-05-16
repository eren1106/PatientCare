import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import { ThemeProvider } from './components/theme-provider';
import Topbar from "./components/topbar";
import Footer from "./components/footer";
import PatientListPage from "./pages/PatientListPage";
import Sidebar from "./components/sidebar";
import AppointmentPage from "./pages/AppointmentPage";
import { DASHBOARD_ROOT_PATH } from "./constants";

const MainWrapper = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Topbar />
      <div className='flex-1 flex flex-col items-center pt-16'>
        <main className='w-full'>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

const DoctorDashboardWrapper = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container p-6">
        <Outlet />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainWrapper />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: DASHBOARD_ROOT_PATH,
        element: <DoctorDashboardWrapper />,
        children: [
          {
            path: "",
            element: <DoctorDashboardPage />,
          },
          {
            path: "patients",
            element: <PatientListPage />,
          },
          {
            path: "appointments",
            element: <AppointmentPage />
          }
        ]
      },
    ]
  }
]);

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
