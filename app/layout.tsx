import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import Link from "next/link";
export const metadata:Metadata={title:"বাজার দর | BazarDor",description:"নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে জানুন।"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bn"><body><Providers><Header/><main>{children}</main><footer className="footer"><div className="wrap footer-inner"><div><Link href="/" className="footer-brand">🛒 বাজার দর</Link><p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p></div><p className="footer-note">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p><span className="copyright">© {new Date().getFullYear()} BazarDor</span></div></footer></Providers></body></html>}
