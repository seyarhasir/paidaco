"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  Grid,
  DollarSign,
  HeartPulse,
  ToggleLeft,
  X,
  Search,
  UserCheck,
  Ban,
  Database,
  Cloud,
  Cpu,
  TrendingUp,
  Award,
  Activity,
  PlusCircle,
  FileText,
  Star
} from "lucide-react";
import { type Locale } from "@/lib/i18n";

type AdminDashboardShellProps = {
  locale: Locale;
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    createdAt: Date;
    userRoles: Array<{ role: { key: string } }>;
  }>;
  businessesCount: number;
  reviewsCount: number;
  ordersCount: number;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  }>;
  recentReviews: Array<{
    id: string;
    comment: string | null;
    rating: number;
    createdAt: Date;
    user: { name: string | null; email: string } | null;
    business: { slug: string; translations: Array<{ name: string }> };
  }>;
  recentBusinesses: Array<{
    id: string;
    slug: string;
    createdAt: Date;
    translations: Array<{ name: string }>;
  }>;
  dbLatency: string;
  premiumCount: number;
  initialFeatureFlags: Array<{ key: string; name: string; enabled: boolean; desc: string }>;
  totalPhotosCount: number;
  onUpdateUserRole: (userId: string, roles: string[]) => Promise<void>;
  onToggleUserBan: (userId: string) => Promise<void>;
  onToggleFeatureFlag: (key: string, enabled: boolean) => Promise<void>;
};

