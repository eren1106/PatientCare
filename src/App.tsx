import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/doctor",
    element: <DoctorDashboardPage />,
  },
]);


function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
