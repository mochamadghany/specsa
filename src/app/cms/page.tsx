"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Media = {
  id: number;
  title: string;
  alt_text: string | null;
  file_url: string;
  usage_type: string;
  sort_order: number;
  is_active: number;
};

type Item = {
  id?: number;
  section_id?: number;
  title: string | null;
  body: string | null;
  icon: string | null;
  media_id: number | null;
  href: string | null;
  sort_order: number;
  is_published: number;
};

type Section = {
  id?: number;
  page_id?: number;
  section_key: string | null;
  eyebrow: string | null;
  title: string;
  body: string | null;
  media_id: number | null;
  layout: string;
  sort_order: number;
  is_published: number;
  items: Item[];
};

type Page = {
  id: number;
  slug: string;
  nav_label: string;
  eyebrow: string | null;
  title: string;
  lead_text: string | null;
  hero_media_id: number | null;
  cta_label: string | null;
  cta_href: string | null;
  template: string;
  sort_order: number;
  is_nav_visible: number;
  is_published: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_path: string | null;
  og_media_id: number | null;
  sections: Section[];
};

type Product = {
  id: number;
  category_id: number | null;
  slug: string;
  name: string;
  badge: string | null;
  brand: string | null;
  short_description: string | null;
  main_media_id: number | null;
  unit: string;
  coverage: string;
  price_min: string;
  price_max: string;
  waste_factor: string;
  calc_label: string | null;
  has_cnc_option: number;
  sort_order: number;
  is_featured: number;
  is_published: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
};

type Project = {
  id?: number;
  slug: string;
  title: string;
  tag: string | null;
  client_name: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  main_media_id: number | null;
  sort_order: number;
  is_featured: number;
  is_published: number;
};

type ContactSubmission = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  product_interest: string | null;
  message: string | null;
  source_page: string | null;
  status: "new" | "contacted" | "quoted" | "closed" | "spam";
  created_at: string;
  updated_at: string;
};

type DashboardData = {
  settings: Record<string, string>;
  media: Media[];
  pages: Page[];
  products: Product[];
  projects: Project[];
  contactSubmissions: ContactSubmission[];
};

type Tab = "overview" | "inquiries" | "pages" | "products" | "projects" | "media" | "settings";
type DeleteEntity = "page" | "product" | "project" | "media";

const tabs: Array<{ id: Tab; label: string; glyph: string; count?: (data: DashboardData) => number }> = [
  { id: "overview", label: "Dashboard", glyph: "D" },
  { id: "inquiries", label: "Inquiries", glyph: "I", count: (data) => data.contactSubmissions.length },
  { id: "pages", label: "Pages & SEO", glyph: "P", count: (data) => data.pages.length },
  { id: "products", label: "Products", glyph: "K", count: (data) => data.products.length },
  { id: "projects", label: "Projects", glyph: "R", count: (data) => data.projects.length },
  { id: "media", label: "Media", glyph: "M", count: (data) => data.media.length },
  { id: "settings", label: "Settings", glyph: "S" },
];

const contactStatuses: ContactSubmission["status"][] = [
  "new",
  "contacted",
  "quoted",
  "closed",
  "spam",
];

const pageSize = 8;

function paginate<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    safePage,
    start,
  };
}

