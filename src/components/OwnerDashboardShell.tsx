"use client";

import { useState } from "react";
import {
  TrendingUp,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  DollarSign,
  Briefcase,
  Layers,
  Star,
  Users,
  Grid,
  FileText,
  Percent,
  Plus,
  Eye,
  CheckCircle,
  AlertTriangle,
  Send,
  Flag,
  Globe,
  Upload,
  CreditCard,
  Edit2,
  X,
  Phone,
  Clock,
  Sparkles,
  MapPin,
  Lock
} from "lucide-react";
import { LocationPicker } from "@/components/LocationPicker";
import { type Locale, localePath } from "@/lib/i18n";

type OwnerDashboardShellProps = {
  locale: Locale;
  businesses: Array<{
    id: string;
    slug: string;
    status: string;
    verified: boolean;
    phone: string | null;
    whatsapp: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    priceRange?: string | null;
    city: { slug: string };
    area?: { name: string; localName: string | null } | null;
    translations: Array<{ locale: string; name: string; description?: string | null }>;
  }>;
  initialLeads: Array<{
    id: string;
    name: string;
    phone: string;
    message: string | null;
    status: string;
    createdAt: Date;
    businessId: string;
  }>;
  initialReviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    approved: boolean;
    createdAt: Date;
    businessId: string;
  }>;
  onUpdateListing?: (businessId: string, updates: any) => Promise<void>;
  onReplyToReview?: (reviewId: string, replyText: string) => Promise<void>;
  onUpdateLeadStatus?: (leadId: string, status: string) => Promise<void>;
};

