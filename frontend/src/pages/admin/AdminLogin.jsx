import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Waves } from "lucide-react";
import { useAuthStore } from "../../stores";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login(formData);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/owner/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-tropical flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-white">
            <span className="text-4xl">🌊</span>
            <span className="font-accent text-3xl">Fatwave</span>
          </div>
          <p className="text-white/70 mt-2">Owner Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ocean/10 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-ocean" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-charcoal">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-1">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label flex items-center gap-2">
                <Mail className="w-4 h-4 text-ocean" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@fatwavesurfresort.com"
                className="input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Lock className="w-4 h-4 text-ocean" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 spinner border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a
              href="/"
              className="text-sm text-ocean hover:text-sunset transition-colors"
            >
              ← Back to main website
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-sm mt-8">
          © {new Date().getFullYear()} Fatwave Surf Resort
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
