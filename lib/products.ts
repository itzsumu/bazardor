export type Product = {
  id: string; slug: string; name: string; category: string; categoryName: string; unit: string;
  price: number; minPrice: number; maxPrice: number; averagePrice: number; change: number;
  emoji: string; description: string; markets: { name: string; price: number; location?: string }[];
};
export type Category = { slug: string; name: string; emoji: string };

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://openapi.programming-hero.com/api/bazardor").replace(/\/$/, "");
const emojis: Record<string,string> = { chal:"🍚", rice:"🍚", dal:"🫘", vegetables:"🥬", sobji:"🥬", mach:"🐟", fish:"🐟", meat:"🍗", murgi:"🍗", dim:"🥚", oil:"🫙", alu:"🥔", peyaj:"🧅", morich:"🌶️", roshun:"🧄", ada:"🫚", fruits:"🍎" };
const pick = (o:any, keys:string[], fallback:any=null) => { for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null) return o[k]; return fallback; };
const number = (v:any, fallback=0) => { if (typeof v === "number") return v; const bn="০১২৩৪৫৬৭৮৯"; const normalized=String(v ?? "").replace(/[০-৯]/g,d=>String(bn.indexOf(d))).replace(/[৳ টাকা,\s]/g,""); const n=Number(normalized); return Number.isFinite(n) ? n : fallback; };
const text = (v:any, fallback="") => typeof v === "string" || typeof v === "number" ? String(v) : fallback;
function unwrap(json:any): any { const d=json?.data; return d?.products ?? d?.items ?? d?.categories ?? d ?? json?.products ?? json?.items ?? json?.categories ?? json?.result ?? json; }
function normaliseProduct(raw:any, i:number):Product {
  const id = text(pick(raw,["id","_id","product_id","slug"],i+1));
  const name = text(pick(raw,["name","product_name","title","bn_name"],"নাম পাওয়া যায়নি"));
  const category = text(pick(raw,["category","category_slug","category_id","type"],"others")).toLowerCase().replace(/\s+/g,"-");
  const price = number(pick(raw,["price","current_price","today_price","average_price","avg_price"],0));
  const marketsRaw = pick(raw,["markets","market_prices","bazar_prices","prices"],[]);
  const markets = Array.isArray(marketsRaw) ? marketsRaw.map((m:any,j:number)=>({name:text(pick(m,["name","market_name","bazar","market"],`বাজার ${j+1}`)),price:number(pick(m,["price","today_price","amount"],price)),location:text(pick(m,["location","address"],"ঢাকা"))})) : [];
  const change = number(pick(raw,["change","price_change","change_percent","percentage_change"],0));
  return { id, slug:text(pick(raw,["slug","id","_id"],id)), name, category, categoryName:text(pick(raw,["category_name","categoryName"],category)), unit:text(pick(raw,["unit","measurement","per"],"প্রতি কেজি")), price, minPrice:number(pick(raw,["min_price","minimum_price"],markets.length?Math.min(...markets.map(m=>m.price)):price)), maxPrice:number(pick(raw,["max_price","maximum_price"],markets.length?Math.max(...markets.map(m=>m.price)):price)), averagePrice:number(pick(raw,["average_price","avg_price"],price)), change, emoji:text(pick(raw,["emoji","icon"],emojis[category]||"🛍️")), description:text(pick(raw,["description","details","summary"],`${name} এর আজকের বাজারদর ও বিভিন্ন বাজারের দামের তথ্য।`)), markets };
}
async function request(path:string) {
  const bases=[API,"https://api.api-store.workers.dev/api/bazardor","https://api.abcz.workers.dev/api/bazardor"].filter((v,i,a)=>a.indexOf(v)===i);
  let lastError:unknown;
  for(const base of bases){try{const res=await fetch(`${base}${path}`,{cache:"no-store",signal:AbortSignal.timeout(12000)});if(!res.ok)throw new Error(`API error ${res.status}`);return unwrap(await res.json());}catch(error){lastError=error;}}
  throw lastError instanceof Error?lastError:new Error("API unavailable");
}
export async function getProducts():Promise<Product[]> { const data=await request("/products"); const arr=Array.isArray(data)?data:Array.isArray(data?.items)?data.items:[]; return arr.map(normaliseProduct); }
export async function getProduct(id:string):Promise<Product|null> { try { const data=await request(`/products/${encodeURIComponent(id)}`); const raw=Array.isArray(data)?data[0]:data?.product??data; return raw?normaliseProduct(raw,0):null; } catch { return null; } }
export async function getCategories():Promise<Category[]> { try { const data=await request("/categories"); const arr=Array.isArray(data)?data:[]; return arr.map((c:any)=>{const slug=text(pick(c,["slug","id","category_slug","name"],"others")).toLowerCase().replace(/\s+/g,"-");return {slug,name:text(pick(c,["name","category_name","title"],slug)),emoji:text(pick(c,["emoji","icon"],emojis[slug]||"🛒"))};}); } catch { return []; } }
export function formatBengali(value:number) { return new Intl.NumberFormat("bn-BD",{maximumFractionDigits:2}).format(value); }
export function money(value:number) { return `${formatBengali(value)} টাকা`; }
export function slugify(value:string) { return value.toLowerCase().trim().replace(/\s+/g,"-"); }
