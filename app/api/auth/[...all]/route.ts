import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ensureDatabase } from "@/lib/db";
export const runtime = "nodejs";
const handlers = toNextJsHandler(auth);
export async function GET(request: NextRequest) { await ensureDatabase(); return handlers.GET(request); }
export async function POST(request: NextRequest) { await ensureDatabase(); return handlers.POST(request); }
