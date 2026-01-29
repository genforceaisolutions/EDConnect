import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/student/Courses";
import Internships from "./pages/student/Internships";

import Meetings from "./pages/student/Meetings";
import Schemes from "./pages/student/Schemes";
import Roadmap from "./pages/student/Roadmap";
import WebDevelopment from "./pages/student/courses/WebDevelopment";
import MobileDevelopment from "./pages/student/courses/MobileDevelopment";
import DataScience from "./pages/student/courses/DataScience";
import MachineLearning from "./pages/student/courses/MachineLearning";
import CloudComputing from "./pages/student/courses/CloudComputing";
import DevOps from "./pages/student/courses/DevOps";
import Cybersecurity from "./pages/student/courses/Cybersecurity";
import Blockchain from "./pages/student/courses/Blockchain";
import UIUXDesign from "./pages/student/courses/UIUXDesign";
import DigitalMarketing from "./pages/student/courses/DigitalMarketing";
import StudyMaterials from "./pages/student/courses/StudyMaterials";
import NotFound from "./pages/NotFound";
import CourseDetails from './pages/student/CourseDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/student/dashboard" element={
                  <AuthGuard requiredRole="student">
                    <StudentDashboard />
                  </AuthGuard>
                } />
                <Route path="/student/courses" element={
                  <AuthGuard requiredRole="student">
                    <Courses />
                  </AuthGuard>
                } />
                <Route path="/student/courses/:courseTitle" element={<CourseDetails />} />
                <Route path="/student/internships" element={
                  <AuthGuard requiredRole="student">
                    <Internships />
                  </AuthGuard>
                } />
              
                <Route path="/student/meetings" element={
                  <AuthGuard requiredRole="student">
                    <Meetings />
                  </AuthGuard>
                } />
                <Route path="/student/schemes" element={
                  <AuthGuard requiredRole="student">
                    <Schemes />
                  </AuthGuard>
                } />
                <Route path="/student/roadmap" element={
                  <AuthGuard requiredRole="student">
                    <Roadmap />
                  </AuthGuard>
                } />

                <Route path="/student/courses/web-development" element={
                  <AuthGuard requiredRole="student">
                    <WebDevelopment />
                  </AuthGuard>
                } />
                <Route path="/student/courses/mobile-development" element={
                  <AuthGuard requiredRole="student">
                    <MobileDevelopment />
                  </AuthGuard>
                } />
                <Route path="/student/courses/data-science" element={
                  <AuthGuard requiredRole="student">
                    <DataScience />
                  </AuthGuard>
                } />
                <Route path="/student/courses/machine-learning" element={
                  <AuthGuard requiredRole="student">
                    <MachineLearning />
                  </AuthGuard>
                } />
                <Route path="/student/courses/cloud-computing" element={
                  <AuthGuard requiredRole="student">
                    <CloudComputing />
                  </AuthGuard>
                } />
                <Route path="/student/courses/devops" element={
                  <AuthGuard requiredRole="student">
                    <DevOps />
                  </AuthGuard>
                } />
                <Route path="/student/courses/cybersecurity" element={
                  <AuthGuard requiredRole="student">
                    <Cybersecurity />
                  </AuthGuard>
                } />
                <Route path="/student/courses/blockchain" element={
                  <AuthGuard requiredRole="student">
                    <Blockchain />
                  </AuthGuard>
                } />
                <Route path="/student/courses/uiux-design" element={
                  <AuthGuard requiredRole="student">
                    <UIUXDesign />
                  </AuthGuard>
                } />
                <Route path="/student/courses/digital-marketing" element={
                  <AuthGuard requiredRole="student">
                    <DigitalMarketing />
                  </AuthGuard>
                } />
                <Route path="/student/courses/study-materials" element={
                  <AuthGuard requiredRole="student">
                    <StudyMaterials />
                  </AuthGuard>
                } />

                <Route path="/teacher/dashboard" element={
                  <AuthGuard requiredRole="teacher">
                    <TeacherDashboard />
                  </AuthGuard>
                } />
                <Route path="/admin/dashboard" element={
                  <AuthGuard requiredRole="admin">
                    <AdminDashboard />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
