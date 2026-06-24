import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  const profile = await Profile.findOne({ key: "default" }).lean();
  return NextResponse.json({ avatarUrl: profile?.avatarUrl ?? null });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { avatarUrl } = body;
  if (avatarUrl !== null && typeof avatarUrl !== "string") {
    return NextResponse.json({ error: "Invalid avatarUrl" }, { status: 400 });
  }

  await dbConnect();
  const profile = await Profile.findOneAndUpdate(
    { key: "default" },
    { avatarUrl: avatarUrl || null, updatedAt: new Date() },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ avatarUrl: profile.avatarUrl });
}
