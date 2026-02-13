import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../stores";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/owner/login");
  };

  const navItems = [
    { path: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/owner/rooms", label: "Rooms", icon: BedDouble },
    { path: "/owner/bookings", label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-sand">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-ocean text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-accent text-xl">Fatwave</span>
          </NavLink>
          <p className="text-white/60 text-xs mt-1">Owner Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-nav">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-sunny flex items-center justify-center">
              <span className="text-ocean font-bold">
                {admin?.username?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{admin?.username}</p>
              <p className="text-white/60 text-xs">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-nav">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-sand"
            >
              <Menu className="w-6 h-6 text-charcoal" />
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <NavLink to="/" className="hover:text-ocean">
                Home
              </NavLink>
              <ChevronRight className="w-4 h-4" />
              <span className="text-charcoal">Admin</span>
            </div>

            <NavLink
              to="/"
              className="text-sm text-ocean hover:text-sunset transition-colors"
            >
              View Site →
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
