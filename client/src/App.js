import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import ClubsPage from "./pages/ClubsPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManageSubAdmins from "./pages/ManageSubAdmins";
import AdminLayout from "./components/AdminLayout";
import ManageClubs from "./pages/ManageClubs";
import ManageEvents from "./pages/ManageEvents";
import ClubDetails from "./pages/ClubDetails";
import EventDetails from "./pages/EventDetails";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "./components/StudentLayout"; // ✅ ADD THIS
import VirtualTourPage from "./pages/VirtualTourPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= STUDENT ROUTES ================= */}
        <Route path="/" element={<StudentLayout />}>
          <Route index element={<ClubsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="clubs" element={<ClubsPage />} />
          <Route path="clubs/:id" element={<ClubDetails />} />
        </Route>

        {/* ── Virtual Tour: top-level route so position:fixed covers full viewport ── */}
        <Route path="/tour" element={<VirtualTourPage />} />


        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* ================= PROTECTED ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subadmins"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ManageSubAdmins />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ManageClubs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ManageEvents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;