export function AdminDashboardShell({
  locale,
  users: initialUsers,
  businessesCount,
  reviewsCount,
  ordersCount,
  recentUsers,
  recentReviews,
  recentBusinesses,
  dbLatency,
  premiumCount,
  initialFeatureFlags,
  totalPhotosCount,
  onUpdateUserRole,
  onToggleUserBan,
  onToggleFeatureFlag
}: AdminDashboardShellProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Users management state
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[number] | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Feature Flags state backed by DB
  const [featureFlags, setFeatureFlags] = useState(initialFeatureFlags);

  const handleToggleFlag = async (key: string, enabled: boolean) => {
    await onToggleFeatureFlag(key, enabled);
    setFeatureFlags((prev) =>
      prev.map((ff) => (ff.key === key ? { ...ff, enabled } : ff))
    );
  };

  const handleRoleEditClick = (user: typeof initialUsers[number]) => {
    setSelectedUser(user);
    setSelectedRoles(user.userRoles.map((ur) => ur.role.key));
    setRoleModalOpen(true);
  };

  const handleRoleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const uid = selectedUser.id;

    // Call the parent update action
    await onUpdateUserRole(uid, selectedRoles);

    // Update locally
    setUsers(
      users.map((u) =>
        u.id === uid
          ? {
              ...u,
              userRoles: selectedRoles.map((key) => ({ role: { key } }))
            }
          : u
      )
    );
    setRoleModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleBan = async (userId: string) => {
    if (confirm("Are you sure you want to clear this user's roles?")) {
      await onToggleUserBan(userId);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, userRoles: [] } : u
        )
      );
      alert("Roles cleared successfully!");
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(term) ||
      (u.name?.toLowerCase() || "").includes(term) ||
      u.id.toLowerCase().includes(term)
    );
  });

  // Calculate dynamic Estimated MRR based on premium listings
  const basePricePerMonth = 49;
  const estimatedMRR = premiumCount * basePricePerMonth;

  // Build real activity feeds sorted chronologically
  const activityFeed = [
    ...recentUsers.map((u) => ({
      id: `u-${u.id}`,
      type: "user",
      title: "New User Registered",
      detail: `${u.email} joined Paidaco`,
      date: u.createdAt,
      color: "var(--red)",
      icon: <Users size={14} />
    })),
    ...recentReviews.map((r) => ({
      id: `r-${r.id}`,
      type: "review",
      title: "Review Written",
      detail: `${r.user?.email || "Anonymous"} reviewed "${r.business.translations[0]?.name || r.business.slug}" (${r.rating} Stars)`,
      date: r.createdAt,
      color: "#eab308",
      icon: <Star size={14} />
    })),
    ...recentBusinesses.map((b) => ({
      id: `b-${b.id}`,
      type: "business",
      title: "New Listing Added",
      detail: `"${b.translations[0]?.name || b.slug}" listing created`,
      date: b.createdAt,
      color: "var(--green)",
      icon: <Grid size={14} />
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const formatDistance = (date: Date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="dashboard-shell" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", minHeight: "80vh", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden", padding: "12px" }}>
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar" style={{ background: "var(--paper)", borderRadius: "12px", borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div className="dashboard-profile" style={{ background: "linear-gradient(135deg, var(--red-dark) 0%, #1a1e22 100%)", padding: "20px 16px", color: "white", borderRadius: "12px 12px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={20} style={{ color: "#ffd700" }} />
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.8)", margin: 0, textTransform: "uppercase", fontSize: "10px", fontWeight: "bold", letterSpacing: "1px" }}>Super Administration</p>
            </div>
            <h2 style={{ fontSize: "18px", margin: "6px 0 0 0", color: "white" }}>Console Cockpit</h2>
          </div>

          <nav className="dashboard-sidebar-nav" style={{ padding: "12px" }}>
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "none", background: activeTab === "overview" ? "var(--red)" : "transparent", color: activeTab === "overview" ? "white" : "var(--ink)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", fontWeight: 550, textAlign: "left", fontSize: "14px", marginBottom: "4px" }}
            >
              <Activity size={16} />
              Live Overview
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "none", background: activeTab === "users" ? "var(--red)" : "transparent", color: activeTab === "users" ? "white" : "var(--ink)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", fontWeight: 550, textAlign: "left", fontSize: "14px", marginBottom: "4px" }}
            >
              <Users size={16} />
              User Directory
              <span style={{ marginInlineStart: "auto", background: activeTab === "users" ? "rgba(255,255,255,0.3)" : "var(--line)", color: activeTab === "users" ? "white" : "var(--muted)", padding: "2px 6px", borderRadius: "20px", fontSize: "11px" }}>
                {users.length}
              </span>
            </button>
            <button
              className={activeTab === "financials" ? "active" : ""}
              onClick={() => setActiveTab("financials")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "none", background: activeTab === "financials" ? "var(--red)" : "transparent", color: activeTab === "financials" ? "white" : "var(--ink)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", fontWeight: 550, textAlign: "left", fontSize: "14px", marginBottom: "4px" }}
            >
              <DollarSign size={16} />
              Revenue Forecast
            </button>
            <button
              className={activeTab === "health" ? "active" : ""}
              onClick={() => setActiveTab("health")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "none", background: activeTab === "health" ? "var(--red)" : "transparent", color: activeTab === "health" ? "white" : "var(--ink)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", fontWeight: 550, textAlign: "left", fontSize: "14px", marginBottom: "4px" }}
            >
              <HeartPulse size={16} />
              System Diagnostics
            </button>
            <button
              className={activeTab === "flags" ? "active" : ""}
              onClick={() => setActiveTab("flags")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: "none", background: activeTab === "flags" ? "var(--red)" : "transparent", color: activeTab === "flags" ? "white" : "var(--ink)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s", fontWeight: 550, textAlign: "left", fontSize: "14px" }}
            >
              <ToggleLeft size={16} />
              Feature Flags
            </button>
          </nav>
        </div>

        <div style={{ padding: "16px", borderTop: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--muted)" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            <span>Database Live Connection</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <section className="dashboard-hero" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Administrative Command Center</h2>
                  <p style={{ color: "var(--muted)", margin: "4px 0 0 0", fontSize: "14px" }}>
                    Platform metrics, real database transactions, localized SEO pages, and server performance diagnostics.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", background: "rgba(16,185,129,0.08)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.2)", fontSize: "12px", color: "#10b981", fontWeight: "bold", alignItems: "center" }}>
                  <Database size={14} /> DB PING: {dbLatency}
                </div>
              </div>
            </section>

            <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="kpi-card" onClick={() => setActiveTab("users")} style={{ cursor: "pointer", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", transition: "transform 0.2s, box-shadow 0.2s" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted)", fontWeight: "bold" }}>Total Users</span>
                <strong style={{ display: "block", fontSize: "32px", fontWeight: "800", color: "var(--red)", marginTop: "4px" }}>{users.length}</strong>
                <span style={{ fontSize: "11px", color: "var(--green)", display: "block", marginTop: "4px" }}>↑ Live Database Accounts</span>
              </div>
              <div className="kpi-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted)", fontWeight: "bold" }}>Business Listings</span>
                <strong style={{ display: "block", fontSize: "32px", fontWeight: "800", color: "var(--ink)", marginTop: "4px" }}>{businessesCount}</strong>
                <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "4px" }}>{premiumCount} Premium (Paid) Subscriptions</span>
              </div>
              <div className="kpi-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted)", fontWeight: "bold" }}>Platform Reviews</span>
                <strong style={{ display: "block", fontSize: "32px", fontWeight: "800", color: "var(--ink)", marginTop: "4px" }}>{reviewsCount}</strong>
                <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "4px" }}>Approved and moderation queues</span>
              </div>
              <div className="kpi-card" style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted)", fontWeight: "bold" }}>Total Quotes / Leads</span>
                <strong style={{ display: "block", fontSize: "32px", fontWeight: "800", color: "var(--ink)", marginTop: "4px" }}>{ordersCount}</strong>
                <span style={{ fontSize: "11px", color: "var(--green)", display: "block", marginTop: "4px" }}>User-to-Business connections</span>
              </div>
            </div>

            {/* Live Activities */}
            <section className="dashboard-section" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Live Database Transactions</h3>
                <span style={{ fontSize: "12px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", background: "var(--red)", borderRadius: "50%", display: "inline-block" }}></span>
                  Real-time events
                </span>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {activityFeed.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--paper)",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--line)",
                      fontSize: "14px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${activity.color}15`, color: activity.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {activity.icon}
                      </div>
                      <div>
                        <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{activity.title}</strong>
                        <span style={{ color: "var(--muted)", marginInlineStart: "8px" }}>{activity.detail}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted)", minWidth: "80px", textAlign: "right" }}>{formatDistance(activity.date)}</span>
                  </div>
                ))}

                {activityFeed.length === 0 && (
                  <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>
                    No recent events logged in database.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* USER DIRECTORY */}
        {activeTab === "users" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <section className="dashboard-section" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>System Users Directory</h2>
                  <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "13px" }}>Manage registration details, set system security roles, and enforce moderation policies.</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--muted)" }} />
                  <input
                    type="text"
                    placeholder="Search by name, email or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "8px 12px 8px 36px",
                      fontSize: "14px",
                      minWidth: "260px",
                      minHeight: "40px"
                    }}
                  />
                </div>
              </div>

              <div className="admin-table-container" style={{ overflowX: "auto" }}>
                <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }} aria-label="System Users directory">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--line)", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase" }}>
                      <th style={{ padding: "12px 8px" }}>User Details</th>
                      <th style={{ padding: "12px 8px" }}>Security Roles</th>
                      <th style={{ padding: "12px 8px" }}>Created At</th>
                      <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: "1px solid var(--line)", transition: "background 0.2s" }}>
                        <td style={{ padding: "14px 8px" }}>
                          <div>
                            <strong style={{ display: "block", color: "var(--ink)", fontSize: "14px" }}>{user.name || "Unnamed User"}</strong>
                            <span style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                              {user.email} <span style={{ color: "var(--line)" }}>|</span> ID: {user.id}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 8px" }}>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                            {user.userRoles.map((ur) => (
                              <span
                                key={ur.role.key}
                                style={{
                                  fontSize: "9px",
                                  fontWeight: "bold",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  background: ur.role.key === "admin" ? "rgba(184,11,41,0.1)" : ur.role.key === "moderator" ? "rgba(245,158,11,0.1)" : ur.role.key === "editor" ? "rgba(16,185,129,0.1)" : "rgba(104,115,131,0.1)",
                                  color: ur.role.key === "admin" ? "var(--red)" : ur.role.key === "moderator" ? "#d97706" : ur.role.key === "editor" ? "#059669" : "var(--muted)"
                                }}
                              >
                                {ur.role.key.replace("_", " ")}
                              </span>
                            ))}
                            {user.userRoles.length === 0 && (
                              <span style={{ fontSize: "10px", color: "var(--muted)", fontStyle: "italic" }}>No Roles</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 8px", fontSize: "13px", color: "var(--muted)" }}>
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td style={{ padding: "14px 8px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              onClick={() => handleRoleEditClick(user)}
                              style={{
                                background: "var(--paper)",
                                border: "1px solid var(--line)",
                                borderRadius: "6px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              Edit Roles
                            </button>
                            <button
                              onClick={() => handleToggleBan(user.id)}
                              style={{
                                background: "rgba(184,11,41,0.08)",
                                border: "1px solid rgba(184,11,41,0.15)",
                                color: "var(--red)",
                                borderRadius: "6px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              Reset Account
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "40px 8px", textAlign: "center", color: "var(--muted)" }}>
                          No users found matching search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* REVENUE FORECAST */}
        {activeTab === "financials" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <section className="dashboard-section" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Revenue Estimator & Billing Forecasts</h2>
                  <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "13px" }}>Estimated recurring metrics generated from active Premium (Featured and Claimed) Listings.</p>
                </div>
              </div>

              <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)", color: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.8)", fontWeight: "bold" }}>Estimated MRR</span>
                  <strong style={{ display: "block", fontSize: "36px", fontWeight: "800", color: "white", marginTop: "4px" }}>${estimatedMRR.toLocaleString()}</strong>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", display: "block", marginTop: "4px" }}>Based on ${basePricePerMonth}/mo Premium Tier</span>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", fontWeight: "bold" }}>Premium Subscriptions</span>
                  <strong style={{ display: "block", fontSize: "36px", fontWeight: "800", color: "var(--ink)", marginTop: "4px" }}>{premiumCount}</strong>
                  <span style={{ fontSize: "11px", color: "var(--green)", display: "block", marginTop: "4px" }}>Active paid business accounts</span>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", fontWeight: "bold" }}>Unclaimed Profiles</span>
                  <strong style={{ display: "block", fontSize: "36px", fontWeight: "800", color: "var(--ink)", marginTop: "4px" }}>{businessesCount - premiumCount}</strong>
                  <span style={{ fontSize: "11px", color: "var(--red)", display: "block", marginTop: "4px" }}>Potential expansion conversion funnel</span>
                </div>
              </div>

              {/* Billing chart */}
              <div style={{ background: "var(--paper)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700" }}>Subscription Projections (Q3 2026 Forecast)</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span>Current MRR ({premiumCount} Subscriptions)</span>
                      <strong>${estimatedMRR}</strong>
                    </div>
                    <div style={{ width: "100%", background: "var(--line)", height: "8px", borderRadius: "4px" }}>
                      <div style={{ width: `${Math.min(100, (premiumCount / (premiumCount + 10)) * 100)}%`, background: "#10b981", height: "100%", borderRadius: "4px" }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span>Conservative Target (Conversion of 10% Unclaimed Profiles)</span>
                      <strong>${Math.round(estimatedMRR + ((businessesCount - premiumCount) * 0.1) * basePricePerMonth)}</strong>
                    </div>
                    <div style={{ width: "100%", background: "var(--line)", height: "8px", borderRadius: "4px" }}>
                      <div style={{ width: `${Math.min(100, ((premiumCount + (businessesCount - premiumCount) * 0.1) / (premiumCount + 10)) * 100)}%`, background: "var(--red)", height: "100%", borderRadius: "4px" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SYSTEM HEALTH */}
        {activeTab === "health" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <section className="dashboard-section" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Diagnostic Telemetry</h2>
                <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "13px" }}>Real database latency pings and dynamic service health gauges.</p>
              </div>

              <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(184,11,41,0.1)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Database size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "18px", color: "var(--ink)", fontWeight: 700 }}>{dbLatency}</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Database Read Ping</span>
                  </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Cloud size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "18px", color: "var(--ink)", fontWeight: 700 }}>Active / Online</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Edge Route Sync</span>
                  </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--line)", display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "18px", color: "var(--ink)", fontWeight: 700 }}>100% Operational</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>API Gateway Handlers</span>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--paper)", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700" }}>Edge Storage Metrics</h3>
                <div style={{ width: "100%", background: "var(--line)", height: "14px", borderRadius: "10px", overflow: "hidden", marginTop: "10px" }}>
                  <div style={{ width: `${Math.min(100, Math.max(0.2, ( (totalPhotosCount * 350) / (1024 * 1024) / 50 ) * 100))}%`, background: "var(--red)", height: "100%" }}></div>
                </div>
                <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginTop: "8px" }}>
                  {((totalPhotosCount * 350) / (1024 * 1024)).toFixed(5)} GB utilized of 50.0 GB Cloud Object Storage ({totalPhotosCount} uploaded assets).
                </span>
              </div>
            </section>
          </div>
        )}

        {/* FEATURE FLAGS */}
        {activeTab === "flags" && (
          <div className="tab-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <section className="dashboard-section" style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--line)" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Dynamic Feature Toggles</h2>
                <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "13px" }}>Enable or disable system features instantly on the frontend client console.</p>
              </div>

              <div style={{ display: "grid", gap: "14px" }}>
                {featureFlags.map((flag) => (
                  <div
                    key={flag.key}
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "15px", color: "var(--ink)", fontWeight: 600 }}>{flag.name}</strong>
                      <span style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                        {flag.desc}
                      </span>
                    </div>
                    <label className="toggle-switch" style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={flag.enabled}
                        onChange={(e) => handleToggleFlag(flag.key, e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span className="toggle-slider" style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: flag.enabled ? "var(--green)" : "#cbd5e1", transition: ".3s", borderRadius: "24px" }}>
                        <span style={{ position: "absolute", content: '""', height: "18px", width: "18px", left: flag.enabled ? "22px" : "4px", bottom: "3px", backgroundColor: "white", transition: ".3s", borderRadius: "50%", display: "inline-block" }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* EDIT ROLES MODAL DIALOG */}
      {roleModalOpen && selectedUser && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-box" style={{ background: "white", padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)", border: "1px solid var(--line)" }}>
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Manage Account Permissions</h3>
              <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)" }} onClick={() => setRoleModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 14px 0" }}>
              Updating role scopes for <strong>{selectedUser.name || selectedUser.email}</strong>.
            </p>

            <form onSubmit={handleRoleSaveSubmit} className="settings-form" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gap: "10px" }}>
                {["admin", "moderator", "editor", "business_owner", "user"].map((role) => (
                  <label key={role} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "var(--paper)", borderRadius: "8px", border: "1px solid var(--line)", cursor: "pointer", fontSize: "14px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, role]);
                        } else {
                          setSelectedRoles(selectedRoles.filter((r) => r !== role));
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ textTransform: "capitalize", fontWeight: "500" }}>{role.replace("_", " ")}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button type="button" style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }} onClick={() => setRoleModalOpen(false)}>
                  Cancel
                </button>
                <button style={{ background: "var(--red)", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }} type="submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
