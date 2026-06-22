"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  History,
  Check,
  X,
  Eye,
  ExternalLink,
  ChevronDown,
  Clock,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Grid,
  Star
} from "lucide-react";
import { type Locale, localePath } from "@/lib/i18n";

type ModeratorDashboardShellProps = {
  locale: Locale;
  initialReviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    business: {
      slug: string;
      city: { slug: string };
      translations: Array<{ locale: string; name: string }>;
    };
  }>;
  initialClaims: Array<{
    id: string;
    ownerName: string;
    phone: string;
    business: {
      slug: string;
      city: { slug: string };
      translations: Array<{ locale: string; name: string }>;
    };
  }>;
  initialBusinesses: Array<{
    id: string;
    slug: string;
    city: { slug: string };
    translations: Array<{ locale: string; name: string }>;
  }>;
  onApproveReview: (reviewId: string) => Promise<void>;
  onRejectReview: (reviewId: string, reason?: string) => Promise<void>;
  onApproveClaim: (claimId: string) => Promise<void>;
  onRejectClaim: (claimId: string) => Promise<void>;
  onPublishBusiness: (businessId: string) => Promise<void>;
  onSuspendBusiness: (businessId: string) => Promise<void>;
};

export function ModeratorDashboardShell({
  locale,
  initialReviews,
  initialClaims,
  initialBusinesses,
  onApproveReview,
  onRejectReview,
  onApproveClaim,
  onRejectClaim,
  onPublishBusiness,
  onSuspendBusiness
}: ModeratorDashboardShellProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Local state for queue lists to support instant UX updates
  const [reviews, setReviews] = useState(initialReviews);
  const [claims, setClaims] = useState(initialClaims);
  const [businesses, setBusinesses] = useState(initialBusinesses);

  // Rejection modal state
  const [rejectingReviewId, setRejectingReviewId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Mock list of reported content
  const [reports, setReports] = useState([
    { id: "r1", type: "Review", business: "Bagh-e Babur Cafe", reason: "Competitor Sabotage / Fake Review", user: "sayed@example.com", date: "2026-05-20" },
    { id: "r2", type: "Business", business: "Shar-e Naw Mobile Center", reason: "Incorrect Location / Spam", user: "ahmad@example.com", date: "2026-05-21" }
  ]);

  // Mock moderator log history
  const [modHistory, setModHistory] = useState([
    { id: "h1", action: "Approved Review", target: "Arian Dental Clinic", mod: "You", date: "1 hour ago" },
    { id: "h2", action: "Approved Claim", target: "Blue Mosque Wedding Hall", mod: "You", date: "3 hours ago" },
    { id: "h3", action: "Published Listing", target: "Herat Rose Salon", mod: "You", date: "5 hours ago" }
  ]);

  // Mock photos queue
  const [photos, setPhotos] = useState([
    { id: "p1", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80", business: "Bagh-e Babur Cafe", uploader: "karimi@example.com", date: "2026-05-21" },
    { id: "p2", url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80", business: "Shar-e Naw Mobile Center", uploader: "noori@example.com", date: "2026-05-22" }
  ]);

  const handleApproveReview = async (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    setModHistory([{ id: String(Date.now()), action: "Approved Review", target: "Review Queue Item", mod: "You", date: "Just now" }, ...modHistory]);
    await onApproveReview(id);
  };

  const handleRejectReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReviewId) return;
    const rid = rejectingReviewId;
    setReviews(reviews.filter((r) => r.id !== rid));
    setRejectingReviewId(null);
    setRejectReason("");
    setModHistory([{ id: String(Date.now()), action: `Rejected Review (${rejectReason})`, target: "Review Queue Item", mod: "You", date: "Just now" }, ...modHistory]);
    await onRejectReview(rid, rejectReason);
  };

  const handleApproveClaim = async (id: string) => {
    setClaims(claims.filter((c) => c.id !== id));
    setModHistory([{ id: String(Date.now()), action: "Approved Claim", target: "Business Claim Request", mod: "You", date: "Just now" }, ...modHistory]);
    await onApproveClaim(id);
  };

  const handleRejectClaim = async (id: string) => {
    setClaims(claims.filter((c) => c.id !== id));
    setModHistory([{ id: String(Date.now()), action: "Rejected Claim", target: "Business Claim Request", mod: "You", date: "Just now" }, ...modHistory]);
    await onRejectClaim(id);
  };

  const handlePublishBusiness = async (id: string) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
    setModHistory([{ id: String(Date.now()), action: "Published Listing", target: "Business Queue Item", mod: "You", date: "Just now" }, ...modHistory]);
    await onPublishBusiness(id);
  };

  const handleSuspendBusiness = async (id: string) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
    setModHistory([{ id: String(Date.now()), action: "Suspended Listing", target: "Business Queue Item", mod: "You", date: "Just now" }, ...modHistory]);
    await onSuspendBusiness(id);
  };

  const totalPending = reviews.length + claims.length + businesses.length + photos.length;

  return (
    <div className="dashboard-shell" style={{ marginTop: "12px" }}>
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-profile" style={{ background: "linear-gradient(135deg, var(--red-dark) 0%, var(--red) 100%)" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>System Safety</p>
          <h2>Moderator Panel</h2>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "6px 12px", marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
            <span>Queue Backlog:</span>
            <strong>{totalPending} Items</strong>
          </div>
        </div>

        <nav className="dashboard-sidebar-nav" aria-label="Moderator tools">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <ShieldAlert size={18} />
            Queue Overview
          </button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            <MessageSquare size={18} />
            Pending Reviews
            {reviews.length > 0 && <span className="queue-count">{reviews.length}</span>}
          </button>
          <button className={activeTab === "claims" ? "active" : ""} onClick={() => setActiveTab("claims")}>
            <FileText size={18} />
            Ownership Claims
            {claims.length > 0 && <span className="queue-count" style={{ background: "var(--green)" }}>{claims.length}</span>}
          </button>
          <button className={activeTab === "businesses" ? "active" : ""} onClick={() => setActiveTab("businesses")}>
            <Grid size={18} />
            Pending Listings
            {businesses.length > 0 && <span className="queue-count">{businesses.length}</span>}
          </button>
          <button className={activeTab === "photos" ? "active" : ""} onClick={() => setActiveTab("photos")}>
            <ImageIcon size={18} />
            Photo Submissions
            {photos.length > 0 && <span className="queue-count">{photos.length}</span>}
          </button>
          <button className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>
            <AlertTriangle size={18} />
            User Reports
            {reports.length > 0 && <span className="queue-count" style={{ background: "var(--red)" }}>{reports.length}</span>}
          </button>
          <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
            <History size={18} />
            Activity Log
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <section className="dashboard-hero" style={{ background: "white" }}>
              <div>
                <h2>Moderator Queue Overview</h2>
                <p style={{ marginTop: "6px", color: "var(--muted)" }}>
                  Evaluate submissions, verify ownership claims, and process reported content to maintain data integrity.
                </p>

                {totalPending > 0 && (
                  <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center", background: "#fff5e6", border: "1px solid #ead9bd", padding: "12px", borderRadius: "10px" }}>
                    <Clock size={20} color="#a24e02" />
                    <span style={{ fontSize: "14px" }}>
                      Oldest pending item in queue is <strong>3 days old</strong>. Please clear outstanding tasks.
                    </span>
                  </div>
                )}
              </div>
            </section>

            <div className="kpi-grid">
              <div className="kpi-card" onClick={() => setActiveTab("reviews")} style={{ cursor: "pointer" }}>
                <strong>{reviews.length}</strong>
                <span>Reviews Queue</span>
              </div>
              <div className="kpi-card" onClick={() => setActiveTab("claims")} style={{ cursor: "pointer" }}>
                <strong>{claims.length}</strong>
                <span>Claims Queue</span>
              </div>
              <div className="kpi-card" onClick={() => setActiveTab("businesses")} style={{ cursor: "pointer" }}>
                <strong>{businesses.length}</strong>
                <span>Pending Businesses</span>
              </div>
              <div className="kpi-card" onClick={() => setActiveTab("photos")} style={{ cursor: "pointer" }}>
                <strong>{photos.length}</strong>
                <span>Photos Queue</span>
              </div>
            </div>

            {/* Recent Mod Activity */}
            <section className="dashboard-section">
              <h3>Recent Mod Activity Log</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {modHistory.map((log) => (
                  <div key={log.id} style={{ display: "flex", justifyContent: "space-between", background: "white", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                    <div>
                      <strong style={{ color: "var(--red)" }}>{log.action}</strong>
                      <span style={{ marginInlineStart: "8px", color: "var(--ink)" }}>for {log.target}</span>
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>{log.date} by {log.mod}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PENDING REVIEWS */}
        {activeTab === "reviews" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>Pending Reviews Queue ({reviews.length})</h2>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {reviews.map((review) => (
                  <div key={review.id} className="review-item-card" style={{ padding: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong style={{ fontSize: "16px" }}>
                          {review.business.translations[0]?.name ?? review.business.slug}
                        </strong>
                        <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
                          Business Location: {review.business.city.slug}
                        </span>
                      </div>
                      <div className="rating-stars">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p style={{ background: "var(--paper)", padding: "10px", borderRadius: "8px", margin: "10px 0 0", fontSize: "14px" }}>
                      {review.comment || "No text comment left."}
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                      <Link
                        className="inline-link"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginInlineEnd: "auto" }}
                        href={localePath(locale, `/business/${review.business.city.slug}/${review.business.slug}`)}
                      >
                        View Business <ExternalLink size={14} />
                      </Link>

                      <button
                        onClick={() => handleApproveReview(review.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", color: "white", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <Check size={16} /> Approve
                      </button>

                      <button
                        onClick={() => setRejectingReviewId(review.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(184, 11, 41, 0.1)", color: "var(--red)", border: "1px solid transparent", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <p className="empty-note">All pending reviews are processed. Good job!</p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* OWNERSHIP CLAIMS */}
        {activeTab === "claims" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>Ownership Claims Queue ({claims.length})</h2>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {claims.map((claim) => (
                  <div key={claim.id} className="review-item-card" style={{ padding: "18px" }}>
                    <div>
                      <strong style={{ fontSize: "18px" }}>
                        {claim.business.translations[0]?.name ?? claim.business.slug}
                      </strong>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                        <span>Claimant Name: <strong>{claim.ownerName}</strong></span>
                        <span>Contact: <strong>{claim.phone}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                      <Link
                        className="inline-link"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginInlineEnd: "auto" }}
                        href={localePath(locale, `/business/${claim.business.city.slug}/${claim.business.slug}`)}
                      >
                        View Business <ExternalLink size={14} />
                      </Link>

                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", color: "white", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <Check size={16} /> Approve
                      </button>

                      <button
                        onClick={() => handleRejectClaim(claim.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(184, 11, 41, 0.1)", color: "var(--red)", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}

                {claims.length === 0 && (
                  <p className="empty-note">All pending ownership claims are processed.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* PENDING LISTINGS */}
        {activeTab === "businesses" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>Pending Listings Queue ({businesses.length})</h2>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {businesses.map((business) => (
                  <div key={business.id} className="review-item-card" style={{ padding: "18px" }}>
                    <div>
                      <strong style={{ fontSize: "18px" }}>
                        {business.translations[0]?.name ?? business.slug}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
                        Slug: {business.slug} · City: {business.city.slug}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
                      <Link
                        className="inline-link"
                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginInlineEnd: "auto" }}
                        href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                      >
                        Preview Draft <ExternalLink size={14} />
                      </Link>

                      <button
                        onClick={() => handlePublishBusiness(business.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--green)", color: "white", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <Check size={16} /> Publish Listing
                      </button>

                      <button
                        onClick={() => handleSuspendBusiness(business.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(184, 11, 41, 0.1)", color: "var(--red)", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold" }}
                      >
                        <X size={16} /> Suspend / Reject
                      </button>
                    </div>
                  </div>
                ))}

                {businesses.length === 0 && (
                  <p className="empty-note">All pending listing submissions are processed.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* PHOTO SUBMISSIONS */}
        {activeTab === "photos" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>Photo Submissions Queue ({photos.length})</h2>
              </div>

              {photos.length > 0 ? (
                <div className="photos-masonry">
                  {photos.map((photo) => (
                    <div key={photo.id} className="photo-item" style={{ gap: "6px" }}>
                      <img src={photo.url} alt="Listing upload preview" className="photo-img" />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{photo.business}</strong>
                        <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Uploaded by: {photo.uploader}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "4px" }}>
                        <button
                          onClick={() => setPhotos(photos.filter((p) => p.id !== photo.id))}
                          style={{ background: "var(--green)", color: "white", padding: "6px 0", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setPhotos(photos.filter((p) => p.id !== photo.id))}
                          style={{ background: "rgba(184,11,41,0.08)", color: "var(--red)", padding: "6px 0", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-note">All photo uploads have been moderate.</p>
              )}
            </section>
          </div>
        )}

        {/* USER REPORTS */}
        {activeTab === "reports" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>User Flags & Content Reports ({reports.length})</h2>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {reports.map((report) => (
                  <div key={report.id} className="review-item-card" style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                      <div>
                        <strong>Flagged {report.type}: {report.business}</strong>
                        <span style={{ display: "block", fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                          Reported by: {report.user} · {report.date}
                        </span>
                      </div>
                      <span style={{ background: "rgba(184,11,41,0.1)", color: "var(--red)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>
                        CRITICAL
                      </span>
                    </div>

                    <p style={{ background: "var(--paper)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", color: "#a24e02", margin: "10px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertTriangle size={14} /> Reason: <strong>{report.reason}</strong>
                    </p>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "10px" }}>
                      <button
                        onClick={() => setReports(reports.filter((r) => r.id !== report.id))}
                        className="action-button ghost"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        Dismiss Report
                      </button>
                      <button
                        onClick={() => {
                          setReports(reports.filter((r) => r.id !== report.id));
                          alert("Content removed and user warned.");
                        }}
                        className="action-button"
                        style={{ background: "var(--red)", padding: "6px 12px", fontSize: "12px" }}
                      >
                        Remove Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ACTIVITY LOG */}
        {activeTab === "history" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <h2>Moderator Activity Audit Log</h2>
              <div className="admin-table-container">
                <table className="admin-table" aria-label="Audit history">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Target Content</th>
                      <th>Responsible Moderator</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modHistory.map((log) => (
                      <tr key={log.id}>
                        <td><strong style={{ color: "var(--red)" }}>{log.action}</strong></td>
                        <td>{log.target}</td>
                        <td>{log.mod}</td>
                        <td>{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* REJECTION MODAL DIALOG */}
      {rejectingReviewId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Specify Rejection Reason</h3>
              <button className="close-modal-btn" onClick={() => setRejectingReviewId(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRejectReviewSubmit} className="settings-form">
              <label>
                <span>Select standard rejection reason</span>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  style={{ minHeight: "40px" }}
                >
                  <option value="">-- Choose reason --</option>
                  <option value="Inappropriate Language">Inappropriate / abusive language</option>
                  <option value="Spam / Marketing copy">Spam / advertising pitch</option>
                  <option value="Competitor Sabotage">Competitor sabotage / fake rating</option>
                  <option value="Irrelevant Content">Irrelevant to business offerings</option>
                </select>
              </label>

              <button className="action-button" style={{ background: "var(--red)" }} type="submit">
                Submit Rejection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
