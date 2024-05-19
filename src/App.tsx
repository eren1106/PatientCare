import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PatientHomePage from './pages/patient/PatientHomePage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import { ThemeProvider } from './components/theme-provider';
import Topbar from "./components/topbar";
import Footer from "./components/footer";
import PatientListPage from "./pages/doctor/PatientListPage";
import Sidebar from "./components/sidebar";
import AppointmentPage from "./pages/doctor/AppointmentPage";
import { DASHBOARD_ROOT_PATH } from "./constants";
import ExercisesPage from "./pages/patient/exercise/ExercisesPage";
import ExerciseDetailPage from "./pages/patient/exercise/ExerciseDetailPage";

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
      <Sidebar isDoctor />
      <div className="container p-6">
        <Outlet />
      </div>
    </div>
  )
}

const PatientWrapper = () => {
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
        element: <PatientWrapper />,
        children: [
          {
            path: "",
            element: <PatientHomePage />,
          },
          {
            path: "exercises",
            children: [
              {
                path: "",
                element: <ExercisesPage />,
              },
              {
                path: ":id",
                element: <ExerciseDetailPage />,
              }
            ]
          },
          {
            path: "appointments",
            element: <AppointmentPage />,
          },
        ]
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
