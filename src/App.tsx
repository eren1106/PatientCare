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
import PatientQuestionnairePage from "./pages/patient/questionnaire/PatientQuestionnairePage";
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

const AppWrapper = () => {

  return (
    // <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Outlet />
        <Toaster />
        <IncomingCall/>

      </div>
    // </AuthProvider>
  )
}

const MainWrapper = ({ isDoctor = false }: { isDoctor?: boolean }) => {
  const currentUser = getCurrentUser();
  if (isDoctor) {
    if (!currentUser) return <Navigate to="/auth/login" />;
    if (currentUser.role === UserRole.PATIENT) return <Navigate to="/" />;
    if (currentUser.role === UserRole.ADMIN) return <Navigate to="/admin" />;
  }
  else { // patient
    if (!currentUser) return <Navigate to="/auth/login" />;
    if (currentUser.role === UserRole.DOCTOR) return <Navigate to="/dashboard" />;
    if (currentUser.role === UserRole.ADMIN) return <Navigate to="/admin" />;
  }

  return (
    <>
      <Topbar />
      <Sidebar isDoctor={isDoctor} />
      <div className='flex-1 p-8 ml-60 mt-16'>
        <Outlet />
      </div >
      <Footer />
    </>
  )
}

export const AuthWrapper = () => {
  return (
    <div className='w-screen h-screen bg-cyan-500 flex flex-col items-center justify-center'>
      <Outlet />
    </div>
  )
}

// const DoctorDashboardWrapper = () => {
//   return (
//     <div className="flex">
//       <Sidebar isDoctor />
//       <div className="container p-6">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

// const PatientWrapper = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="container p-6">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

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
            path : "chat" ,
            children : [
              {
                path: "",
                element : <ChatLayout />
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
            path: "questionnaire/:id",
            element: <PatientQuestionnairePage />
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
        element: <MainWrapper isDoctor />,
        children: [
          {
            path: "",
            element: <DoctorDashboardPage />,
          },
          {
            path : "chat" ,
            children : [
              {
                path: "",
                element : <ChatLayout />
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
            path: "profile/:id",
            element: <DoctorProfilePage />
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
