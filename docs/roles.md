Here's a detailed breakdown of each role's dashboard — what it looks like, what's in it, and how it's structured.

---

**1. Guest User** — no dashboard. They experience the public-facing site only: search, browse, read. Their "interface" is the homepage, listing pages, and blog. No login wall unless they try to leave a review or save something.

---

**2. Normal User Dashboard**

The user lands here after login. It's personal and activity-focused — think "my activity hub."

**Header bar:** profile photo, username, reputation score badge, notification bell, settings link.

**Left sidebar navigation:** Overview, My Reviews, Saved Places, My Photos, Messages, Quote Requests, Settings, Help.

**Main area — Overview tab:**
- A welcome card with their name, review count, photo count, and reputation score (displayed as a progress bar toward the next badge tier).
- "Recent Activity" feed — their last 5 reviews, any business replies to their reviews, and any status changes (e.g. review approved/rejected by moderator).
- "Saved Places" quick-access strip — thumbnails of their 4 most recently saved businesses with a "View All" link.
- "Pending Actions" — if they started writing a review and didn't finish, a draft card appears here.

**My Reviews tab:**
- Filterable list: All / Approved / Pending / Rejected.
- Each row shows: business name, star rating they gave, date, review status badge, reply indicator (if the business replied), and edit/delete actions.
- Clicking a review expands it inline to show the full text and any business reply beneath it.

**Saved Places tab:**
- Grid of saved business cards (name, category, rating, city).
- Sort by: recently saved, rating, alphabetical.
- Option to organize into collections later (Future feature placeholder).

**My Photos tab:**
- Masonry grid of all uploaded photos.
- Each photo shows which business it's attached to, upload date, and approval status.
- Option to delete photos.

**Messages tab (Future):**
- Inbox for business replies and direct messages.
- Conversation thread view.

**Quote Requests tab:**
- List of sent quote requests with business name, date sent, and status (pending / replied / closed).

**Settings tab:**
- Profile info (name, photo, bio, city).
- Email & password change.
- Notification preferences (email alerts for review replies, new messages).
- Account deletion option.

---

**3. Business Owner Dashboard**

This is your most important dashboard — it's where you generate revenue. It should feel professional, like a lightweight CRM/analytics panel.

**Header:** business logo/name, verification badge status, plan type (Free / Standard / Premium), upgrade CTA button if on Free plan.

**Left sidebar:** Overview, My Listing, Reviews & Replies, Analytics, Leads & Quotes, Photo Gallery, Ads & Promotions, Branches, Settings, Billing.

**Overview tab:**
- Four metric cards across the top: Profile Views (this month), Review Count, Average Rating, New Leads.
- A simple line chart: profile views over the last 30 days.
- "Action Required" panel — flagged reviews needing a reply, incomplete listing fields, unread quote requests. This creates urgency and keeps owners engaged.
- Recent Reviews strip — last 3 reviews with a "Reply" button on each.

**My Listing tab:**
- Full preview of how their listing appears to the public, split into editable sections.
- Sections: Business Name & Category, Description, Address & Map Pin, Phone / WhatsApp / Website, Opening Hours (day-by-day toggle), Services Offered (tag-based), Price Range, Cover Photo, Gallery Photos.
- Each section has an inline "Edit" button that opens a modal — no full-page reloads.
- Listing completeness score (e.g. 72% complete) with a checklist showing what's missing. Incomplete listings rank lower — this motivates them to fill everything in.

**Reviews & Replies tab:**
- Full list of all reviews received, filterable by: All / 5-star / 1–2 star / Unanswered / Flagged.
- Each review card shows: reviewer name + photo, star rating, review text, date, and a reply text box if no reply exists yet, or the existing reply if one was already sent.
- Owners can flag a review as inappropriate (sends it to moderators) but cannot delete reviews themselves.

**Analytics tab:**
- Date range selector (7 days / 30 days / 90 days / custom).
- Charts: Profile Views over time, Search Impressions (how often they appeared in search results), Click-through rate, Review trend (rating over time).
- Traffic sources: direct visits, search, comparison pages, blogs.
- This is a paid feature — Free plan users see a blurred preview with an upgrade prompt.

