import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { authStore } from "../store/authStore";
import { Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";

function SignupPage() {
  const { signup, isLoading } = authStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const trimmedFullName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedFullName) {
      toast.error("Full name is required");
      return false;
    }

    if (!trimmedEmail) {
      toast.error("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Invalid email format");
      return false;
    }

    const emailDomain = trimmedEmail.split("@")[1]?.toLowerCase();
    if (
      ![
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
      ].includes(emailDomain)
    ) {
      toast.error("Email provider not supported");
      return false;
    }

    if (!trimmedPassword) {
      toast.error("Password is required");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        trimmedPassword
      )
    ) {
      toast.error(
        "Enter valid password"
      );
      return false;
    }

    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value.trim(),
                    })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value.trim() })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type="password"
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value.trim(),
                    })
                  }
                />
              </div>

              <div className="flex gap-2 text-xs mt-2 flex-wrap px-6 font-semibold">
                <p
                  className={`${
                    formData.password.length >= 8 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  8+ characters
                </p>
                <p
                  className={`${
                    /[A-Z]/.test(formData.password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Uppercase
                </p>
                <p
                  className={`${
                    /[a-z]/.test(formData.password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Lowercase
                </p>
                <p
                  className={`${
                    /\d/.test(formData.password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Number
                </p>
                <p
                  className={`${
                    /[@$!%*?&]/.test(formData.password)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Special character
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="underline-effect">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default SignupPage;
