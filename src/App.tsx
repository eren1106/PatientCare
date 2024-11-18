import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PatientHomePage from './pages/patient/home/PatientHomePage';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import { ThemeProvider } from './providers/theme-provider';
import Topbar from "./components/topbar";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import AppointmentPage from "./pages/doctor/AppointmentPage";
import { DASHBOARD_ROOT_PATH } from "./constants";
import PatientExercisesPage from "./pages/patient/exercise/PatientExercisesPage";
import PatientExerciseDetailPage from "./pages/patient/exercise/PatientExerciseDetailPage";
import PatientAssessmentPage from "./pages/patient/assessment/PatientAssessmentPage";
import PatientDetailPage from "./pages/doctor/PatientDetailPage";
import { Toaster } from "@/components/toaster";
import ExercisesPage from "./pages/doctor/exercises/ExercisesPage";
import ExerciseDetailPage from "./pages/doctor/exercises/ExerciseDetailPage";
import QuestionnairePage from "./pages/doctor/questionnaire/QuestionnairePage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import QuestionnaireDetailsPage from "./pages/doctor/questionnaire/QuestionnaireDetailsPage";
import CreateQuestionnaireForm from "./pages/doctor/questionnaire/CreateQuestionnaireForm";
import { ChatLayout } from "./pages/chat/chat-layout";
import IncomingCall from "./pages/chat/call/incoming-call";
import RegisterPage from "./pages/auth/RegisterPage";
import { getCurrentUser } from "./services/auth.service";
import { UserRole } from "./enums";
import QuestionnaireResult from "./pages/doctor/questionnaire/QuestionnaireResult";
import AssessmentDetailPage from "./pages/patient/assessment/AssessmentDetailPage";
import TrackingPage from "./pages/patient/tracking/TrackingPage";
import AdminPage from "./pages/admin/AdminPage";
import AuthGuard from "./pages/admin/components/AuthGuard";
import DoctorTrackingPage from "./pages/doctor/tracking/DoctorTrackingPage";

const AppWrapper = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
      <Toaster />
      <IncomingCall />
    </div>
  )
}

const MainWrapper = ({ isDoctor = false  }: { isDoctor?: boolean }) => {
  const currentUser = getCurrentUser();
  if (isDoctor) {
    if (!currentUser) return <Navigate to="/auth/login" />;
    if (currentUser.role === UserRole.PATIENT) return <Navigate to="/" />;
    //if (currentUser.role === UserRole.ADMIN) return <Navigate to="/dashboard" />;
  }
  else { // patient
    if (!currentUser) return <Navigate to="/auth/login" />;
    if (currentUser.role === UserRole.DOCTOR) return <Navigate to="/dashboard" />;
    if (currentUser.role === UserRole.ADMIN) return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Topbar />
      <div className='h-full w-56 fixed mt-16 hidden md:flex'>
        <Sidebar isDoctor={isDoctor} />
      </div>
      <div className='flex-1 p-8 ml-0 md:ml-56 mt-8 md:mt-16 bg-secondary/50'>
        <Outlet />
      </div >
      <Footer />
    </>
  )
}

export const AuthWrapper = () => {
  return (
    <div className='w-screen h-screen bg-cyan-500 flex flex-col items-center justify-center p-3'>
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  // PATIENT ROUTES
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        path: "",
        element: <MainWrapper />,
        children: [
          {
            path: "",
            element: <PatientHomePage />,
          },
          {
            path: "chat",
            children: [
              {
                path: "",
                element: <ChatLayout />
              }
            ]
          },
          {
            path: "exercises",
            children: [
              {
                path: "",
                element: <PatientExercisesPage />,
              },
              {
                path: ":id",
                element: <PatientExerciseDetailPage />,
              }
            ]
          },
          {
            path: "appointments",
            element: <AppointmentPage isDoctor={false} />,
          },
          {
            path: "assessment",
            children : [
              {
                path : "",
                element : <PatientAssessmentPage />
              },
              {
                path : ":id",
                element : <AssessmentDetailPage />
              }
            ],
          },
          {
            path: "tracking",
            element: <TrackingPage />
          },
          {
            path: "profile/:id",
            element: <PatientProfilePage />
          }
        ]
      },

      

      // DOCTOR DASHBOARD ROUTES
      {
        path: DASHBOARD_ROOT_PATH,
        element: <MainWrapper isDoctor/>,
        children: [
          {
            path: "",
            element: <DoctorDashboardPage />,
          },
          {
            path: "chat",
            children: [
              {
                path: "",
                element: <ChatLayout />
              }
            ]
          },
          {
            path: "questionnaire",
            children: [
              {
                path: "",
                element: <QuestionnairePage />,
              },
              {
                path: ":id",
                element: <QuestionnaireDetailsPage />
              },
              {
                path: "create",
                element: <CreateQuestionnaireForm />
              },
              {
                path: "result/:id",
                element: <QuestionnaireResult />
              }
            ]


          },
          {
            path: "patients/:recordId",
            element: <PatientDetailPage />,
          },
          {
            path: "exercises",
            children: [
              {
                path: "",
                element: <ExercisesPage />
              },
              {
                path: ":id",
                element: <ExerciseDetailPage />
              }
            ]
          },
          {
            path: "appointments",
            element: <AppointmentPage />
          },
          {
            path: "tracking",
            element: <DoctorTrackingPage />
          },
          {
            path: "profile/:id",
            element: <DoctorProfilePage />
          },

          // Admin Page
          {
            path: "admin",
            element: (
              <AuthGuard requiredRole={UserRole.ADMIN}>
                <AdminPage />
              </AuthGuard>
            ),
          }
        ]
      },


      // AUTH
      {
        path: "auth",
        element: <AuthWrapper />,
        children: [
          {
            path: "login",
            element: <LoginPage />
          },
          {
            path: "register",
            element: <RegisterPage />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
