
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ProductCard from "@/components/product-card";
import SkeletonGrid from "@/components/skeleton";
import { getProducts, type Product } from "@/lib/products";

// Category aliases: API values -> canonical category slug
const categoryAliases: Record<string, string> = {
  chal: "chal",
  rice: "chal",
  dal: "chal",
  "চাল": "chal",
  "ডাল": "chal",
  "চাল ও ডাল": "chal",

  sobji: "sobji",
  vegetable: "sobji",
  vegetables: "sobji",
  "সবজি": "sobji",
  "শাক-সবজি": "sobji",

  mach: "mach",
  fish: "mach",
  "মাছ": "mach",

  mangsho: "mangsho",
  meat: "mangsho",
  chicken: "mangsho",
  "মাংস": "mangsho",

  tel: "tel",
  oil: "tel",
  mosla: "tel",
  masala: "tel",
  spice: "tel",
  spices: "tel",
  "oil-spices": "tel",
  "tel-mosla": "tel",
  "তেল": "tel",
  "মসলা": "tel",
  "তেল ও মসলা": "tel",

  dim: "dim",
  "dim-dui": "dim",
  egg: "dim",
  eggs: "dim",
  "ডিম": "dim",
};

const categoryMeta: Record<
  string,
  { name: string; emoji: string }
> = {
  chal: {
    name: "চাল ও ডাল",
    emoji: "🍚",
  },
  sobji: {
    name: "শাক-সবজি",
    emoji: "🥬",
  },
  mach: {
    name: "মাছ",
    emoji: "🐟",
  },
  mangsho: {
    name: "মাংস",
    emoji: "🍗",
  },
  tel: {
    name: "তেল ও মসলা",
    emoji: "🫙",
  },
  dim: {
    name: "ডিম",
    emoji: "🥚",
  },
};

function normalizeCategory(value: string): string {
  const normalized = value.trim().toLowerCase();

  return categoryAliases[normalized] || normalized;
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();

  const slug = params.slug;
  const normalizedSlug = normalizeCategory(slug);

  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  const meta = categoryMeta[normalizedSlug];

  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) {
          setAll(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);

        if (active) {
          setAll([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    // Only match using category information.
    // Product names are intentionally excluded.
    const matches = all.filter((product) => {
      const productCategory = normalizeCategory(
        product.category || ""
      );

      const productCategoryName = normalizeCategory(
        product.categoryName || ""
      );

      return (
        productCategory === normalizedSlug ||
        productCategoryName === normalizedSlug
      );
    });

    // Sort products without mutating the original array.
    const sorted = [...matches];

    if (sort === "asc") {
      sorted.sort((a, b) => a.price - b.price);
    }

    if (sort === "desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [all, normalizedSlug, sort]);

  if (!meta) {
    return (
      <div className="not-found wrap">
        <span>🔎</span>
        <h1>এই ক্যাটাগরি পাওয়া যায়নি</h1>
        <p>
          আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি নেই অথবা সরানো হয়েছে।
        </p>

        <Link className="btn btn-primary" href="/">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <section className="wrap section category-page">

      <div className="breadcrumb">
        <Link href="/">হোম</Link> / {meta.name}
      </div>

      <div className="section-heading">

        <div>
          <span className="eyebrow">
            PRODUCT CATEGORY
          </span>

          <h1>
            {meta.emoji} {meta.name}
          </h1>

          <p>
            এই ক্যাটাগরির সব পণ্যের আজকের বাজারদর
          </p>
        </div>

        <label className="sort-label">
          সাজান:

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">
              দাম: কম থেকে বেশি
            </option>
            <option value="desc">
              দাম: বেশি থেকে কম
            </option>
          </select>
        </label>

      </div>

      {loading ? (
        <SkeletonGrid />
      ) : products.length > 0 ? (
        <>
          <p className="category-product-count">
            মোট {products.length}টি পণ্য পাওয়া গেছে
          </p>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="not-found compact">
          <span>📦</span>

          <h2>
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>

          <p>
            অন্য ক্যাটাগরি থেকে পণ্য দেখুন।
          </p>

          <Link className="btn btn-primary" href="/">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}

    </section>
  );
}
