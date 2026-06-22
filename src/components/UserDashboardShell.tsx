"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Star,
  Bookmark,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  Camera,
  CheckCircle2,
  Mail,
  Lock,
  ExternalLink
} from "lucide-react";
import { type Locale, localePath } from "@/lib/i18n";

type UserDashboardShellProps = {
  locale: Locale;
  profile: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    roles?: string[];
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    approved: boolean;
    createdAt: Date;
    business: {
      slug: string;
      city: { slug: string };
      translations: Array<{ locale: string; name: string }>;
    };
  }>;
  quoteRequests: Array<{
    id: string;
    createdAt: Date;
    status: string;
    business: {
      slug: string;
      city: { slug: string };
      translations: Array<{ locale: string; name: string }>;
    };
  }>;
  onDeleteReview?: (id: string) => Promise<void>;
  onUpdateProfile?: (data: { name: string; phone: string }) => Promise<void>;
};

export function UserDashboardShell({
  locale,
  profile,
  reviews,
  quoteRequests,
  onDeleteReview,
  onUpdateProfile
}: UserDashboardShellProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [profileName, setProfileName] = useState(profile.name ?? "");
  const [profilePhone, setProfilePhone] = useState(profile.phone ?? "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<"success" | "error" | null>(null);

  // Mock data for saved places
  const [savedPlaces, setSavedPlaces] = useState([
    { id: "1", name: "Bagh-e Babur Cafe", category: "Restaurants", rating: 4.7, city: "Kabul", slug: "bagh-e-babur-cafe", citySlug: "kabul", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80" },
    { id: "2", name: "Shar-e Naw Mobile Center", category: "Mobile Shops", rating: 4.3, city: "Kabul", slug: "shar-e-naw-mobile-center", citySlug: "kabul", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80" },
    { id: "3", name: "Arian Dental Clinic", category: "Doctors", rating: 4.8, city: "Herat", slug: "arian-dental-clinic", citySlug: "herat", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80" },
    { id: "4", name: "Blue Mosque Wedding Hall", category: "Wedding Halls", rating: 4.5, city: "Mazar-e-Sharif", slug: "blue-mosque-wedding-hall", citySlug: "mazar-e-sharif", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" }
  ]);

  // Mock data for user photos
  const [userPhotos, setUserPhotos] = useState([
    { id: "p1", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80", business: "Bagh-e Babur Cafe", status: "approved", date: "2026-05-10" },
    { id: "p2", url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=300&q=80", business: "Shar-e Naw Mobile Center", status: "pending", date: "2026-05-18" }
  ]);

  // Mock data for notification status
  const [notifications, setNotifications] = useState([
    { id: "n1", text: "Your review for Bagh-e Babur Cafe was approved!", date: "2 hours ago", unread: true },
    { id: "n2", text: "Bagh-e Babur Cafe replied: 'Thank you for your feedback!'", date: "1 day ago", unread: false }
  ]);

  const [savedSort, setSavedSort] = useState("recent");

  // Multilingual translations
  const t = {
    fa: {
      welcome: "خوش آمدید",
      reputation: "امتیاز اعتبار",
      nextTier: "مانده تا نشان بعدی",
      recentActivity: "فعالیت‌های اخیر",
      savedPlaces: "جاهای ذخیره شده",
      pendingActions: "کارهای در انتظار",
      draftTitle: "پیش‌نویس بررسی کامل‌نشده",
      draftDesc: "شما یک بررسی ناتمام برای 'سالن رز هرات' دارید.",
      continueWriting: "ادامه نوشتن بررسی",
      allReviews: "همه نظرها",
      myReviews: "نظرهای من",
      myPhotos: "عکس‌های من",
      messages: "پیام‌ها",
      quoteRequests: "درخواست‌های قیمت",
      settings: "تنظیمات حساب",
      help: "راهنما و پشتیبانی",
      overview: "نمای کلی",
      all: "همه",
      approved: "تایید شده",
      pending: "در انتظار",
      rejected: "رد شده",
      replied: "پاسخ داده شده",
      expandedReply: "پاسخ مدیریت کسب‌وکار",
      sortBy: "مرتب‌سازی بر اساس",
      sortRecent: "اخیراً ذخیره شده",
      sortRating: "امتیاز بالاتر",
      sortAlpha: "الفبا",
      uploadPhoto: "آپلود عکس جدید",
      deletePhoto: "حذف عکس",
      noPhotos: "هنوز عکسی آپلود نکرده‌اید.",
      noReviews: "هنوز نظری ثبت نکرده‌اید.",
      noQuotes: "هنوز درخواست قیمتی ارسال نکرده‌اید.",
      saveChanges: "ذخیره تغییرات",
      profileInfo: "اطلاعات پروفایل",
      fullName: "نام کامل",
      phoneNumber: "شماره تلفن",
      emailAddress: "آدرس ایمیل",
      notificationsPref: "تنظیمات اعلان‌ها",
      emailAlerts: "اعلان‌های ایمیلی برای پاسخ‌ها و پیام‌های جدید",
      deleteAccount: "حذف حساب کاربری",
      deleteAccountWarn: "این عمل غیرقابل برگشت است. تمام اطلاعات شما برای همیشه پاک خواهد شد.",
      deleteConfirm: "حذف دائمی حساب",
      statusSaved: "تغییرات با موفقیت ذخیره شد.",
      statusError: "خطایی رخ داد. دوباره تلاش کنید."
    },
    ps: {
      welcome: "ښه راغلاست",
      reputation: "د اعتبار نمرې",
      nextTier: "پاتې تر بل نښان پورې",
      recentActivity: "وروستي فعالیتونه",
      savedPlaces: "خوندي شوي ځایونه",
      pendingActions: "په تمه کارونه",
      draftTitle: "نیمګړی لیکل شوی نظر",
      draftDesc: "تاسو د 'هرات ګلاب سالون' لپاره یو ناچاپ شوی نظر لرئ.",
      continueWriting: "د نظر لیکلو دوام",
      allReviews: "ټول نظرونه",
      myReviews: "زما نظرونه",
      myPhotos: "زما انځورونه",
      messages: "پیامونه",
      quoteRequests: "د نرخ غوښتنې",
      settings: "د حساب ترتیبات",
      help: "لارښود او ملاتړ",
      overview: "لنډیز",
      all: "ټول",
      approved: "تایید شوي",
      pending: "په تمه",
      rejected: "رد شوي",
      replied: "ځواب شوي",
      expandedReply: "د کاروبار ځواب",
      sortBy: "ترتیب پر اساس د",
      sortRecent: "نوي خوندي شوي",
      sortRating: "لوړ امتیاز",
      sortAlpha: "الفبا",
      uploadPhoto: "د نوي انځور اپلوډ",
      deletePhoto: "انځور حذف کړئ",
      noPhotos: "تر اوسه مو کوم انځور نه دی اپلوډ کړی.",
      noReviews: "تر اوسه مو کوم نظر نه دی ثبت کړی.",
      noQuotes: "تر اوسه مو د نرخ غوښتنه نه ده لیږلې.",
      saveChanges: "بدلونونه خوندي کړئ",
      profileInfo: "پېژندپاڼه معلومات",
      fullName: "بشپړ نوم",
      phoneNumber: "تلیفون شمیره",
      emailAddress: "بریښنالیک پته",
      notificationsPref: "د خبرتیاوو تنظیمات",
      emailAlerts: "د نوي ځوابونو او پیغامونو لپاره ایمیل خبرتیاوې غواړم",
      deleteAccount: "د حساب حذف کول",
      deleteAccountWarn: "دا کار بې ځوابه دی. ستاسو ټول معلومات به د تل لپاره حذف شي.",
      deleteConfirm: "د حساب دایمي حذف",
      statusSaved: "بدلونونه په بریالیتوب سره خوندي شول.",
      statusError: "ستونزه رامنځته شوه. بیا هڅه وکړئ."
    },
    en: {
      welcome: "Welcome back",
      reputation: "Reputation score",
      nextTier: "to next badge tier",
      recentActivity: "Recent Activity",
      savedPlaces: "Saved Places",
      pendingActions: "Pending Actions",
      draftTitle: "Unfinished Review Draft",
      draftDesc: "You left a draft review for 'Herat Rose Salon'.",
      continueWriting: "Continue Writing Review",
      allReviews: "All Reviews",
      myReviews: "My Reviews",
      myPhotos: "My Photos",
      messages: "Messages",
      quoteRequests: "Quote Requests",
      settings: "Settings",
      help: "Help & Support",
      overview: "Overview",
      all: "All",
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected",
      replied: "Replied",
      expandedReply: "Business Owner's Reply",
      sortBy: "Sort by",
      sortRecent: "Recently Saved",
      sortRating: "Highest Rating",
      sortAlpha: "Alphabetical",
      uploadPhoto: "Upload Photo",
      deletePhoto: "Delete Photo",
      noPhotos: "No photos uploaded yet.",
      noReviews: "No reviews written yet.",
      noQuotes: "No quote requests sent yet.",
      saveChanges: "Save Changes",
      profileInfo: "Profile Info",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      emailAddress: "Email Address",
      notificationsPref: "Notification Preferences",
      emailAlerts: "Email alerts for review replies & direct messages",
      deleteAccount: "Delete Account",
      deleteAccountWarn: "This action is permanent and cannot be undone. All user records will be destroyed.",
      deleteConfirm: "Confirm Delete Account",
      statusSaved: "Changes saved successfully.",
      statusError: "Error saving profile. Try again."
    }
  }[locale];

  // Logic to handle review toggle
  const toggleReview = (id: string) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handles profile updating
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateStatus(null);
    try {
      if (onUpdateProfile) {
        await onUpdateProfile({ name: profileName, phone: profilePhone });
        setUpdateStatus("success");
      } else {
        // Fallback for visual mock
        setTimeout(() => {
          setUpdateStatus("success");
          setIsUpdating(false);
        }, 800);
      }
    } catch {
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    if (reviewFilter === "approved") return r.approved;
    if (reviewFilter === "pending") return !r.approved;
    return false; // placeholder for rejected if modeled later
  });

  // Sort saved places
  const sortedPlaces = [...savedPlaces].sort((a, b) => {
    if (savedSort === "rating") return b.rating - a.rating;
    if (savedSort === "alphabetical") return a.name.localeCompare(b.name);
    return 1; // Default unsorted / recent
  });

  // Calculations for reputation progress bar
  const totalReviewsCount = reviews.length;
  const totalPhotosCount = userPhotos.length;
  const reputationScore = totalReviewsCount * 25 + totalPhotosCount * 10;
  const reputationTarget = reputationScore < 100 ? 100 : reputationScore < 300 ? 300 : 500;
  const progressPercent = Math.min(100, Math.round((reputationScore / reputationTarget) * 100));
  const badgeName = reputationScore < 100 ? "Local Explorer" : reputationScore < 300 ? "Silver Contributor" : "Elite Guide";

  return (
    <div className="dashboard-shell">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-profile">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "grid",
                placeItems: "center",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              {profileName[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="profile-meta">
              <strong>{profileName || "User Account"}</strong>
              <span>{profile.email}</span>
              {profile.roles && profile.roles.length > 0 && (
                <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                  {profile.roles.map((r) => (
                    <span
                      key={r}
                      style={{
                        fontSize: "9px",
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {r.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              marginTop: "8px",
              background: "rgba(255, 255, 255, 0.12)",
              padding: "8px 12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} style={{ color: "#ffd700" }} />
              {locale === "en" ? `Badge: ${badgeName}` : locale === "fa" ? `نشان: ${badgeName}` : `نښان: ${badgeName}`}
            </span>
            <strong>{reputationScore}</strong>
          </div>
        </div>

        <nav className="dashboard-sidebar-nav" aria-label="Dashboard views">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <User size={18} />
            {t.overview}
          </button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            <Star size={18} />
            {t.myReviews}
            {reviews.length > 0 && <span className="queue-count">{reviews.length}</span>}
          </button>
          <button className={activeTab === "saved" ? "active" : ""} onClick={() => setActiveTab("saved")}>
            <Bookmark size={18} />
            {t.savedPlaces}
          </button>
          <button className={activeTab === "photos" ? "active" : ""} onClick={() => setActiveTab("photos")}>
            <ImageIcon size={18} />
            {t.myPhotos}
          </button>
          <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>
            <MessageSquare size={18} />
            {t.messages}
          </button>
          <button className={activeTab === "quotes" ? "active" : ""} onClick={() => setActiveTab("quotes")}>
            <FileText size={18} />
            {t.quoteRequests}
            {quoteRequests.length > 0 && <span className="queue-count">{quoteRequests.length}</span>}
          </button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
            <Settings size={18} />
            {t.settings}
          </button>
          <button className={activeTab === "help" ? "active" : ""} onClick={() => setActiveTab("help")}>
            <HelpCircle size={18} />
            {t.help}
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <section className="dashboard-hero" style={{ background: "white" }}>
              <div>
                <p className="eyebrow" style={{ textTransform: "uppercase" }}>{t.welcome}</p>
                <h2>{profileName || "Valued User"}</h2>
                <p style={{ marginTop: "8px", color: "var(--muted)" }}>
                  Track your stats, view saved places, and read replies to your reviews in your personal hub.
                </p>
                <div style={{ marginTop: "24px", display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>
                      {t.reputation}: <strong>{reputationScore}</strong> ({badgeName})
                    </span>
                    <span style={{ color: "var(--muted)" }}>
                      {reputationScore} / {reputationTarget} {t.nextTier}
                    </span>
                  </div>
                  <div className="completeness-bar-bg">
                    <div className="completeness-bar-fill" style={{ width: `${progressPercent}%`, backgroundColor: "var(--red)" }}></div>
                  </div>
                </div>
              </div>
              <div className="dashboard-hero-card">
                <span className="eyebrow" style={{ fontSize: "12px" }}>Dashboard Stats</span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                  <div className="kpi-card" style={{ padding: "10px" }}>
                    <strong style={{ fontSize: "24px" }}>{totalReviewsCount}</strong>
                    <span style={{ fontSize: "12px" }}>{t.myReviews}</span>
                  </div>
                  <div className="kpi-card" style={{ padding: "10px" }}>
                    <strong style={{ fontSize: "24px" }}>{totalPhotosCount}</strong>
                    <span style={{ fontSize: "12px" }}>{t.myPhotos}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pending actions */}
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.pendingActions}</h3>
              </div>
              <div
                style={{
                  background: "#fff9f0",
                  border: "1px dashed #ead9bd",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div>
                  <strong style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a24e02" }}>
                    <Clock size={16} />
                    {t.draftTitle}
                  </strong>
                  <p style={{ fontSize: "14px", margin: "4px 0 0", color: "var(--muted)" }}>
                    {t.draftDesc}
                  </p>
                </div>
                <Link
                  className="action-button"
                  style={{ fontSize: "13px", padding: "8px 16px", background: "var(--red)" }}
                  href={localePath(locale, "/business/herat/herat-rose-salon")}
                >
                  {t.continueWriting}
                </Link>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.recentActivity}</h3>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="review-item-card" style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{review.business.translations[0]?.name ?? review.business.slug}</strong>
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className={`status-pill status-${review.approved ? "published" : "pending"}`} style={{ fontSize: "11px", padding: "3px 8px" }}>
                          {review.approved ? t.approved : t.pending}
                        </span>
                        <div className="rating-stars">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && <p style={{ margin: "4px 0 0", fontSize: "14px" }}>{review.comment}</p>}
                  </div>
                ))}
                {reviews.length === 0 && <p className="empty-note">{t.noReviews}</p>}
              </div>
            </section>

            {/* Saved Places strip */}
            <section className="dashboard-section">
              <div className="section-head">
                <h3>{t.savedPlaces}</h3>
                <button className="inline-link" onClick={() => setActiveTab("saved")} style={{ background: "none", border: 0 }}>
                  View All
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                {savedPlaces.slice(0, 4).map((place) => (
                  <div
                    key={place.id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "white",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <img src={place.image} alt={place.name} style={{ height: "100px", width: "100%", objectFit: "cover" }} />
                    <div style={{ padding: "10px", display: "grid", gap: "4px" }}>
                      <strong style={{ fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {place.name}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>{place.category} · {place.city}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "bold" }}>
                        <Star size={12} fill="#ffb100" color="#ffb100" />
                        {place.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MY REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2>{t.myReviews}</h2>
                  <span className="section-note">Manage reviews you've written</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className={`role-switch-btn ${reviewFilter === "all" ? "active" : ""}`} onClick={() => setReviewFilter("all")}>
                    {t.all}
                  </button>
                  <button className={`role-switch-btn ${reviewFilter === "approved" ? "active" : ""}`} onClick={() => setReviewFilter("approved")}>
                    {t.approved}
                  </button>
                  <button className={`role-switch-btn ${reviewFilter === "pending" ? "active" : ""}`} onClick={() => setReviewFilter("pending")}>
                    {t.pending}
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                {filteredReviews.map((review) => {
                  const isExpanded = !!expandedReviews[review.id];
                  return (
                    <div key={review.id} className="review-item-card">
                      <div className="review-header">
                        <div>
                          <strong style={{ fontSize: "18px" }}>
                            {review.business.translations[0]?.name ?? review.business.slug}
                          </strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span className={`status-pill status-${review.approved ? "published" : "pending"}`}>
                            {review.approved ? t.approved : t.pending}
                          </span>
                          <div className="rating-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < review.rating ? "currentColor" : "none"}
                                color={i < review.rating ? "#ffb100" : "var(--line)"}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => toggleReview(review.id)}
                            style={{ background: "none", color: "var(--muted)", padding: "4px" }}
                            aria-label="Toggle details"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </div>

                      {review.comment && (
                        <p className="review-body" style={{ marginTop: "6px" }}>
                          {review.comment}
                        </p>
                      )}

                      {isExpanded && (
                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "grid", gap: "12px" }}>
                          {/* Mock reply if approved */}
                          {review.approved && (
                            <div className="review-reply-box">
                              <span className="review-reply-title">{t.expandedReply}</span>
                              <p style={{ margin: 0, fontSize: "14px", color: "var(--ink)" }}>
                                Salam! Thank you for taking the time to write a review. We are thrilled to hear you had a great experience and we hope to serve you again soon!
                              </p>
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                            <Link
                              className="inline-link"
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px" }}
                              href={localePath(locale, `/business/${review.business.city.slug}/${review.business.slug}`)}
                            >
                              View Listing <ExternalLink size={14} />
                            </Link>

                            {onDeleteReview && (
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this review?")) {
                                    await onDeleteReview(review.id);
                                  }
                                }}
                                style={{
                                  background: "rgba(184, 11, 41, 0.08)",
                                  color: "var(--red)",
                                  border: 0,
                                  borderRadius: "8px",
                                  padding: "8px 12px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  fontSize: "13px",
                                  fontWeight: 600
                                }}
                              >
                                <Trash2 size={14} />
                                Delete Review
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredReviews.length === 0 && (
                  <div className="empty-state">
                    <strong>{t.noReviews}</strong>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* SAVED PLACES TAB */}
        {activeTab === "saved" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2>{t.savedPlaces}</h2>
                  <span className="section-note">Businesses you bookmarked</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>{t.sortBy}:</span>
                  <select
                    value={savedSort}
                    onChange={(e) => setSavedSort(e.target.value)}
                    style={{ minHeight: "38px", padding: "4px 10px", width: "auto" }}
                  >
                    <option value="recent">{t.sortRecent}</option>
                    <option value="rating">{t.sortRating}</option>
                    <option value="alphabetical">{t.sortAlpha}</option>
                  </select>
                </div>
              </div>

              <div className="listing-grid">
                {sortedPlaces.map((place) => (
                  <article key={place.id} className="business-card">
                    <div className="business-photo">
                      <img src={place.image} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        onClick={() => setSavedPlaces(savedPlaces.filter((p) => p.id !== place.id))}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "white",
                          border: 0,
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--red)",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                        }}
                        aria-label="Remove bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="business-body" style={{ padding: "14px" }}>
                      <h3 style={{ fontSize: "18px" }}>{place.name}</h3>
                      <span className="muted" style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} /> {place.city}
                      </span>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                        <span style={{ background: "var(--warm)", padding: "4px 8px", borderRadius: "6px", fontSize: "12px" }}>
                          {place.category}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "14px" }}>
                          <Star size={14} fill="#ffb100" color="#ffb100" />
                          {place.rating}
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid var(--line)", marginTop: "12px", paddingTop: "10px", textAlign: "center" }}>
                        <Link
                          className="inline-link"
                          style={{ fontSize: "13px" }}
                          href={localePath(locale, `/business/${place.citySlug}/${place.slug}`)}
                        >
                          View Listing
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MY PHOTOS TAB */}
        {activeTab === "photos" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <div>
                  <h2>{t.myPhotos}</h2>
                  <span className="section-note">Photos you uploaded to listings</span>
                </div>
                <button className="action-button" style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--red)" }}>
                  <Camera size={16} />
                  {t.uploadPhoto}
                </button>
              </div>

              {userPhotos.length > 0 ? (
                <div className="photos-masonry">
                  {userPhotos.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <img src={photo.url} alt={photo.business} className="photo-img" />
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>{photo.business}</strong>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                          <span style={{ fontSize: "12px", color: "var(--muted)" }}>{photo.date}</span>
                          <span className={`status-pill status-${photo.status === "approved" ? "published" : "pending"}`} style={{ fontSize: "10px", padding: "2px 6px" }}>
                            {photo.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setUserPhotos(userPhotos.filter((p) => p.id !== photo.id))}
                        className="delete-photo-btn"
                      >
                        {t.deletePhoto}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <strong>{t.noPhotos}</strong>
                </div>
              )}
            </section>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>{t.messages}</h2>
              </div>
              <div style={{ border: "1px dashed var(--line)", padding: "40px 20px", borderRadius: "12px", textAlign: "center", background: "#fdfdfd" }}>
                <MessageSquare size={48} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
                <h3>Direct Messages (Coming Soon)</h3>
                <p style={{ color: "var(--muted)", maxWidth: "440px", margin: "8px auto 0", fontSize: "14px" }}>
                  We are building a direct communication system between users and business owners. You will receive notifications when this feature goes live!
                </p>
              </div>
            </section>
          </div>
        )}

        {/* QUOTE REQUESTS TAB */}
        {activeTab === "quotes" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <div>
                  <h2>{t.quoteRequests}</h2>
                  <span className="section-note">Estimates and pricing inquiries sent to business listings</span>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {quoteRequests.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "16px",
                      background: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "16px" }}>
                        {quote.business.translations[0]?.name ?? quote.business.slug}
                      </strong>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                        <span>Sent: {new Date(quote.createdAt).toLocaleDateString()}</span>
                        <span>Request ID: {quote.id}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <span className={`status-pill status-${quote.status === "new" ? "pending" : "published"}`} style={{ padding: "4px 10px", fontSize: "11px" }}>
                        {quote.status}
                      </span>
                      <Link
                        className="inline-link"
                        style={{ fontSize: "13px" }}
                        href={localePath(locale, `/business/${quote.business.city.slug}/${quote.business.slug}`)}
                      >
                        View Business
                      </Link>
                    </div>
                  </div>
                ))}

                {quoteRequests.length === 0 && (
                  <div className="empty-state">
                    <strong>{t.noQuotes}</strong>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>{t.settings}</h2>
              </div>

              <form onSubmit={handleUpdate} className="settings-form">
                <h3>{t.profileInfo}</h3>

                {updateStatus === "success" && (
                  <div className="toast toast-success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={16} />
                    {t.statusSaved}
                  </div>
                )}
                {updateStatus === "error" && (
                  <div className="toast toast-error">
                    {t.statusError}
                  </div>
                )}

                <label>
                  <span>{t.fullName}</span>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    style={{ background: "var(--paper)" }}
                  />
                </label>

                <label>
                  <span>{t.phoneNumber}</span>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+93 7x xxx xxxx"
                    style={{ background: "var(--paper)" }}
                  />
                </label>

                <label>
                  <span>{t.emailAddress}</span>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      style={{
                        background: "rgba(104,115,131,0.06)",
                        color: "var(--muted)",
                        paddingLeft: "36px",
                        cursor: "not-allowed"
                      }}
                    />
                    <Lock size={14} style={{ position: "absolute", left: "12px", top: "17px", color: "var(--muted)" }} />
                  </div>
                </label>

                <div style={{ borderTop: "1px solid var(--line)", margin: "10px 0" }}></div>

                <h3>{t.notificationsPref}</h3>
                <label style={{ flexDirection: "row", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ width: "20px", height: "20px", minHeight: "auto", cursor: "pointer" }} />
                  <span style={{ fontSize: "14px", fontWeight: "normal", color: "var(--ink)" }}>{t.emailAlerts}</span>
                </label>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="action-button"
                  style={{ background: "var(--red)", minHeight: "44px", justifySelf: "start", marginTop: "10px" }}
                >
                  {isUpdating ? "Saving..." : t.saveChanges}
                </button>
              </form>

              <div style={{ borderTop: "1px solid var(--line)", marginTop: "24px", paddingTop: "24px" }}>
                <h3 style={{ color: "var(--red)" }}>{t.deleteAccount}</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "12px" }}>
                  {t.deleteAccountWarn}
                </p>
                <button
                  onClick={() => confirm("Delete account permanently?")}
                  style={{
                    background: "transparent",
                    color: "var(--red)",
                    border: "1px solid var(--red)",
                    borderRadius: "8px",
                    padding: "10px 16px",
                    fontWeight: 600
                  }}
                >
                  {t.deleteConfirm}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* HELP TAB */}
        {activeTab === "help" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>{t.help}</h2>
              </div>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", background: "white" }}>
                  <strong style={{ display: "block", fontSize: "16px", marginBottom: "6px" }}>How do reputation badges work?</strong>
                  <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                    You earn reputation scores by writing high-quality reviews (+25 points) and uploading verified photos of local places (+10 points). As your score climbs, you level up and unlock exclusive explorer tiers!
                  </p>
                </div>
                <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", background: "white" }}>
                  <strong style={{ display: "block", fontSize: "16px", marginBottom: "6px" }}>Can I edit my reviews?</strong>
                  <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                    Once a review is submitted, it goes into our moderation queue to filter out spam. While pending, reviews cannot be edited but you can request deletion of any of your reviews under the "My Reviews" tab.
                  </p>
                </div>
                <div style={{ border: "1px solid var(--line)", borderRadius: "10px", padding: "16px", background: "white" }}>
                  <strong style={{ display: "block", fontSize: "16px", marginBottom: "6px" }}>How do I request quotes from local businesses?</strong>
                  <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
                    On any business listing page offering services, click the "Request a Quote" button. Complete the quick form, and the owner will respond right to your phone or here in your dashboard.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