**Leads & Quotes tab:**
- List of incoming quote requests: name, date, message, contact info.
- Status toggles: New / In Progress / Closed.
- Each lead is a card the owner can mark as handled.

**Photo Gallery tab:**
- Upload area (drag and drop).
- Uploaded photos shown in a grid with approval status (Pending / Approved / Rejected by moderator).
- Cover photo selector.

**Ads & Promotions tab:**
- Available ad placements explained visually: Featured Listing (top of category page), Banner Ad (city page), Spotlight (homepage section).
- Simple self-serve form: pick placement, upload creative or use auto-generated one, set budget/duration, pay.
- Active ads shown with performance stats (impressions, clicks).

**Billing tab:**
- Current plan, next renewal date, payment method.
- Invoice history.
- Plan upgrade/downgrade options.

**Settings tab:**
- Business contact details.
- Notification preferences (email when a new review arrives, new quote request, etc.).
- Team access — invite employees to manage the listing (Future feature).

---

**4. Moderator Dashboard**

Functional and queue-focused. Speed matters — moderators need to process many items fast. Design should feel like an admin triage tool, not a regular user interface.

**Header:** Moderator name, items in queue count, last login.

**Left sidebar:** Queue Overview, Reviews, Business Listings, Photos, User Reports, Categories, Activity Log.

**Queue Overview tab:**
- Four priority counters: Pending Reviews, Pending Listings, Pending Photos, Open Reports.
- "Oldest unreviewed item" timestamp — to catch backlogs.
- Recent activity feed showing what other moderators have actioned.

**Reviews tab:**
- List of reviews awaiting approval, sorted oldest-first by default.
- Each review card shows: reviewer account age, review text, star rating, business name, any prior history of this user's reviews being rejected.
- Three quick-action buttons per item: Approve / Reject / Escalate to Admin.
- When rejecting, a required dropdown: reason (spam, fake, offensive, irrelevant, duplicate).
- Approved reviews publish immediately. Rejected ones trigger a notification to the user.

**Business Listings tab:**
- New claim requests — owner claiming an existing unclaimed listing.
- Edits to existing verified listings that exceed a change threshold (e.g. phone number changed, address changed).
- Each claim shows: business name, claimant's account info, submitted documents (if any).
- Actions: Approve Claim / Reject Claim / Request More Info.

**Photos tab:**
- Grid of user-uploaded photos awaiting approval.
- Click to expand full-size.
- Approve / Reject with reason.

**User Reports tab:**
- Reports submitted by users about businesses or reviews.
- Each report shows: what was reported, who reported it, date, and the content being flagged.
- Actions: Dismiss / Remove Content / Warn User / Ban User (ban escalates to Admin).

**Activity Log tab:**
- Full log of this moderator's own actions (approvals, rejections, escalations) with timestamps.
- Useful for accountability and auditing by the Super Admin.

---

**5. Content Editor / SEO Manager Dashboard**

This is essentially a lightweight CMS. It should feel like a stripped-down WordPress or Notion — clean, writing-focused.

**Left sidebar:** Dashboard, Blog Posts, City Pages, Comparison Pages, SEO Landing Pages, Categories & Tags, Media Library, Translations, SEO Tools, Analytics.

**Dashboard tab:**
- Content calendar — what's published, what's scheduled, what's in draft.
- Quick stats: total blog posts, total city pages, organic traffic this month (pulled from analytics).
- Top performing content (by page views) — helps editors double down on what works.

**Blog Posts tab:**
- List of all posts: title, status (draft / scheduled / published), author, publish date, page views.
- New Post button opens a full-width writing editor.
- Editor features: rich text, heading levels, image insertion from Media Library, internal link suggestions (link to a business listing or city page), meta title & description fields, focus keyword field, slug editor.
- Preview button shows how the post will look publicly before publishing.

**City Pages tab:**
- List of all city/region pages (e.g. "Restaurants in Kabul", "Car Repair in Mazar-i-Sharif").
- Each page is auto-generated from listing data but the editor can customize: hero text, intro paragraph, featured businesses (manually pinned), FAQ section.
- SEO fields: meta title, meta description, H1 override.

