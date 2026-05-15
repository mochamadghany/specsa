"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

type DashboardData = {
  settings: Record<string, string>;
  media: Media[];
  pages: Page[];
  products: Product[];
};

type Tab = "settings" | "pages" | "products" | "media";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "settings", label: "Site Settings" },
  { id: "pages", label: "Pages & SEO" },
  { id: "products", label: "Products" },
  { id: "media", label: "Media" },
];

function TextInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-text-muted">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border bg-bg-base px-3 text-sm outline-none focus:border-gold"
        style={{ borderColor: "var(--border)" }}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-text-muted">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border bg-bg-base px-3 py-2 text-sm leading-relaxed outline-none focus:border-gold"
        style={{ borderColor: "var(--border)" }}
      />
    </label>
  );
}

function MediaSelect({
  label,
  value,
  media,
  onChange,
}: {
  label: string;
  value: number | null;
  media: Media[];
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-semibold text-text-muted">{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)}
        className="h-10 rounded-md border bg-bg-base px-3 text-sm outline-none focus:border-gold"
        style={{ borderColor: "var(--border)" }}
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

export default function CmsPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [tab, setTab] = useState<Tab>("settings");
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [status, setStatus] = useState("Memuat dashboard...");
  const [saving, setSaving] = useState(false);

  const selectedPage = useMemo(
    () => data?.pages.find((page) => page.id === selectedPageId) || data?.pages[0],
    [data, selectedPageId]
  );
  const selectedProduct = useMemo(
    () =>
      data?.products.find((product) => product.id === selectedProductId) ||
      data?.products[0],
    [data, selectedProductId]
  );

  async function loadDashboard() {
    setStatus("Memuat data dari database...");
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
    setData(json);
    setSelectedPageId(json.pages?.[0]?.id ?? null);
    setSelectedProductId(json.products?.[0]?.id ?? null);
    setStatus("Data siap diedit.");
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateData(updater: (draft: DashboardData) => DashboardData) {
    setData((current) => (current ? updater(current) : current));
  }

  function updateSettings(key: string, value: string) {
    updateData((draft) => ({
      ...draft,
      settings: { ...draft.settings, [key]: value },
    }));
  }

  function updatePage(id: number, patch: Partial<Page>) {
    updateData((draft) => ({
      ...draft,
      pages: draft.pages.map((page) => (page.id === id ? { ...page, ...patch } : page)),
    }));
  }

  function updatePageSection(pageId: number, index: number, patch: Partial<Section>) {
    updateData((draft) => ({
      ...draft,
      pages: draft.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section, sectionIndex) =>
                sectionIndex === index ? { ...section, ...patch } : section
              ),
            }
          : page
      ),
    }));
  }

  function updateSectionItems(pageId: number, sectionIndex: number, lines: string) {
    const items = lines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((title, index) => ({
        title,
        body: null,
        icon: null,
        media_id: null,
        href: null,
        sort_order: index,
        is_published: 1,
      }));
    updatePageSection(pageId, sectionIndex, { items });
  }

  function updateProduct(id: number, patch: Partial<Product>) {
    updateData((draft) => ({
      ...draft,
      products: draft.products.map((product) =>
        product.id === id ? { ...product, ...patch } : product
      ),
    }));
  }

  function updateMedia(id: number, patch: Partial<Media>) {
    updateData((draft) => ({
      ...draft,
      media: draft.media.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)),
    }));
  }

  async function saveDashboard() {
    if (!data) return;
    setSaving(true);
    setStatus("Menyimpan perubahan...");
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

  async function logout() {
    await fetch("/api/cms/auth", { method: "DELETE" });
    router.push("/cms/login");
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-dark">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-container mx-auto px-8 h-[72px] flex items-center justify-between gap-4">
          <div>
            <div
              className="text-[10px] uppercase text-gold"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
            >
              Specsa CMS
            </div>
            <h1 className="font-bold text-[20px] tracking-[-0.01em]">
              Dashboard Konten & SEO
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:inline-flex rounded-md border px-4 py-2 text-sm font-semibold" style={{ borderColor: "var(--border)" }}>
              Lihat Website
            </a>
            <button type="button" onClick={logout} className="rounded-md border px-4 py-2 text-sm font-semibold text-text-muted hover:text-gold" style={{ borderColor: "var(--border)" }}>
              Logout
            </button>
            <button type="button" onClick={saveDashboard} disabled={saving || !data} className="btn btn-gold disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-container mx-auto px-8 py-6">
        <div className="mb-5 rounded-[8px] border bg-card-bg px-4 py-3 text-sm text-text-muted" style={{ borderColor: "var(--border)" }}>
          {status}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={[
                "rounded-md border px-4 py-2 text-sm font-semibold transition-colors",
                tab === item.id ? "bg-gold text-white" : "bg-white text-text-muted hover:text-gold",
              ].join(" ")}
              style={{ borderColor: "var(--border)" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {!data ? (
          <div className="rounded-[10px] border bg-card-bg p-8" style={{ borderColor: "var(--border)" }}>
            Memuat data...
          </div>
        ) : null}

        {data && tab === "settings" ? (
          <section className="grid md:grid-cols-2 gap-4 rounded-[10px] border bg-card-bg p-6" style={{ borderColor: "var(--border)" }}>
            {["site_name", "site_url", "phone", "whatsapp", "email", "address"].map((key) => (
              <TextInput
                key={key}
                label={key}
                value={data.settings[key] || ""}
                onChange={(value) => updateSettings(key, value)}
              />
            ))}
          </section>
        ) : null}

        {data && tab === "pages" && selectedPage ? (
          <section className="grid lg:grid-cols-[280px_1fr] gap-5">
            <aside className="rounded-[10px] border bg-card-bg p-3" style={{ borderColor: "var(--border)" }}>
              {data.pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPageId(page.id)}
                  className={[
                    "w-full rounded-md px-3 py-2 text-left text-sm font-semibold",
                    selectedPage.id === page.id ? "bg-bg-soft text-gold" : "hover:bg-bg-soft",
                  ].join(" ")}
                >
                  {page.nav_label}
                </button>
              ))}
            </aside>

            <div className="grid gap-5">
              <div className="rounded-[10px] border bg-card-bg p-6" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-bold text-[22px] mb-5">Konten Halaman</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput label="Slug" value={selectedPage.slug} onChange={(value) => updatePage(selectedPage.id, { slug: value })} />
                  <TextInput label="Nav Label" value={selectedPage.nav_label} onChange={(value) => updatePage(selectedPage.id, { nav_label: value })} />
                  <TextInput label="Eyebrow" value={selectedPage.eyebrow} onChange={(value) => updatePage(selectedPage.id, { eyebrow: value })} />
                  <TextInput label="CTA Label" value={selectedPage.cta_label} onChange={(value) => updatePage(selectedPage.id, { cta_label: value })} />
                  <TextInput label="CTA URL" value={selectedPage.cta_href} onChange={(value) => updatePage(selectedPage.id, { cta_href: value })} />
                  <MediaSelect label="Hero Image" value={selectedPage.hero_media_id} media={data.media} onChange={(value) => updatePage(selectedPage.id, { hero_media_id: value })} />
                </div>
                <div className="mt-4 grid gap-4">
                  <TextArea label="Title" value={selectedPage.title} rows={2} onChange={(value) => updatePage(selectedPage.id, { title: value })} />
                  <TextArea label="Lead" value={selectedPage.lead_text} onChange={(value) => updatePage(selectedPage.id, { lead_text: value })} />
                </div>
              </div>

              <div className="rounded-[10px] border bg-card-bg p-6" style={{ borderColor: "var(--border)" }}>
                <h2 className="font-bold text-[22px] mb-5">SEO</h2>
                <div className="grid gap-4">
                  <TextInput label="Canonical Path" value={selectedPage.canonical_path} onChange={(value) => updatePage(selectedPage.id, { canonical_path: value })} />
                  <TextInput label="Meta Title" value={selectedPage.meta_title} onChange={(value) => updatePage(selectedPage.id, { meta_title: value })} />
                  <TextArea label="Meta Description" value={selectedPage.meta_description} onChange={(value) => updatePage(selectedPage.id, { meta_description: value })} />
                  <TextArea label="Meta Keywords" value={selectedPage.meta_keywords} rows={2} onChange={(value) => updatePage(selectedPage.id, { meta_keywords: value })} />
                </div>
              </div>

              {selectedPage.sections.map((section, index) => (
                <div key={section.id || index} className="rounded-[10px] border bg-card-bg p-6" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold mb-4">Section {index + 1}</h3>
                  <div className="grid gap-4">
                    <TextInput label="Section Title" value={section.title} onChange={(value) => updatePageSection(selectedPage.id, index, { title: value })} />
                    <TextArea label="Body" value={section.body} onChange={(value) => updatePageSection(selectedPage.id, index, { body: value })} />
                    <TextArea
                      label="Items, satu baris per item"
                      value={section.items.map((item) => item.title || item.body || "").join("\n")}
                      rows={5}
                      onChange={(value) => updateSectionItems(selectedPage.id, index, value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data && tab === "products" && selectedProduct ? (
          <section className="grid lg:grid-cols-[280px_1fr] gap-5">
            <aside className="rounded-[10px] border bg-card-bg p-3" style={{ borderColor: "var(--border)" }}>
              {data.products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProductId(product.id)}
                  className={[
                    "w-full rounded-md px-3 py-2 text-left text-sm font-semibold",
                    selectedProduct.id === product.id ? "bg-bg-soft text-gold" : "hover:bg-bg-soft",
                  ].join(" ")}
                >
                  {product.name}
                </button>
              ))}
            </aside>

            <div className="rounded-[10px] border bg-card-bg p-6" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-bold text-[22px] mb-5">Produk</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput label="Slug" value={selectedProduct.slug} onChange={(value) => updateProduct(selectedProduct.id, { slug: value })} />
                <TextInput label="Name" value={selectedProduct.name} onChange={(value) => updateProduct(selectedProduct.id, { name: value })} />
                <TextInput label="Badge" value={selectedProduct.badge} onChange={(value) => updateProduct(selectedProduct.id, { badge: value })} />
                <TextInput label="Brand" value={selectedProduct.brand} onChange={(value) => updateProduct(selectedProduct.id, { brand: value })} />
                <TextInput label="Unit" value={selectedProduct.unit} onChange={(value) => updateProduct(selectedProduct.id, { unit: value })} />
                <TextInput label="Coverage" value={selectedProduct.coverage} type="number" onChange={(value) => updateProduct(selectedProduct.id, { coverage: value })} />
                <TextInput label="Price Min" value={selectedProduct.price_min} type="number" onChange={(value) => updateProduct(selectedProduct.id, { price_min: value })} />
                <TextInput label="Price Max" value={selectedProduct.price_max} type="number" onChange={(value) => updateProduct(selectedProduct.id, { price_max: value })} />
                <TextInput label="Waste Factor" value={selectedProduct.waste_factor} type="number" onChange={(value) => updateProduct(selectedProduct.id, { waste_factor: value })} />
                <TextInput label="Calc Label" value={selectedProduct.calc_label} onChange={(value) => updateProduct(selectedProduct.id, { calc_label: value })} />
                <MediaSelect label="Product Image" value={selectedProduct.main_media_id} media={data.media} onChange={(value) => updateProduct(selectedProduct.id, { main_media_id: value })} />
              </div>
              <div className="mt-4 grid gap-4">
                <TextArea label="Short Description" value={selectedProduct.short_description} onChange={(value) => updateProduct(selectedProduct.id, { short_description: value })} />
                <TextInput label="SEO Title" value={selectedProduct.meta_title} onChange={(value) => updateProduct(selectedProduct.id, { meta_title: value })} />
                <TextArea label="SEO Description" value={selectedProduct.meta_description} onChange={(value) => updateProduct(selectedProduct.id, { meta_description: value })} />
                <TextArea label="SEO Keywords" value={selectedProduct.meta_keywords} rows={2} onChange={(value) => updateProduct(selectedProduct.id, { meta_keywords: value })} />
              </div>
            </div>
          </section>
        ) : null}

        {data && tab === "media" ? (
          <section className="grid gap-4">
            {data.media.map((asset) => (
              <article key={asset.id} className="grid lg:grid-cols-[160px_1fr] gap-4 rounded-[10px] border bg-card-bg p-4" style={{ borderColor: "var(--border)" }}>
                <div className="overflow-hidden rounded-md bg-bg-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.file_url} alt={asset.alt_text || asset.title} className="h-28 w-full object-cover" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <TextInput label="Title" value={asset.title} onChange={(value) => updateMedia(asset.id, { title: value })} />
                  <TextInput label="Alt Text" value={asset.alt_text} onChange={(value) => updateMedia(asset.id, { alt_text: value })} />
                  <TextInput label="File URL" value={asset.file_url} onChange={(value) => updateMedia(asset.id, { file_url: value })} />
                  <TextInput label="Usage Type" value={asset.usage_type} onChange={(value) => updateMedia(asset.id, { usage_type: value })} />
                  <TextInput label="Sort Order" value={asset.sort_order} type="number" onChange={(value) => updateMedia(asset.id, { sort_order: Number(value) })} />
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
