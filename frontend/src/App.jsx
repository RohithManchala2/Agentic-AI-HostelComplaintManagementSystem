import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyComplaints from "./pages/student/MyComplaints";
import NewComplaint from "./pages/student/NewComplaint";



import WardenLayout from "./layouts/WardenLayout";
import WardenDashboard from "./pages/warden/WardenDashboard";
import WardenAllComplaints from "./pages/warden/WardenAllComplaints";
import TechnicianManagement from "./pages/warden/TechnicianManagement";

import TechnicianLayout from "./layouts/TechnicianLayout";
import TechnicianDashboard from "./pages/technician/TechnicianDashboard";
import MyTasks from "./pages/technician/MyTasks";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="newcomplaints" element={<NewComplaint />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Warden"]} />}>
          <Route path="/warden" element={<WardenLayout />}>
            <Route index element={<WardenDashboard />} />
            <Route path="complaints" element={<WardenAllComplaints />} />
            <Route path="technicians" element={<TechnicianManagement />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Technician"]} />}>
          <Route path="/technician" element={<TechnicianLayout />}>
            <Route index element={<TechnicianDashboard />} />
            <Route path="tasks" element={<MyTasks />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