**Comparison Pages tab:**
- Template-driven pages: "Best Pharmacies in Kabul", "Top 10 Wedding Halls in Herat".
- Editor selects businesses to include, writes intro text, ranks them, adds pros/cons per listing.
- These pages are extremely high SEO value — they need their own management section.

**SEO Landing Pages tab:**
- Keyword-targeted pages not tied to a specific city or blog post.
- Template system: pick a layout, fill in the content blocks.

**Media Library tab:**
- All uploaded images for content use (not business photos — those live in business listings).
- Search, filter by type, copy image URL, delete.

**Translations tab:**
- For Dari/Pashto versions of all content.
- Side-by-side editor: original language on left, translation on right.
- Status per page: Not Translated / In Progress / Complete.

**SEO Tools tab:**
- Sitemap status (last generated date, regenerate button).
- Robots.txt editor.
- Redirect manager (add 301 redirects when URLs change).
- Canonical URL checker.

---

**6. Super Admin Dashboard**

Full control. Data-dense. Should feel like a command center.

**Left sidebar:** Overview, Users, Businesses, Financials, Ads, Moderation Log, System, Feature Flags, Settings.

**Overview tab:**
- Platform-wide metrics: total registered users, total business listings, total reviews, monthly active users, revenue this month.
- Growth charts: new users per day, new listings per day, revenue trend.
- Alert panel: system errors, unusual activity spikes, payment failures.

**Users tab:**
- Searchable/filterable table of all user accounts.
- Filters: role, registration date, status (active / suspended / banned).
- Click any user → full profile: account details, activity history, reviews written, reports filed against them.
- Actions: change role, suspend, ban, delete account, impersonate (view platform as that user — for support purposes).

**Businesses tab:**
- All listings in one searchable table.
- Columns: business name, category, city, claimed (yes/no), verification status, plan type, date added.
- Click any business → full listing detail with ability to edit anything, force-verify, downgrade plan, or delete.

**Financials tab:**
- Revenue breakdown: by plan subscriptions, by ad purchases, by month.
- Payment failure log.
- Manual refund/credit tool.
- Export to CSV.

**Ads tab:**
- All active ad campaigns across all businesses.
- Performance metrics per campaign.
- Ability to pause, remove, or approve ad creatives.

**Moderation Log tab:**
- Full audit trail of all moderator actions platform-wide.
- Filterable by moderator, action type, date range.
- Ability to reverse a moderation decision (e.g. un-reject a review a moderator wrongly rejected).

**Feature Flags tab:**
- Toggle features on/off without a code deploy.
- Examples: "Enable quote requests", "Enable bookings", "Show reputation scores", "Enable direct messaging".
- Each flag shows: current state (on/off), who last changed it, date changed.

**System tab:**
- Server health indicators.
- Error log (last 100 errors with stack traces).
- Cache clear buttons.
- Database backup status.

**Settings tab:**
- Platform name, logo, default language, default country/city.
- Email configuration (SMTP settings).
- Payment gateway keys.
- Google Maps API key.
- SEO defaults (default meta title template, default OG image).
- Allowed file types and upload size limits.

---

Here's a visual overview of how all six roles relate to each other in terms of access scope:A few things worth highlighting across all of these:

**The Business Owner dashboard is your product's core value proposition.** The listing completeness score, the "Action Required" panel, and the analytics paywall are the three features most likely to drive upgrades. Owners respond to urgency and incomplete states.

**The Moderator dashboard needs speed above everything.** Every extra click costs you moderation throughput. In the Afghan context you mentioned — where spam, fake listings, and politically sensitive content will be common — the Reject + Reason dropdown being a single step is critical. Anything slower will create backlogs.

**The Content Editor dashboard is your SEO engine room.** The Comparison Pages section in particular (Best X in City Y) is where you'll get the most long-tail organic traffic. That tab deserves the most attention in your CMS build.

**Feature flags in the Super Admin dashboard** are non-negotiable for a platform at your stage — they let you roll out messaging, bookings, and reward points incrementally without redeployments.

Want me to go deeper on any specific dashboard — wireframe a specific tab, outline the database schema behind it, or map out the user flows?