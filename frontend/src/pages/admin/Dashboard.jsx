import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import {
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Clock,
  BedDouble,
  Users,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import { useAdminStore } from "../../stores";
import Loading from "../../components/Loading";

const Dashboard = () => {
  const { dashboardStats, isLoading, fetchDashboard } = useAdminStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !dashboardStats) {
    return <Loading />;
  }

  const { stats, recentBookings, statusBreakdown, categoryBreakdown } =
    dashboardStats;

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "bg-ocean",
      change: `${stats.monthlyBookings} this month`,
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
      change: `${formatCurrency(stats.monthlyRevenue)} this month`,
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      icon: TrendingUp,
      color: "bg-sunset",
      change: `Today's rate`,
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "bg-amber-500",
      change: "Require attention",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "cancelled":
        return "badge-error";
      case "completed":
        return "badge-ocean";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-charcoal">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening at Fatwave.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-charcoal mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-charcoal">
                Recent Bookings
              </h2>
              <NavLink
                to="/owner/bookings"
                className="text-sm text-ocean hover:text-sunset flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </NavLink>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Confirmation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-sand/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-ocean">
                          {booking.confirmationNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-charcoal">
                            {booking.guestName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.guestEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {booking.room?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Status Breakdown */}
          <div className="card p-6">
            <h3 className="font-heading font-bold text-charcoal mb-4">
              Booking Status
            </h3>
            <div className="space-y-3">
              {Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status === "confirmed"
                          ? "bg-green-500"
                          : status === "pending"
                            ? "bg-amber-500"
                            : status === "cancelled"
                              ? "bg-red-500"
                              : "bg-ocean"
                      }`}
                    />
                    <span className="text-gray-600 capitalize">{status}</span>
                  </div>
                  <span className="font-medium text-charcoal">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card p-6">
            <h3 className="font-heading font-bold text-charcoal mb-4">
              By Room Category
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600 capitalize">
                    {cat._id?.replace("-", " ") || "Unknown"}
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-charcoal">
                      {cat.count} bookings
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(cat.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-heading font-bold text-charcoal mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <NavLink
                to="/owner/rooms/new"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-sand transition-colors"
              >
                <BedDouble className="w-5 h-5 text-ocean" />
                <span>Add New Room</span>
              </NavLink>
              <NavLink
                to="/owner/bookings?status=pending"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-sand transition-colors"
              >
                <Clock className="w-5 h-5 text-amber-500" />
                <span>View Pending Bookings</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
