
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  unit: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  change: number;
  emoji: string;
  description: string;
  markets: {
    name: string;
    price: number;
    minPrice: number;
    maxPrice: number;
    location?: string;
  }[];
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
};

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

const emojis: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫙",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍗",
  "dim-dui": "🥚",
  mosla: "🌶️",
};

const unitNames: Record<string, string> = {
  kg: "প্রতি কেজি",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

function getNumber(value: any): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function getArray(data: any): any[] {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.data?.categories)) return data.data.categories;

  return [];
}

function normalizeProduct(raw: any): Product {
  const marketsRaw = Array.isArray(raw.markets)
    ? raw.markets
    : [];

  const markets = marketsRaw.map((market: any) => ({
    name: market.market || "অজানা বাজার",
    price: (getNumber(market.min) + getNumber(market.max)) / 2,
    minPrice: getNumber(market.min),
    maxPrice: getNumber(market.max),
    location: market.division || "",
  }));

  const allMin = markets.map((m: any) => m.minPrice);
  const allMax = markets.map((m: any) => m.maxPrice);

  const minPrice = allMin.length
    ? Math.min(...allMin)
    : getNumber(raw.today);

  const maxPrice = allMax.length
    ? Math.max(...allMax)
    : getNumber(raw.today);

  const averagePrice = markets.length
    ? markets.reduce((sum: number, m: any) => sum + m.price, 0) /
      markets.length
    : getNumber(raw.today);

  const change = getNumber(raw.change?.pct);

  return {
    id: String(raw.id),
    slug: raw.slug || String(raw.id),
    name: raw.nameBn || "নাম পাওয়া যায়নি",
    category: raw.category || "others",
    categoryName: raw.categoryNameBn || "অন্যান্য",
    unit: unitNames[raw.unit] || "প্রতি কেজি",
    price: getNumber(raw.today),
    minPrice,
    maxPrice,
    averagePrice,
    change,
    emoji:
      raw.image ||
      raw.categoryIcon ||
      emojis[raw.category] ||
      "🛍️",
    description: `${raw.nameBn || "পণ্য"} এর আজকের বাজারদর এবং বিভিন্ন বাজারের মূল্য।`,
    markets,
  };
}

async function request(path: string) {
  const bases = [
    API,
    "https://openapi.programming-hero.com/api/bazardor",
    "https://api.abcz.workers.dev/api/bazardor",
  ];

  let lastError: unknown;

  for (const base of [...new Set(bases)]) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to connect to API");
}

export async function getProducts(): Promise<Product[]> {
  const data = await request("/products");
  return getArray(data).map(normalizeProduct);
}

export async function getProduct(
  id: string
): Promise<Product | null> {
  try {
    const data = await request(
      `/products/${encodeURIComponent(id)}`
    );

    const raw =
      data?.data?.product ||
      data?.product ||
      data?.data ||
      data;

    if (!raw || !raw.id) return null;

    return normalizeProduct(raw);
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await request("/categories");
    const categories = getArray(data);

    return categories.map((category: any) => ({
      slug: category.slug || category.id || category.category,
      name:
        category.nameBn ||
        category.categoryNameBn ||
        category.name ||
        "অন্যান্য",
      emoji:
        category.icon ||
        category.categoryIcon ||
        emojis[category.slug || category.id] ||
        "🛒",
    }));
  } catch {
    return [];
  }
}

export function formatBengali(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function money(value: number) {
  return `${formatBengali(value)} টাকা`;
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}
