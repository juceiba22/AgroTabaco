// Migra las noticias publicadas en https://www.agrotabaco.com (sitio Wix)
// hacia la tabla `posts` de Supabase, subiendo la imagen destacada de cada
// una al bucket `media`.
//
// Requisitos previos:
//   1. Correr supabase/migrations/0001_init.sql en el SQL Editor del proyecto
//      (crea las tablas, RLS y el bucket `media`, y siembra las categorías).
//   2. Completar scripts/migrate-wix/.env con SUPABASE_URL y
//      SUPABASE_SERVICE_ROLE_KEY (ver .env.example).
//   3. npm install (en esta carpeta).
//
// Uso:
//   npm run migrate                   -> migra todos los posts del sitemap
//   MIGRATE_LIMIT=50 npm run migrate  -> migra solo los 50 más recientes
//                                        (ordenados por <lastmod> del sitemap)
//
// El script es idempotente: hace upsert por `slug`, así que se puede
// volver a correr sin duplicar noticias.

import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import slugify from "slugify";
import sanitizeHtml from "sanitize-html";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIGRATE_LIMIT = process.env.MIGRATE_LIMIT
  ? Number(process.env.MIGRATE_LIMIT)
  : undefined;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en scripts/migrate-wix/.env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const BASE_URL = "https://www.agrotabaco.com";
const SITEMAP_URL = `${BASE_URL}/blog-posts-sitemap.xml`;
const STORAGE_BUCKET = "media";
const DEFAULT_CATEGORY_SLUG = "novedades";
const REQUEST_DELAY_MS = 500;
const FETCH_TIMEOUT_MS = 20_000;
const AUTHOR_NAME = "Redacción AgroTabaco";

