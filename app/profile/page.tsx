"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function ProfilePage(){const router=useRouter();const {data:session,isPending}=authClient.useSession();useEffect(()=>{if(!isPending&&!session){toast.error("প্রোফাইল দেখতে সাইন ইন করুন");router.replace("/signin");}},[isPending,session,router]);if(isPending||!session)return <div className="loading-page">লোড হচ্ছে...</div>;return <div className="wrap profile-page"><div className="profile-card"><div className="profile-avatar">{session.user.name?.charAt(0)||"👤"}</div><span className="eyebrow">MY ACCOUNT</span><h1>আমার প্রোফাইল</h1><div className="profile-field"><small>নাম</small><strong>{session.user.name}</strong></div><div className="profile-field"><small>ইমেইল</small><strong>{session.user.email}</strong></div><Link href="/profile/update" className="btn btn-primary">তথ্য আপডেট করুন</Link></div></div>}
