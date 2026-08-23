import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);

      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">

      {/* Background particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className={`particle ${i % 4 === 0 ? "white" : ""}`}
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
              animationDelay: `${(i % 7) * 0.8}s`,
              animationDuration: `${4 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-3xl border border-white/10 bg-white/4 p-8 shadow-2xl backdrop-blur-2xl">

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">
              Dev<span className="text-green-400">Track</span>
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              AI-Powered Software Issue Management
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to continue to DevTrack
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50 focus:bg-white/6"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50 focus:bg-white/6"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400 transition-all duration-300 hover:border-green-400/60 hover:bg-green-400/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Login;