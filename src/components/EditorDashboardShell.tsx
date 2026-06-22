"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Globe,
  Settings,
  Image as ImageIcon,
  Compass,
  TrendingUp,
  Plus,
  BookOpen,
  Edit,
  Save,
  Trash,
  HelpCircle,
  Eye,
  CheckCircle,
  FileCode,
  Link as LinkIcon,
  X
} from "lucide-react";
import { type Locale, localePath } from "@/lib/i18n";
import { TranslationForm } from "@/components/TranslationForm";

type EditorDashboardShellProps = {
  locale: Locale;
  businesses: Array<{ id: string; slug: string; city: { slug: string } }>;
  categories: Array<{ id: string; slug: string }>;
  products: Array<{ id: string; slug: string; business: { slug: string; city: { slug: string } } }>;
  saveBusinessTranslation: (formData: FormData) => Promise<void>;
  saveCategoryTranslation: (formData: FormData) => Promise<void>;
  saveProductTranslation: (formData: FormData) => Promise<void>;
};

export function EditorDashboardShell({
  locale,
  businesses,
  categories,
  products,
  saveBusinessTranslation,
  saveCategoryTranslation,
  saveProductTranslation
}: EditorDashboardShellProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Blog posts list
  const [blogPosts, setBlogPosts] = useState([
    { id: "b1", title: "Best Restaurants in Kabul (2026 Guide)", category: "Restaurants", status: "Published", author: "Karim", date: "May 10, 2026" },
    { id: "b2", title: "Top English Courses in West Kabul", category: "Courses", status: "Published", author: "Safia", date: "May 18, 2026" }
  ]);

  // Blog composer state
  const [newPostModal, setNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Restaurants");

  // City Pages overrides
  const [cityPages, setCityPages] = useState([
    { id: "c1", city: "Kabul", slug: "kabul", h1: "Find Businesses in Kabul", description: "Discover top verified restaurants, doctors, shops in Kabul." },
    { id: "c2", city: "Herat", slug: "herat", h1: "Explore Local Services in Herat", description: "Find the best dental clinics, schools, and salons in Herat." }
  ]);
  const [selectedCityId, setSelectedCityId] = useState("c1");
  const activeCity = cityPages.find((c) => c.id === selectedCityId);

  // SEO tools
  const [robotsTxt, setRobotsTxt] = useState("User-agent: *\nAllow: /\nSitemap: https://paidaco.com/sitemap.xml");
  const [redirectSource, setRedirectSource] = useState("");
  const [redirectTarget, setRedirectTarget] = useState("");
  const [redirects, setRedirects] = useState([
    { id: "r1", from: "/old-cafe-url", to: "/business/kabul/bagh-e-babur-cafe" }
  ]);

  // Multilingual
  const t = {
    fa: {
      quickStats: "آمار تولید محتوا",
      newPost: "نوشتن راهنمای جدید",
      blogHeader: "وبلاگ و راهنماها",
      blogTitle: "عنوان راهنما",
      draftPreview: "پیش‌نویس محتوا (Markdown)",
      cityPagesHeader: "تنظیمات سئو صفحات شهرها",
      cityH1: "عنوان اصلی صفحه (H1)",
      cityDesc: "توضیحات متا (SEO Meta)",
      translationTab: "مترجم دوزبانه (Dari / Pashto / English)",
      redirectsTitle: "مدیریت تغییر مسیرها (Redirects)",
      redirectFrom: "آدرس قدیمی (From)",
      redirectTo: "آدرس جدید (To)",
      saveBtn: "ذخیره تغییرات"
    },
    ps: {
      quickStats: "د منځپانګې احصایه",
      newPost: "د نوي لارښود لیکل",
      blogHeader: "وبلاګ او لارښودونه",
      blogTitle: "د لارښود سرلیک",
      draftPreview: "د لیکنې مسوده (Markdown)",
      cityPagesHeader: "د ښارونو پاڼو سئو ترتیبات",
      cityH1: "د پاڼې اصلي سرلیک (H1)",
      cityDesc: "د میتا تشریح (SEO Meta)",
      translationTab: "دوه ژبیز ژباړونکی",
      redirectsTitle: "د ادرسونو د بدلولو مدیریت (Redirects)",
      redirectFrom: "زوړ ادرس (From)",
      redirectTo: "نوی ادرس (To)",
      saveBtn: "بدلونونه خوندي کړئ"
    },
    en: {
      quickStats: "Content Overview Stats",
      newPost: "Write New Guide Post",
      blogHeader: "Guides & Blog Manager",
      blogTitle: "Guide Title",
      draftPreview: "Content Draft Editor (Markdown supported)",
      cityPagesHeader: "City SEO Overrides",
      cityH1: "Page Main Header (H1 Title)",
      cityDesc: "Meta Description",
      translationTab: "Side-by-Side Translating Tool",
      redirectsTitle: "Redirection Path Manager (301 Redirects)",
      redirectFrom: "Source URL path (From)",
      redirectTo: "Destination URL path (To)",
      saveBtn: "Save Settings"
    }
  }[locale];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogPosts([
      {
        id: String(Date.now()),
        title: newPostTitle,
        category: newPostCategory,
        status: "Published",
        author: "You",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      },
      ...blogPosts
    ]);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostModal(false);
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirectSource || !redirectTarget) return;
    setRedirects([
      ...redirects,
      { id: String(Date.now()), from: redirectSource, to: redirectTarget }
    ]);
    setRedirectSource("");
    setRedirectTarget("");
  };

  return (
    <div className="dashboard-shell">
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-profile" style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>CMS Center</p>
          <h2>SEO Content Manager</h2>
        </div>

        <nav className="dashboard-sidebar-nav" aria-label="CMS tools">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <TrendingUp size={18} />
            Dashboard
          </button>
          <button className={activeTab === "blog" ? "active" : ""} onClick={() => setActiveTab("blog")}>
            <BookOpen size={18} />
            Blog Posts
            {blogPosts.length > 0 && <span className="queue-count">{blogPosts.length}</span>}
          </button>
          <button className={activeTab === "cities" ? "active" : ""} onClick={() => setActiveTab("cities")}>
            <Compass size={18} />
            City Pages
          </button>
          <button className={activeTab === "translations" ? "active" : ""} onClick={() => setActiveTab("translations")}>
            <Globe size={18} />
            Translations
            {(businesses.length + categories.length + products.length) > 0 && (
              <span className="queue-count" style={{ background: "var(--red)" }}>
                {businesses.length + categories.length + products.length}
              </span>
            )}
          </button>
          <button className={activeTab === "seo-tools" ? "active" : ""} onClick={() => setActiveTab("seo-tools")}>
            <FileCode size={18} />
            SEO & Redirects
          </button>
        </nav>
      </aside>

      {/* Main panel */}
      <div className="dashboard-main">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="tab-content">
            <section className="dashboard-hero" style={{ background: "white" }}>
              <h2>SEO Dashboard</h2>
              <p style={{ color: "var(--muted)", marginTop: "4px" }}>
                Keep our landing pages and directories localized to maintain high organic visibility in search results.
              </p>
            </section>

            <div className="kpi-grid">
              <div className="kpi-card">
                <strong>86%</strong>
                <span>Overall Locale Match Rate</span>
              </div>
              <div className="kpi-card">
                <strong>{blogPosts.length}</strong>
                <span>Published Blog Posts</span>
              </div>
              <div className="kpi-card">
                <strong>{businesses.length}</strong>
                <span>Missing Business Info (EN/FA/PS)</span>
              </div>
            </div>

            <section className="dashboard-section">
              <h3>Top Performing Guide Pages (Organic Clicks)</h3>
              <div className="admin-table-container">
                <table className="admin-table" aria-label="Performance table">
                  <thead>
                    <tr>
                      <th>Guide Page Path</th>
                      <th>Monthly Clicks</th>
                      <th>Average Position</th>
                      <th>Locale Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>/blog/best-restaurants-in-kabul</strong></td>
                      <td>12,480 Clicks</td>
                      <td>#1.2 Rank</td>
                      <td>FA, PS, EN</td>
                    </tr>
                    <tr>
                      <td><strong>/blog/mobile-shops-in-shar-e-naw</strong></td>
                      <td>8,320 Clicks</td>
                      <td>#1.8 Rank</td>
                      <td>FA, EN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* BLOG POSTS TAB */}
        {activeTab === "blog" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <div className="section-head">
                <h2>{t.blogHeader}</h2>
                <button
                  onClick={() => setNewPostModal(true)}
                  className="action-button"
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--red)" }}
                >
                  <Plus size={16} />
                  {t.newPost}
                </button>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "16px",
                      background: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "16px" }}>{post.title}</strong>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                        <span>Category: {post.category}</span>
                        <span>Author: {post.author}</span>
                        <span>Published: {post.date}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span className="status-pill status-published" style={{ fontSize: "11px", padding: "4px 8px" }}>
                        {post.status}
                      </span>
                      <button
                        onClick={() => setBlogPosts(blogPosts.filter((p) => p.id !== post.id))}
                        style={{ background: "none", border: 0, color: "var(--muted)" }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CITY PAGES OVERRIDES */}
        {activeTab === "cities" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <h2>{t.cityPagesHeader}</h2>
              <div style={{ display: "flex", gap: "10px", margin: "14px 0" }}>
                {cityPages.map((city) => (
                  <button
                    key={city.id}
                    className={`role-switch-btn ${selectedCityId === city.id ? "active" : ""}`}
                    onClick={() => setSelectedCityId(city.id)}
                  >
                    {city.city}
                  </button>
                ))}
              </div>

              {activeCity && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("City Page SEO updates saved!");
                  }}
                  className="settings-form"
                >
                  <label>
                    <span>{t.cityH1}</span>
                    <input
                      type="text"
                      value={activeCity.h1}
                      onChange={(e) => {
                        setCityPages(cityPages.map((c) => (c.id === activeCity.id ? { ...c, h1: e.target.value } : c)));
                      }}
                      required
                      style={{ background: "var(--paper)" }}
                    />
                  </label>

                  <label>
                    <span>{t.cityDesc}</span>
                    <textarea
                      value={activeCity.description}
                      onChange={(e) => {
                        setCityPages(cityPages.map((c) => (c.id === activeCity.id ? { ...c, description: e.target.value } : c)));
                      }}
                      required
                      style={{ minHeight: "80px" }}
                    />
                  </label>

                  <button className="action-button" style={{ background: "var(--red)", justifySelf: "start" }} type="submit">
                    {t.saveBtn}
                  </button>
                </form>
              )}
            </section>
          </div>
        )}

        {/* TRANSLATIONS TRIAGE */}
        {activeTab === "translations" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <h2>{t.translationTab}</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                Translate system-wide business entities side-by-side to guarantee local accessibility.
              </p>

              {/* Businesses list */}
              <h3 style={{ marginTop: "24px" }}>Businesses Missing Translations ({businesses.length})</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {businesses.map((business, index) => {
                  const nextAnchor = businesses[index + 1] ? `business-${businesses[index + 1].id}` : null;
                  return (
                    <div
                      key={business.id}
                      id={`business-${business.id}`}
                      style={{ border: "1px solid var(--line)", padding: "16px", borderRadius: "12px", background: "white", display: "grid", gap: "10px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>{business.slug}</strong>
                        <Link
                          className="inline-link"
                          style={{ fontSize: "13px" }}
                          href={localePath(locale, `/business/${business.city.slug}/${business.slug}`)}
                        >
                          View Original
                        </Link>
                      </div>
                      <TranslationForm
                        action={saveBusinessTranslation}
                        locale={locale}
                        entityId={business.id}
                        entityField="businessId"
                        nameLabel="Name translation"
                        descriptionLabel="Description translation"
                        saveLabel="Save Translation"
                        requiredText="Required"
                        maxHintLabel="Max length"
                        nextAnchor={nextAnchor}
                      />
                    </div>
                  );
                })}
                {businesses.length === 0 && <p className="empty-note">All businesses translated!</p>}
              </div>

              {/* Categories list */}
              <h3 style={{ marginTop: "24px" }}>Categories Missing Translations ({categories.length})</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {categories.map((category, index) => {
                  const nextAnchor = categories[index + 1] ? `category-${categories[index + 1].id}` : null;
                  return (
                    <div
                      key={category.id}
                      id={`category-${category.id}`}
                      style={{ border: "1px solid var(--line)", padding: "16px", borderRadius: "12px", background: "white", display: "grid", gap: "10px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>{category.slug}</strong>
                        <Link
                          className="inline-link"
                          style={{ fontSize: "13px" }}
                          href={localePath(locale, `/category/${category.slug}`)}
                        >
                          View Original
                        </Link>
                      </div>
                      <TranslationForm
                        action={saveCategoryTranslation}
                        locale={locale}
                        entityId={category.id}
                        entityField="categoryId"
                        nameLabel="Category name"
                        descriptionLabel="Category description"
                        saveLabel="Save Translation"
                        requiredText="Required"
                        maxHintLabel="Max length"
                        nextAnchor={nextAnchor}
                      />
                    </div>
                  );
                })}
                {categories.length === 0 && <p className="empty-note">All categories translated!</p>}
              </div>
            </section>
          </div>
        )}

        {/* SEO TOOLS & REDIRECTS */}
        {activeTab === "seo-tools" && (
          <div className="tab-content">
            <section className="dashboard-section">
              <h2>robots.txt Editor</h2>
              <textarea
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                style={{ fontFamily: "monospace", minHeight: "100px", display: "block" }}
              />
              <button
                onClick={() => alert("robots.txt updated successfully!")}
                className="action-button"
                style={{ background: "var(--red)", marginTop: "10px" }}
              >
                Save robots.txt
              </button>
            </section>

            <section className="dashboard-section">
              <h2>{t.redirectsTitle}</h2>
              <form onSubmit={handleAddRedirect} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "14px" }}>
                <label style={{ display: "grid", gap: "4px", flex: "1" }}>
                  <span style={{ fontSize: "12px" }}>{t.redirectFrom}</span>
                  <input
                    type="text"
                    placeholder="/old-path"
                    value={redirectSource}
                    onChange={(e) => setRedirectSource(e.target.value)}
                    required
                    style={{ background: "var(--paper)" }}
                  />
                </label>
                <label style={{ display: "grid", gap: "4px", flex: "1" }}>
                  <span style={{ fontSize: "12px" }}>{t.redirectTo}</span>
                  <input
                    type="text"
                    placeholder="/new-path"
                    value={redirectTarget}
                    onChange={(e) => setRedirectTarget(e.target.value)}
                    required
                    style={{ background: "var(--paper)" }}
                  />
                </label>
                <button type="submit" className="action-button" style={{ background: "var(--red)", height: "46px" }}>
                  Add Redirect
                </button>
              </form>

              <div className="admin-table-container">
                <table className="admin-table" aria-label="301 redirects logs">
                  <thead>
                    <tr>
                      <th>Source path</th>
                      <th>Target path</th>
                      <th>Status code</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redirects.map((red) => (
                      <tr key={red.id}>
                        <td><strong>{red.from}</strong></td>
                        <td>{red.to}</td>
                        <td>301 (Permanent)</td>
                        <td>
                          <button
                            onClick={() => setRedirects(redirects.filter((r) => r.id !== red.id))}
                            style={{ background: "none", border: 0, color: "var(--red)" }}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* BLOG DRAFT COMPOSE MODAL */}
      {newPostModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: "min(700px, 100%)" }}>
            <div className="modal-header">
              <h3>{t.newPost}</h3>
              <button className="close-modal-btn" onClick={() => setNewPostModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="settings-form">
              <label>
                <span>{t.blogTitle}</span>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. 10 Best Mobile Repair Shops in Mazar"
                  required
                />
              </label>

              <label>
                <span>Post Category</span>
                <select value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)} style={{ minHeight: "40px" }}>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Courses">Courses</option>
                  <option value="Doctors">Doctors</option>
                  <option value="Mobile Shops">Mobile Shops</option>
                </select>
              </label>

              <label>
                <span>{t.draftPreview}</span>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="# Enter markdown title..."
                  required
                  style={{ minHeight: "200px" }}
                />
              </label>

              <button className="action-button" style={{ background: "var(--red)" }} type="submit">
                Publish Guide Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