// Tags/atributos permitidos al limpiar el HTML que trae Wix (Ricos editor).
// El resto (estilos inline, data-hook, clases de Wix, scripts) se descarta.
const SANITIZE_OPTIONS = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "h2", "h3", "ul", "ol", "li", "blockquote", "a",
    "img", "figure", "figcaption",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
  },
  transformTags: {
    h1: "h2",
    h4: "h3",
    h5: "h3",
    h6: "h3",
  },
  exclusiveFilter(frame) {
    // Descarta párrafos vacíos (espaciadores típicos del editor de Wix).
    return (
      ["p", "figure"].includes(frame.tag) &&
      !frame.text.trim() &&
      !/<img/.test(frame.innerHTML ?? "")
    );
  },
};

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadCategoryMap() {
  const { data, error } = await supabase.from("categories").select("id, slug");
  if (error) {
    console.error("Error leyendo categories:", error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.error(
      "La tabla categories está vacía. Corré supabase/migrations/0001_init.sql antes de migrar."
    );
    process.exit(1);
  }
  return new Map(data.map((c) => [c.slug, c.id]));
}

// Lee el sitemap de posts (y, por las dudas, sitemap index anidados) y
// devuelve [{ url, image, lastmod }], ordenado del más reciente al más
// antiguo según <lastmod> (que en el blog de Wix coincide con la fecha de
// publicación salvo que el post se haya editado después).
async function getPostUrls() {
  console.log("🔍 Leyendo sitemap de posts...");
  const res = await fetchWithTimeout(SITEMAP_URL);
  if (!res.ok) throw new Error(`No se pudo leer el sitemap (HTTP ${res.status})`);
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  function parseUrlSet($$) {
    const out = [];
    $$("url").each((_, el) => {
      const loc = $$(el).find("loc").first().text().trim();
      const image = $$(el).find("image\\:loc").first().text().trim() || null;
      const lastmod = $$(el).find("lastmod").first().text().trim() || null;
      if (loc.includes("/post/")) out.push({ url: loc, image, lastmod });
    });
    return out;
  }

  let entries;
  if ($("sitemapindex").length > 0) {
    const subSitemaps = $("sitemap > loc").map((_, el) => $(el).text().trim()).get();
    entries = [];
    for (const sub of subSitemaps) {
      const subRes = await fetchWithTimeout(sub);
      if (!subRes.ok) continue;
      const subXml = await subRes.text();
      entries.push(...parseUrlSet(cheerio.load(subXml, { xmlMode: true })));
    }
  } else {
    entries = parseUrlSet($);
  }

  entries.sort((a, b) => {
    const dateA = a.lastmod ? new Date(a.lastmod).getTime() : 0;
    const dateB = b.lastmod ? new Date(b.lastmod).getTime() : 0;
    return dateB - dateA;
  });

  return entries;
}

async function uploadImageToSupabase(imageUrl, slug) {
  if (!imageUrl) return null;

  try {
    const res = await fetchWithTimeout(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const extension = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : "jpg";

    const filePath = `posts/${slug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, Buffer.from(arrayBuffer), { contentType, upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn(`  ⚠️  No se pudo migrar la imagen (${imageUrl}): ${err.message}. Uso la URL original.`);
    return imageUrl;
  }
}

// La página de un post en agrotabaco.com siempre lista las 4 categorías del
// sitio como menú de navegación, y después repite UNA vez el link a la
// categoría real de ESE post. Nos quedamos con la última ocurrencia.
function extractCategorySlug($) {
  const links = $('a[href*="/todo-noticias/categories/"]')
    .map((_, el) => {
      const href = $(el).attr("href") || "";
      const match = href.match(/todo-noticias\/categories\/([a-z0-9-]+)/);
      return match ? match[1] : null;
    })
    .get()
    .filter(Boolean);

  return links.length > 0 ? links[links.length - 1] : null;
}

function extractJsonLd($) {
  const raw = $('script[type="application/ld+json"]').first().html();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cleanContent(rawHtml) {
  const sanitized = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
  // Colapsa tabs/espacios y saltos de línea sobrantes que deja el editor de Wix.
  return sanitized
    .replace(/[\t ]+/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

async function scrapePost({ url, image: sitemapImage }, usedSlugs) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim();
  if (!title) throw new Error("No se encontró título (og:title)");

  const excerptRaw =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";
  const excerpt = excerptRaw.replace(/\s+/g, " ").trim();

  const contentHtml = $('[data-hook="post-description"]').html();
  if (!contentHtml) throw new Error('No se encontró el contenido ([data-hook="post-description"])');
  const content = cleanContent(contentHtml);

  const rawImage =
    sitemapImage || $('meta[property="og:image"]').attr("content") || null;

  const jsonLd = extractJsonLd($);
  const publishedAt = jsonLd?.datePublished || new Date().toISOString();

  const categorySlug = extractCategorySlug($) || DEFAULT_CATEGORY_SLUG;

  let slug = slugify(title, { lower: true, strict: true, locale: "es" });
  if (usedSlugs.has(slug)) {
    slug = `${slug}-${usedSlugs.get(slug)}`;
  }
  usedSlugs.set(slugify(title, { lower: true, strict: true, locale: "es" }), (usedSlugs.get(slug) || 1) + 1);

  const coverImage = await uploadImageToSupabase(rawImage, slug);

  return {
    slug,
    title,
    excerpt,
    content,
    cover_image: coverImage,
    categorySlug,
    author_name: AUTHOR_NAME,
    status: "published",
    featured: false,
    views: 0,
    published_at: publishedAt,
  };
}

async function run() {
  const categoryMap = await loadCategoryMap();
  let entries = await getPostUrls();

  if (entries.length === 0) {
    console.log("⚠️  No se encontraron posts en el sitemap.");
    return;
  }

  if (MIGRATE_LIMIT) {
    entries = entries.slice(0, MIGRATE_LIMIT);
  }

  console.log(`🚀 Migrando ${entries.length} artículo(s)...`);

  const usedSlugs = new Map();
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    console.log(`[${i + 1}/${entries.length}] ${entry.url}`);

    try {
      const post = await scrapePost(entry, usedSlugs);
      const categoryId = categoryMap.get(post.categorySlug) ?? categoryMap.get(DEFAULT_CATEGORY_SLUG);
      const { categorySlug, ...postData } = post;

      const { error } = await supabase
        .from("posts")
        .upsert({ ...postData, category_id: categoryId }, { onConflict: "slug" });

      if (error) throw error;

      console.log(`  ✅ ${post.title} [${categorySlug}]`);
      ok++;
    } catch (err) {
      console.error(`  ❌ ${err.message}`);
      failed++;
    }

    await delay(REQUEST_DELAY_MS);
  }

  console.log(`\n🎉 Listo. ${ok} migrados, ${failed} con error, de ${entries.length} procesados.`);
}

run();
