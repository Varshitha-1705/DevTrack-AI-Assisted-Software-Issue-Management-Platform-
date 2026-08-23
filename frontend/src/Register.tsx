import { useState, type FormEvent } from "react";

interface RegisterProps {
  onRegister: () => void;
  onLoginClick: () => void;
}

function Register({ onRegister, onLoginClick }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("developer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok || !data.success) {
        if (
          data.message?.toLowerCase().includes("already") ||
          data.message?.toLowerCase().includes("exists")
        ) {
          setError(
            "An account with this email already exists. Please login instead."
          );
        } else {
          setError(data.message || "Registration failed.");
        }

        return;
      }

      alert("Registration successful! Please login.");

      setName("");
      setEmail("");
      setPassword("");
      setRole("developer");

      onRegister();
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Cannot connect to backend. Make sure your backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 text-white">
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

        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#080808]/95 p-8 shadow-[0_0_80px_rgba(34,197,94,0.08)] backdrop-blur-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            Dev<span className="text-green-400">Track</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            AI-Powered Software Issue Management
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Create account</h2>

          <p className="mt-1 text-sm text-gray-500">
            Register to start using DevTrack
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0b0d0c] px-4 py-3 text-sm text-white outline-none focus:border-green-400/50"
            >
              <option value="developer">Developer</option>
              <option value="tester">Tester</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400 transition-all duration-300 hover:border-green-400/60 hover:bg-green-400/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-medium text-green-400 transition hover:text-green-300"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;