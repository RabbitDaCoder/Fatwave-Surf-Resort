import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import BookingLookup from "./pages/BookingLookup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DiningBar from "./pages/DiningBar";
import Events from "./pages/Events";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageBookings from "./pages/admin/ManageBookings";
import RoomForm from "./pages/admin/RoomForm";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import LiveSupport from "./components/LiveSupport";

function App() {
  return (
    <Router>
      <LiveSupport />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "Open Sans, sans-serif",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetails />} />
          <Route path="/checkout/:slug" element={<Checkout />} />
          <Route
            path="/booking/success/:bookingReference"
            element={<BookingSuccess />}
          />
          <Route path="/booking/lookup" element={<BookingLookup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dining" element={<DiningBar />} />
          <Route path="/events" element={<Events />} />
        </Route>

        {/* Owner Routes */}
        <Route path="/owner/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/owner" element={<Dashboard />} />
            <Route path="/owner/dashboard" element={<Dashboard />} />
            <Route path="/owner/rooms" element={<ManageRooms />} />
            <Route path="/owner/rooms/new" element={<RoomForm />} />
            <Route path="/owner/rooms/edit/:id" element={<RoomForm />} />
            <Route path="/owner/bookings" element={<ManageBookings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
