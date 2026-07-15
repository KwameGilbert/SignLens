import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formValidationError, setFormValidationError] = useState("");
  
  const navigate = useNavigate();
  const { loginAsync, isLoggingIn, loginError } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormValidationError("");

    // Simple client-side validation
    if (!email.trim() || !password) {
      setFormValidationError("Please fill in all fields.");
      return;
    }

    try {
      await loginAsync({ email, password });
      navigate("/dashboard");
    } catch (err) {
      // Error is already captured by useAuth's loginError, but catching prevents unhandled promise rejection warnings.
      console.error("Login failed:", err);
    }
  };

  // Safe extraction of error message from backend
  const displayError = formValidationError || 
    (loginError?.response?.data?.message || loginError?.message);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080B11] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Background Decorative Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[100px] animate-float-blob pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] animate-float-blob-reverse pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md glass-panel p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.4)] border border-white/5 space-y-8 backdrop-blur-xl">
        {/* Branding & Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 glow-orange">
            {/* Custom Glowing Hands / Lens SignLens Logo */}
            <svg className="w-9 h-9 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-md -z-10" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              SignLens <span className="text-primary">Admin</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to platform management console
            </p>
          </div>
        </div>

        {/* Form and Submission UI */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Error Message Box */}
          {displayError && (
            <div className="flex items-center space-x-3 p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm animate-shake">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email-address" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Mail className="w-4 h-4" />
                </span>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@signlens.com"
                  className="pl-10"
                  value={email}
                  disabled={isLoggingIn}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  disabled={isLoggingIn}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={isLoggingIn}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 glow-orange active:scale-[0.98] transition-transform duration-100 font-semibold"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