export function OwnerDashboardShell({
  locale,
  businesses,
  initialLeads,
  initialReviews,
  onUpdateListing,
  onReplyToReview,
  onUpdateLeadStatus
}: OwnerDashboardShellProps) {
  const [managedBusinesses, setManagedBusinesses] = useState(businesses);
  // If user manages multiple, allow selection
  const [selectedBusinessId, setSelectedBusinessId] = useState(managedBusinesses[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState("overview");

  // State hooks for leads & reviews
  const [leads, setLeads] = useState(initialLeads);
  const [reviews, setReviews] = useState(initialReviews);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [reviewFilter, setReviewFilter] = useState("all");
  const [analyticsDays, setAnalyticsDays] = useState("30");

  // Listing editor state
  const activeBusiness = managedBusinesses.find((b) => b.id === selectedBusinessId);
  const [editModal, setEditModal] = useState<string | null>(null);

  // Edit form states
  const [editName, setEditName] = useState(activeBusiness?.translations[0]?.name ?? "");
  const [editDesc, setEditDesc] = useState(activeBusiness?.translations[0]?.description ?? "");
  const [editPhone, setEditPhone] = useState(activeBusiness?.phone ?? "");
  const [editWhatsapp, setEditWhatsapp] = useState(activeBusiness?.whatsapp ?? "");
  const [editAddress, setEditAddress] = useState(activeBusiness?.address ?? "");
  const [editLatitude, setEditLatitude] = useState<number | null>(activeBusiness?.latitude ?? null);
  const [editLongitude, setEditLongitude] = useState<number | null>(activeBusiness?.longitude ?? null);
  const [editPriceRange, setEditPriceRange] = useState(activeBusiness?.priceRange ?? "$$");

  // Mock list of uploaded photos
  const [gallery, setGallery] = useState([
    { id: "g1", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80", status: "approved", cover: true },
    { id: "g2", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80", status: "approved", cover: false },
    { id: "g3", url: "https://images.unsplash.com/photo-1570213489059-0aac6626cade?auto=format&fit=crop&w=400&q=80", status: "pending", cover: false }
  ]);

  // Billing and plan type
  const [planType, setPlanType] = useState<"Free" | "Premium">("Free");

  // Multilingual labels
  const t = {
    fa: {
      upgradeCTA: "ارتقا به ویژه",
      planBadge: "طرح شما",
      metricViews: "بازدید از پروفایل",
      metricReviews: "تعداد نظرها",
      metricRating: "میانگین امتیاز",
      metricLeads: "لیدهای جدید",
      actionRequired: "اقدامات لازم",
      noActions: "هیچ کار معلقی ندارید! آفرین.",
      incompleteFields: "فیلدهای ناقص در پروفایل کسب‌وکار شما وجود دارد.",
      unreadQuotes: "درخواست قیمت خوانده‌نشده دارید.",
      recentReviews: "نظرهای اخیر",
      editSection: "ویرایش بخش",
      completenessScore: "درصد تکمیل پروفایل",
      checklistCompleted: "تکمیل شده",
      replyBtn: "ارسال پاسخ",
      analyticsLocked: "بخش آمار ویژه است",
      analyticsLockedDesc: "برای مشاهده آمار کامل بازدید، کلمات کلیدی، و منابع ورودی، طرح خود را ارتقا دهید.",
      leadStatusNew: "تازه",
      leadStatusProgress: "در حال بررسی",
      leadStatusClosed: "بسته شده",
      adFeatured: "کسب‌وکار ویژه در صفحات دسته‌بندی",
      adBanner: "بنر تبلیغاتی صفحه شهر",
      adSpotlight: "قرارگیری در کانون توجه صفحه اصلی",
      budget: "بودجه روزانه",
      adActive: "تبلیغات فعال",
      nextBilling: "تمدید بعدی",
      invoiceHistory: "تاریخچه فاکتورها"
    },
    ps: {
      upgradeCTA: "پریمیم ته لوړول",
      planBadge: "ستاسو پلان",
      metricViews: "د پروفایل لیدنې",
      metricReviews: "د نظرونو شمیر",
      metricRating: "اوسط امتیاز",
      metricLeads: "نوي تماسونه",
      actionRequired: "اړین اقدامات",
      noActions: "هیڅ پاتې کار نشته! بریا.",
      incompleteFields: "ستاسو د سوداګرۍ پروفایل ځینې برخې خالي دي.",
      unreadQuotes: "بې لوستې نرخ غوښتنې لرئ.",
      recentReviews: "وروستي نظرونه",
      editSection: "د برخې سمون",
      completenessScore: "د معلوماتو بشپړوالي فیصدي",
      checklistCompleted: "بشپړ شوی",
      replyBtn: "ځواب لیږل",
      analyticsLocked: "احصایه پریمیم کاروونکو لپاره ده",
      analyticsLockedDesc: "د لیدنو احصاییو، کلیدي کلمو او ټرافیک منابعو کتلو لپاره خپل پلان پریمیم ته لوړ کړئ.",
      leadStatusNew: "نوی",
      leadStatusProgress: "په کار کې",
      leadStatusClosed: "تړل شوی",
      adFeatured: "کټګورۍ پاڼه کې غوره ځای",
      adBanner: "د ښار پاڼې بنر اعلانات",
      adSpotlight: "اصلي پاڼه کې ځانګړی کانون",
      budget: "ورځنی بودیجه",
      adActive: "فعال اعلانات",
      nextBilling: "بل تمدید",
      invoiceHistory: "د فاکتورونو تاریخچه"
    },
    en: {
      upgradeCTA: "Upgrade to Premium",
      planBadge: "Your Plan",
      metricViews: "Profile Views (This Month)",
      metricReviews: "Total Reviews",
      metricRating: "Average Rating",
      metricLeads: "New Leads",
      actionRequired: "Action Required",
      noActions: "No urgent actions. Good job!",
      incompleteFields: "Your listing profile is not 100% complete.",
      unreadQuotes: "You have unread quote requests.",
      recentReviews: "Recent Reviews",
      editSection: "Edit Section",
      completenessScore: "Listing Completeness Score",
      checklistCompleted: "Completed",
      replyBtn: "Submit Reply",
      analyticsLocked: "Analytics is a Premium Feature",
      analyticsLockedDesc: "Upgrade your plan to view detailed traffic sources, impressions count, CTR, and search queries.",
      leadStatusNew: "New",
      leadStatusProgress: "In Progress",
      leadStatusClosed: "Closed",
      adFeatured: "Featured Listing (Top of Category page)",
      adBanner: "Banner Ad (City page)",
      adSpotlight: "Spotlight (Homepage spotlight slot)",
      budget: "Daily Budget",
      adActive: "Active Campaigns",
      nextBilling: "Next Renewal",
      invoiceHistory: "Invoice History"
    }
  }[locale];

  if (!activeBusiness) {
    return (
      <div className="dashboard-section empty-state">
        <strong>No business listing assigned to your account.</strong>
        <p>Please claim a business or register a new one to unlock the owner control panel.</p>
      </div>
    );
  }

  // Handle lead status updates
  const updateLeadStatus = async (leadId: string, status: string) => {
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status } : l)));
    if (onUpdateLeadStatus) {
      await onUpdateLeadStatus(leadId, status);
    }
  };

  // Submit reply action
  const submitReply = async (reviewId: string) => {
    const text = replies[reviewId]?.trim();
    if (!text) return;
    if (onReplyToReview) {
      await onReplyToReview(reviewId, text);
    }
    // Simulate updating state
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, replies: [{ id: "rep", text, createdAt: new Date() }] } as any : r
      )
    );
    setReplies({ ...replies, [reviewId]: "" });
  };

  // Profile views simulated data
  const viewsMock = [42, 68, 92, 105, 84, 116, 142];
  const viewsLabels = ["May 16", "May 17", "May 18", "May 19", "May 20", "May 21", "Today"];

  // Listing completeness score calculation
  const completenessChecks = [
    { label: "Description filled", done: !!activeBusiness.translations[0]?.description },
    { label: "Phone number listed", done: !!activeBusiness.phone },
    { label: "WhatsApp number listed", done: !!activeBusiness.whatsapp },
    { label: "Business address added", done: !!activeBusiness.address },
    { label: "Exact map pin set", done: typeof activeBusiness.latitude === "number" && typeof activeBusiness.longitude === "number" },
    { label: "Photos uploaded (minimum 2)", done: gallery.length >= 2 }
  ];
  const completedCount = completenessChecks.filter((c) => c.done).length;
  const completenessScore = Math.round((completedCount / completenessChecks.length) * 100);

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "5-star") return r.rating === 5;
    if (reviewFilter === "1-2-star") return r.rating <= 2;
    if (reviewFilter === "unanswered") return !(r as any).replies?.length;
    return true;
  });

  const saveListingInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateListing) {
      await onUpdateListing(selectedBusinessId, {
        name: editName,
        description: editDesc,
        phone: editPhone,
        whatsapp: editWhatsapp,
        address: editAddress,
        latitude: editLatitude,
        longitude: editLongitude,
        priceRange: editPriceRange
      });
    }
    setManagedBusinesses((current) =>
      current.map((business) =>
        business.id === selectedBusinessId
          ? {
              ...business,
              phone: editPhone || null,
              whatsapp: editWhatsapp || null,
              address: editAddress || null,
              latitude: editLatitude,
              longitude: editLongitude,
              priceRange: editPriceRange || null,
              translations: business.translations.length
                ? business.translations.map((translation, index) =>
                    index === 0
                      ? {
                          ...translation,
                          name: editName,
                          description: editDesc || null
                        }
                      : translation
                  )
                : [
                    {
                      locale,
                      name: editName,
                      description: editDesc || null
                    }
                  ]
            }
          : business
      )
    );
    setEditModal(null);
  };

  return (
    <div className="tab-content" style={{ gap: "16px" }}>
      {/* Top Header Controls */}
      <div className="role-header-switcher">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px" }}>
              {activeBusiness.translations[0]?.name ?? activeBusiness.slug}
            </h2>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Status: <span className={`status-pill status-${activeBusiness.status}`} style={{ fontSize: "11px", padding: "2px 6px" }}>{activeBusiness.status}</span>
              {activeBusiness.verified && " · Verified Listing"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {managedBusinesses.length > 1 && (
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              style={{ minHeight: "38px", padding: "4px 8px", width: "auto" }}
            >
              {managedBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.translations[0]?.name ?? b.slug}
                </option>
              ))}
            </select>
          )}

          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>{t.planBadge}:</span>
            <strong style={{ color: planType === "Premium" ? "var(--green)" : "var(--ink)" }}>{planType}</strong>
          </div>

          {planType === "Free" && (
            <button
              onClick={() => setPlanType("Premium")}
              className="action-button"
              style={{ background: "var(--red)", fontSize: "13px", padding: "8px 16px" }}
            >
              {t.upgradeCTA}
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-shell" style={{ marginTop: 0 }}>
        {/* Navigation Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="dashboard-sidebar-nav" aria-label="Business tools">
            <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              <Grid size={18} />
              Overview
            </button>
            <button className={activeTab === "listing" ? "active" : ""} onClick={() => setActiveTab("listing")}>
              <Layers size={18} />
              My Listing
            </button>
            <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
              <MessageSquare size={18} />
              Reviews & Replies
              {reviews.length > 0 && <span className="queue-count">{reviews.length}</span>}
            </button>
            <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>
              <TrendingUp size={18} />
              Analytics
            </button>
            <button className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>
              <Users size={18} />
              Leads & Quotes
              {leads.filter((l) => l.status === "new").length > 0 && (
                <span className="queue-count" style={{ background: "var(--green)", color: "white" }}>
                  {leads.filter((l) => l.status === "new").length}
                </span>
              )}
            </button>
            <button className={activeTab === "photos" ? "active" : ""} onClick={() => setActiveTab("photos")}>
              <ImageIcon size={18} />
              Photo Gallery
            </button>
            <button className={activeTab === "ads" ? "active" : ""} onClick={() => setActiveTab("ads")}>
              <Percent size={18} />
              Ads & Promotions
            </button>
            <button className={activeTab === "billing" ? "active" : ""} onClick={() => setActiveTab("billing")}>
              <DollarSign size={18} />
              Billing
            </button>
            <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
              <Settings size={18} />
              Settings
            </button>
          </nav>
        </aside>

        {/* Content Tabs */}
        <div className="dashboard-main">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <strong>3,248</strong>
                  <span>{t.metricViews}</span>
                </div>
                <div className="kpi-card">
                  <strong>{reviews.length}</strong>
                  <span>{t.metricReviews}</span>
                </div>
                <div className="kpi-card">
                  <strong>4.6</strong>
                  <span>{t.metricRating}</span>
                </div>
                <div className="kpi-card">
                  <strong>{leads.filter((l) => l.status === "new").length}</strong>
                  <span>{t.metricLeads}</span>
                </div>
              </div>

              {/* Action items */}
              <section className="dashboard-section">
                <div className="section-head">
                  <h3>{t.actionRequired}</h3>
                </div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {completenessScore < 100 && (
                    <div style={{ display: "flex", gap: "12px", background: "#fff5e6", border: "1px solid #ead9bd", borderRadius: "10px", padding: "14px", alignItems: "center" }}>
                      <AlertTriangle color="#a24e02" />
                      <div>
                        <strong>{t.incompleteFields} ({completenessScore}% Complete)</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                          Complete your profile to gain higher ranking in search lists.
                        </p>
                      </div>
                      <button className="inline-link" onClick={() => setActiveTab("listing")} style={{ background: "none", border: 0, marginInlineStart: "auto" }}>
                        Complete Now
                      </button>
                    </div>
                  )}

                  {leads.filter((l) => l.status === "new").length > 0 && (
                    <div style={{ display: "flex", gap: "12px", background: "rgba(15, 118, 110, 0.08)", border: "1px solid rgba(15, 118, 110, 0.2)", borderRadius: "10px", padding: "14px", alignItems: "center" }}>
                      <CheckCircle color="var(--green)" />
                      <div>
                        <strong>{t.unreadQuotes}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                          Respond promptly to secure customers.
                        </p>
                      </div>
                      <button className="inline-link" onClick={() => setActiveTab("leads")} style={{ background: "none", border: 0, marginInlineStart: "auto" }}>
                        Respond Leads
                      </button>
                    </div>
                  )}

                  {completenessScore === 100 && leads.filter((l) => l.status === "new").length === 0 && (
                    <p style={{ color: "var(--muted)" }}>{t.noActions}</p>
                  )}
                </div>
              </section>

              {/* Chart views */}
              <section className="dashboard-section">
                <h3>Profile Views (Last 30 Days)</h3>
                <div className="chart-container">
                  <div className="chart-bar-layout">
                    {viewsMock.map((val, idx) => (
                      <div key={idx} className="chart-bar-col">
                        <span className="chart-bar-value">{val}</span>
                        <div className="chart-bar" style={{ height: `${(val / 150) * 140}px` }}></div>
                        <span className="chart-bar-label">{viewsLabels[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Recent Reviews strip */}
              <section className="dashboard-section">
                <div className="section-head">
                  <h3>{t.recentReviews}</h3>
                  <button className="inline-link" onClick={() => setActiveTab("reviews")} style={{ background: "none", border: 0 }}>
                    Manage Replies
                  </button>
                </div>
                <div style={{ display: "grid", gap: "12px" }}>
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="review-item-card" style={{ padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Reviewer Rating</strong>
                        <div className="rating-stars">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", margin: "4px 0" }}>{review.comment || "No comment left."}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* MY LISTING PREVIEW & EDITOR */}
          {activeTab === "listing" && (
            <div className="tab-content">
              {/* Completeness Score */}
              <div className="completeness-box">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{t.completenessScore}: {completenessScore}%</strong>
                  <span style={{ fontSize: "13px" }}>{completedCount} / {completenessChecks.length} {t.checklistCompleted}</span>
                </div>
                <div className="completeness-bar-bg">
                  <div className="completeness-bar-fill" style={{ width: `${completenessScore}%` }}></div>
                </div>
                <div style={{ display: "grid", gap: "6px", marginTop: "10px" }}>
                  {completenessChecks.map((check, idx) => (
                    <div key={idx} className={`checklist-item ${check.done ? "done" : ""}`}>
                      <CheckCircle size={14} color={check.done ? "var(--green)" : "var(--muted)"} />
                      {check.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Listing fields details */}
              <section className="dashboard-section">
                <div className="section-head">
                  <h3>Business General Information</h3>
                  <button
                    onClick={() => {
                      setEditModal("info");
                      setEditName(activeBusiness.translations[0]?.name ?? "");
                      setEditDesc(activeBusiness.translations[0]?.description ?? "");
                    }}
                    className="inline-link"
                    style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <Edit2 size={14} /> {t.editSection}
                  </button>
                </div>
                <dl>
                  <dt>Business Name</dt>
                  <dd><strong>{activeBusiness.translations[0]?.name ?? "Unnamed"}</strong></dd>

                  <dt>Description</dt>
                  <dd>{activeBusiness.translations[0]?.description ?? "No description added yet."}</dd>
                </dl>
              </section>

              <section className="dashboard-section">
                <div className="section-head">
                  <h3>Contact & Location details</h3>
                  <button
                    onClick={() => {
                      setEditModal("contact");
                      setEditPhone(activeBusiness.phone ?? "");
                      setEditWhatsapp(activeBusiness.whatsapp ?? "");
                      setEditAddress(activeBusiness.address ?? "");
                      setEditLatitude(activeBusiness.latitude ?? null);
                      setEditLongitude(activeBusiness.longitude ?? null);
                      setEditPriceRange(activeBusiness.priceRange ?? "$$");
                    }}
                    className="inline-link"
                    style={{ background: "none", border: 0, display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <Edit2 size={14} /> {t.editSection}
                  </button>
                </div>
                <dl>
                  <dt>Phone Number</dt>
                  <dd>{activeBusiness.phone ?? "Not listed"}</dd>

                  <dt>WhatsApp Number</dt>
                  <dd>{activeBusiness.whatsapp ?? "Not listed"}</dd>

                  <dt>Address</dt>
                  <dd>{activeBusiness.address ?? "Not listed"}</dd>

                  <dt>Map Pin</dt>
                  <dd>
                    {typeof activeBusiness.latitude === "number" && typeof activeBusiness.longitude === "number"
                      ? `${activeBusiness.latitude.toFixed(5)}, ${activeBusiness.longitude.toFixed(5)}`
                      : "Not set"}
                  </dd>

                  <dt>Price Category</dt>
                  <dd>{activeBusiness.priceRange ?? "$$"}</dd>
                </dl>
              </section>

              <section className="dashboard-section">
                <div className="section-head">
                  <h3>Opening Hours</h3>
                  <button className="inline-link" style={{ background: "none", border: 0 }}>
                    <Edit2 size={14} /> {t.editSection}
                  </button>
                </div>
                <div style={{ display: "grid", gap: "6px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Saturday - Wednesday</span>
                    <strong>08:00 AM - 08:00 PM</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Thursday</span>
                    <strong>08:00 AM - 04:00 PM</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--red)" }}>
                    <span>Friday</span>
                    <strong>Closed</strong>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* REVIEWS & REPLIES */}
          {activeTab === "reviews" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <div className="section-head" style={{ flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h2>Reviews & Replies</h2>
                    <span className="section-note">Interact with review submitters</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className={`role-switch-btn ${reviewFilter === "all" ? "active" : ""}`} onClick={() => setReviewFilter("all")}>
                      All
                    </button>
                    <button className={`role-switch-btn ${reviewFilter === "5-star" ? "active" : ""}`} onClick={() => setReviewFilter("5-star")}>
                      5 Stars
                    </button>
                    <button className={`role-switch-btn ${reviewFilter === "1-2-star" ? "active" : ""}`} onClick={() => setReviewFilter("1-2-star")}>
                      Critical (1-2★)
                    </button>
                    <button className={`role-switch-btn ${reviewFilter === "unanswered" ? "active" : ""}`} onClick={() => setReviewFilter("unanswered")}>
                      Unanswered
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "16px" }}>
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="review-item-card">
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <strong>Customer Review</strong>
                          <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="rating-stars">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={15} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: "4px 0" }}>{review.comment || "No comment text left."}</p>

                      {/* Display existing replies */}
                      {(review as any).replies?.map((rep: any) => (
                        <div key={rep.id} className="review-reply-box">
                          <span className="review-reply-title">Your Reply</span>
                          <p style={{ margin: 0, fontSize: "14px" }}>{rep.text}</p>
                        </div>
                      ))}

                      {/* Form to submit a reply */}
                      {!(review as any).replies?.length && (
                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", display: "grid", gap: "8px" }}>
                          <textarea
                            value={replies[review.id] ?? ""}
                            onChange={(e) => setReplies({ ...replies, [review.id]: e.target.value })}
                            placeholder="Write your professional response to this customer..."
                            style={{ minHeight: "80px" }}
                          ></textarea>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button
                              onClick={() => submitReply(review.id)}
                              className="action-button"
                              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "var(--red)" }}
                            >
                              <Send size={14} />
                              {t.replyBtn}
                            </button>
                            <button
                              onClick={() => alert("Review flagged. Moderators will audit this review shortly.")}
                              style={{ background: "none", border: 0, color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <Flag size={14} /> Flag review
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredReviews.length === 0 && (
                    <p className="empty-note">No matching reviews received.</p>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* ANALYTICS (PAID FEATURE LOCK) */}
          {activeTab === "analytics" && (
            <div className="tab-content">
              <section className="dashboard-section" style={{ position: "relative" }}>
                <div className="section-head" style={{ marginBottom: "16px" }}>
                  <h2>Analytics Panel</h2>
                  <select value={analyticsDays} onChange={(e) => setAnalyticsDays(e.target.value)} style={{ width: "auto", minHeight: "36px" }}>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                  </select>
                </div>

                {/* Blurred mockup under */}
                <div style={{ filter: planType === "Free" ? "blur(5px)" : "none", pointerEvents: planType === "Free" ? "none" : "auto", display: "grid", gap: "20px" }}>
                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <strong>1,420</strong>
                      <span>Search Impressions</span>
                    </div>
                    <div className="kpi-card">
                      <strong>5.4%</strong>
                      <span>Click-through Rate</span>
                    </div>
                    <div className="kpi-card">
                      <strong>42</strong>
                      <span>Direct Calls / Clicks</span>
                    </div>
                  </div>

                  <div className="chart-container">
                    <strong>Clicks & Calls Trend</strong>
                    <div className="chart-bar-layout" style={{ height: "140px" }}>
                      {[12, 18, 30, 24, 28, 42, 38].map((v, i) => (
                        <div key={i} className="chart-bar-col">
                          <div className="chart-bar" style={{ height: `${v * 3}px`, background: "var(--green)" }}></div>
                          <span className="chart-bar-label">Day {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lock Overlay */}
                {planType === "Free" && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255,255,255,0.7)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "24px",
                      borderRadius: "16px"
                    }}
                  >
                    <Lock size={44} style={{ color: "var(--red)", marginBottom: "16px" }} />
                    <h3 style={{ margin: 0 }}>{t.analyticsLocked}</h3>
                    <p style={{ color: "var(--muted)", maxWidth: "400px", margin: "8px 0 16px", fontSize: "14px" }}>
                      {t.analyticsLockedDesc}
                    </p>
                    <button
                      onClick={() => setPlanType("Premium")}
                      className="action-button"
                      style={{ background: "var(--red)" }}
                    >
                      {t.upgradeCTA}
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* LEADS & QUOTES */}
          {activeTab === "leads" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <div className="section-head">
                  <h2>Leads & Quote Requests</h2>
                  <span className="section-note">Incoming inquiries from prospective customers</span>
                </div>

                <div style={{ display: "grid", gap: "14px" }}>
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: "12px",
                        padding: "18px",
                        background: "white",
                        display: "grid",
                        gap: "10px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <strong style={{ fontSize: "18px" }}>{lead.name}</strong>
                          <span style={{ fontSize: "12px", color: "var(--muted)", display: "block" }}>
                            Received: {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className={`role-switch-btn ${lead.status === "new" ? "active" : ""}`}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => updateLeadStatus(lead.id, "new")}
                          >
                            {t.leadStatusNew}
                          </button>
                          <button
                            className={`role-switch-btn ${lead.status === "contacted" ? "active" : ""}`}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => updateLeadStatus(lead.id, "contacted")}
                          >
                            {t.leadStatusProgress}
                          </button>
                          <button
                            className={`role-switch-btn ${lead.status === "closed" ? "active" : ""}`}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => updateLeadStatus(lead.id, "closed")}
                          >
                            {t.leadStatusClosed}
                          </button>
                        </div>
                      </div>

                      {lead.message && (
                        <p style={{ background: "var(--paper)", padding: "10px 12px", borderRadius: "8px", fontSize: "14px", margin: 0 }}>
                          {lead.message}
                        </p>
                      )}

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "10px", marginTop: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Phone size={12} /> Contact: <strong>{lead.phone}</strong>
                        </span>
                        <a
                          className="inline-link"
                          style={{ marginInlineStart: "auto" }}
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}

                  {leads.length === 0 && (
                    <p className="empty-note">No quote requests received yet.</p>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* PHOTO GALLERY */}
          {activeTab === "photos" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <h2>Photo Gallery</h2>
                <div
                  style={{
                    border: "2px dashed var(--line)",
                    borderRadius: "12px",
                    padding: "32px 16px",
                    textAlign: "center",
                    background: "var(--paper)",
                    cursor: "pointer"
                  }}
                  onClick={() => alert("Simulated photo selection dialog")}
                >
                  <Upload size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
                  <strong>Drag & drop images here to upload</strong>
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0" }}>
                    Allowed formats: PNG, JPG, WEBP. Max size: 5MB.
                  </p>
                </div>

                <div className="photos-masonry" style={{ marginTop: "20px" }}>
                  {gallery.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <img src={photo.url} alt="Gallery" className="photo-img" />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <span className={`status-pill status-${photo.status === "approved" ? "published" : "pending"}`} style={{ fontSize: "10px", padding: "2px 6px" }}>
                          {photo.status}
                        </span>
                        {photo.cover ? (
                          <span style={{ fontSize: "11px", fontWeight: "bold", color: "var(--red)" }}>Cover Photo</span>
                        ) : (
                          <button
                            onClick={() => setGallery(gallery.map((g) => ({ ...g, cover: g.id === photo.id })))}
                            style={{ background: "none", border: 0, fontSize: "11px", color: "var(--muted)" }}
                          >
                            Set Cover
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setGallery(gallery.filter((g) => g.id !== photo.id))}
                        className="delete-photo-btn"
                        style={{ marginTop: "6px" }}
                      >
                        Delete Photo
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ADS & PROMOTIONS */}
          {activeTab === "ads" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <h2>Ads & Promotions</h2>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  Promote your business on Paidaco to boost visibility and acquire high-intent local customer leads.
                </p>

                <div style={{ display: "grid", gap: "16px", marginTop: "14px" }}>
                  <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{t.adFeatured}</strong>
                      <span style={{ fontSize: "12px", background: "rgba(184, 11, 41, 0.1)", color: "var(--red)", padding: "3px 8px", borderRadius: "6px" }}>$5/day</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                      Keep your business at the top of category pages in Kabul/Herat when users explore lists.
                    </p>
                  </div>

                  <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{t.adBanner}</strong>
                      <span style={{ fontSize: "12px", background: "rgba(184, 11, 41, 0.1)", color: "var(--red)", padding: "3px 8px", borderRadius: "6px" }}>$8/day</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                      Display a graphical banner in high-traffic landing areas.
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", marginTop: "24px", paddingTop: "20px" }}>
                  <h3>Campaign Selector Settings</h3>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Campaign successfully created!"); }} style={{ display: "grid", gap: "12px", maxWidth: "500px", marginTop: "10px" }}>
                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>Ad Placement Type</span>
                      <select style={{ minHeight: "40px" }}>
                        <option value="featured">{t.adFeatured}</option>
                        <option value="banner">{t.adBanner}</option>
                        <option value="spotlight">{t.adSpotlight}</option>
                      </select>
                    </label>

                    <label style={{ display: "grid", gap: "6px" }}>
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}>{t.budget} (USD)</span>
                      <input type="number" defaultValue="10" style={{ background: "var(--paper)" }} />
                    </label>

                    <button className="action-button" style={{ background: "var(--red)", marginTop: "8px", justifySelf: "start" }} type="submit">
                      Start Promotion
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <h2>Billing details</h2>
                <div style={{ display: "flex", justifyContent: "space-between", background: "var(--paper)", border: "1px solid var(--line)", padding: "16px", borderRadius: "10px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Current Plan</span>
                    <strong style={{ display: "block", fontSize: "20px" }}>{planType} Account</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>{t.nextBilling}</span>
                    <strong style={{ display: "block", fontSize: "16px" }}>June 22, 2026</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>Payment Card</span>
                    <strong style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CreditCard size={16} /> Visa ending in 4242
                    </strong>
                  </div>
                </div>

                <div style={{ marginTop: "24px" }}>
                  <h3>{t.invoiceHistory}</h3>
                  <div className="admin-table-container">
                    <table className="admin-table" aria-label="Invoice logs">
                      <thead>
                        <tr>
                          <th>Invoice ID</th>
                          <th>Date</th>
                          <th>Plan Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>INV-9023</strong></td>
                          <td>May 22, 2026</td>
                          <td>{planType} Subscription</td>
                          <td>{planType === "Premium" ? "$49.00" : "$0.00"}</td>
                          <td><span className="status-pill status-published" style={{ fontSize: "11px", padding: "2px 6px" }}>PAID</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="tab-content">
              <section className="dashboard-section">
                <h2>Settings</h2>
                <div style={{ display: "grid", gap: "16px", maxWidth: "600px" }}>
                  <label style={{ display: "grid", gap: "6px" }}>
                    <span>E-mail notifications</span>
                    <label style={{ flexDirection: "row", display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", fontWeight: "normal" }}>
                      <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", minHeight: "auto" }} />
                      Send alerts when new review is received
                    </label>
                    <label style={{ flexDirection: "row", display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", fontWeight: "normal" }}>
                      <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", minHeight: "auto" }} />
                      Send alerts for quote requests
                    </label>
                  </label>

                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                    <h3>Team Access Management</h3>
                    <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "10px" }}>
                      Invite other employees to help moderate reviews and leads of this business.
                    </p>
                    <button className="action-button ghost" disabled style={{ opacity: 0.6 }}>
                      Invite Member (Coming Soon)
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* EDITING DIALOG MODALS */}
      {editModal === "info" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Listing Information</h3>
              <button className="close-modal-btn" onClick={() => setEditModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveListingInfo} className="settings-form">
              <label>
                <span>Business name (display title)</span>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </label>

              <label>
                <span>Detailed Description</span>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} required />
              </label>

              <button className="action-button" style={{ background: "var(--red)" }} type="submit">
                Save Updates
              </button>
            </form>
          </div>
        </div>
      )}

      {editModal === "contact" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Contact details</h3>
              <button className="close-modal-btn" onClick={() => setEditModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveListingInfo} className="settings-form">
              <label>
                <span>Phone number</span>
                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
              </label>

              <label>
                <span>WhatsApp number</span>
                <input type="text" value={editWhatsapp} onChange={(e) => setEditWhatsapp(e.target.value)} />
              </label>

              <label>
                <span>Location details (Map pin text)</span>
                <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required />
              </label>

              <LocationPicker
                locale={locale}
                value={{ latitude: editLatitude, longitude: editLongitude }}
                onChange={({ latitude, longitude }) => {
                  setEditLatitude(latitude);
                  setEditLongitude(longitude);
                }}
              />

              <label>
                <span>Price Category</span>
                <select value={editPriceRange} onChange={(e) => setEditPriceRange(e.target.value)} style={{ minHeight: "40px" }}>
                  <option value="$">Low ($)</option>
                  <option value="$$">Moderate ($$)</option>
                  <option value="$$$">High ($$$)</option>
                </select>
              </label>

              <button className="action-button" style={{ background: "var(--red)" }} type="submit">
                Save Updates
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