function formatMoney(value: string | number | null) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function fieldClass(full = false) {
  return [styles.field, full ? styles.full : ""].filter(Boolean).join(" ");
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  full = false,
}: {
  label: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={fieldClass(full)}>
      <span>{label}</span>
      <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  full = true,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  rows?: number;
  full?: boolean;
}) {
  return (
    <label className={fieldClass(full)}>
      <span>{label}</span>
      <textarea rows={rows} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function MediaSelect({
  label,
  value,
  media,
  onChange,
  full,
}: {
  label: string;
  value: number | null | undefined;
  media: Media[];
  onChange: (value: number | null) => void;
  full?: boolean;
}) {
  return (
    <label className={fieldClass(full)}>
      <span>{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
      >
        <option value="">Tidak ada</option>
        {media.map((asset) => (
          <option key={asset.id} value={asset.id}>
            #{asset.id} - {asset.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={[styles.badge, active ? styles.badgeGreen : styles.badgeRed].join(" ")}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}

function TablePager({
  page,
  totalPages,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className={styles.pagination}>
      <span>
        Page {page} / {totalPages} - {total} data
      </span>
      <div className={styles.paginationActions}>
        <button
          type="button"
          className={[styles.btn, styles.btnOutline].join(" ")}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Prev
        </button>
        <button
          type="button"
          className={[styles.btn, styles.btnOutline].join(" ")}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SaveActions({
  saving,
  disabled,
  onSave,
}: {
  saving: boolean;
  disabled?: boolean;
  onSave: () => void;
}) {
  return (
    <div className={styles.saveBar}>
      <button
        type="button"
        onClick={onSave}
        disabled={saving || disabled}
        className={[styles.btn, styles.btnGold].join(" ")}
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}

export default function CmsPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [pagesPage, setPagesPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [status, setStatus] = useState("Memuat dashboard...");
  const [saving, setSaving] = useState(false);

  const selectedPage = useMemo(
    () => data?.pages.find((page) => page.id === selectedPageId) || data?.pages[0],
    [data, selectedPageId]
  );
  const selectedProduct = useMemo(
    () => data?.products.find((product) => product.id === selectedProductId) || data?.products[0],
    [data, selectedProductId]
  );
  const selectedProject = useMemo(
    () =>
      (selectedProjectId === null
        ? data?.projects.find((project) => !project.id)
        : data?.projects.find((project) => project.id && project.id === selectedProjectId)) ||
      data?.projects[0],
    [data, selectedProjectId]
  );
  const selectedMedia = useMemo(
    () => data?.media.find((asset) => asset.id === selectedMediaId) || data?.media[0],
    [data, selectedMediaId]
  );

  async function loadDashboard() {
    setStatus("Memuat data dari database production...");
    const res = await fetch("/api/cms/dashboard", { cache: "no-store" });
    const json = await res.json();
    if (res.status === 401) {
      router.push("/cms/login");
      return;
    }
    if (!res.ok) {
      setStatus(json.error || "Gagal memuat dashboard.");
      return;
    }

    const payload = {
      ...json,
      projects: json.projects || [],
      contactSubmissions: json.contactSubmissions || [],
    } as DashboardData;
    setData(payload);
    setSelectedPageId(payload.pages?.[0]?.id ?? null);
    setSelectedProductId(payload.products?.[0]?.id ?? null);
    setSelectedProjectId(payload.projects?.[0]?.id ?? null);
    setSelectedMediaId(payload.media?.[0]?.id ?? null);
    setStatus("Data siap diedit dan tersambung ke database.");
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPagesPage(1);
    setProductsPage(1);
    setProjectsPage(1);
    setMediaPage(1);
    setInquiriesPage(1);
  }, [query]);

  function updateData(updater: (draft: DashboardData) => DashboardData) {
    setData((current) => (current ? updater(current) : current));
  }

  function updateSettings(key: string, value: string) {
    updateData((draft) => ({ ...draft, settings: { ...draft.settings, [key]: value } }));
  }

  function updatePage(id: number, patch: Partial<Page>) {
    updateData((draft) => ({
      ...draft,
      pages: draft.pages.map((page) => (page.id === id ? { ...page, ...patch } : page)),
    }));
  }

  function updatePageSection(pageId: number, sectionIndex: number, patch: Partial<Section>) {
    updateData((draft) => ({
      ...draft,
      pages: draft.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section, index) =>
                index === sectionIndex ? { ...section, ...patch } : section
              ),
            }
          : page
      ),
    }));
  }

  function updateSectionItem(pageId: number, sectionIndex: number, itemIndex: number, patch: Partial<Item>) {
    updateData((draft) => ({
      ...draft,
      pages: draft.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section, sIndex) =>
                sIndex === sectionIndex
                  ? {
                      ...section,
                      items: section.items.map((item, iIndex) =>
                        iIndex === itemIndex ? { ...item, ...patch } : item
                      ),
                    }
                  : section
              ),
            }
          : page
      ),
    }));
  }

  function addSectionItem(pageId: number, sectionIndex: number) {
    updatePageSection(pageId, sectionIndex, {
      items: [
        ...(selectedPage?.sections[sectionIndex]?.items || []),
        {
          title: "",
          body: "",
          icon: "",
          media_id: null,
          href: "",
          sort_order: selectedPage?.sections[sectionIndex]?.items.length || 0,
          is_published: 1,
        },
      ],
    });
  }

  function updateProduct(id: number, patch: Partial<Product>) {
    updateData((draft) => ({
      ...draft,
      products: draft.products.map((product) => (product.id === id ? { ...product, ...patch } : product)),
    }));
  }

  function updateProject(index: number, patch: Partial<Project>) {
    updateData((draft) => ({
      ...draft,
      projects: draft.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, ...patch } : project
      ),
    }));
  }

  function addProject() {
    const project: Project = {
      slug: `project-${Date.now()}`,
      title: "Project Baru",
      tag: "",
      client_name: "",
      location: "",
      year: "",
      description: "",
      main_media_id: null,
      sort_order: data?.projects.length || 0,
      is_featured: 0,
      is_published: 1,
    };
    updateData((draft) => ({ ...draft, projects: [...draft.projects, project] }));
    setTab("projects");
    setSelectedProjectId(null);
  }

  function addProduct() {
    const tempId = -Date.now();
    const product: Product = {
      id: tempId,
      category_id: null,
      slug: `produk-${Date.now()}`,
      name: "Produk Baru",
      badge: "",
      brand: "",
      short_description: "",
      main_media_id: null,
      unit: "m2",
      coverage: "1",
      price_min: "0",
      price_max: "0",
      waste_factor: "0.1",
      calc_label: "m2 area proyek",
      has_cnc_option: 0,
      sort_order: data?.products.length || 0,
      is_featured: 0,
      is_published: 1,
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
    };
    updateData((draft) => ({ ...draft, products: [...draft.products, product] }));
    setTab("products");
    setSelectedProductId(tempId);
  }

  function updateMedia(id: number, patch: Partial<Media>) {
    updateData((draft) => ({
      ...draft,
      media: draft.media.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)),
    }));
  }

  function updateSubmission(id: number, statusValue: ContactSubmission["status"]) {
    updateData((draft) => ({
      ...draft,
      contactSubmissions: draft.contactSubmissions.map((item) =>
        item.id === id ? { ...item, status: statusValue } : item
      ),
    }));
  }

  async function saveDashboard() {
    if (!data) return;
    setSaving(true);
    setStatus("Menyimpan perubahan ke database...");
    const res = await fetch("/api/cms/dashboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setSaving(false);
    if (res.status === 401) {
      router.push("/cms/login");
      return;
    }
    if (!res.ok) {
      setStatus(json.error || "Gagal menyimpan perubahan.");
      return;
    }
    setStatus("Perubahan tersimpan ke database.");
    await loadDashboard();
  }

  async function deleteEntity(entity: DeleteEntity, id: number, label: string) {
    if (!Number.isFinite(id) || id <= 0) {
      updateData((draft) => ({
        ...draft,
        pages: entity === "page" ? draft.pages.filter((page) => page.id !== id) : draft.pages,
        products:
          entity === "product" ? draft.products.filter((product) => product.id !== id) : draft.products,
        projects:
          entity === "project" ? draft.projects.filter((project) => project.id !== id) : draft.projects,
        media: entity === "media" ? draft.media.filter((asset) => asset.id !== id) : draft.media,
      }));
      return;
    }

    if (!window.confirm(`Hapus ${label}? Tindakan ini tidak bisa dibatalkan.`)) return;

    setStatus(`Menghapus ${label}...`);
    const res = await fetch("/api/cms/dashboard", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, id }),
    });
    const json = await res.json();

    if (res.status === 401) {
      router.push("/cms/login");
      return;
    }
    if (!res.ok) {
      setStatus(json.error || `Gagal menghapus ${label}.`);
      return;
    }
    setStatus(`${label} berhasil dihapus.`);
    await loadDashboard();
  }

  async function logout() {
    await fetch("/api/cms/auth", { method: "DELETE" });
    router.push("/cms/login");
  }

  const searchable = query.trim().toLowerCase();
  const filteredPages = (data?.pages || []).filter((page) =>
    `${page.nav_label} ${page.slug} ${page.title} ${page.meta_title || ""}`.toLowerCase().includes(searchable)
  );
  const filteredProducts = (data?.products || []).filter((product) =>
    `${product.name} ${product.brand || ""} ${product.badge || ""}`.toLowerCase().includes(searchable)
  );
  const filteredProjects = (data?.projects || []).filter((project) =>
    `${project.title} ${project.tag || ""} ${project.location || ""}`.toLowerCase().includes(searchable)
  );
  const filteredMedia = (data?.media || []).filter((asset) =>
    `${asset.title} ${asset.usage_type} ${asset.file_url}`.toLowerCase().includes(searchable)
  );
  const filteredSubmissions = (data?.contactSubmissions || []).filter((item) =>
    `${item.name} ${item.phone || ""} ${item.email || ""} ${item.product_interest || ""}`
      .toLowerCase()
      .includes(searchable)
  );
  const pagesTable = paginate(filteredPages, pagesPage);
  const productsTable = paginate(filteredProducts, productsPage);
  const projectsTable = paginate(filteredProjects, projectsPage);
  const mediaTable = paginate(filteredMedia, mediaPage);
  const inquiriesTable = paginate(filteredSubmissions, inquiriesPage);

  const projectIndex = data?.projects.findIndex((project) => project === selectedProject) ?? -1;

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.mark}>S</div>
          <div>
            <div className={styles.brandName}>Specsa</div>
            <div className={styles.brandSub}>Admin Dashboard</div>
          </div>
        </div>

        <label className={styles.search}>
          <span className={styles.mono}>Cari</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Produk, page, inquiry..." />
        </label>

        <div className={styles.headerActions}>
          <a href="/" className={[styles.btn, styles.btnOutline].join(" ")}>
            Lihat Website
          </a>
          <button type="button" onClick={logout} className={[styles.btn, styles.btnOutline].join(" ")}>
            Logout
          </button>
          <div className={styles.userChip}>
            <div className={styles.avatar}>AD</div>
            <div>
              <div className={styles.userName}>Admin</div>
              <div className={styles.userRole}>Production CMS</div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div>
            <div className={[styles.sideLabel, styles.mono].join(" ")}>Menu</div>
            <nav className={styles.nav}>
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={[styles.navButton, tab === item.id ? styles.active : ""].join(" ")}
                >
                  <span className={styles.mono}>{item.glyph}</span>
                  {item.label}
                  {data && item.count ? <span className={styles.countPill}>{item.count(data)}</span> : null}
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.sideFooter}>
            <div className={styles.status}>{status}</div>
          </div>
        </aside>

        <section className={styles.main}>
          <div className={styles.pageHead}>
            <div>
              <h1 className={styles.title}>
                {tab === "overview" ? "Dashboard Konten & SEO" : tabs.find((item) => item.id === tab)?.label}
              </h1>
              <p className={styles.subtitle}>
                Edit konten dinamis website Specsa dari satu CMS yang tersambung ke database.
              </p>
            </div>
            <div className={[styles.mono, styles.muted].join(" ")}>
              {new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date())}
            </div>
          </div>

          {!data ? <div className={styles.empty}>Memuat data CMS...</div> : null}

          {data && tab === "overview" ? (
            <>
              <div className={styles.gridStats}>
                <div className={styles.stat}>
                  <div className={styles.statTop}>Pages <span>P</span></div>
                  <div className={styles.statValue}>{data.pages.length}</div>
                  <div className={styles.statNote}>{data.pages.filter((page) => page.is_published).length} published</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statTop}>Products <span>K</span></div>
                  <div className={styles.statValue}>{data.products.length}</div>
                  <div className={styles.statNote}>{data.products.filter((item) => item.is_featured).length} featured</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statTop}>Projects <span>R</span></div>
                  <div className={styles.statValue}>{data.projects.length}</div>
                  <div className={styles.statNote}>{data.projects.filter((item) => item.is_published).length} visible</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statTop}>New Inquiries <span>I</span></div>
                  <div className={styles.statValue}>
                    {data.contactSubmissions.filter((item) => item.status === "new").length}
                  </div>
                  <div className={styles.statNote}>{data.contactSubmissions.length} total submission</div>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Inquiry Terbaru</div>
                    <div className={styles.muted}>100 data terbaru dari contact_submissions</div>
                  </div>
                  <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => setTab("inquiries")}>
                    Kelola Inquiry
                  </button>
                </div>
                <table className={styles.table}>
                  <tbody>
                    {data.contactSubmissions.slice(0, 5).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                          <div className={styles.muted}>{item.email || item.phone || "-"}</div>
                        </td>
                        <td>{item.product_interest || "-"}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td><span className={styles.badge}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          {data && tab === "settings" ? (
            <div className={styles.stack}>
              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div className={styles.cardTitle}>Informasi Umum & Kontak</div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    {[
                      ["site_name", "Nama Perusahaan"],
                      ["site_url", "URL Website"],
                      ["phone", "Telepon"],
                      ["whatsapp", "WhatsApp (62...)"],
                      ["email", "Email"],
                      ["address", "Alamat"],
                    ].map(([key, label]) => (
                      <TextInput key={key} label={label} value={data.settings[key] || ""} onChange={(value) => updateSettings(key, value)} full={key === "address"} />
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Social Media</div>
                    <div className={styles.muted}>Tampil di header & footer. Kosongkan URL untuk menyembunyikan ikon.</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    {[
                      ["social_instagram_url", "Instagram URL"],
                      ["social_instagram_handle", "Instagram Username"],
                      ["social_facebook_url", "Facebook URL"],
                      ["social_facebook_handle", "Facebook Username"],
                      ["social_tiktok_url", "TikTok URL"],
                      ["social_tiktok_handle", "TikTok Username"],
                      ["social_youtube_url", "YouTube URL"],
                      ["social_youtube_handle", "YouTube Username"],
                      ["social_linkedin_url", "LinkedIn URL"],
                      ["social_linkedin_handle", "LinkedIn Username"],
                    ].map(([key, label]) => (
                      <TextInput key={key} label={label} value={data.settings[key] || ""} onChange={(value) => updateSettings(key, value)} />
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Instagram Feed</div>
                    <div className={styles.muted}>Butuh akun Instagram Business/Creator + access token (Graph API).</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    <TextInput label="Instagram User ID" value={data.settings.instagram_user_id || ""} onChange={(value) => updateSettings("instagram_user_id", value)} />
                    <TextInput label="Aktif? (1 = ya, 0 = tidak)" value={data.settings.instagram_feed_enabled ?? "1"} onChange={(value) => updateSettings("instagram_feed_enabled", value)} />
                    <TextArea label="Instagram Access Token" value={data.settings.instagram_access_token || ""} onChange={(value) => updateSettings("instagram_access_token", value)} />
                  </div>
                </div>
              </div>

              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Facebook Feed</div>
                    <div className={styles.muted}>Menampilkan timeline halaman Facebook secara real-time (Page Plugin).</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    <TextInput label="Facebook Page URL" value={data.settings.facebook_page_url || ""} onChange={(value) => updateSettings("facebook_page_url", value)} full />
                    <TextInput label="Aktif? (1 = ya, 0 = tidak)" value={data.settings.facebook_feed_enabled ?? "1"} onChange={(value) => updateSettings("facebook_feed_enabled", value)} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data && tab === "pages" && selectedPage ? (
            <div className={styles.stack}>
              <div className={styles.tableWrap}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Daftar Pages & SEO</div>
                    <div className={styles.muted}>Pilih baris untuk update, atau hapus data halaman.</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Halaman</th>
                      <th>Slug</th>
                      <th>Template</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagesTable.items.map((page) => (
                      <tr key={page.id} className={selectedPage.id === page.id ? styles.selectedRow : ""}>
                        <td>
                          <strong>{page.nav_label}</strong>
                          <div className={styles.muted}>{page.title}</div>
                        </td>
                        <td>/{page.slug}</td>
                        <td>{page.template}</td>
                        <td>
                          <StatusBadge active={Boolean(page.is_published)} label={page.is_published ? "Published" : "Draft"} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => setSelectedPageId(page.id)}>
                              Edit
                            </button>
                            <button type="button" className={[styles.btn, styles.btnDanger].join(" ")} onClick={() => deleteEntity("page", page.id, page.nav_label)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePager page={pagesTable.safePage} totalPages={pagesTable.totalPages} total={filteredPages.length} onChange={setPagesPage} />
              </div>

              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Konten Halaman</div>
                    <div className={styles.muted}>Hero, SEO, navigasi, dan section dinamis</div>
                  </div>
                  <StatusBadge active={Boolean(selectedPage.is_published)} label={selectedPage.is_published ? "Published" : "Draft"} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    <TextInput label="Slug" value={selectedPage.slug} onChange={(value) => updatePage(selectedPage.id, { slug: value })} />
                    <TextInput label="Nav Label" value={selectedPage.nav_label} onChange={(value) => updatePage(selectedPage.id, { nav_label: value })} />
                    <TextInput label="Eyebrow" value={selectedPage.eyebrow} onChange={(value) => updatePage(selectedPage.id, { eyebrow: value })} />
                    <TextInput label="CTA Label" value={selectedPage.cta_label} onChange={(value) => updatePage(selectedPage.id, { cta_label: value })} />
                    <TextInput label="CTA URL" value={selectedPage.cta_href} onChange={(value) => updatePage(selectedPage.id, { cta_href: value })} />
                    <MediaSelect label="Hero Image" value={selectedPage.hero_media_id} media={data.media} onChange={(value) => updatePage(selectedPage.id, { hero_media_id: value })} />
                    <TextArea label="Title" value={selectedPage.title} rows={2} onChange={(value) => updatePage(selectedPage.id, { title: value })} />
                    <TextArea label="Lead" value={selectedPage.lead_text} onChange={(value) => updatePage(selectedPage.id, { lead_text: value })} />
                    <TextInput label="Canonical Path" value={selectedPage.canonical_path} onChange={(value) => updatePage(selectedPage.id, { canonical_path: value })} />
                    <TextInput label="Meta Title" value={selectedPage.meta_title} onChange={(value) => updatePage(selectedPage.id, { meta_title: value })} />
                    <TextArea label="Meta Description" value={selectedPage.meta_description} onChange={(value) => updatePage(selectedPage.id, { meta_description: value })} />
                    <TextArea label="Meta Keywords" rows={2} value={selectedPage.meta_keywords} onChange={(value) => updatePage(selectedPage.id, { meta_keywords: value })} />
                  </div>

                  <div className={styles.sectionStack}>
                    {selectedPage.sections.map((section, sectionIndex) => (
                      <div key={section.id || sectionIndex} className={styles.miniCard}>
                        <div className={styles.miniTitle}>
                          <span>Section {sectionIndex + 1}</span>
                          <button type="button" className={styles.switch + (section.is_published ? ` ${styles.on}` : "")} onClick={() => updatePageSection(selectedPage.id, sectionIndex, { is_published: section.is_published ? 0 : 1 })} aria-label="Toggle section" />
                        </div>
                        <div className={styles.formGrid}>
                          <TextInput label="Section Key" value={section.section_key} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { section_key: value })} />
                          <TextInput label="Eyebrow" value={section.eyebrow} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { eyebrow: value })} />
                          <TextInput label="Title" value={section.title} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { title: value })} full />
                          <TextArea label="Body" value={section.body} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { body: value })} />
                          <MediaSelect label="Section Media" value={section.media_id} media={data.media} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { media_id: value })} />
                          <TextInput label="Sort Order" type="number" value={section.sort_order} onChange={(value) => updatePageSection(selectedPage.id, sectionIndex, { sort_order: Number(value) })} />
                        </div>
                        {section.items.map((item, itemIndex) => (
                          <div className={styles.itemRow} key={item.id || itemIndex}>
                            <TextInput label="Item Title" value={item.title} onChange={(value) => updateSectionItem(selectedPage.id, sectionIndex, itemIndex, { title: value })} />
                            <TextInput label="Item Body" value={item.body} onChange={(value) => updateSectionItem(selectedPage.id, sectionIndex, itemIndex, { body: value })} />
                            <TextInput label="Icon" value={item.icon} onChange={(value) => updateSectionItem(selectedPage.id, sectionIndex, itemIndex, { icon: value })} />
                            <TextInput label="Href" value={item.href} onChange={(value) => updateSectionItem(selectedPage.id, sectionIndex, itemIndex, { href: value })} />
                          </div>
                        ))}
                        <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => addSectionItem(selectedPage.id, sectionIndex)}>
                          Tambah Item
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data && tab === "products" && selectedProduct ? (
            <div className={styles.stack}>
              <div className={styles.toolbar}>
                <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={addProduct}>Tambah Product</button>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Daftar Products</div>
                    <div className={styles.muted}>Tambah produk baru, update data, atau hapus item. Produk baru tersimpan setelah klik Simpan.</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Brand</th>
                      <th>Harga</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsTable.items.map((product) => (
                      <tr key={product.id} className={selectedProduct.id === product.id ? styles.selectedRow : ""}>
                        <td>
                          <strong>{product.name}</strong>
                          <div className={styles.muted}>/{product.slug}</div>
                        </td>
                        <td>{product.brand || "-"}</td>
                        <td>{formatMoney(product.price_min)} - {formatMoney(product.price_max)}</td>
                        <td>
                          <StatusBadge active={Boolean(product.is_published)} label={product.is_published ? "Published" : "Draft"} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => setSelectedProductId(product.id)}>
                              Edit
                            </button>
                            <button type="button" className={[styles.btn, styles.btnDanger].join(" ")} onClick={() => deleteEntity("product", product.id, product.name)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePager page={productsTable.safePage} totalPages={productsTable.totalPages} total={filteredProducts.length} onChange={setProductsPage} />
              </div>

              <div className={styles.editor}>
                <div className={styles.cardHead}>
                  <div className={styles.cardTitle}>Produk</div>
                  <button type="button" className={styles.switch + (selectedProduct.is_published ? ` ${styles.on}` : "")} onClick={() => updateProduct(selectedProduct.id, { is_published: selectedProduct.is_published ? 0 : 1 })} aria-label="Toggle product" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    <TextInput label="Slug" value={selectedProduct.slug} onChange={(value) => updateProduct(selectedProduct.id, { slug: value })} />
                    <TextInput label="Name" value={selectedProduct.name} onChange={(value) => updateProduct(selectedProduct.id, { name: value })} />
                    <TextInput label="Category ID (1-5)" type="number" value={selectedProduct.category_id ?? ""} onChange={(value) => updateProduct(selectedProduct.id, { category_id: value ? Number(value) : null })} />
                    <TextInput label="Badge" value={selectedProduct.badge} onChange={(value) => updateProduct(selectedProduct.id, { badge: value })} />
                    <TextInput label="Brand" value={selectedProduct.brand} onChange={(value) => updateProduct(selectedProduct.id, { brand: value })} />
                    <MediaSelect label="Product Image" value={selectedProduct.main_media_id} media={data.media} onChange={(value) => updateProduct(selectedProduct.id, { main_media_id: value })} />
                    <TextInput label="Unit" value={selectedProduct.unit} onChange={(value) => updateProduct(selectedProduct.id, { unit: value })} />
                    <TextInput label="Coverage" type="number" value={selectedProduct.coverage} onChange={(value) => updateProduct(selectedProduct.id, { coverage: value })} />
                    <TextInput label="Price Min" type="number" value={selectedProduct.price_min} onChange={(value) => updateProduct(selectedProduct.id, { price_min: value })} />
                    <TextInput label="Price Max" type="number" value={selectedProduct.price_max} onChange={(value) => updateProduct(selectedProduct.id, { price_max: value })} />
                    <TextInput label="Waste Factor" type="number" value={selectedProduct.waste_factor} onChange={(value) => updateProduct(selectedProduct.id, { waste_factor: value })} />
                    <TextInput label="Calc Label" value={selectedProduct.calc_label} onChange={(value) => updateProduct(selectedProduct.id, { calc_label: value })} />
                    <TextInput label="Opsi CNC (1/0)" type="number" value={selectedProduct.has_cnc_option} onChange={(value) => updateProduct(selectedProduct.id, { has_cnc_option: Number(value) ? 1 : 0 })} />
                    <TextInput label="Sort Order" type="number" value={selectedProduct.sort_order} onChange={(value) => updateProduct(selectedProduct.id, { sort_order: Number(value) })} />
                    <TextArea label="Short Description" value={selectedProduct.short_description} onChange={(value) => updateProduct(selectedProduct.id, { short_description: value })} />
                    <TextInput label="SEO Title" value={selectedProduct.meta_title} onChange={(value) => updateProduct(selectedProduct.id, { meta_title: value })} />
                    <TextArea label="SEO Description" value={selectedProduct.meta_description} onChange={(value) => updateProduct(selectedProduct.id, { meta_description: value })} />
                    <TextArea label="SEO Keywords" rows={2} value={selectedProduct.meta_keywords} onChange={(value) => updateProduct(selectedProduct.id, { meta_keywords: value })} />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data && tab === "projects" ? (
            <div className={styles.stack}>
              <div className={styles.toolbar}>
                <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={addProject}>Tambah Project</button>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Daftar Projects</div>
                    <div className={styles.muted}>Project showcase yang tampil di website.</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Tag</th>
                      <th>Lokasi</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsTable.items.map((project) => (
                      <tr key={project.id || project.slug} className={selectedProject === project ? styles.selectedRow : ""}>
                        <td>
                          <strong>{project.title}</strong>
                          <div className={styles.muted}>/{project.slug}</div>
                        </td>
                        <td>{project.tag || "-"}</td>
                        <td>{project.location || "-"}</td>
                        <td>
                          <StatusBadge active={Boolean(project.is_published)} label={project.is_published ? "Published" : "Draft"} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => setSelectedProjectId(project.id ?? null)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className={[styles.btn, styles.btnDanger].join(" ")}
                              disabled={!project.id}
                              onClick={() => project.id && deleteEntity("project", project.id, project.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePager page={projectsTable.safePage} totalPages={projectsTable.totalPages} total={filteredProjects.length} onChange={setProjectsPage} />
              </div>

                {selectedProject && projectIndex >= 0 ? (
                  <div className={styles.editor}>
                    <div className={styles.cardHead}>
                      <div className={styles.cardTitle}>Project Showcase</div>
                      <button type="button" className={styles.switch + (selectedProject.is_published ? ` ${styles.on}` : "")} onClick={() => updateProject(projectIndex, { is_published: selectedProject.is_published ? 0 : 1 })} aria-label="Toggle project" />
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.formGrid}>
                        <TextInput label="Slug" value={selectedProject.slug} onChange={(value) => updateProject(projectIndex, { slug: value })} />
                        <TextInput label="Title" value={selectedProject.title} onChange={(value) => updateProject(projectIndex, { title: value })} />
                        <TextInput label="Tag" value={selectedProject.tag} onChange={(value) => updateProject(projectIndex, { tag: value })} />
                        <TextInput label="Client Name" value={selectedProject.client_name} onChange={(value) => updateProject(projectIndex, { client_name: value })} />
                        <TextInput label="Location" value={selectedProject.location} onChange={(value) => updateProject(projectIndex, { location: value })} />
                        <TextInput label="Year" value={selectedProject.year} onChange={(value) => updateProject(projectIndex, { year: value })} />
                        <MediaSelect label="Project Image" value={selectedProject.main_media_id} media={data.media} onChange={(value) => updateProject(projectIndex, { main_media_id: value })} />
                        <TextInput label="Sort Order" type="number" value={selectedProject.sort_order} onChange={(value) => updateProject(projectIndex, { sort_order: Number(value) })} />
                        <TextArea label="Description" value={selectedProject.description} onChange={(value) => updateProject(projectIndex, { description: value })} />
                      </div>
                    </div>
                  </div>
                ) : null}
            </div>
          ) : null}

          {data && tab === "media" && selectedMedia ? (
            <div className={styles.stack}>
              <div className={styles.tableWrap}>
                <div className={styles.cardHead}>
                  <div>
                    <div className={styles.cardTitle}>Daftar Media</div>
                    <div className={styles.muted}>Kelola asset media yang dipakai konten, produk, dan proyek.</div>
                  </div>
                  <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Media</th>
                      <th>Usage</th>
                      <th>URL</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mediaTable.items.map((asset) => (
                      <tr key={asset.id} className={selectedMedia.id === asset.id ? styles.selectedRow : ""}>
                        <td>
                          <strong>{asset.title}</strong>
                          <div className={styles.muted}>{asset.alt_text || "-"}</div>
                        </td>
                        <td>{asset.usage_type}</td>
                        <td className={styles.urlCell}>{asset.file_url}</td>
                        <td>
                          <StatusBadge active={Boolean(asset.is_active)} label={asset.is_active ? "Active" : "Hidden"} />
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button type="button" className={[styles.btn, styles.btnOutline].join(" ")} onClick={() => setSelectedMediaId(asset.id)}>
                              Edit
                            </button>
                            <button type="button" className={[styles.btn, styles.btnDanger].join(" ")} onClick={() => deleteEntity("media", asset.id, asset.title)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TablePager page={mediaTable.safePage} totalPages={mediaTable.totalPages} total={filteredMedia.length} onChange={setMediaPage} />
              </div>

              <div className={styles.editor}>
                <div className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedMedia.file_url} alt={selectedMedia.alt_text || selectedMedia.title} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.formGrid}>
                    <TextInput label="Title" value={selectedMedia.title} onChange={(value) => updateMedia(selectedMedia.id, { title: value })} />
                    <TextInput label="Alt Text" value={selectedMedia.alt_text} onChange={(value) => updateMedia(selectedMedia.id, { alt_text: value })} />
                    <TextInput label="File URL" value={selectedMedia.file_url} onChange={(value) => updateMedia(selectedMedia.id, { file_url: value })} full />
                    <TextInput label="Usage Type" value={selectedMedia.usage_type} onChange={(value) => updateMedia(selectedMedia.id, { usage_type: value })} />
                    <TextInput label="Sort Order" type="number" value={selectedMedia.sort_order} onChange={(value) => updateMedia(selectedMedia.id, { sort_order: Number(value) })} />
                    <label className={fieldClass()}>
                      <span>Status</span>
                      <select value={selectedMedia.is_active} onChange={(event) => updateMedia(selectedMedia.id, { is_active: Number(event.target.value) })}>
                        <option value={1}>Active</option>
                        <option value={0}>Hidden</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data && tab === "inquiries" ? (
            <div className={styles.tableWrap}>
              <div className={styles.cardHead}>
                <div>
                  <div className={styles.cardTitle}>Daftar Inquiries</div>
                  <div className={styles.muted}>Update status inquiry, lalu simpan perubahan.</div>
                </div>
                <SaveActions saving={saving} disabled={!data} onSave={saveDashboard} />
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Kontak</th>
                    <th>Produk</th>
                    <th>Pesan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiriesTable.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <div className={styles.muted}>{item.phone || "-"}</div>
                        <div className={styles.muted}>{item.email || "-"}</div>
                      </td>
                      <td>{item.product_interest || "-"}</td>
                      <td className={styles.muted}>{item.message || "-"}</td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <label className={styles.field}>
                          <select value={item.status} onChange={(event) => updateSubmission(item.id, event.target.value as ContactSubmission["status"])}>
                            {contactStatuses.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>{statusOption}</option>
                            ))}
                          </select>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePager page={inquiriesTable.safePage} totalPages={inquiriesTable.totalPages} total={filteredSubmissions.length} onChange={setInquiriesPage} />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
