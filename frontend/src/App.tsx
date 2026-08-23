import { useEffect, useState, type FormEvent } from "react";
import Login from "./Login";
import Register from "./Register";

interface AIAnalysis {
  category: string;
  severity: string;
  priority: string;
  suggestedTeam: string;
  suggestedAction: string;
  analyzedAt?: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  priority: string;
  status: string;
  assignedTo: string | null;
  aiAnalysis: AIAnalysis | null;
  createdAt?: string;
  updatedAt?: string;
}

type AuthMode = "login" | "register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "bug",
    severity: "medium",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTickets([]);
    setSelectedTicket(null);
    setAuthMode("login");
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tickets",
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTickets();
    }
  }, [isLoggedIn]);

  const handleCreateTicket = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please enter title and description.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/tickets",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(form),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to create ticket.");
        return;
      }

      setTickets((prev) => [data.ticket, ...prev]);

      setForm({
        title: "",
        description: "",
        category: "bug",
        severity: "medium",
      });

      setShowCreateModal(false);
    } catch (error) {
      console.error("Create ticket error:", error);
      alert("Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeTicket = async (ticket: Ticket) => {
    try {
      setAnalyzing(true);

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticket._id}/analyze`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();

      console.log("AI response:", data);

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "AI analysis failed. Please check the backend."
        );
        return;
      }

      const analysis: AIAnalysis =
        data.analysis || data.ticket?.aiAnalysis;

      if (!analysis) {
        alert("AI analysis response was empty.");
        return;
      }

      const updatedTicket: Ticket = {
        ...ticket,
        aiAnalysis: analysis,
        category: analysis.category || ticket.category,
        severity: analysis.severity || ticket.severity,
        priority: analysis.priority || ticket.priority,
        assignedTo:
          analysis.suggestedTeam || ticket.assignedTo,
      };

      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticket._id ? updatedTicket : t
        )
      );

      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error("AI analysis error:", error);

      alert(
        "Unable to connect to AI service. Make sure your backend and AI service are running."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const updateTicket = async (
    ticketId: string,
    updates: Partial<Ticket>
  ) => {
    try {
      setUpdating(true);

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update ticket.");
        return;
      }

      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === ticketId ? data.ticket : ticket
        )
      );

      setSelectedTicket(data.ticket);
    } catch (error) {
      console.error("Update ticket error:", error);
      alert("Failed to update ticket.");
    } finally {
      setUpdating(false);
    }
  };

  const deleteTicket = async (ticketId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete ticket.");
        return;
      }

      setTickets((prev) =>
        prev.filter((ticket) => ticket._id !== ticketId)
      );

      setSelectedTicket(null);
    } catch (error) {
      console.error("Delete ticket error:", error);
      alert("Failed to delete ticket.");
    }
  };

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  const progressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "high" ||
      ticket.priority === "urgent"
  ).length;

  const resolutionRate =
    totalTickets > 0
      ? Math.round((resolvedTickets / totalTickets) * 100)
      : 0;

  if (!isLoggedIn) {
    if (authMode === "login") {
      return (
        <Login
          onLogin={() => setIsLoggedIn(true)}
          onRegisterClick={() => setAuthMode("register")}
        />
      );
    }

    return (
      <Register
        onRegister={() => setAuthMode("login")}
        onLoginClick={() => setAuthMode("login")}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background particles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className={`particle ${i % 3 === 0 ? "white" : ""}`}
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

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">

        {/* NAVBAR */}
        <nav className="mb-12 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 shadow-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold">
              Dev<span className="text-green-400">Track</span>
            </h1>

            <p className="text-sm text-gray-500">
              AI-Powered Software Issue Management
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-400/20"
            >
              Logout
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl border border-green-400/30 bg-green-400/10 px-5 py-2.5 text-sm font-medium text-green-400 transition-all duration-300 hover:border-green-400/60 hover:bg-green-400/20 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]"
            >
              + Create Ticket
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-green-400">
            Software Intelligence
          </p>

          <h2 className="text-5xl font-bold tracking-tight md:text-6xl">
            Track. Analyze.
            <br />
            <span className="text-green-400">Resolve.</span>
          </h2>

          <p className="mt-5 max-w-xl text-gray-500">
            Manage software issues, prioritize bugs and let AI help
            your engineering team resolve problems faster.
          </p>
        </section>

        {/* =========================
            MONITORING DASHBOARD
        ========================= */}

        <section className="mb-10 grid gap-4 md:grid-cols-5">

          <StatCard
            label="Total Tickets"
            value={totalTickets}
          />

          <StatCard
            label="Open"
            value={openTickets}
          />

          <StatCard
            label="In Progress"
            value={progressTickets}
          />

          <StatCard
            label="Resolved"
            value={resolvedTickets}
          />

          <StatCard
            label="High Priority"
            value={highPriorityTickets}
          />

        </section>

        {/* RESOLUTION RATE */}

        <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Resolution Rate
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {resolutionRate}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-600">
                Resolved / Total
              </p>

              <p className="mt-1 text-sm text-green-400">
                {resolvedTickets} / {totalTickets}
              </p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-700"
              style={{
                width: `${resolutionRate}%`,
              }}
            />
          </div>
        </section>

        {/* RECENT TICKETS */}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">
                Recent Tickets
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your software issues at a glance
              </p>
            </div>

            <button
              onClick={fetchTickets}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 transition hover:border-green-400/30 hover:text-green-400"
            >
              Refresh
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-16 text-center backdrop-blur-2xl">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-2xl text-green-400">
                +
              </div>

              <h4 className="text-xl font-semibold">
                No tickets yet
              </h4>

              <p className="mt-2 text-sm text-gray-500">
                Create your first software issue to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <button
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="group w-full rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-left backdrop-blur-xl transition-all duration-300 hover:border-green-400/30 hover:bg-white/5 hover:shadow-[0_10px_40px_rgba(34,197,94,0.05)]"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <h4 className="text-lg font-semibold transition-colors group-hover:text-green-400">
                        {ticket.title}
                      </h4>

                      <p className="mt-2 text-sm text-gray-500">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-start gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                        {ticket.category}
                      </span>

                      <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs text-red-400">
                        {ticket.severity}
                      </span>

                      <span className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs text-green-400">
                        {ticket.status}
                      </span>

                      {ticket.priority && (
                        <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400">
                          {ticket.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-gray-600">
          DevTrack • AI-Powered Software Issue Management
        </footer>
      </main>

      {/* CREATE TICKET MODAL */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#080a09]/95 p-7 shadow-[0_0_80px_rgba(34,197,94,0.08)] backdrop-blur-2xl">

            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                  New Issue
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Create Ticket
                </h2>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:border-red-400/30 hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateTicket}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Login button not working"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="Describe the issue..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-green-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0d0c] px-4 py-3 text-sm text-white outline-none focus:border-green-400/50"
                  >
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="security">Security</option>
                    <option value="performance">
                      Performance
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    Severity
                  </label>

                  <select
                    value={form.severity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        severity: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0d0c] px-4 py-3 text-sm text-white outline-none focus:border-green-400/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400 transition hover:bg-green-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS MODAL */}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#080a09]/95 p-7 shadow-[0_0_100px_rgba(34,197,94,0.08)] backdrop-blur-2xl">

            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-green-400">
                  Ticket Details
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  {selectedTicket.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:border-red-400/30 hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                Description
              </p>

              <p className="leading-7 text-gray-300">
                {selectedTicket.description}
              </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <InfoCard
                label="Category"
                value={selectedTicket.category}
              />

              <InfoCard
                label="Severity"
                value={selectedTicket.severity}
              />

              <InfoCard
                label="Priority"
                value={
                  selectedTicket.priority || "Not assigned"
                }
              />

              <InfoCard
                label="Status"
                value={selectedTicket.status}
              />
            </div>

            {/* AI ANALYSIS */}

            <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-400/[0.035] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-green-400">
                    Artificial Intelligence
                  </p>

                  <h3 className="mt-1 text-xl font-semibold">
                    AI Analysis
                  </h3>
                </div>

                <button
                  onClick={() =>
                    analyzeTicket(selectedTicket)
                  }
                  disabled={analyzing}
                  className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-400 transition hover:bg-green-400/20 disabled:opacity-50"
                >
                  {analyzing ? "Analyzing..." : "🤖 Analyze"}
                </button>
              </div>

              {selectedTicket.aiAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">
                      Suggested Team
                    </p>

                    <p className="mt-1 text-green-400">
                      {selectedTicket.aiAnalysis.suggestedTeam}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Suggested Action
                    </p>

                    <p className="mt-1 leading-6 text-gray-300">
                      {
                        selectedTicket.aiAnalysis
                          .suggestedAction
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <InfoCard
                      label="AI Category"
                      value={
                        selectedTicket.aiAnalysis.category
                      }
                    />

                    <InfoCard
                      label="AI Severity"
                      value={
                        selectedTicket.aiAnalysis.severity
                      }
                    />

                    <InfoCard
                      label="AI Priority"
                      value={
                        selectedTicket.aiAnalysis.priority
                      }
                    />
                  </div>

                  {selectedTicket.aiAnalysis.analyzedAt && (
                    <p className="text-xs text-gray-600">
                      Analyzed:{" "}
                      {new Date(
                        selectedTicket.aiAnalysis.analyzedAt
                      ).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-center">
                  <p className="text-sm text-gray-500">
                    This ticket has not been analyzed yet.
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    Click Analyze to let DevTrack AI inspect
                    the issue.
                  </p>
                </div>
              )}
            </div>

            {/* STATUS + TEAM */}

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Status
                </label>

                <select
                  value={selectedTicket.status}
                  disabled={updating}
                  onChange={(e) =>
                    updateTicket(selectedTicket._id, {
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#0b0d0c] px-4 py-3 text-sm text-white outline-none focus:border-green-400/50"
                >
                  <option value="open">Open</option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Assigned Team
                </label>

                <select
                  value={selectedTicket.assignedTo || ""}
                  disabled={updating}
                  onChange={(e) =>
                    updateTicket(selectedTicket._id, {
                      assignedTo:
                        e.target.value || null,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#0b0d0c] px-4 py-3 text-sm text-white outline-none focus:border-green-400/50"
                >
                  <option value="">Unassigned</option>

                  <option value="Frontend Engineering">
                    Frontend Engineering
                  </option>

                  <option value="Backend Engineering">
                    Backend Engineering
                  </option>

                  <option value="DevOps">DevOps</option>

                  <option value="Security">Security</option>

                  <option value="QA Engineering">
                    QA Engineering
                  </option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="flex justify-between border-t border-white/10 pt-6">
              <button
                onClick={() =>
                  deleteTicket(selectedTicket._id)
                }
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm text-red-400 transition hover:bg-red-400/20"
              >
                🗑 Delete Ticket
              </button>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-400/30 hover:bg-white/5 hover:shadow-[0_10px_40px_rgba(34,197,94,0.08)]">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-semibold">
        {value}
      </p>

      <div className="mt-5 h-0.5 w-8 bg-green-400 transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

/* =========================
   INFO CARD
========================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}

export default App;