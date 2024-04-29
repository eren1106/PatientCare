import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';

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
      <RouterProvider router={router} />
    </>
  )
}

export default App
